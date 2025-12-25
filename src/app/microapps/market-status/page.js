'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import MarketStatusTable from '@/components/microapps/market-status/MarketStatusTable';
import { ArrowLineUpRight, ArrowLineDownRight, Activity, ChartBar, WarningCircle } from "@phosphor-icons/react";

export default function MarketStatusPage() {
    const [rawRows, setRawRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMarketData() {
            try {
                if (!supabase) throw new Error('Supabase client not initialized');

                // Fetch data for the default major indices
                const targetIndices = [
                    "NIFTY 50",
                    "NIFTY NEXT 50",
                    "NIFTY MIDCAP 150",
                    "NIFTY SMLCAP 250",
                    "NIFTY LARGEMID250"
                ];

                const { data, error: fetchError } = await supabase
                    .from('index_ind')
                    .select('*')
                    .in('symbol', targetIndices)
                    .order('date', { ascending: false });

                if (fetchError) throw fetchError;
                setRawRows(data || []);
            } catch (err) {
                console.error('Error fetching market data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMarketData();
    }, []);

    const processedData = useMemo(() => {
        if (!rawRows.length) return [];

        // Group by symbol
        const grouped = rawRows.reduce((acc, row) => {
            if (!acc[row.symbol]) acc[row.symbol] = [];
            acc[row.symbol].push(row);
            return acc;
        }, {});

        return Object.entries(grouped).map(([symbol, rows]) => {
            // Data is ordered by date DESC
            const latest = rows[0];
            const prev1d = rows[1];

            // Find row approx 7 days ago (or the closest available before it)
            // Since data is sorted DESC, we look ahead in the array
            const targetDate1w = new Date(latest.date);
            targetDate1w.setDate(targetDate1w.getDate() - 7);
            const prev1w = rows.find(r => new Date(r.date) <= targetDate1w) || rows[rows.length - 1];

            // Calculations
            const change1d = prev1d ? ((latest.close - prev1d.close) / prev1d.close) * 100 : 0;
            const change1w = prev1w ? ((latest.close - prev1w.close) / prev1w.close) * 100 : 0;

            // ATH
            const ath = Math.max(...rows.map(r => r.high || r.close));
            const distFromAth = ath ? ((ath - latest.close) / ath) * 100 : 0;

            // 5Y Median PE
            // Get last 5 years of PE data
            const fiveYearsAgo = new Date();
            fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
            const peValues = rows
                .filter(r => new Date(r.date) >= fiveYearsAgo && r.pe !== null)
                .map(r => r.pe)
                .sort((a, b) => a - b);

            let medianPe5y = null;
            if (peValues.length > 0) {
                const mid = Math.floor(peValues.length / 2);
                medianPe5y = peValues.length % 2 !== 0
                    ? peValues[mid]
                    : (peValues[mid - 1] + peValues[mid]) / 2;
            }

            return {
                symbol,
                close: latest.close,
                pe: latest.pe,
                change1d,
                change1w,
                distFromAth,
                medianPe5y,
                lastUpdated: latest.date
            };
        });
    }, [rawRows]);

    return (
        <div className="w-full min-h-screen bg-zinc-900 py-32 px-5">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 mb-4">
                            Market Status
                        </div>
                        <h1 className="text-4xl md:text-5xl font-['Gloock'] font-bold text-white tracking-tight leading-tight mb-6">
                            Indian <span className="text-zinc-500 italic font-medium">Broader Market Index</span> Status
                        </h1>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                            A real-time snapshot of major NSE indices, tracking momentum, valuation levels,
                            and historical context to gauge current market sentiment.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 py-4 px-6 bg-zinc-900 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Last Update</span>
                            <span className="text-xs font-semibold text-zinc-400 tabular-nums">
                                {processedData[0]?.lastUpdated || 'Syncing...'}
                            </span>
                        </div>
                        <div className="w-px h-8 bg-zinc-800/50" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Source</span>
                            <span className="text-xs font-semibold text-zinc-400">NSE Python</span>
                        </div>
                    </div>
                </div>

                {/* Stats Section Unified Card */}
                <div className="bg-zinc-900 border border-zinc-800/50 rounded-2xl mb-12 overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/50">
                        <StatItem
                            title="Top Gainer (1D)"
                            value={processedData.length > 0 ? [...processedData].sort((a, b) => b.change1d - a.change1d)[0] : null}
                        />
                        <StatItem
                            title="Top Laggard (1D)"
                            value={processedData.length > 0 ? [...processedData].sort((a, b) => a.change1d - b.change1d)[0] : null}
                            isNegative
                        />
                        <StatItem
                            title="Most Oversold (v/s ATH)"
                            value={processedData.length > 0 ? [...processedData].sort((a, b) => b.distFromAth - a.distFromAth)[0] : null}
                            metricType="distFromAth"
                        />
                        <StatItem
                            title="Cheapest (PE/Med)"
                            value={processedData.length > 0 ? [...processedData].sort((a, b) => (a.pe / a.medianPe5y) - (b.pe / b.medianPe5y))[0] : null}
                            metricType="peRatio"
                        />
                    </div>
                </div>

                {/* Main Table */}
                {error ? (
                    <div className="w-full p-8 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-center gap-4">
                        <WarningCircle className="text-rose-500" size={24} />
                        <div>
                            <h3 className="text-rose-500 font-bold uppercase tracking-wider text-xs mb-1">Connection Error</h3>
                            <p className="text-rose-500/70 text-sm">Failed to sync with market data: {error}</p>
                        </div>
                    </div>
                ) : (
                    <MarketStatusTable data={processedData} isLoading={isLoading} />
                )}

                {/* Footer */}
                <div className="mt-24 pt-12 border-t border-zinc-900 flex flex-col items-center">
                    <div className="flex items-center gap-2 grayscale opacity-40 hover:opacity-100 transition-opacity">
                        <span className="text-zinc-500 text-[10px] font-medium">Powered by</span>
                        <span className="text-white text-[12px] font-display italic">Surjith.dsgn Market Status</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatItem({ title, value, isNegative, metricType = 'change1d' }) {
    if (!value) return (
        <div className="p-6 animate-pulse">
            <div className="h-2 w-20 bg-zinc-800 rounded mb-3" />
            <div className="h-4 w-32 bg-zinc-800 rounded" />
        </div>
    );

    let displayValue = '';
    if (metricType === 'change1d') {
        displayValue = `${value.change1d > 0 ? '+' : ''}${value.change1d.toFixed(2)}%`;
    } else if (metricType === 'distFromAth') {
        displayValue = `-${value.distFromAth.toFixed(1)}%`;
    } else if (metricType === 'peRatio') {
        displayValue = `${(value.pe / value.medianPe5y).toFixed(2)}x`;
    }

    return (
        <div className="p-6 flex flex-col gap-1 hover:bg-zinc-800/10 transition-colors cursor-default">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">
                {title}
            </span>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight leading-tight mb-1">
                    {value.symbol}
                </span>
                <div className={`flex items-center gap-1.5 text-xs font-bold tabular-nums ${isNegative || metricType === 'distFromAth' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {metricType === 'change1d' && (
                        value.change1d >= 0 ? <ArrowLineUpRight size={14} weight="bold" /> : <ArrowLineDownRight size={14} weight="bold" />
                    )}
                    {displayValue}
                </div>
            </div>
        </div>
    );
}
