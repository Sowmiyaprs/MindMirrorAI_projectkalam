/**
 * useAnalysis Hook
 * 
 * Handles sentiment analysis operations:
 * - Analyze text
 * - Save results
 * - Error handling
 * - Loading states
 */

import { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import SentimentAnalysisService from '../services/SentimentAnalysisService';
import StorageService from '../services/StorageService';
import ErrorHandlingService from '../services/ErrorHandlingService';
import RetryHandler from '../utils/RetryHandler';
import perfMonitor from '../utils/PerformanceMonitor';

export function useAnalysis() {
  const { updateAnalysis, addEntry } = useContext(AppContext);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async (text) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Analyze with retry and performance monitoring
      const analysis = await RetryHandler.withSingleRetry(
        () => perfMonitor.measureAnalysisAsync(
          () => Promise.resolve(SentimentAnalysisService.analyze(text))
        )
      );

      // Check for analysis errors
      if (analysis.error) {
        setError(analysis.error);
        ErrorHandlingService.handleValidationError({ message: analysis.error });
        return { success: false, error: analysis.error };
      }

      // Update context
      updateAnalysis(analysis);

      // Save to storage
      const saveResult = StorageService.saveEntry(text, analysis);
      
      if (saveResult.success) {
        addEntry(saveResult.entry);
        ErrorHandlingService.showSuccessToast('Analysis complete!');
        return { success: true, analysis, entry: saveResult.entry };
      } else {
        ErrorHandlingService.handleStorageError({ message: saveResult.error });
        return { success: false, error: saveResult.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Analysis failed';
      setError(errorMsg);
      ErrorHandlingService.handleAnalysisError({ message: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyze,
    isAnalyzing,
    error,
  };
}
