'use client';

import React from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * MockupSidebar Component
 * Left panel with all mockup controls using shadcn/ui.
 */
const MockupSidebar = ({
    state,
    setCanvasPreset,
    setCanvasSize,
    setBackgroundType,
    setSolidColor,
    setGradient,
    setDeviceMode,
    toggleShadow,
    addDevice,
    removeDevice,
    updateDevice,
    setScreenshot,
    resetLayout,
    CANVAS_PRESETS,
}) => {
    const { canvas, deviceMode, shadowEnabled, items } = state;

    const handleFileUpload = (e, deviceId) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setScreenshot(deviceId, event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <aside className="space-y-6">
            {/* Canvas Section */}
            <SidebarSection title="Canvas">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Select
                            value={canvas.preset}
                            onValueChange={(value) => setCanvasPreset(value)}
                        >
                            <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 hover:border-zinc-700">
                                <SelectValue placeholder="Select preset" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {Object.entries(CANVAS_PRESETS).map(([key, preset]) => (
                                    <SelectItem key={key} value={key} className="focus:bg-zinc-800 focus:text-white">
                                        {preset.label} ({preset.width}×{preset.height})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {canvas.preset === 'custom' && (
                        <div className="flex gap-3">
                            <div className="flex-1 space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Width</Label>
                                <Input
                                    type="number"
                                    value={canvas.width}
                                    onChange={(e) => setCanvasSize(parseInt(e.target.value) || 1080, canvas.height)}
                                    className="bg-zinc-950 border-zinc-800 h-9 hover:border-zinc-700"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Height</Label>
                                <Input
                                    type="number"
                                    value={canvas.height}
                                    onChange={(e) => setCanvasSize(canvas.width, parseInt(e.target.value) || 1080)}
                                    className="bg-zinc-950 border-zinc-800 h-9 hover:border-zinc-700"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </SidebarSection>

            {/* Background Section */}
            <SidebarSection title="Background">
                <div className="space-y-4">
                    <div className="flex p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
                        {['transparent', 'solid', 'gradient'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setBackgroundType(type)}
                                className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all ${canvas.bgType === type
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    {canvas.bgType === 'solid' && (
                        <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 p-2 rounded-lg hover:border-zinc-700">
                            <input
                                type="color"
                                value={canvas.solidHex}
                                onChange={(e) => setSolidColor(e.target.value)}
                                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                            />
                            <Input
                                type="text"
                                value={canvas.solidHex}
                                onChange={(e) => setSolidColor(e.target.value)}
                                className="bg-transparent border-none focus-visible:ring-0 h-8 font-mono text-xs uppercase"
                            />
                        </div>
                    )}

                    {canvas.bgType === 'gradient' && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-2 rounded-lg hover:border-zinc-700">
                                    <input
                                        type="color"
                                        value={canvas.gradient.c1}
                                        onChange={(e) => setGradient({ c1: e.target.value })}
                                        className="w-6 h-6 rounded border-none bg-transparent cursor-pointer"
                                    />
                                    <Input
                                        type="text"
                                        value={canvas.gradient.c1}
                                        onChange={(e) => setGradient({ c1: e.target.value })}
                                        className="bg-transparent border-none focus-visible:ring-0 h-6 font-mono text-[10px] uppercase p-0"
                                    />
                                </div>
                                <div className="flex-1 flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-2 rounded-lg hover:border-zinc-700">
                                    <input
                                        type="color"
                                        value={canvas.gradient.c2}
                                        onChange={(e) => setGradient({ c2: e.target.value })}
                                        className="w-6 h-6 rounded border-none bg-transparent cursor-pointer"
                                    />
                                    <Input
                                        type="text"
                                        value={canvas.gradient.c2}
                                        onChange={(e) => setGradient({ c2: e.target.value })}
                                        className="bg-transparent border-none focus-visible:ring-0 h-6 font-mono text-[10px] uppercase p-0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Angle</Label>
                                    <span className="text-[10px] font-mono text-zinc-400">{canvas.gradient.angle}°</span>
                                </div>
                                <Slider
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={[canvas.gradient.angle]}
                                    onValueChange={([val]) => setGradient({ angle: val })}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </SidebarSection>

            {/* Device Section */}
            <SidebarSection title="Device & Effects">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Model</Label>
                        <div className="flex p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
                            {['pixel', 'safari'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setDeviceMode(mode)}
                                    className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all ${deviceMode === mode
                                        ? 'bg-orange-500 text-white shadow-lg'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    {mode === 'pixel' ? 'Pixel 9 Pro' : 'Safari'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 p-3 rounded-xl">
                        <div className="space-y-0.5">
                            <Label className="text-xs font-bold text-white">Device Shadow</Label>
                            <p className="text-[10px] text-zinc-500">Add depth to mockups</p>
                        </div>
                        <Switch
                            checked={shadowEnabled}
                            onCheckedChange={toggleShadow}
                            className="data-[state=checked]:bg-orange-500"
                        />
                    </div>
                </div>
            </SidebarSection>

            {/* Device Instances */}
            <div className="space-y-4">
                {items.map((item, index) => (
                    <SidebarSection key={item.id} title={`Instance ${index + 1}`}>
                        <div className="space-y-4">
                            {/* Scale slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Scale</Label>
                                    <span className="text-[10px] font-mono text-zinc-400">{(item.scale * 100).toFixed(0)}%</span>
                                </div>
                                <Slider
                                    min={0.2}
                                    max={2}
                                    step={0.01}
                                    value={[item.scale]}
                                    onValueChange={([val]) => updateDevice(item.id, { scale: val })}
                                    className="cursor-pointer"
                                />
                            </div>

                            {/* Position inputs */}
                            <div className="flex gap-3">
                                <div className="flex-1 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Shift X</Label>
                                    <Input
                                        type="number"
                                        value={Math.round(item.x)}
                                        onChange={(e) => updateDevice(item.id, { x: parseInt(e.target.value) || 0 })}
                                        className="bg-zinc-950 border-zinc-800 h-9 text-xs hover:border-zinc-700"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Shift Y</Label>
                                    <Input
                                        type="number"
                                        value={Math.round(item.y)}
                                        onChange={(e) => updateDevice(item.id, { y: parseInt(e.target.value) || 0 })}
                                        className="bg-zinc-950 border-zinc-800 h-9 text-xs hover:border-zinc-700"
                                    />
                                </div>
                            </div>

                            {/* Screenshot upload */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Screenshot</Label>
                                <div
                                    onClick={() => document.getElementById(`file-${item.id}`).click()}
                                    className="relative aspect-video bg-zinc-900 border border-dashed border-zinc-700 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer group"
                                >
                                    {item.screenshotDataUrl ? (
                                        <>
                                            <img
                                                src={item.screenshotDataUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Replace</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
                                            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                                                <Plus size={16} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    id={`file-${item.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, item.id)}
                                    className="hidden"
                                />
                            </div>

                            {/* Remove button (if more than 1 device) */}
                            {items.length > 1 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeDevice(item.id)}
                                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 shadow-none h-9 text-xs font-bold"
                                >
                                    <Trash2 size={14} className="mr-2" />
                                    Remove Instance
                                </Button>
                            )}
                        </div>
                    </SidebarSection>
                ))}

                {/* Add device button (only for pixel mode, max 3) */}
                {deviceMode === 'pixel' && items.length < 3 && (
                    <Button
                        variant="outline"
                        onClick={addDevice}
                        className="w-full bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white border-orange-500/20 border-dashed h-12 text-xs font-bold uppercase tracking-widest"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Instance
                    </Button>
                )}
            </div>

            {/* Reset Layout Button */}
            <div className="pt-4 border-t border-zinc-800/50">
                <Button
                    variant="ghost"
                    onClick={resetLayout}
                    className="w-full text-zinc-500 hover:text-white hover:bg-zinc-800/50 h-10 text-[10px] font-bold uppercase tracking-widest"
                >
                    <RotateCcw size={14} className="mr-2" />
                    Reset All Settings
                </Button>
            </div>
        </aside>
    );
};

// Sidebar section wrapper
const SidebarSection = ({ title, children }) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">{title}</h3>
        {children}
    </div>
);

export default MockupSidebar;
