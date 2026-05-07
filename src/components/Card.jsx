import { motion } from 'framer-motion';

export function Card({ children, className = '', glow = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white dark:bg-gray-800
        border border-gray-100 dark:border-gray-700
        rounded-xl p-6
        ${glow ? 'shadow-lavender dark:shadow-lavender-500/20' : 'shadow-soft'}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
