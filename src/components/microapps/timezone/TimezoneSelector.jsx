'use client';

import { useState } from 'react';
import { Plus, X, MagnifyingGlass } from '@phosphor-icons/react';
import { useTimezone } from '@/context/TimezoneContext';

export default function TimezoneSelector() {
    const { availableTimezones, selectedTimezones, addTimezone } = useTimezone();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const existingIds = ['local', ...selectedTimezones.map(tz => tz.id)];
    const canAddMore = selectedTimezones.length < 5;

    // Search by full timezone string, name, region, or country
    const filteredTimezones = availableTimezones.filter(
        tz => !existingIds.includes(tz.id) &&
            (tz.timezone?.toLowerCase().includes(search.toLowerCase()) ||
                tz.name?.toLowerCase().includes(search.toLowerCase()) ||
                tz.region?.toLowerCase().includes(search.toLowerCase()) ||
                tz.country?.toLowerCase().includes(search.toLowerCase()))
    );

    const handleSelect = (tz) => {
        addTimezone(tz);
        setIsOpen(false);
        setSearch('');
    };

    if (!canAddMore) return null;

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors p-4"
            >
                <Plus size={16} />
                Add New Timezone
            </button>
        );
    }

    return (
        <div className="p-4 bg-zinc-950">
            <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 flex items-center gap-2 bg-zinc-800 rounded px-3 py-2">
                    <MagnifyingGlass size={16} className="text-zinc-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search city or country (e.g., Canada, London, Tokyo)..."
                        className="flex-1 bg-transparent text-white text-sm outline-none"
                        autoFocus
                    />
                </div>
                <button
                    onClick={() => { setIsOpen(false); setSearch(''); }}
                    className="text-zinc-500 hover:text-white p-2"
                >
                    <X size={16} />
                </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {filteredTimezones.slice(0, 30).map(tz => (
                    <button
                        key={tz.id}
                        onClick={() => handleSelect(tz)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded transition-colors text-left"
                    >
                        <span className="text-zinc-400">{tz.country || tz.region}/</span>
                        <span className="text-white">{tz.name}</span>
                        <span className="text-zinc-500 text-xs ml-2">({tz.offset})</span>
                    </button>
                ))}
                {filteredTimezones.length === 0 && (
                    <span className="text-zinc-500 text-sm">No timezones found</span>
                )}
                {filteredTimezones.length > 30 && (
                    <span className="text-zinc-500 text-xs w-full mt-2">
                        Showing 30 of {filteredTimezones.length} results. Type more to filter...
                    </span>
                )}
            </div>
        </div>
    );
}
