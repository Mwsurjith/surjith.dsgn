'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_TASKS, STORAGE_KEY, SETTINGS_KEY } from '@/constants/tasks';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hideCompleted, setHideCompleted] = useState(false);
    const [syncStatus, setSyncStatus] = useState('idle');

    // ==================== SETTINGS ====================
    useEffect(() => {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) setHideCompleted(JSON.parse(saved).hideCompleted || false);
        } catch { }
    }, []);

    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ hideCompleted }));
    }, [hideCompleted]);

    // ==================== INITIALIZE ====================
    useEffect(() => {
        if (!supabase) {
            loadLocal();
            setIsLoading(false);
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                loadCloud(session.user.id);
            } else {
                loadLocal();
            }
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth:', event);

            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user);
                handleSignIn(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                loadLocal();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // ==================== DATA LOADING ====================
    function loadLocal() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            setTasks(saved ? JSON.parse(saved) : DEFAULT_TASKS);
            if (!saved) localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
        } catch {
            setTasks(DEFAULT_TASKS);
        }
        setSyncStatus('idle');
    }

    async function loadCloud(userId) {
        setSyncStatus('syncing');
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setTasks(data || []);
            setSyncStatus('synced');
        } catch (e) {
            console.error('Load failed:', e);
            setSyncStatus('error');
        }
    }

    // ==================== SIGN IN HANDLER ====================
    async function handleSignIn(userId) {
        setSyncStatus('syncing');

        try {
            // Grab local tasks and IMMEDIATELY clear to prevent race condition
            const localData = localStorage.getItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_KEY);

            // Always migrate local tasks (if any) - merge with cloud
            if (localData) {
                const localTasks = JSON.parse(localData);

                // Filter out default welcome tasks (they have simple numeric IDs like '1', '2', etc.)
                const userCreatedTasks = localTasks.filter(t =>
                    !['1', '2', '3', '4', '5'].includes(t.id)
                );

                if (userCreatedTasks.length > 0) {
                    console.log('Migrating', userCreatedTasks.length, 'local tasks to cloud...');

                    // Insert local tasks to cloud (they will be merged with existing cloud tasks)
                    const { error } = await supabase.from('tasks').insert(
                        userCreatedTasks.map(t => ({
                            user_id: userId,
                            title: t.title,
                            is_completed: t.is_completed,
                            created_at: t.created_at,
                        }))
                    );

                    if (error) {
                        console.error('Migration error:', error);
                    }
                }
            }

            // Load the latest from cloud (now includes both old cloud + newly migrated local)
            await loadCloud(userId);
        } catch (e) {
            console.error('Sign-in handler failed:', e);
            setSyncStatus('error');
        }
    }

    // ==================== SAVE LOCAL ====================
    function saveLocal(newTasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    }

    // ==================== ACTIONS ====================
    const addTask = useCallback(async (title) => {
        const newTask = {
            id: crypto.randomUUID(),
            title,
            is_completed: false,
            created_at: new Date().toISOString(),
        };

        if (user && supabase) {
            setSyncStatus('syncing');
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .insert({ title, is_completed: false, user_id: user.id })
                    .select()
                    .single();
                if (error) throw error;
                setTasks(prev => [...prev, data]);
                setSyncStatus('synced');
            } catch (e) {
                console.error('Add failed:', e);
                setSyncStatus('error');
            }
        } else {
            const updated = [...tasks, newTask];
            setTasks(updated);
            saveLocal(updated);
        }
    }, [user, tasks]);

    const toggleTask = useCallback(async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newStatus = !task.is_completed;
        const updated = tasks.map(t => t.id === taskId ? { ...t, is_completed: newStatus } : t);
        setTasks(updated);

        if (user && supabase) {
            setSyncStatus('syncing');
            try {
                const { error } = await supabase
                    .from('tasks')
                    .update({ is_completed: newStatus })
                    .eq('id', taskId);
                if (error) throw error;
                setSyncStatus('synced');
            } catch (e) {
                console.error('Toggle failed:', e);
                setTasks(tasks);
                setSyncStatus('error');
            }
        } else {
            saveLocal(updated);
        }
    }, [user, tasks]);

    const deleteTask = useCallback(async (taskId) => {
        const updated = tasks.filter(t => t.id !== taskId);
        setTasks(updated);

        if (user && supabase) {
            setSyncStatus('syncing');
            try {
                const { error } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', taskId);
                if (error) throw error;
                setSyncStatus('synced');
            } catch (e) {
                console.error('Delete failed:', e);
                setTasks(tasks);
                setSyncStatus('error');
            }
        } else {
            saveLocal(updated);
        }
    }, [user, tasks]);

    const updateTask = useCallback(async (taskId, newTitle) => {
        const updated = tasks.map(t => t.id === taskId ? { ...t, title: newTitle } : t);
        setTasks(updated);

        if (user && supabase) {
            setSyncStatus('syncing');
            try {
                const { error } = await supabase
                    .from('tasks')
                    .update({ title: newTitle })
                    .eq('id', taskId);
                if (error) throw error;
                setSyncStatus('synced');
            } catch (e) {
                console.error('Update failed:', e);
                setTasks(tasks);
                setSyncStatus('error');
            }
        } else {
            saveLocal(updated);
        }
    }, [user, tasks]);

    // ==================== RENDER ====================
    const filteredTasks = hideCompleted ? tasks.filter(t => !t.is_completed) : tasks;
    const groupedTasks = groupTasksByDate(filteredTasks);

    return (
        <TasksContext.Provider value={{
            tasks: filteredTasks,
            groupedTasks,
            isLoading,
            user,
            hideCompleted,
            setHideCompleted,
            syncStatus,
            addTask,
            toggleTask,
            deleteTask,
            updateTask,
        }}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TasksContext);
    if (!context) throw new Error('useTasks must be used within TasksProvider');
    return context;
}

// ==================== HELPERS ====================
function groupTasksByDate(tasks) {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    tasks.forEach(task => {
        const taskDate = new Date(task.created_at);
        const dateKey = taskDate.toDateString();

        let label;
        if (taskDate.toDateString() === today.toDateString()) {
            label = `Today - ${formatDate(taskDate)}`;
        } else if (taskDate.toDateString() === yesterday.toDateString()) {
            label = `Yesterday - ${formatDate(taskDate)}`;
        } else {
            label = `${taskDate.toLocaleDateString('en-US', { weekday: 'long' })} - ${formatDate(taskDate)}`;
        }

        if (!groups[dateKey]) groups[dateKey] = { label, tasks: [] };
        groups[dateKey].tasks.push(task);
    });

    return Object.values(groups).sort((a, b) =>
        new Date(a.tasks[0]?.created_at) - new Date(b.tasks[0]?.created_at)
    );
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
}
