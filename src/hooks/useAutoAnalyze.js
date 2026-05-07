/**
 * useAutoAnalyze Hook
 * 
 * Auto-analyze text with debouncing
 */

import { useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { useSettings } from './useSettings';
import config from '../utils/config';

export function useAutoAnalyze(text, onAnalyze) {
  const { analysisMode } = useSettings();
  const debouncedText = useDebounce(text, config.ui.autoAnalyzeDelay);

  useEffect(() => {
    if (analysisMode === 'auto' && debouncedText && debouncedText.length >= 3) {
      onAnalyze(debouncedText);
    }
  }, [debouncedText, analysisMode, onAnalyze]);
}
