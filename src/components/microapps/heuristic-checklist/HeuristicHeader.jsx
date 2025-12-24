'use client';

/**
 * HeuristicHeader Component
 * Displays the heuristic number badge and title
 */
export default function HeuristicHeader({ heuristicId, heuristicName }) {
    const formattedId = String(heuristicId).padStart(2, '0');

    return (
        <header className="mb-8">
            <span className="text-[#E85C2C] text-sm font-medium tracking-wide uppercase mb-2 block">
                Heuristic #{formattedId}
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-white leading-tight italic">
                {heuristicName}
            </h1>
        </header>
    );
}
