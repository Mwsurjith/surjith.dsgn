'use client';

import { useState, useCallback } from 'react';
import { TimezoneProvider, useTimezone } from '@/context/TimezoneContext';
import ClockHeader from '@/components/microapps/timezone/ClockHeader';
import TimezoneRow from '@/components/microapps/timezone/TimezoneRow';
import TimezoneSelector from '@/components/microapps/timezone/TimezoneSelector';

function TimezoneApp() {
    const { localTimezone, selectedTimezones, clearHovered, isLoading, error } = useTimezone();
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleScroll = useCallback((left) => {
        setScrollLeft(left);
    }, []);

    if (isLoading || !localTimezone) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-zinc-500">Loading timezones...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen max-w-5xl mx-auto bg-zinc-900 flex flex-col px-5 py-30">
            {/* Large Clock Header */}
            <ClockHeader />

            {/* Error Message */}
            {error && (
                <div className="text-orange-400 text-xs mb-4">
                    Using cached timezones (API unavailable)
                </div>
            )}

            {/* Timezone Comparison Grid */}
            <div
                className="w-full"
                onMouseLeave={clearHovered}
            >
                {/* Local Timezone Row */}
                <TimezoneRow
                    timezone={localTimezone}
                    isLocal={true}
                    scrollRef={{ scrollLeft }}
                    onScroll={handleScroll}
                    isFirst={true}
                    isLast={selectedTimezones.length === 0}
                />

                {/* Additional Timezone Rows */}
                {selectedTimezones.map((timezone, index) => (
                    <TimezoneRow
                        key={timezone.id}
                        timezone={timezone}
                        scrollRef={{ scrollLeft }}
                        onScroll={handleScroll}
                        isFirst={false}
                        isLast={index === selectedTimezones.length - 1}
                    />
                ))}

                {/* Add Timezone Button */}
                <TimezoneSelector />
            </div>
        </main>
    );
}

export default function TimezonePage() {
    return (
        <TimezoneProvider>
            <TimezoneApp />
        </TimezoneProvider>
    );
}
