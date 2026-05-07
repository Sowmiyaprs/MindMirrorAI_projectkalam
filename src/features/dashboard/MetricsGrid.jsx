/**
 * MetricsGrid Component
 * 
 * Grid of 6 emotional metric cards
 */

import { Heart, Zap, Target, Shield, TrendingUp, Focus } from 'lucide-react';
import { MetricCard } from './MetricCard';

export function MetricsGrid({ scores }) {
  const metrics = [
    { label: 'Mood', value: scores.mood, icon: Heart, color: 'cyan' },
    { label: 'Stress', value: scores.stress, icon: Zap, color: 'pink' },
    { label: 'Motivation', value: scores.motivation, icon: Target, color: 'purple' },
    { label: 'Confidence', value: scores.confidence, icon: Shield, color: 'green' },
    { label: 'Productivity', value: scores.productivity, icon: TrendingUp, color: 'yellow' },
    { label: 'Focus', value: scores.focus, icon: Focus, color: 'blue' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
