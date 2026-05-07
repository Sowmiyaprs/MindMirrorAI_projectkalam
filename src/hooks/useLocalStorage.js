/**
 * useLocalStorage Hook
 * 
 * Generic localStorage hook with caching
 */

import { useState, useEffect } from 'react';
import HybridCache from '../utils/HybridCache';

const cache = new HybridCache(50, 300000);

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Check cache first
      const cached = cache.get(key);
      if (cached !== null) return cached;

      // Fallback to localStorage
      const item = window.localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : initialValue;
      
      // Update cache
      cache.set(key, parsed);
      
      return parsed;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Update cache
      cache.set(key, valueToStore);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
