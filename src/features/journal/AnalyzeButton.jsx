/**
 * AnalyzeButton Component
 * 
 * Animated analyze button
 */

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export function AnalyzeButton({ onClick, isAnalyzing, disabled }) {
  const { shouldReduceAnimations } = usePerformanceMode();

  const buttonContent = (
    <button
      onClick={onClick}
      disabled={disabled || isAnalyzing}
      className={`
        px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all
        ${disabled || isAnalyzing
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-primary text-white hover:shadow-glow-cyan hover:scale-105'
        }
      `}
    >
      {isAnalyzing ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          <span>Analyze</span>
        </>
      )}
    </button>
  );

  if (shouldReduceAnimations || disabled || isAnalyzing) {
    return buttonContent;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {buttonContent}
    </motion.div>
  );
}
