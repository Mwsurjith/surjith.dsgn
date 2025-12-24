'use client';

import { useState } from 'react';
import { CaretDown, MagnifyingGlass, X } from '@phosphor-icons/react';
import { formatTimeLarge, formatFullDate, getTimeInTimezone } from '@/lib/timezone';
import { useTimezone } from '@/context/TimezoneContext';

export default function ClockHeader() {
    const { localTimezone, currentDate, availableTimezones, setLocalTimezone } = useTimezone();
    const [isSelecting, setIsSelecting] = useState(false);
    const [search, setSearch] = useState('');

    if (!localTimezone) return null;

    const localTzDate = getTimeInTimezone(currentDate, localTimezone.offset);
    const { time, ampm } = formatTimeLarge(localTzDate);

    // Use timezone name (like "Kolkata") or fallback to "Asia/Kolkata" format
    const displayName = localTimezone.name || localTimezone.timezone?.split('/').pop()?.replace(/_/g, ' ') || 'Your Location';
    const regionName = localTimezone.country || localTimezone.region || localTimezone.timezone?.split('/')[0] || '';
    const fullName = regionName ? `${regionName}/${displayName}` : displayName;

    const filteredTimezones = availableTimezones.filter(tz =>
        tz.timezone?.toLowerCase().includes(search.toLowerCase()) ||
        tz.name?.toLowerCase().includes(search.toLowerCase()) ||
        tz.country?.toLowerCase().includes(search.toLowerCase()) ||
        tz.region?.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (tz) => {
        setLocalTimezone(tz);
        setIsSelecting(false);
        setSearch('');
    };

    return (
        <div className="mb-16">
            {/* Clickable Location Name */}
            <button
                onClick={() => setIsSelecting(!isSelecting)}
                className="flex items-center gap-1 text-orange-400 text-sm mb-2 hover:text-orange-300 transition-colors"
            >
                {fullName}
                <CaretDown size={14} className={`transition-transform ${isSelecting ? 'rotate-180' : ''}`} />
            </button>

            {/* Timezone Selector Dropdown */}
            {isSelecting && (
                <div className="mb-4 p-3 bg-zinc-950 rounded-lg border border-zinc-800 max-w-md">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 flex items-center gap-2 bg-zinc-800 rounded px-3 py-2">
                            <MagnifyingGlass size={16} className="text-zinc-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search city or country..."
                                className="flex-1 bg-transparent text-white text-sm outline-none"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={() => { setIsSelecting(false); setSearch(''); }}
                            className="text-zinc-500 hover:text-white p-2"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                        {filteredTimezones.slice(0, 20).map(tz => (
                            <button
                                key={tz.id}
                                onClick={() => handleSelect(tz)}
                                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded transition-colors text-left"
                            >
                                <span className="text-zinc-500">{tz.country || tz.region}/</span>
                                <span className="text-white">{tz.name}</span>
                                <span className="text-zinc-500 text-xs ml-2">({tz.offset})</span>
                            </button>
                        ))}
                        {filteredTimezones.length === 0 && (
                            <span className="text-zinc-500 text-sm">No timezones found</span>
                        )}
                    </div>
                </div>
            )}

            {/* Large Clock */}
            <div className="flex items-baseline gap-2">
                <span className="text-white text-8xl tracking-tight">{time}</span>
                <span className="text-white text-3xl">{ampm}</span>
            </div>

            {/* Date */}
            <div className="text-zinc-500 text-sm mt-4">
                {formatFullDate(localTzDate)}
            </div>
        </div>
    );
}
