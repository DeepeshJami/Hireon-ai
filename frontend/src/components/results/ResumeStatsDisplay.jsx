import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BookOpen } from 'lucide-react';

const ResumeStatsDisplay = ({ stats }) => {
  if (!stats || Object.keys(stats).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-center text-gray-500 dark:text-gray-400"
      >
        No statistics available.
      </motion.div>
    );
  }

  const { word_count, readability_score } = stats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
      data-testid="stats-container"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
        data-testid="stat-item"
      >
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {word_count}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-300">Word Count</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
        data-testid="stat-item"
      >
        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
          {readability_score}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-300">Readability Score</span>
      </motion.div>
    </motion.div>
  );
};

export default ResumeStatsDisplay; 