import React, { createContext, useContext, useState, useEffect } from 'react';

// --- DATA STRUCTURE: BOUNDED QUEUE ---

const CompareContext = createContext();

export const useCompare = () => {
    return useContext(CompareContext);
};

export const CompareProvider = ({ children }) => {
    // We enforce a strict algorithmic boundary limit on our queue
    const CAPACITY = 3;

    const [compareQueue, setCompareQueue] = useState(() => {
        try {
            const stored = localStorage.getItem('compareQueue');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('compareQueue', JSON.stringify(compareQueue));
    }, [compareQueue]);

    const addDaycareToCompare = (daycare) => {
        if (!daycare || !daycare.id) return;

        // O(1) Check if already exists to prevent duplicate insertion
        if (compareQueue.some(d => d.id === daycare.id)) {
            alert(`${daycare.name} is already in your comparison matrix.`);
            return;
        }

        // O(1) Capacity Enforcement check
        if (compareQueue.length >= CAPACITY) {
            alert(`Comparison Matrix is full. Maximum capacity is strictly ${CAPACITY}. Remove a daycare to add another.`);
            return;
        }

        // Push to end of Bounded Queue
        setCompareQueue(prev => [...prev, daycare]);
        alert(`Added ${daycare.name} to Comparison Matrix!`);
    };

    const removeDaycareFromCompare = (id) => {
        setCompareQueue(prev => prev.filter(d => d.id !== id));
    };

    const clearCompareQueue = () => {
        setCompareQueue([]);
    };

    return (
        <CompareContext.Provider value={{ compareQueue, addDaycareToCompare, removeDaycareFromCompare, clearCompareQueue }}>
            {children}
        </CompareContext.Provider>
    );
};
