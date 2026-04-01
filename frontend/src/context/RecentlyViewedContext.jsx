import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// --- DATA STRUCTURES: DOUBLY LINKED LIST & HASH MAP ---

class Node {
    constructor(key, value) {
        this.key = key;     // Daycare ID
        this.value = value; // Daycare Object
        this.prev = null;
        this.next = null;
    }
}

/**
 * Custom LRU Cache Implementation
 * Time Complexity: O(1) for get and put
 * Space Complexity: O(capacity) for the Map and Linked List
 */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map(); // O(1) lookups

        // Dummy head and tail to avoid edge cases during insertion/deletion
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    _remove(node) {
        const prevNode = node.prev;
        const nextNode = node.next;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
    }

    _insert(node) {
        // Insert right after the dummy head (Most Recently Used)
        const nextNode = this.head.next;
        this.head.next = node;
        node.prev = this.head;
        node.next = nextNode;
        nextNode.prev = node;
    }

    get(key) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            this._remove(node);
            this._insert(node); // Move to front (MRU)
            return node.value;
        }
        return null; // Equivalent to -1 in standard DSA problems
    }

    put(key, value) {
        if (this.map.has(key)) {
            this._remove(this.map.get(key));
        }

        const newNode = new Node(key, value);
        this._insert(newNode);
        this.map.set(key, newNode);

        // Evict LRU if capacity exceeded
        if (this.map.size > this.capacity) {
            // LRU node is the one right before the dummy tail
            const lruNode = this.tail.prev;
            this._remove(lruNode);
            this.map.delete(lruNode.key);
        }
    }

    // Helper to get all items in order from Most Recent to Least Recent for UI rendering
    getArray() {
        const result = [];
        let curr = this.head.next;
        while (curr !== this.tail) {
            result.push(curr.value);
            curr = curr.next;
        }
        return result;
    }

    // Helper to initialize from localStorage
    loadFromArray(arr) {
        // Since arr is from Most to Least recent, we need to iterate in reverse 
        // to put them in the cache so the MRU ends up at the head again.
        for (let i = arr.length - 1; i >= 0; i--) {
            this.put(arr[i].id, arr[i]);
        }
    }
}

// --- REACT CONTEXT ---

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => {
    return useContext(RecentlyViewedContext);
};

export const RecentlyViewedProvider = ({ children }) => {
    const CAPACITY = 5;
    // We use a ref for the cache instance so it persists across re-renders without triggering them
    const cacheRef = useRef(new LRUCache(CAPACITY));
    const [recentDaycares, setRecentDaycares] = useState([]);

    // Hydrate cache from localStorage on mount
    useEffect(() => {
        try {
            const storedConfig = localStorage.getItem('recentlyViewedDaycares');
            if (storedConfig) {
                const parsedConfig = JSON.parse(storedConfig);
                cacheRef.current.loadFromArray(parsedConfig);
                setRecentDaycares(cacheRef.current.getArray());
            }
        } catch (error) {
            console.error("Failed to parse recently viewed memory.", error);
        }
    }, []);

    const addDaycare = (daycare) => {
        if (!daycare || !daycare.id) return;

        // Put in O(1) LRU Cache
        cacheRef.current.put(daycare.id, daycare);

        // Extract array for React state
        const updatedList = cacheRef.current.getArray();
        setRecentDaycares(updatedList);

        // Persist to localStorage
        localStorage.setItem('recentlyViewedDaycares', JSON.stringify(updatedList));
    };

    return (
        <RecentlyViewedContext.Provider value={{ recentDaycares, addDaycare }}>
            {children}
        </RecentlyViewedContext.Provider>
    );
};
