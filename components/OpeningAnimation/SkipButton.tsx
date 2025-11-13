'use client';

import { motion } from 'framer-motion';
import type { SkipButtonProps } from './types';

export function SkipButton({ onClick, visible }: SkipButtonProps) {
  if (!visible) return null;

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label="跳过动画"
      tabIndex={0}
    >
      跳过动画
    </motion.button>
  );
}
