'use client';

import { useState, useCallback } from 'react';

const CANVAS_PRESETS = {
    instagram: { width: 1080, height: 1080, label: 'Instagram' },
    dribbble: { width: 1600, height: 1200, label: 'Dribbble' },
    ppt: { width: 1920, height: 1080, label: 'PPT' },
    custom: { width: 1080, height: 1080, label: 'Custom' },
};

const DEFAULT_STATE = {
    canvas: {
        preset: 'instagram',
        width: 1080,
        height: 1080,
        bgType: 'gradient', // 'transparent' | 'solid' | 'gradient'
        solidHex: '#cbd5e1',
        gradient: { c1: '#52525b', c2: '#27272a', angle: 135 },
    },
    deviceMode: 'pixel', // 'pixel' | 'safari'
    shadowEnabled: true,
    exportScale: 2, // 1 | 2 | 4
    previewZoom: null, // null means auto-fit, number like 1.0 means manual zoom
    items: [
        { id: 1, type: 'pixel', screenshotDataUrl: null, x: 0, y: 0, scale: 1.2, zIndex: 1 },
    ],
};

let deviceIdCounter = 2;

export function useMockupState() {
    const [state, setState] = useState(DEFAULT_STATE);

    // Canvas actions
    const setCanvasPreset = useCallback((preset) => {
        const presetData = CANVAS_PRESETS[preset];
        if (presetData) {
            setState((prev) => ({
                ...prev,
                canvas: {
                    ...prev.canvas,
                    preset,
                    width: presetData.width,
                    height: presetData.height,
                },
            }));
        }
    }, []);

    const setCanvasSize = useCallback((width, height) => {
        setState((prev) => ({
            ...prev,
            canvas: { ...prev.canvas, preset: 'custom', width, height },
        }));
    }, []);

    const setBackgroundType = useCallback((bgType) => {
        setState((prev) => ({
            ...prev,
            canvas: { ...prev.canvas, bgType },
        }));
    }, []);

    const setSolidColor = useCallback((hex) => {
        setState((prev) => ({
            ...prev,
            canvas: { ...prev.canvas, solidHex: hex },
        }));
    }, []);

    const setGradient = useCallback((gradient) => {
        setState((prev) => ({
            ...prev,
            canvas: { ...prev.canvas, gradient: { ...prev.canvas.gradient, ...gradient } },
        }));
    }, []);

    // Device mode actions
    const setDeviceMode = useCallback((mode) => {
        const newItems = mode === 'safari'
            ? [{ id: 1, type: 'safari', screenshotDataUrl: null, x: 0, y: 0, scale: 0.65, zIndex: 1 }]
            : [{ id: 1, type: 'pixel', screenshotDataUrl: null, x: 0, y: 0, scale: 1.2, zIndex: 1 }];
        setState((prev) => ({ ...prev, deviceMode: mode, items: newItems }));
    }, []);

    const toggleShadow = useCallback(() => {
        setState((prev) => ({ ...prev, shadowEnabled: !prev.shadowEnabled }));
    }, []);

    const setExportScale = useCallback((scale) => {
        setState((prev) => ({ ...prev, exportScale: scale }));
    }, []);

    const setPreviewZoom = useCallback((zoom) => {
        setState((prev) => ({ ...prev, previewZoom: zoom }));
    }, []);

    // Device instance actions
    const addDevice = useCallback(() => {
        setState((prev) => {
            if (prev.deviceMode === 'safari' || prev.items.length >= 3) return prev;
            const newDevice = {
                id: deviceIdCounter++,
                type: 'pixel',
                screenshotDataUrl: null,
                x: prev.items.length * 50,
                y: prev.items.length * 30,
                scale: 1.2,
                zIndex: prev.items.length + 1,
            };
            return { ...prev, items: [...prev.items, newDevice] };
        });
    }, []);

    const removeDevice = useCallback((id) => {
        setState((prev) => {
            if (prev.items.length <= 1) return prev;
            return { ...prev, items: prev.items.filter((item) => item.id !== id) };
        });
    }, []);

    const updateDevice = useCallback((id, updates) => {
        setState((prev) => ({
            ...prev,
            items: prev.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        }));
    }, []);

    const setScreenshot = useCallback((id, dataUrl) => {
        updateDevice(id, { screenshotDataUrl: dataUrl });
    }, [updateDevice]);

    const resetLayout = useCallback(() => {
        setState(DEFAULT_STATE);
        deviceIdCounter = 2;
    }, []);

    // Find next empty device slot
    const getNextEmptySlot = useCallback(() => {
        return state.items.find((item) => !item.screenshotDataUrl);
    }, [state.items]);

    return {
        state,
        // Canvas
        setCanvasPreset,
        setCanvasSize,
        setBackgroundType,
        setSolidColor,
        setGradient,
        // Device mode
        setDeviceMode,
        toggleShadow,
        setExportScale,
        setPreviewZoom,
        // Device instances
        addDevice,
        removeDevice,
        updateDevice,
        setScreenshot,
        getNextEmptySlot,
        // Utilities
        resetLayout,
        CANVAS_PRESETS,
    };
}
