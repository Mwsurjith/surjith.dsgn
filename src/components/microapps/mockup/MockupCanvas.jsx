'use client';

import React, { forwardRef, useRef, useState, useLayoutEffect } from 'react';
import PixelDevice from './PixelDevice';
import SafariBrowser from './SafariBrowser';

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

/**
 * MockupCanvas Component
 * The live preview area where device mockups are rendered.
 * Preview scales to fit container while maintaining aspect ratio.
 * Actual canvas dimensions are preserved for html-to-image export.
 */
const MockupCanvas = forwardRef(({ state, updateDevice, setPreviewZoom }, ref) => {
    const { canvas, shadowEnabled, items, previewZoom } = state;
    const containerRef = useRef(null);
    const [autoScale, setAutoScale] = useState(1);

    // Calculate auto-scale to fit canvas within container
    useLayoutEffect(() => {
        const updateAutoScale = () => {
            if (!containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const padding = 160; // Increased padding to ensure canvas is fully visible
            const availableWidth = containerRect.width - padding;
            const availableHeight = containerRect.height - padding;

            const scaleX = Math.max(0.1, availableWidth / canvas.width);
            const scaleY = Math.max(0.1, availableHeight / canvas.height);
            const newAutoScale = Math.min(scaleX, scaleY, 1);

            setAutoScale(newAutoScale);
        };

        updateAutoScale();
        window.addEventListener('resize', updateAutoScale);
        return () => window.removeEventListener('resize', updateAutoScale);
    }, [canvas.width, canvas.height]);

    // Final zoom level to use (manual if set, else auto)
    const currentZoom = previewZoom || autoScale;

    // Generate background style
    const getBackgroundStyle = () => {
        switch (canvas.bgType) {
            case 'transparent':
                return {
                    backgroundColor: 'transparent',
                    backgroundImage: `
                        linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
                        linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
                        linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                };
            case 'solid':
                return { backgroundColor: canvas.solidHex };
            case 'gradient':
                return {
                    background: `linear-gradient(${canvas.gradient.angle}deg, ${canvas.gradient.c1}, ${canvas.gradient.c2})`,
                };
            default:
                return { backgroundColor: '#f1f5f9' };
        }
    };

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData('deviceId', item.id.toString());
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const deviceId = parseInt(e.dataTransfer.getData('deviceId'), 10);
        if (!deviceId) return;

        const rect = e.currentTarget.getBoundingClientRect();
        // Adjust for currentZoom when calculating drop position
        const x = (e.clientX - rect.left - rect.width / 2) / currentZoom;
        const y = (e.clientY - rect.top - rect.height / 2) / currentZoom;
        updateDevice(deviceId, { x, y });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-auto"
        >
            {/* Centering Wrapper */}
            <div className="w-full min-h-full flex items-center justify-center p-8 md:p-12">
                {/* Scaled preview wrapper - this div has the "visual" size to trigger parent scrollbars */}
                <div
                    style={{
                        width: canvas.width * currentZoom,
                        height: canvas.height * currentZoom,
                        flexShrink: 0,
                        position: 'relative'
                    }}
                >
                    {/* The actual scaled content - transformOrigin '0 0' makes it easy to position inside the sized wrapper */}
                    <div
                        style={{
                            transform: `scale(${currentZoom})`,
                            transformOrigin: '0 0',
                            width: canvas.width,
                            height: canvas.height,
                        }}
                    >
                        {/* Actual canvas (full size for export) */}
                        <div
                            ref={ref}
                            className="relative overflow-hidden shadow-2xl rounded-2xl"
                            style={{
                                width: '100%',
                                height: '100%',
                                ...getBackgroundStyle(),
                            }}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item)}
                                    className="absolute cursor-move"
                                    style={{
                                        left: `calc(50% + ${item.x}px)`,
                                        top: `calc(50% + ${item.y}px)`,
                                        transform: `translate(-50%, -50%) scale(${item.scale})`,
                                        zIndex: item.zIndex,
                                    }}
                                >
                                    {item.type === 'pixel' ? (
                                        <PixelDevice
                                            screenshotUrl={item.screenshotDataUrl}
                                            shadowEnabled={shadowEnabled}
                                        />
                                    ) : (
                                        <SafariBrowser
                                            screenshotUrl={item.screenshotDataUrl}
                                            shadowEnabled={shadowEnabled}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scale Indicator & Zoom Slider */}
            <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 p-2.5 rounded-2xl shadow-2xl z-20">
                <div className="flex items-center gap-4 pr-3 border-r border-zinc-700/50">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] min-w-[40px] text-right">
                        {Math.round(currentZoom * 100)}%
                    </span>
                    <Slider
                        min={0.1}
                        max={2}
                        step={0.01}
                        value={[currentZoom]}
                        onValueChange={([val]) => setPreviewZoom(val)}
                        className="w-32 cursor-pointer"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewZoom(null)}
                    className={`h-8 px-3 text-[10px] font-black tracking-[0.2em] transition-all rounded-lg ${!previewZoom ? 'text-orange-500 bg-orange-500/10 hover:bg-orange-500/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
                >
                    FIT
                </Button>
            </div>
        </div>
    );
});

MockupCanvas.displayName = 'MockupCanvas';

export default MockupCanvas;
