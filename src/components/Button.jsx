import { motion } from 'framer-motion';

export function Button({ children, onClick, variant = 'primary', disabled, className = '' }) {
  const variants = {
    primary: 'bg-gradient-lavender hover:shadow-lavender text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    secondary: 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 shadow-md',
    outline: 'border-2 border-lavender-400 text-lavender-600 dark:text-lavender-400 hover:bg-lavender-50 dark:hover:bg-lavender-900/20'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg font-semibold
        transition-all duration-200
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
