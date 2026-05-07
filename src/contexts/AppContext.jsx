/**
 * AppContext
 * 
 * Global application state:
 * - Current analysis result
 * - Journal entry history
 * - User settings
 * - Loading states
 */

import { createContext, useState, useEffect } from 'react';
import StorageService from '../services/StorageService';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [entries, setEntries] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Load entries
      const loadedEntries = StorageService.getAllEntries();
      setEntries(loadedEntries);

      // Load settings
      const loadedSettings = StorageService.getSettings();
      setSettings(loadedSettings);

      // Load most recent analysis
      if (loadedEntries.length > 0) {
        const recent = loadedEntries[loadedEntries.length - 1];
        setCurrentAnalysis(recent.analysis);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnalysis = (analysis) => {
    setCurrentAnalysis(analysis);
  };

  const addEntry = (entry) => {
    setEntries(prev => [...prev, entry]);
  };

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  const value = {
    currentAnalysis,
    updateAnalysis,
    entries,
    addEntry,
    settings,
    updateSettings,
    isLoading,
    refreshEntries: loadInitialData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
