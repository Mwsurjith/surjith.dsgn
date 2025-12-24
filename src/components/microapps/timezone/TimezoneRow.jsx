'use client';

import { useRef, useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import { useTimezone } from '@/context/TimezoneContext';
import { formatTimeDisplay, formatDateShort, formatOffset } from '@/lib/timezone';

export default function TimezoneRow({
    timezone,
    isLocal = false,
    scrollRef,
    onScroll,
    isFirst = false,
    isLast = false
}) {
    const { hoveredSlot, setHovered, removeTimezone, getSlots } = useTimezone();
    const rowScrollRef = useRef(null);

    const slots = getSlots(timezone.offset);

    // Sync scroll with other rows
    useEffect(() => {
        if (scrollRef && rowScrollRef.current) {
            rowScrollRef.current.scrollLeft = scrollRef.scrollLeft;
        }
    }, [scrollRef?.scrollLeft]);

    const handleScroll = (e) => {
        if (onScroll) {
            onScroll(e.target.scrollLeft);
        }
    };

    // Calculate current time display
    const currentSlot = slots.find(s => s.isCurrent);
    const hoveredSlotData = hoveredSlot !== null ? slots[hoveredSlot] : null;
    const displayTime = hoveredSlotData ? hoveredSlotData.targetTime : (currentSlot?.targetTime || slots[0]?.targetTime);

    return (
        <div className="group flex items-stretch border-b border-zinc-800">
            {/* Remove Button */}
            <div className="flex items-center justify-center w-8 shrink-0">
                {!isLocal && (
                    <button
                        onClick={() => removeTimezone(timezone.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-all p-1"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Info Column */}
            <div className="flex flex-col justify-center w-28 py-3 shrink-0">
                <span className="text-white text-sm font-medium">
                    {isLocal ? 'Your time' : timezone.name}
                </span>
                <span className="text-zinc-500 text-xs">
                    {formatOffset(timezone.offset)}
                </span>
            </div>

            {/* Time Display */}
            <div className="flex flex-col justify-center w-24 py-3 shrink-0">
                <span className="text-white text-sm font-medium">
                    {displayTime ? formatTimeDisplay(displayTime) : '--:--'}
                </span>
                <span className="text-zinc-500 text-xs">
                    {displayTime ? formatDateShort(displayTime) : ''}
                </span>
            </div>

            {/* Hour Slots */}
            <div className="relative flex flex-1 min-w-0">
                <div
                    ref={rowScrollRef}
                    onScroll={handleScroll}
                    className="flex flex-1 items-stretch overflow-x-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {slots.map((slot, idx) => {
                        const isHovered = idx === hoveredSlot;
                        const prevSlot = idx > 0 ? slots[idx - 1] : null;
                        const isDayChange = prevSlot && slot.targetTime.getDate() !== prevSlot.targetTime.getDate();

                        const hour = slot.targetTime.getHours();
                        const mins = slot.targetTime.getMinutes();
                        const displayHour = hour % 12 || 12;
                        const ampm = hour >= 12 ? 'pm' : 'am';
                        const timeStr = mins === 0 ? `${displayHour}` : `${displayHour}:${mins.toString().padStart(2, '0')}`;

                        return (
                            <div
                                key={idx}
                                onMouseEnter={() => setHovered(idx)}
                                className={`flex flex-col items-center justify-center min-w-[60px] py-4 cursor-pointer transition-all relative
                                    ${(isHovered || (slot.isCurrent && hoveredSlot === null)) ? 'bg-zinc-950' : 'bg-zinc-900'}
                                    ${(isHovered || (slot.isCurrent && hoveredSlot === null)) && isFirst ? 'rounded-t-2xl' : ''}
                                    ${(isHovered || (slot.isCurrent && hoveredSlot === null)) && isLast ? 'rounded-b-2xl' : ''}
                                    ${isDayChange ? 'border-l-2 border-orange-500/50' : ''}
                                `}
                            >
                                <span className="text-sm font-medium text-white">
                                    {timeStr}
                                </span>
                                <span className="text-xs text-zinc-400">
                                    {ampm}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {/* Gradient Fade */}
                <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-zinc-900 to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}
