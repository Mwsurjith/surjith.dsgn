'use client';

import { useState } from 'react';
import { SlidersHorizontal } from '@phosphor-icons/react';
import { useTasks } from '@/context/TasksContext';
import SettingsPopover from './SettingsPopover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TaskInput() {
    const [input, setInput] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const { addTask } = useTasks();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        addTask(input.trim());
        setInput('');
    };

    return (
        <div className="sticky bottom-0 left-0 right-0">
            {/* Gradient fade */}
            <div className="h-20 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent pointer-events-none" />

            {/* Input area */}
            <div className="bg-zinc-900 pb-6 px-4">
                <form onSubmit={handleSubmit} className="relative">
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your task & press enter"
                        className="w-full text-sm h-12 px-5 py-3 pr-12 bg-zinc-950 text-white rounded-full border-none placeholder:text-zinc-500 outline-none focus-visible:border-zinc-700 focus-visible:ring-0 transition-all"
                    />
                    <Button
                        type="button"
                        onClick={() => setShowSettings(!showSettings)}
                        className="absolute bg-transparent right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </Button>

                    {/* Settings Popover */}
                    <SettingsPopover isOpen={showSettings} onClose={() => setShowSettings(false)} />
                </form>
            </div>
        </div>
    );
}
