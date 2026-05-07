/**
 * useSettings Hook
 * 
 * Manages user settings:
 * - Analysis mode (auto/manual)
 * - Theme
 * - Performance mode
 */

import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { PerformanceContext } from '../contexts/PerformanceContext';

export function useSettings() {
  const { settings, updateSettings } = useContext(AppContext);
  const { performanceMode, setPerformanceMode } = useContext(PerformanceContext);

  const setAnalysisMode = (mode) => {
    updateSettings({ analysisMode: mode });
  };

  const setTheme = (theme) => {
    updateSettings({ theme });
  };

  const toggleAnalysisMode = () => {
    const newMode = settings?.analysisMode === 'auto' ? 'manual' : 'auto';
    setAnalysisMode(newMode);
  };

  return {
    settings,
    analysisMode: settings?.analysisMode || 'auto',
    theme: settings?.theme || 'dark',
    performanceMode,
    setAnalysisMode,
    setTheme,
    setPerformanceMode,
    toggleAnalysisMode,
  };
}
