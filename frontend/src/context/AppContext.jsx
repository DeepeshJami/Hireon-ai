import React, { createContext, useState, useContext } from 'react';

// Define the initial state
const initialState = {
  resumeFile: null,
  resume: '',
  jobDescription: '',
  analysisResult: null, // This will hold the API response later
  isLoading: false,
  error: null,
};

// Create the context
const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [resumeFile, setResumeFile] = useState(initialState.resumeFile);
  const [resume, setResume] = useState(initialState.resume);
  const [jobDescription, setJobDescription] = useState(initialState.jobDescription);
  const [analysisResult, setAnalysisResult] = useState(initialState.analysisResult);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [error, setError] = useState(initialState.error);

  // Placeholder for AnalysisResponse type (matches backend FullAnalysisResponse)
  // type AnalysisResponse = {
  //   match_score: number;
  //   match_rating: string;
  //   missing_keywords: string[];
  //   suggestions: string[];
  //   resume_stats: {
  //     word_count: number;
  //     readability_score: number;
  //   };
  // };

  const contextValues = {
    resumeFile,
    setResumeFile,
    resume,
    setResume,
    jobDescription,
    setJobDescription,
    analysisResult,
    setAnalysisResult,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <AppContext.Provider value={contextValues}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 