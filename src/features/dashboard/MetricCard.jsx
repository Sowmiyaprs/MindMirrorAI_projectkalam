/**
 * MetricCard Component
 * 
 * Individual emotional metric card with animated progress
 */

import { motion } from 'framer-motion';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';

export function MetricCard({ label, value, icon: Icon, color }) {
  const { shouldReduceAnimations, animationDuration } = usePerformanceMode();

  const getColorClasses = () => {
    switch (color) {
      case 'cyan':
        return 'from-primary-cyan to-blue-500';
      case 'purple':
        return 'from-primary-purple to-purple-600';
      case 'pink':
        return 'from-primary-pink to-red-500';
      case 'green':
        return 'from-green-400 to-emerald-500';
      case 'yellow':
        return 'from-yellow-400 to-orange-500';
      case 'blue':
        return 'from-blue-400 to-indigo-500';
      default:
        return 'from-primary-cyan to-primary-purple';
    }
  };

  return (
    <div className="bg-dark-card border border-gray-700 rounded-lg p-4 hover:border-primary-cyan transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      </div>

      <div className="text-3xl font-bold text-white mb-3">{value}</div>

      {/* Progress Bar */}
      <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
        {shouldReduceAnimations ? (
          <div
            className={`h-full bg-gradient-to-r ${getColorClasses()}`}
            style={{ width: `${value}%` }}
          />
        ) : (
          <motion.div
            className={`h-full bg-gradient-to-r ${getColorClasses()}`}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: animationDuration / 1000, ease: 'easeOut' }}
          />
        )}
      </div>
    </div>
  );
}
