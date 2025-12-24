'use client';

import { useEffect } from 'react';
import { heuristics, getHeuristicById, getHeuristicItemIds } from '@/constants/heuristics';
import { useHeuristicState } from '@/hooks/useHeuristicState';
import HeuristicHeader from '@/components/microapps/heuristic-checklist/HeuristicHeader';
import HeuristicNavigation from '@/components/microapps/heuristic-checklist/HeuristicNavigation';
import ChecklistSection from '@/components/microapps/heuristic-checklist/ChecklistSection';
import HeuristicReport from '@/components/microapps/heuristic-checklist/HeuristicReport';

/**
 * Heuristic Checklist Page
 * Refactored layout for better site integration (centered grid with sticky nav)
 */
export default function HeuristicChecklistPage() {
    const {
        currentHeuristicId,
        setCurrentHeuristicId,
        getItemStatus,
        setItemStatus,
        getHeuristicStats,
        isLoaded
    } = useHeuristicState();

    const isReportPage = currentHeuristicId === 'report';

    // Get current heuristic data
    const currentHeuristic = !isReportPage ? getHeuristicById(currentHeuristicId) : null;
    const currentItemIds = !isReportPage ? getHeuristicItemIds(currentHeuristicId) : [];
    const currentStats = !isReportPage ? getHeuristicStats(currentItemIds) : null;

    // Scroll to top when heuristic changes
    useEffect(() => {
        if (isLoaded) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentHeuristicId, isLoaded]);

    // Loading state
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-zinc-600 font-medium tracking-widest animate-pulse italic">
                    LOADING...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-zinc-900 py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-16 lg:gap-24 relative">

                {/* Left Column: Integrated Navigation */}
                <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                    <HeuristicNavigation
                        currentHeuristicId={currentHeuristicId}
                        onHeuristicChange={setCurrentHeuristicId}
                        getHeuristicStats={getHeuristicStats}
                    />
                </aside>

                {/* Right Column: Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="max-w-3xl">

                        {isReportPage ? (
                            <HeuristicReport getHeuristicStats={getHeuristicStats} />
                        ) : (
                            <>
                                {/* Header Section */}
                                <HeuristicHeader
                                    heuristicId={currentHeuristic.id}
                                    heuristicName={currentHeuristic.name}
                                />

                                {/* Description */}
                                <p className="text-zinc-500 text-sm leading-relaxed mb-12 max-w-2xl italic">
                                    {currentHeuristic.description}
                                </p>

                                {/* Checkbox Summary */}
                                <div className="flex flex-wrap items-center gap-6 mb-16 py-6 border-y border-zinc-800/50">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-zinc-400 text-xs font-medium tracking-tight">Pass: <span className="text-white ml-0.5">{currentStats.pass}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500" />
                                        <span className="text-zinc-400 text-xs font-medium tracking-tight">Fail: <span className="text-white ml-0.5">{currentStats.fail}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-zinc-600" />
                                        <span className="text-zinc-400 text-xs font-medium tracking-tight">N/A: <span className="text-white ml-0.5">{currentStats.na}</span></span>
                                    </div>

                                    <div className="ml-auto text-zinc-600 text-[10px] font-bold uppercase tracking-widest bg-zinc-950/50 px-3 py-1.5 rounded-full border border-zinc-800/50">
                                        {currentStats.completed}/{currentStats.total} Finished
                                    </div>
                                </div>

                                {/* Checklist Content */}
                                <div className="space-y-12">
                                    {currentHeuristic.categories.map((category) => (
                                        <ChecklistSection
                                            key={category.name}
                                            category={category}
                                            getItemStatus={getItemStatus}
                                            onStatusChange={setItemStatus}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Sequential Navigation */}
                        {!isReportPage && (
                            <footer className="flex justify-between items-center mt-32 pt-12 border-t border-zinc-900 group">
                                <button
                                    onClick={() => {
                                        setCurrentHeuristicId(Math.max(1, currentHeuristicId - 1));
                                    }}
                                    disabled={currentHeuristicId === 1}
                                    className={`
                                        flex flex-col items-start gap-1 p-4 rounded-2xl transition-all duration-300
                                        ${currentHeuristicId === 1
                                            ? 'opacity-20 grayscale'
                                            : 'hover:bg-zinc-800/50'
                                        }
                                    `}
                                >
                                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Previous</span>
                                    <span className="text-zinc-300 text-sm font-semibold">
                                        Heuristic {String(currentHeuristicId - 1).padStart(2, '0')}
                                    </span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (currentHeuristicId === 10) setCurrentHeuristicId('report');
                                        else setCurrentHeuristicId(currentHeuristicId + 1);
                                    }}
                                    className={`
                                        flex flex-col items-end gap-1 p-4 rounded-2xl transition-all duration-300
                                        hover:bg-zinc-800/50 text-[#E85C2C]
                                    `}
                                >
                                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest text-right">Next</span>
                                    <span className="text-zinc-300 text-sm font-semibold text-right group-hover:text-[#E85C2C] transition-colors">
                                        {currentHeuristicId === 10 ? 'View Report' : `Heuristic ${String(currentHeuristicId + 1).padStart(2, '0')}`}
                                    </span>
                                </button>
                            </footer>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
