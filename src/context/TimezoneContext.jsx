'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLocalOffset, generateSlots } from '@/lib/timezone';
import { FALLBACK_TIMEZONES, STORAGE_KEY, STORAGE_LOCAL_KEY } from '@/constants/timezone';

const TimezoneContext = createContext(null);

// Convert gmtOffset in seconds to "+HHMM" format
function offsetSecondsToString(seconds) {
    const sign = seconds >= 0 ? '+' : '-';
    const abs = Math.abs(seconds);
    const h = Math.floor(abs / 3600).toString().padStart(2, '0');
    const m = Math.floor((abs % 3600) / 60).toString().padStart(2, '0');
    return `${sign}${h}${m}`;
}

// Extract display name from timezone string (e.g., "Africa/Abidjan" -> "Abidjan")
function getDisplayName(timezone) {
    if (!timezone) return '';
    const parts = timezone.split('/');
    return parts[parts.length - 1].replace(/_/g, ' ');
}

// Extract region from timezone string (e.g., "Africa/Abidjan" -> "Africa")
function getRegion(timezone) {
    if (!timezone) return '';
    const parts = timezone.split('/');
    return parts[0];
}

export function TimezoneProvider({ children }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [availableTimezones, setAvailableTimezones] = useState(
        FALLBACK_TIMEZONES.map(tz => ({
            id: tz.timezone.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name: getDisplayName(tz.timezone),
            timezone: tz.timezone,
            offset: tz.offset,
            region: getRegion(tz.timezone),
            country: tz.country,
        }))
    );
    const [selectedTimezones, setSelectedTimezones] = useState([]);
    const [localTimezone, setLocalTimezone] = useState(null);
    const [hoveredSlot, setHoveredSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch timezones from our local API proxy (solves CORS issues)
    useEffect(() => {
        async function fetchTimezones() {
            try {
                const response = await fetch('/api/timezones'); // Proxy route
                if (!response.ok) throw new Error('Proxy failed to fetch timezones');
                const data = await response.json();

                if (data.status !== 'OK') {
                    throw new Error(data.message || 'API error');
                }

                // Transform TimezoneDB response to our format
                const timezones = (data.zones || []).map(tz => ({
                    id: tz.zoneName?.toLowerCase().replace(/[^a-z0-9]/g, '_') || '',
                    name: getDisplayName(tz.zoneName),
                    timezone: tz.zoneName,
                    offset: offsetSecondsToString(tz.gmtOffset),
                    region: getRegion(tz.zoneName),
                    country: tz.countryName,
                }));

                setAvailableTimezones(timezones);
            } catch (err) {
                console.error('Failed to fetch timezones:', err);
                setError(err.message);
                // Keep using fallback (already initialized)
            }
        }

        fetchTimezones();
    }, []);

    // Initialize local timezone and load saved selections immediately
    useEffect(() => {
        // Initialize local timezone from localStorage or detect from browser
        const initialize = () => {
            const localOffset = getLocalOffset();
            let initialLocal = null;

            try {
                const savedLocal = localStorage.getItem(STORAGE_LOCAL_KEY);
                if (savedLocal) {
                    const parsedLocal = JSON.parse(savedLocal);
                    if (parsedLocal && parsedLocal.id) {
                        initialLocal = parsedLocal;
                    }
                }
            } catch (e) {
                console.error('Failed to load local timezone from storage:', e);
            }

            if (!initialLocal) {
                const matchingTz = availableTimezones.find(tz => tz.offset === localOffset);
                initialLocal = {
                    id: 'local',
                    name: matchingTz?.name || 'Local',
                    timezone: matchingTz?.timezone || 'Local',
                    offset: localOffset,
                    region: matchingTz?.region || '',
                };
            }
            setLocalTimezone(initialLocal);

            // Load saved timezones from localStorage
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const savedData = JSON.parse(saved);
                    if (Array.isArray(savedData)) {
                        // Check if it's the old format (IDs) or new format (Objects)
                        if (savedData.length > 0 && typeof savedData[0] === 'string') {
                            const rehydrated = savedData
                                .map(id => availableTimezones.find(tz => tz.id === id))
                                .filter(Boolean);
                            setSelectedTimezones(rehydrated);
                        } else {
                            // Assume new format or empty array
                            setSelectedTimezones(savedData);
                        }
                    }
                }
            } catch { }

            // Default: Add America/Denver if no saved zones (null check, not empty array check)
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === null) {
                const mst = availableTimezones.find(tz =>
                    tz.timezone === 'America/Denver' || tz.offset === '-0700'
                );
                setSelectedTimezones(mst ? [mst] : []);
            }

            setIsLoading(false);
        };

        initialize();
    }, []);

    // Update timezones once API returns
    useEffect(() => {
        if (availableTimezones.length > FALLBACK_TIMEZONES.length) {
            // Update local info if a better match is found from the full list
            // ONLY if the user hasn't manually selected a different timezone
            if (localTimezone?.id === 'local') {
                const localOffset = getLocalOffset();
                const matchingTz = availableTimezones.find(tz => tz.offset === localOffset);
                if (matchingTz) {
                    setLocalTimezone(prev => ({
                        ...prev,
                        name: matchingTz.name,
                        timezone: matchingTz.timezone,
                        region: matchingTz.region,
                        country: matchingTz.country,
                    }));
                }
            }
        }
    }, [availableTimezones, localTimezone]);

    // Save selections and local timezone to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTimezones));
    }, [selectedTimezones]);

    useEffect(() => {
        if (localTimezone) {
            localStorage.setItem(STORAGE_LOCAL_KEY, JSON.stringify(localTimezone));
        }
    }, [localTimezone]);

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const addTimezone = useCallback((timezone) => {
        if (selectedTimezones.length < 5) {
            setSelectedTimezones(prev => [...prev, timezone]);
        }
    }, [selectedTimezones]);

    const removeTimezone = useCallback((id) => {
        setSelectedTimezones(prev => prev.filter(tz => tz.id !== id));
    }, []);

    const setHovered = useCallback((slot) => {
        setHoveredSlot(slot);
    }, []);

    const clearHovered = useCallback(() => {
        setHoveredSlot(null);
    }, []);

    // Generate slots for all timezones
    const getSlots = useCallback((targetOffset) => {
        if (!localTimezone) return [];
        return generateSlots(currentDate, localTimezone.offset, targetOffset);
    }, [currentDate, localTimezone]);

    const value = {
        currentDate,
        availableTimezones,
        selectedTimezones,
        localTimezone,
        setLocalTimezone,
        hoveredSlot,
        isLoading,
        error,
        addTimezone,
        removeTimezone,
        setHovered,
        clearHovered,
        getSlots,
    };

    return (
        <TimezoneContext.Provider value={value}>
            {children}
        </TimezoneContext.Provider>
    );
}

export function useTimezone() {
    const context = useContext(TimezoneContext);
    if (!context) {
        throw new Error('useTimezone must be used within TimezoneProvider');
    }
    return context;
}
