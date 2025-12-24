'use client';

import { heuristics, getHeuristicItemIds } from '@/constants/heuristics';

/**
 * HeuristicNavigation Component
 * Integrated sticky vertical menu for heuristic switching
 */
export default function HeuristicNavigation({
    currentHeuristicId,
    onHeuristicChange,
    getHeuristicStats
}) {
    const totalProgress = Math.round(heuristics.reduce((acc, h) => acc + getHeuristicStats(getHeuristicItemIds(h.id)).completionPercentage, 0) / 10);

    return (
        <nav className="sticky top-32 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
                <div>
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">
                        Evaluation
                    </span>
                    <h2 className="text-white text-lg font-display italic">
                        10 Heuristics
                    </h2>
                </div>

                <div className="flex flex-col gap-1.5 border-b border-zinc-900 pb-6 mb-2">
                    {heuristics.map((heuristic) => {
                        const isActive = heuristic.id === currentHeuristicId;
                        const itemIds = getHeuristicItemIds(heuristic.id);
                        const stats = getHeuristicStats(itemIds);
                        const isComplete = stats.completionPercentage === 100;

                        return (
                            <button
                                key={heuristic.id}
                                onClick={() => onHeuristicChange(heuristic.id)}
                                className={`
                                    group flex items-center gap-3 py-2 text-left transition-all duration-200
                                    ${isActive
                                        ? 'text-white'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                    }
                                `}
                            >
                                {/* Active Dot/Icon */}
                                <div className="relative flex items-center justify-center w-5 h-5">
                                    {isActive ? (
                                        <div className="w-1.5 h-1.5 bg-[#E85C2C] rounded-full shadow-[0_0_8px_rgba(232,92,44,0.6)]" />
                                    ) : isComplete ? (
                                        <div className="w-1.5 h-1.5 bg-green-500/50 rounded-full" />
                                    ) : (
                                        <div className="w-1 h-1 bg-zinc-800 rounded-full group-hover:bg-zinc-700" />
                                    )}
                                </div>

                                <span className={`
                                    text-[13px] font-semibold tracking-wide transition-colors
                                    ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}
                                `}>
                                    {String(heuristic.id).padStart(2, '0')}. {heuristic.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Final Report Tab with Integrated Progress */}
                <button
                    onClick={() => onHeuristicChange('report')}
                    className={`
                        group flex flex-col gap-3 p-4 rounded-2xl transition-all duration-300
                        ${currentHeuristicId === 'report'
                            ? 'bg-zinc-800/40 ring-1 ring-zinc-700/50'
                            : 'hover:bg-zinc-800/20'
                        }
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-5 h-5">
                            {currentHeuristicId === 'report' ? (
                                <div className="w-1.5 h-1.5 bg-[#E85C2C] rounded-full shadow-[0_0_8px_rgba(232,92,44,0.6)]" />
                            ) : (
                                <div className="w-1 h-1 bg-zinc-800 rounded-full group-hover:bg-zinc-700" />
                            )}
                        </div>
                        <span className={`
                            text-[11px] font-bold uppercase tracking-[0.15em] transition-colors
                            ${currentHeuristicId === 'report' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}
                        `}>
                            Final Report
                        </span>
                    </div>

                    {/* Integrated Total Progress */}
                    <div className="w-full space-y-2 pl-8">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-wider">Overall Audit</span>
                            <span className="text-zinc-400 text-[9px] font-mono">
                                {totalProgress}%
                            </span>
                        </div>
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-zinc-700 transition-all duration-700 ease-out"
                                style={{ width: `${totalProgress}%` }}
                            />
                        </div>
                    </div>
                </button>
            </div>
        </nav>
    );
}
