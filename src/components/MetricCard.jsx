import { motion } from 'framer-motion';

export function MetricCard({ label, value, icon: Icon, color = 'cyan' }) {
  const colors = {
    cyan: 'from-cyan-500 to-blue-500',
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-pink-500 to-red-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    blue: 'from-blue-500 to-indigo-500'
  };

  const iconColors = {
    cyan: 'text-cyan-500',
    purple: 'text-purple-500',
    pink: 'text-pink-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    blue: 'text-blue-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-soft"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        {Icon && <Icon className={`w-5 h-5 ${iconColors[color]}`} />}
      </div>
      
      <div className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
        {Math.round(value)}
      </div>

      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colors[color]}`}
        />
      </div>
    </motion.div>
  );
}
