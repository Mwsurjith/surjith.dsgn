'use client';

import ChecklistItem from './ChecklistItem';

/**
 * ChecklistSection Component
 * Groups checklist items by category with a table header
 */
export default function ChecklistSection({ category, getItemStatus, onStatusChange }) {
    return (
        <section className="mb-8">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_80px_80px_120px] gap-4 items-center py-3 border-b border-zinc-700 bg-zinc-900/50">
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                    {category.name}
                </span>
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider text-center">
                    Pass
                </span>
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider text-center">
                    Fail
                </span>
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider text-center whitespace-nowrap">
                    Not Applicable
                </span>
            </div>

            {/* Checklist Items */}
            <div>
                {category.items.map((item) => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        status={getItemStatus(item.id)}
                        onStatusChange={onStatusChange}
                    />
                ))}
            </div>
        </section>
    );
}
