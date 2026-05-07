/**
 * MoodDisplay Component
 * 
 * Large display of overall detected mood
 */

import { Card } from '../../components/Card';
import { motion } from 'framer-motion';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';

const moodEmojis = {
  'Happy': '😊',
  'Motivated': '💪',
  'Overwhelmed': '😰',
  'Stressed': '😓',
  'Calm': '😌',
  'Focused': '🎯',
  'Burned Out': '😵',
  'Productive': '⚡',
  'Content': '🙂',
  'Down': '😔',
  'Neutral': '😐',
};

const moodColors = {
  'Happy': 'text-primary-cyan',
  'Motivated': 'text-primary-purple',
  'Overwhelmed': 'text-primary-pink',
  'Stressed': 'text-red-500',
  'Calm': 'text-green-400',
  'Focused': 'text-blue-400',
  'Burned Out': 'text-orange-500',
  'Productive': 'text-yellow-400',
  'Content': 'text-green-300',
  'Down': 'text-gray-400',
  'Neutral': 'text-gray-300',
};

export function MoodDisplay({ mood }) {
  const { shouldReduceAnimations } = usePerformanceMode();
  const emoji = moodEmojis[mood] || '🙂';
  const colorClass = moodColors[mood] || 'text-primary-cyan';

  const content = (
    <Card glow className="text-center h-full flex flex-col justify-center">
      <div className="text-7xl mb-4">{emoji}</div>
      <h3 className="text-sm text-gray-400 mb-2">Overall Mood</h3>
      <p className={`text-3xl font-bold ${colorClass}`}>{mood}</p>
    </Card>
  );

  if (shouldReduceAnimations) {
    return content;
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {content}
    </motion.div>
  );
}
