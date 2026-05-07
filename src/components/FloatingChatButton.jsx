/**
 * FloatingChatButton Component
 * 
 * Decorative floating chat button (non-functional)
 */

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePerformanceMode } from '../hooks/usePerformanceMode';

export function FloatingChatButton() {
  const { shouldReduceAnimations } = usePerformanceMode();

  const buttonContent = (
    <button className="bg-gradient-primary p-4 rounded-full shadow-glow-cyan hover:scale-110 transition-transform">
      <MessageCircle className="w-6 h-6 text-white" />
    </button>
  );

  if (shouldReduceAnimations) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {buttonContent}
      </div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
    >
      {buttonContent}
    </motion.div>
  );
}
