'use client';

import React from 'react';

/**
 * SafariBrowser Component
 * Renders a Safari browser window mockup with macOS-style window chrome.
 */
const SafariBrowser = ({ screenshotUrl, shadowEnabled }) => {
    const browserWidth = 1440;
    const browserHeight = 810;
    const titleBarHeight = 40;

    return (
        <div
            className="relative bg-zinc-800 rounded-xl overflow-hidden"
            style={{
                width: browserWidth,
                height: browserHeight,
                boxShadow: shadowEnabled
                    ? '0 25px 80px rgba(0, 0, 0, 0.6), 0 10px 30px rgba(0, 0, 0, 0.4)'
                    : 'none',
            }}
        >
            {/* Title bar */}
            <div
                className="flex items-center gap-3 px-4 bg-zinc-700/80 border-b border-zinc-600/50"
                style={{ height: titleBarHeight }}
            >
                {/* Traffic lights */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>

                {/* URL bar */}
                <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-600/50 rounded-md min-w-[300px] max-w-[400px]">
                        <svg
                            className="w-3.5 h-3.5 text-zinc-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                            />
                        </svg>
                        <span className="text-zinc-400 text-xs font-medium truncate">
                            yourwebsite.com
                        </span>
                    </div>
                </div>

                {/* Spacer for symmetry */}
                <div className="w-[52px]" />
            </div>

            {/* Content area */}
            <div
                className="bg-white"
                style={{
                    height: browserHeight - titleBarHeight,
                }}
            >
                {screenshotUrl ? (
                    <img
                        src={screenshotUrl}
                        alt="Website Screenshot"
                        className="w-full h-full object-cover object-top"
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 text-sm font-medium">
                        Drop or paste a screenshot
                    </div>
                )}
            </div>
        </div>
    );
};

export default SafariBrowser;
