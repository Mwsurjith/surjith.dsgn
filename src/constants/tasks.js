/**
 * MicroTask microapp constants
 */

export const DEFAULT_TASKS = [
    { id: '1', title: 'Welcome to MicroTask 👋', is_completed: false, created_at: new Date().toISOString() },
    { id: '2', title: 'Type a task below and press enter ✏️', is_completed: false, created_at: new Date().toISOString() },
    { id: '3', title: 'Click a task to mark it complete ✅', is_completed: false, created_at: new Date().toISOString() },
    { id: '4', title: 'Use settings to hide completed tasks ⚙️', is_completed: false, created_at: new Date().toISOString() },
    { id: '5', title: 'Login to sync across devices ☁️', is_completed: false, created_at: new Date().toISOString() },
];

export const STORAGE_KEY = 'microtask_tasks';
export const SETTINGS_KEY = 'microtask_settings';
