/**
 * usePerformanceMode Hook
 * 
 * Access performance mode settings
 */

import { useContext } from 'react';
import { PerformanceContext } from '../contexts/PerformanceContext';

export function usePerformanceMode() {
  const context = useContext(PerformanceContext);
  
  if (!context) {
    throw new Error('usePerformanceMode must be used within PerformanceProvider');
  }

  return context;
}
