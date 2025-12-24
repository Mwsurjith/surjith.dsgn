'use client';

import { useState } from 'react';
import { Cloud, CloudWarning, SignOut, PaperPlaneTilt } from '@phosphor-icons/react';
import { useTasks } from '@/context/TasksContext';
import { supabase } from '@/lib/supabase';

export default function SettingsPopover({ isOpen, onClose }) {
    const { user, hideCompleted, setHideCompleted, syncStatus } = useTasks();
    const [email, setEmail] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!supabase || !email.trim()) return;

        setIsLoggingIn(true);
        setLoginMessage('');

        const { error } = await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: {
                emailRedirectTo: window.location.href,
            },
        });

        setIsLoggingIn(false);

        if (error) {
            setLoginMessage('Error: ' + error.message);
        } else {
            setLoginMessage('Check your email for login link!');
            setEmail('');
        }
    };

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden">
            {/* Sync Status */}
            <div className="px-4 py-3 border-b border-zinc-700">
                {user ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            {syncStatus === 'synced' ? (
                                <>
                                    <Cloud className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400">Synced</span>
                                </>
                            ) : syncStatus === 'syncing' ? (
                                <>
                                    <Cloud className="w-4 h-4 text-amber-400 animate-pulse" />
                                    <span className="text-amber-400">Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <CloudWarning className="w-4 h-4 text-red-400" />
                                    <span className="text-red-400">Error</span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                        >
                            <SignOut className="w-3 h-3" />
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <CloudWarning className="w-4 h-4" />
                            <span>Guest mode</span>
                        </div>
                        {supabase && (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-1">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                                        placeholder="Email for magic link"
                                        className="flex-1 px-2 py-1.5 text-xs bg-zinc-700 text-white rounded placeholder:text-zinc-500 outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleLogin}
                                        disabled={isLoggingIn || !email.trim()}
                                        className="px-2 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <PaperPlaneTilt className="w-3 h-3" />
                                    </button>
                                </div>
                                {loginMessage && (
                                    <p className={`text-xs ${loginMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                                        {loginMessage}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* User email if logged in */}
            {user && (
                <div className="px-4 py-2 border-b border-zinc-700">
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
            )}

            {/* Settings */}
            <div className="px-4 py-3">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-zinc-300">Hide completed</span>
                    <button
                        onClick={() => setHideCompleted(!hideCompleted)}
                        className={`w-10 h-6 rounded-full transition-colors duration-200 ${hideCompleted ? 'bg-blue-500' : 'bg-zinc-600'
                            } relative`}
                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${hideCompleted ? 'translate-x-4' : ''
                                }`}
                        />
                    </button>
                </label>
            </div>
        </div>
    );
}

