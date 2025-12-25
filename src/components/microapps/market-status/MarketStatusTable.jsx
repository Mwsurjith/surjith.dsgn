'use client';

import React, { useState } from 'react';
import { CaretDown, CaretUp, ArrowLineUpRight, ArrowLineDownRight, Clock } from "@phosphor-icons/react";

/**
 * MarketStatusTable Component
 * Displays a list of indices with key performance and valuation metrics.
 * Supports row expansion for more details.
 */
const MarketStatusTable = ({ data, isLoading }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (symbol) => {
        setExpandedRow(expandedRow === symbol ? null : symbol);
    };

    if (isLoading) {
        return (
            <div className="w-full h-64 bg-zinc-950 border border-zinc-800/50 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="text-zinc-600 font-medium tracking-widest animate-pulse italic">
                    FETCHING MARKET DATA...
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 italic">No market data available.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-zinc-900 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-800/50 bg-zinc-900">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Index Name</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">1D Change</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">1W Change</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">PE</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">5Y Med PE</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">v/s ATH</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/30">
                        {data.map((item) => {
                            const isExpanded = expandedRow === item.symbol;
                            const isPositive1D = item.change1d >= 0;
                            const isPositive1W = item.change1w >= 0;

                            return (
                                <React.Fragment key={item.symbol}>
                                    <tr
                                        onClick={() => toggleRow(item.symbol)}
                                        className={`
                                            group cursor-pointer transition-colors duration-200
                                            ${isExpanded ? 'bg-zinc-800/20' : 'hover:bg-zinc-800/10'}
                                        `}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-[#E85C2C] text-white' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'}`}>
                                                    {isExpanded ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
                                                </div>
                                                <span className="text-sm font-semibold text-zinc-200 tracking-tight group-hover:text-white transition-colors">
                                                    {item.symbol}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-5 text-right text-sm font-medium tabular-nums ${isPositive1D ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            <div className="flex items-center justify-end gap-1.5">
                                                {isPositive1D ? <ArrowLineUpRight size={14} weight="bold" /> : <ArrowLineDownRight size={14} weight="bold" />}
                                                {isPositive1D ? '+' : ''}{item.change1d?.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className={`px-6 py-5 text-right text-sm font-medium tabular-nums ${isPositive1W ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            <div className="flex items-center justify-end gap-1.5">
                                                {isPositive1W ? <ArrowLineUpRight size={14} weight="bold" /> : <ArrowLineDownRight size={14} weight="bold" />}
                                                {isPositive1W ? '+' : ''}{item.change1w?.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right text-sm font-medium text-zinc-300 tabular-nums">
                                            {item.pe?.toFixed(2) || '-'}
                                        </td>
                                        <td className="px-6 py-5 text-right text-sm font-medium text-zinc-400 tabular-nums">
                                            {item.medianPe5y?.toFixed(2) || '-'}
                                        </td>
                                        <td className="px-6 py-5 text-right text-sm font-medium text-rose-400 tabular-nums">
                                            -{item.distFromAth?.toFixed(2)}%
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan="6" className="bg-zinc-900/40 px-6 py-12 border-t border-zinc-800/50">
                                                <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50 relative overflow-hidden group/chart">
                                                    {/* Decorative background elements */}
                                                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#E85C2C,transparent)]" />

                                                    <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 mb-6 group-hover/chart:scale-110 transition-transform duration-500">
                                                        <Clock size={40} weight="light" className="text-zinc-600 animate-[spin_8s_linear_infinite]" />
                                                    </div>

                                                    <h4 className="text-zinc-200 font-bold uppercase tracking-[0.2em] text-xs mb-2">
                                                        Chart Analysis
                                                    </h4>
                                                    <p className="text-zinc-500 text-[11px] font-medium italic">
                                                        Interactive Candlestick Perspective — Coming Soon
                                                    </p>

                                                    {/* Abstract Chart Placeholder Visualization */}
                                                    <div className="mt-8 flex gap-1 items-end h-12">
                                                        {[30, 45, 25, 60, 40, 70, 50, 85, 45, 30].map((h, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-1 bg-zinc-800/50 rounded-t-sm"
                                                                style={{ height: `${h}%` }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarketStatusTable;
