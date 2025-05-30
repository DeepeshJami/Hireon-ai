import React from 'react';
import { useAppContext } from '../../context/AppContext';
import MatchScoreDisplay from './MatchScoreDisplay';
import MissingKeywordsList from './MissingKeywordsList';
import SuggestionsList from './SuggestionsList';
import ResumeStatsDisplay from './ResumeStatsDisplay';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const AnalysisResult = () => {
  const { analysisResult, error, isLoading } = useAppContext();

  // If loading, and no result or error yet, LoadingModal is shown by UploadPage
  // So, this component doesn't need to render a loading state itself if UploadPage handles modal visibility.
  // However, if this component were to be used independently or if LoadingModal wasn't global,
  // we might add: if (isLoading && !analysisResult && !error) return <p>Loading analysis...</p>;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-8 p-6 bg-red-500/10 border border-red-500/30 rounded-lg shadow-md"
      >
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 font-inter">
            Analysis Error
          </h3>
        </div>
        <p className="text-red-600 dark:text-red-300 font-inter">
          {typeof error === 'string' ? error : error.message || 'An unexpected error occurred.'}
        </p>
      </motion.div>
    );
  }

  if (!analysisResult && !isLoading && !error) {
    // No analysis run yet, or cleared after a run
    return null; 
  }
  
  if (!analysisResult) {
      // This case should ideally not be hit if !isLoading and !error, 
      // but as a fallback if analysisResult is null/undefined unexpectedly.
      return null;
  }

  // Destructure with defaults to prevent errors if parts of the result are missing
  const {
    match_score = null,
    match_rating = '',
    missing_keywords = [],
    suggestions = [],
    resume_stats = { word_count: 0, readability_score: 0.0 },
  } = analysisResult;

  return (
    <motion.div 
      className="my-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      data-testid="analysis-result"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <MatchScoreDisplay score={match_score} rating={match_rating} />
        <ResumeStatsDisplay stats={resume_stats} />
      </div>
      <MissingKeywordsList keywords={missing_keywords} />
      <SuggestionsList suggestions={suggestions} />
    </motion.div>
  );
};

export default AnalysisResult; 