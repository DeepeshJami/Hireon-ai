import React from 'react';
import { motion } from 'framer-motion'; // Restoring import for motion.div and motion.li
import { XCircle, AlertTriangle } from 'lucide-react';

const MissingKeywordsList = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return (
      // No motion here as it's a fallback static display
      <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-semibold font-inter text-foreground">
            Missing Keywords
          </h3>
        </div>
        <p className="text-muted-foreground font-inter text-sm">No significant missing keywords identified, or this section is not applicable.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card p-6 rounded-xl shadow-lg border border-border"
      data-testid="missing-keywords-container"
    >
      <div className="flex items-center gap-3 mb-4">
        <XCircle className="w-6 h-6 text-red-500" />
        <h3 className="text-xl font-semibold font-inter text-foreground">
          Missing Keywords
        </h3>
      </div>
      <ul className="space-y-2" data-testid="missing-keywords-list">
        {keywords.map((keyword, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center gap-2 text-sm text-muted-foreground font-inter bg-muted/50 p-2 rounded-md"
            data-testid="missing-keyword-item"
          >
            <span>- {keyword}</span>
          </motion.li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground mt-4 font-inter">
        Consider incorporating these terms if relevant and accurate to your experience.
      </p>
    </motion.div>
  );
};

export default MissingKeywordsList; 