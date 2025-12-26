'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download, Image } from 'lucide-react';
import { useMockupState } from '@/hooks/useMockupState';
import MockupSidebar from '@/components/microapps/mockup/MockupSidebar';
import MockupCanvas from '@/components/microapps/mockup/MockupCanvas';

import { Button } from '@/components/ui/button';

/**
 * Mockup Generator Page
 * A minimal mockup screen generator for placing screenshots into device frames.
 */
export default function MockupPage() {
    const canvasRef = useRef(null);
    const {
        state,
        setCanvasPreset,
        setCanvasSize,
        setBackgroundType,
        setSolidColor,
        setGradient,
        setDeviceMode,
        toggleShadow,
        setExportScale,
        setPreviewZoom,
        addDevice,
        removeDevice,
        updateDevice,
        setScreenshot,
        getNextEmptySlot,
        resetLayout,
        CANVAS_PRESETS,
    } = useMockupState();

    // Handle PNG export
    const handleExport = useCallback(async () => {
        if (!canvasRef.current) return;

        try {
            const dataUrl = await toPng(canvasRef.current, {
                pixelRatio: state.exportScale,
                backgroundColor: state.canvas.bgType === 'transparent' ? 'transparent' : null,
                style: {
                    borderRadius: '0',
                    ...(state.canvas.bgType === 'transparent' ? { backgroundImage: 'none' } : {}),
                }
            });

            const link = document.createElement('a');
            link.download = `mockup-${state.deviceMode}-${state.canvas.width}x${state.canvas.height}-${state.exportScale}x.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Export failed:', error);
        }
    }, [state.exportScale, state.deviceMode, state.canvas.width, state.canvas.height, state.canvas.bgType]);

    // Handle clipboard paste
    const handlePaste = useCallback((e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    const emptySlot = getNextEmptySlot();
                    if (emptySlot) {
                        setScreenshot(emptySlot.id, event.target.result);
                    } else if (state.items.length > 0) {
                        setScreenshot(state.items[0].id, event.target.result);
                    }
                };
                reader.readAsDataURL(file);
                break;
            }
        }
    }, [getNextEmptySlot, setScreenshot, state.items]);

    // Handle drag & drop on canvas
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const emptySlot = getNextEmptySlot();
                    if (emptySlot) {
                        setScreenshot(emptySlot.id, event.target.result);
                    } else if (state.items.length > 0) {
                        setScreenshot(state.items[0].id, event.target.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }, [getNextEmptySlot, setScreenshot, state.items]);

    // Add paste event listener
    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [handlePaste]);


    return (
        <div className="w-full bg-zinc-900 pt-16">
            {/* Main Content - integrated with site layout */}
            <div
                className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-80px)] min-h-[600px] overflow-hidden"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                {/* Scrollable Sidebar */}
                <div className="w-80 flex-shrink-0 overflow-y-auto no-scrollbar p-6 pr-0">
                    {/* Inline Title */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="text-lg font-bold font-['gloock'] text-white leading-tight ml-4">
                            Mockup Generator
                        </div>
                    </div>

                    <MockupSidebar
                        state={state}
                        setCanvasPreset={setCanvasPreset}
                        setCanvasSize={setCanvasSize}
                        setBackgroundType={setBackgroundType}
                        setSolidColor={setSolidColor}
                        setGradient={setGradient}
                        setDeviceMode={setDeviceMode}
                        toggleShadow={toggleShadow}
                        addDevice={addDevice}
                        removeDevice={removeDevice}
                        updateDevice={updateDevice}
                        setScreenshot={setScreenshot}
                        resetLayout={resetLayout}
                        CANVAS_PRESETS={CANVAS_PRESETS}
                    />
                </div>

                {/* Canvas Preview - with floating controls */}
                <div className="flex-1 relative overflow-hidden">
                    {/* Floating Export Controls */}
                    <div className="absolute top-6 right-6 z-10 flex items-center gap-4">
                        {/* Export Scale Selector */}
                        <div className="flex items-center gap-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/50 rounded-xl p-1 shadow-2xl">
                            {[1, 2, 4].map((scale) => (
                                <Button
                                    key={scale}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExportScale(scale)}
                                    className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${state.exportScale === scale
                                        ? 'bg-orange-500 text-white hover:bg-orange-600 hover:text-white shadow-lg'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                        }`}
                                >
                                    {scale}x
                                </Button>
                            ))}
                        </div>

                        {/* Export Button */}
                        <Button
                            onClick={handleExport}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl h-10 px-6 transition-all shadow-xl hover:shadow-orange-500/20 active:scale-95"
                        >
                            <Download size={16} className="mr-2" />
                            Export PNG
                        </Button>
                    </div>

                    <MockupCanvas
                        ref={canvasRef}
                        state={state}
                        updateDevice={updateDevice}
                        setPreviewZoom={setPreviewZoom}
                    />
                </div>
            </div>
        </div>
    );
}
