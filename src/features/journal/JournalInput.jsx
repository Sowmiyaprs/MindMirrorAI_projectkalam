/**
 * JournalInput Component
 * 
 * Main text input for journal entries
 */

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAnalysis } from '../../hooks/useAnalysis';
import { useSettings } from '../../hooks/useSettings';
import { useAutoAnalyze } from '../../hooks/useAutoAnalyze';
import { AnalyzeButton } from './AnalyzeButton';
import { AnalysisModeToggle } from './AnalysisModeToggle';
import { Card } from '../../components/Card';

export function JournalInput() {
  const [text, setText] = useState('');
  const { analyze, isAnalyzing } = useAnalysis();
  const { analysisMode } = useSettings();

  // Auto-analyze when in auto mode
  useAutoAnalyze(text, analyze);

  const handleAnalyze = () => {
    if (text.trim().length >= 3) {
      analyze(text);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <Card glow className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-cyan" />
          <h2 className="text-xl font-bold text-white">How are you feeling?</h2>
        </div>
        <AnalysisModeToggle />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Share your thoughts, feelings, and emotions here... I'll analyze them in real-time."
        className="w-full h-40 bg-dark-bg border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan focus:ring-opacity-50 transition-all resize-none"
        disabled={isAnalyzing}
      />

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-400">
          {text.length} characters
          {analysisMode === 'auto' && text.length >= 3 && (
            <span className="ml-2 text-primary-cyan">• Auto-analyzing...</span>
          )}
        </div>

        {analysisMode === 'manual' && (
          <AnalyzeButton onClick={handleAnalyze} isAnalyzing={isAnalyzing} disabled={text.length < 3} />
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Tip: Press Ctrl+Enter to analyze quickly
      </p>
    </Card>
  );
}
