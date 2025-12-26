'use client';

import React from 'react';

/**
 * PixelDevice Component
 * Renders a Pixel 9 Pro device frame using the SVG asset.
 * Screenshot is clipped inside the device screen area.
 */
const PixelDevice = ({ screenshotUrl, shadowEnabled }) => {
    // Pixel 9 Pro screen dimensions (from SVG viewBox analysis)
    // The SVG is 312x666 with screen area roughly at specific coordinates
    const deviceWidth = 352;
    const deviceHeight = 744;

    // Screen area offsets (approximate based on SVG structure)
    const screenTop = 16;
    const screenLeft = 14.5;
    const screenWidth = 320;
    const screenHeight = 714;
    const screenBorderRadius = 32;

    return (
        <div
            className="relative"
            style={{
                width: deviceWidth,
                height: deviceHeight,
                filter: shadowEnabled
                    ? 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))'
                    : 'none',
            }}
        >
            {/* Screenshot layer (behind device frame) */}
            <div
                className="absolute overflow-hidden bg-white"
                style={{
                    top: screenTop,
                    left: screenLeft,
                    width: screenWidth,
                    height: screenHeight,
                    borderRadius: screenBorderRadius,
                }}
            >
                {screenshotUrl ? (
                    <img
                        src={screenshotUrl}
                        alt="Screenshot"
                        className="w-full h-auto"
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 text-xs font-medium">
                        Drop Screenshot
                    </div>
                )}
            </div>

            {/* Device frame SVG */}
            <img
                src="/microapps/mockup/Pixel 9 Pro - Obsidian.svg"
                alt="Pixel 9 Pro"
                className="relative z-10 pointer-events-none"
                style={{ width: deviceWidth, height: deviceHeight }}
                draggable={false}
            />
        </div>
    );
};

export default PixelDevice;
