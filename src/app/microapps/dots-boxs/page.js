'use client';

import React from 'react';

export default function DotsBoxesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6 text-center">
            <h1 className="text-4xl font-display italic mb-4">Dots & Boxes</h1>
            <p className="text-zinc-500 max-w-md">
                This micro-app is currently under development. Check back soon for the full experience!
            </p>
            <div className="mt-8 px-6 py-2 rounded-full border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                Coming Soon
            </div>
        </div>
    );
}
