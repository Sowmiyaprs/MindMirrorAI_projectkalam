import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Zap, Target, Shield, TrendingUp, Focus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MetricCard } from '../components/MetricCard';
import { analyzeText, saveAnalysis } from '../services/sentimentService';

export function Dashboard() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (text.trim().length < 3) {
      alert('Please enter at least 3 characters');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay for smooth UX
    setTimeout(() => {
      const result = analyzeText(text);
      if (result) {
        // Convert new format to old format for compatibility
        const compatibleResult = {
          ...result,
          mood: result.state,
          scores: {
            mood: result.scores.emotionalBalance,
            stress: result.scores.stressLevel,
            motivation: result.scores.motivationLevel,
            confidence: result.scores.confidenceLevel,
            productivity: result.scores.motivationLevel,
            focus: Math.max(0, 100 - result.scores.stressLevel)
          },
          suggestions: result.recommendations
        };
        setAnalysis(compatibleResult);
        saveAnalysis(compatibleResult);
      }
      setIsAnalyzing(false);
    }, 500);
  };

  const moodEmojis = {
    'Happy': '😊',
    'Calm': '😌',
    'Motivated': '💪',
    'Stressed': '😓',
    'Overwhelmed': '😰',
    'Productive': '⚡',
    'Burned Out': '😵',
    'Neutral': '😐'
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card glow>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-lavender-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            How are you feeling?
          </h2>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts and feelings here... I'll analyze them for you."
          className="w-full h-32 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent resize-none transition-all"
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {text.length} characters
          </span>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || text.length < 3}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {analysis && (
        <>
          {/* Mood Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center bg-gradient-lavender-soft dark:bg-gray-800">
              <div className="text-7xl mb-4">{moodEmojis[analysis.mood]}</div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Overall Mood</h3>
              <p className="text-3xl font-bold text-lavender-700 dark:text-lavender-400">
                {analysis.mood}
              </p>
            </Card>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Mood" value={analysis.scores.mood} icon={Heart} color="cyan" />
            <MetricCard label="Stress" value={analysis.scores.stress} icon={Zap} color="pink" />
            <MetricCard label="Motivation" value={analysis.scores.motivation} icon={Target} color="purple" />
            <MetricCard label="Confidence" value={analysis.scores.confidence} icon={Shield} color="green" />
            <MetricCard label="Productivity" value={analysis.scores.productivity} icon={TrendingUp} color="yellow" />
            <MetricCard label="Focus" value={analysis.scores.focus} icon={Focus} color="blue" />
          </div>

          {/* Suggestions */}
          <Card>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              AI Suggestions
            </h3>
            <div className="space-y-3">
              {analysis.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <span className="text-lavender-600 dark:text-lavender-400 font-bold">{index + 1}.</span>
                  <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Empty State */}
      {!analysis && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            No Analysis Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start by sharing your thoughts above
          </p>
        </Card>
      )}
    </div>
  );
}
