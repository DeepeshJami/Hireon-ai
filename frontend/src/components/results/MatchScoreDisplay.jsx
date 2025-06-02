import React from 'react';
// eslint-disable-next-line 
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const MatchScoreDisplay = ({ score, rating }) => {
  if (score === null || score === undefined) return null;

  const getScoreColor = () => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRatingColor = () => {
    if (rating?.toLowerCase().includes('excellent') || rating?.toLowerCase().includes('strong')) return 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400';
    if (rating?.toLowerCase().includes('good') || rating?.toLowerCase().includes('fair')) return 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400';
    return 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border border-border text-center"
      data-testid="match-score-container"
    >
      <Target className={`w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 ${getScoreColor()}`} />
      <h3 className="text-lg sm:text-xl font-semibold font-inter text-foreground mb-1">
        Match Score
      </h3>
      <p className={`text-3xl sm:text-5xl font-bold font-inter ${getScoreColor()} mb-2`} data-testid="match-score">
        {score}%
      </p>
      {rating && (
        <span className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getRatingColor()} font-inter`} data-testid="match-rating">
          {rating}
        </span>
      )}
    </motion.div>
  );
};

export default MatchScoreDisplay; 