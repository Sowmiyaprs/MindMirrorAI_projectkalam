/**
 * PerformanceContext
 * 
 * Performance mode state:
 * - Device performance detection
 * - Animation reduction settings
 * - Chart data point limits
 */

import { createContext, useState, useEffect } from 'react';
import PerformanceDetectionService from '../services/PerformanceDetectionService';
import StorageService from '../services/StorageService';

export const PerformanceContext = createContext();

export function PerformanceProvider({ children }) {
  const [performanceMode, setPerformanceMode] = useState('high');
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    detectPerformance();
  }, []);

  const detectPerformance = async () => {
    try {
      setIsDetecting(true);

      // Check if user has manually set performance mode
      const savedMode = StorageService.getPerformanceMode();
      
      if (savedMode) {
        setPerformanceMode(savedMode);
      } else {
        // Auto-detect
        const detected = await PerformanceDetectionService.detectPerformanceMode();
        setPerformanceMode(detected);
        StorageService.savePerformanceMode(detected);
      }
    } catch (error) {
      console.error('Performance detection failed:', error);
      setPerformanceMode('high'); // Default to high
    } finally {
      setIsDetecting(false);
    }
  };

  const setMode = (mode) => {
    setPerformanceMode(mode);
    StorageService.savePerformanceMode(mode);
  };

  const shouldReduceAnimations = performanceMode === 'low';
  const animationDuration = PerformanceDetectionService.getAnimationDuration(performanceMode);
  const chartDataPointLimit = PerformanceDetectionService.getChartDataPointLimit(performanceMode);

  const value = {
    performanceMode,
    setPerformanceMode: setMode,
    isDetecting,
    shouldReduceAnimations,
    animationDuration,
    chartDataPointLimit,
  };

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}
