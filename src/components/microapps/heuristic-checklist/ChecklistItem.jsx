'use client';

import { ItemStatus } from '@/hooks/useHeuristicState';

/**
 * ChecklistItem Component
 * Individual checklist row with title, description, and PASS/FAIL/NA options
 */
export default function ChecklistItem({ item, status, onStatusChange }) {
    const handleStatusClick = (newStatus) => {
        // Toggle off if clicking the same status
        if (status === newStatus) {
            onStatusChange(item.id, ItemStatus.NONE);
        } else {
            onStatusChange(item.id, newStatus);
        }
    };

    return (
        <div className="grid grid-cols-[1fr_80px_80px_120px] gap-4 items-center py-4 border-b border-zinc-800 last:border-b-0">
            {/* Title and Description */}
            <div className="pr-4">
                <h3 className="text-white font-medium text-sm mb-1">
                    {item.title}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                    {item.description}
                </p>
            </div>

            {/* Pass Checkbox */}
            <div className="flex justify-center">
                <button
                    onClick={() => handleStatusClick(ItemStatus.PASS)}
                    className="w-5 h-5 border border-zinc-600 rounded flex items-center justify-center transition-colors hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    aria-label="Mark as Pass"
                >
                    {status === ItemStatus.PASS && (
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Fail Checkbox */}
            <div className="flex justify-center">
                <button
                    onClick={() => handleStatusClick(ItemStatus.FAIL)}
                    className="w-5 h-5 border border-zinc-600 rounded flex items-center justify-center transition-colors hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    aria-label="Mark as Fail"
                >
                    {status === ItemStatus.FAIL && (
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Not Applicable Checkbox */}
            <div className="flex justify-center">
                <button
                    onClick={() => handleStatusClick(ItemStatus.NOT_APPLICABLE)}
                    className="w-5 h-5 border border-zinc-600 rounded flex items-center justify-center transition-colors hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    aria-label="Mark as Not Applicable"
                >
                    {status === ItemStatus.NOT_APPLICABLE && (
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
