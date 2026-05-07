/**
 * AnalysisModeToggle Component
 * 
 * Toggle between auto and manual analysis modes
 */

import { Zap, Hand } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export function AnalysisModeToggle() {
  const { analysisMode, toggleAnalysisMode } = useSettings();

  return (
    <button
      onClick={toggleAnalysisMode}
      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-bg border border-gray-700 hover:border-primary-cyan transition-all text-sm"
    >
      {analysisMode === 'auto' ? (
        <>
          <Zap className="w-4 h-4 text-primary-cyan" />
          <span className="text-gray-300">Auto</span>
        </>
      ) : (
        <>
          <Hand className="w-4 h-4 text-primary-purple" />
          <span className="text-gray-300">Manual</span>
        </>
      )}
    </button>
  );
}
