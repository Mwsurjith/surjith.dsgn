'use client';

import React from 'react';
import { heuristics, getHeuristicItemIds } from '@/constants/heuristics';

/**
 * Gauge Component (SVG based)
 */
const Gauge = ({ score, size = 200, strokeWidth = 12, label = "Heuristic Score" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    // We only show a semi-circle (180 degrees) or a 3/4 circle (270 degrees)
    // Let's do a semi-circle like the screenshot
    const strokeDashoffset = circumference - (score / 100) * (circumference * 0.75);
    const rotation = 135; // Start from bottom-left

    return (
        <div className="relative flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-0">
                {/* Background Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference * 0.75} ${circumference}`}
                    strokeLinecap="round"
                    className="text-zinc-800"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: '50% 50%'
                    }}
                />
                {/* Progress Bar */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#gauge-gradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference * 0.75} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: '50% 50%'
                    }}
                />
                <defs>
                    <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                <span className="text-5xl font-display italic text-white leading-none">{Math.round(score)}</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">{label}</span>
            </div>
        </div>
    );
};

/**
 * Mini Gauge for Cards
 */
const MiniGauge = ({ score }) => {
    const size = 48;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-12 h-12">
            <svg width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-zinc-800"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={score > 80 ? '#22c55e' : score > 50 ? '#fbbf24' : '#ef4444'}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out -rotate-90 origin-center"
                />
            </svg>
            <span className="absolute text-[10px] font-bold text-white">{Math.round(score)}</span>
        </div>
    );
};

/**
 * HeuristicReport Component
 */
export default function HeuristicReport({ getHeuristicStats }) {
    // Calculate stats for each heuristic
    const reportData = heuristics.map(h => {
        const itemIds = getHeuristicItemIds(h.id);
        const stats = getHeuristicStats(itemIds);

        // Quality Score = Pass / (Pass + Fail)
        // If nothing is answered, score is 0
        const totalAnswered = stats.pass + stats.fail;
        const score = totalAnswered > 0 ? (stats.pass / totalAnswered) * 100 : 0;

        // Impact based on fails
        let impact = { label: 'Low Impact', color: 'text-green-500 bg-green-500/10' };
        if (stats.fail > 3) impact = { label: 'High Impact', color: 'text-red-500 bg-red-500/10' };
        else if (stats.fail > 0) impact = { label: 'Moderate Impact', color: 'text-amber-500 bg-amber-500/10' };

        return {
            ...h,
            stats,
            score,
            impact
        };
    });

    // Overall Score
    const overallScore = reportData.reduce((acc, curr) => acc + curr.score, 0) / 10;
    const statusLabel = overallScore > 80 ? 'Good' : overallScore > 50 ? 'Needs Improvement' : 'Critical';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Score Section */}
            <div className="flex flex-col items-center mb-24 py-12 bg-zinc-950/20 rounded-[40px] border border-zinc-800/30">
                <Gauge score={overallScore} label="Overall Heuristic Score" />

                <div className="mt-8 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest leading-none">
                        {statusLabel}
                    </span>
                </div>
            </div>

            {/* List of Heuristic Cards */}
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6 px-2">
                    <h3 className="text-white text-sm font-bold uppercase tracking-widest opacity-40">Findings Breakdown</h3>
                    <span className="text-zinc-500 text-[10px] font-medium tracking-tight">10 Heuristics Evaluated</span>
                </div>

                {reportData.map((data, index) => (
                    <div
                        key={data.id}
                        className="group relative flex items-center gap-6 p-6 rounded-3xl bg-zinc-950/30 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300"
                    >
                        <div className="flex-shrink-0">
                            <MiniGauge score={data.score} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-zinc-600 text-[10px] font-bold tracking-tighter uppercase">Nielsen #{data.id}</span>
                                <h4 className="text-zinc-200 text-sm font-bold truncate tracking-tight">{data.name}</h4>
                            </div>
                            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-1 italic pr-12">
                                {data.description}
                            </p>
                        </div>

                        <div className={`
                            flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-tight 
                            ${data.impact.color}
                        `}>
                            {data.impact.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-24 pt-12 border-t border-zinc-900 flex flex-col items-center">
                <div className="flex items-center gap-2 grayscale opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-zinc-500 text-[10px] font-medium">Evaluation Powered by</span>
                    <span className="text-white text-[12px] font-display italic">Surjith.ux Heuristics Engine</span>
                </div>
            </div>
        </div>
    );
}
