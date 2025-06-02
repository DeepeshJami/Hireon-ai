import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckSquare } from 'lucide-react';

const SuggestionsList = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-2 sm:mb-3">
          <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
          <h3 className="text-lg sm:text-xl font-semibold font-inter text-foreground">
            Suggestions for Improvement
          </h3>
        </div>
        <p className="text-muted-foreground font-inter text-xs sm:text-sm">No specific suggestions at this time. Your resume looks good in this aspect!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border border-border"
      data-testid="suggestions-container"
    >
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        <h3 className="text-lg sm:text-xl font-semibold font-inter text-foreground">
          Suggestions for Improvement
        </h3>
      </div>
      <ul className="space-y-2 sm:space-y-3" data-testid="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.07 }}
            className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-foreground font-inter"
            data-testid="suggestion-item"
          >
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary/80 shrink-0 mt-0.5" />
            <span>{suggestion}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SuggestionsList; 