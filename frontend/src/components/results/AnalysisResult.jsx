import React from 'react';
import { useAppContext } from '../../context/AppContext';
import MatchScoreDisplay from './MatchScoreDisplay';
import MissingKeywordsList from './MissingKeywordsList';
import SuggestionsList from './SuggestionsList';
import ResumeStatsDisplay from './ResumeStatsDisplay';
import { AlertTriangle } from 'lucide-react';

const AnalysisResult = () => {
  const { analysisResult, error, isLoading } = useAppContext();

  // If loading, and no result or error yet, LoadingModal is shown by UploadPage
  // So, this component doesn't need to render a loading state itself if UploadPage handles modal visibility.
  // However, if this component were to be used independently or if LoadingModal wasn't global,
  // we might add: if (isLoading && !analysisResult && !error) return <p>Loading analysis...</p>;

  if (error) {
    return (
      <div
        className="my-6 sm:my-8 p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-lg shadow-md"
      >
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          <h3 className="text-lg sm:text-xl font-semibold text-red-700 dark:text-red-400 font-inter">
            Analysis Error
          </h3>
        </div>
        <p className="text-red-600 dark:text-red-300 font-inter text-xs sm:text-sm">
          {typeof error === 'string' ? error : error.message || 'An unexpected error occurred.'}
        </p>
      </div>
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
  } = analysisResult;

  return (
    <div
      className="my-6 sm:my-8 space-y-4 sm:space-y-6"
      data-testid="analysis-result"
    >
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <MatchScoreDisplay score={match_score} rating={match_rating} />
        </div>
      </div>
      <MissingKeywordsList keywords={missing_keywords} />
      <SuggestionsList suggestions={suggestions} />
    </div>
  );
};

export default AnalysisResult; 