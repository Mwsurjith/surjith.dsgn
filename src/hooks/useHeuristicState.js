'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'heuristic-checklist-state';

/**
 * Status values for checklist items
 */
export const ItemStatus = {
    NONE: null,
    PASS: 'pass',
    FAIL: 'fail',
    NOT_APPLICABLE: 'na'
};

/**
 * Custom hook for managing heuristic checklist state with localStorage persistence
 */
export function useHeuristicState() {
    const [currentHeuristicId, setCurrentHeuristicId] = useState(1);
    const [itemStates, setItemStates] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setItemStates(parsed.itemStates || {});
                setCurrentHeuristicId(parsed.currentHeuristicId || 1);
            }
        } catch (error) {
            console.error('Failed to load heuristic state:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (!isLoaded) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                itemStates,
                currentHeuristicId
            }));
        } catch (error) {
            console.error('Failed to save heuristic state:', error);
        }
    }, [itemStates, currentHeuristicId, isLoaded]);

    /**
     * Set the status of a checklist item
     */
    const setItemStatus = useCallback((itemId, status) => {
        setItemStates(prev => ({
            ...prev,
            [itemId]: status
        }));
    }, []);

    /**
     * Get the status of a checklist item
     */
    const getItemStatus = useCallback((itemId) => {
        return itemStates[itemId] || ItemStatus.NONE;
    }, [itemStates]);

    /**
     * Clear all states (reset entire checklist)
     */
    const clearAll = useCallback(() => {
        setItemStates({});
    }, []);

    /**
     * Clear states for a specific heuristic
     */
    const clearHeuristic = useCallback((heuristicId, itemIds) => {
        setItemStates(prev => {
            const newState = { ...prev };
            itemIds.forEach(id => {
                delete newState[id];
            });
            return newState;
        });
    }, []);

    /**
     * Get completion stats for a heuristic
     */
    const getHeuristicStats = useCallback((itemIds) => {
        let pass = 0;
        let fail = 0;
        let na = 0;
        let unanswered = 0;

        itemIds.forEach(id => {
            const status = itemStates[id];
            if (status === ItemStatus.PASS) pass++;
            else if (status === ItemStatus.FAIL) fail++;
            else if (status === ItemStatus.NOT_APPLICABLE) na++;
            else unanswered++;
        });

        return {
            pass,
            fail,
            na,
            unanswered,
            total: itemIds.length,
            completed: pass + fail + na,
            completionPercentage: Math.round(((pass + fail + na) / itemIds.length) * 100)
        };
    }, [itemStates]);

    return {
        currentHeuristicId,
        setCurrentHeuristicId,
        itemStates,
        setItemStatus,
        getItemStatus,
        clearAll,
        clearHeuristic,
        getHeuristicStats,
        isLoaded
    };
}
