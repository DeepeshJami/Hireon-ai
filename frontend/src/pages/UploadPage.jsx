import React, { useState, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Upload, FileText, Briefcase, Zap } from 'lucide-react';
import LoadingModal from '../components/feedback/LoadingModal';
import { useAppContext } from '../context/AppContext';
import { analyzeResumeWithAPI } from '../services/api'; // Import the API service
import AnalysisResult from '../components/results/AnalysisResult'; // Import AnalysisResult

// Mock onEvaluate function for now - this will be replaced by API call logic
// const mockOnEvaluate = (resume, jobDescription) => {
//   console.log("Evaluate button clicked with:", { resume, jobDescription });
//   alert(`Mock Evaluation:\nResume: ${resume.substring(0,100)}...\nJD: ${jobDescription.substring(0,100)}...`);
// };

const UploadPage = () => {
  // States from AppContext
  const {
    resumeFile, // Assuming we'll want to store the File object in context eventually
    setResumeFile, // And its setter
    resume, // Assuming this is resume text
    setResume, // And its setter, renaming from original UploadPage state to avoid conflict if needed
    jobDescription,
    setJobDescription,
    isLoading,
    setIsLoading,
    analysisResult, // To store the result
    setAnalysisResult,
    error,
    setError,
  } = useAppContext();

  // Local UI states for this component
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState(null); // To display the name of the uploaded/dragged file
  const [resumeError, setResumeError] = useState(null);
  const [jobDescriptionError, setJobDescriptionError] = useState(null);
  const [fileTypeError, setFileTypeError] = useState(null);

  const handleSubmit = async () => {
    setError(null); // Clear previous errors
    setAnalysisResult(null); // Clear previous results
    setResumeError(null);
    setJobDescriptionError(null);
    setFileTypeError(null);

    let hasError = false;
    if (!resumeFile) {
      setResumeError('Please upload a PDF resume');
      hasError = true;
    }
    if (!jobDescription.trim()) {
      setJobDescriptionError('Please provide a job description');
      hasError = true;
    }
    if (hasError) return;

    setIsLoading(true);
    try {
      const result = await analyzeResumeWithAPI(resumeFile, jobDescription);
      setAnalysisResult(result);
      alert("Analysis Complete! Check console for results (placeholder)."); 
    } catch (apiError) {
      console.error("API Error in handleSubmit:", apiError);
      setError(apiError.response?.data?.detail || apiError.message || 'Failed to analyze. Please try again.');
      alert(`Error: ${apiError.response?.data?.detail || apiError.message || 'Failed to analyze. Please try again.'}`); // Temporary alert for user
    } finally {
      // Add a short delay for test/dev so loading modal is visible
      if (import.meta.env.MODE !== 'production') {
        setTimeout(() => setIsLoading(false), 600);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleLoadingComplete = () => {
    // This modal callback is just for its own animation cycle. 
    // Actual loading state is controlled by handleSubmit's finally block.
    console.log("Loading modal animation reported completion.");
  };

  const handleFileChange = (event) => {
    setFileTypeError(null);
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setResumeFile(file); // Store the File object in context
      setError(null); // Clear error if a file is selected
      setResumeError(null);
      // Only allow PDF files for upload
      if (file.type !== 'application/pdf') {
        setFileTypeError('Please upload a PDF file');
        setResume('');
        return;
      }
      setResume(`PDF file selected: ${file.name} (Content will be processed by AI)`);
      console.log("Selected file:", file.name);
    }
  };

  const handleDrop = useCallback((event) => {
    setFileTypeError(null);
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setResumeFile(file); // Store the File object in context
      setError(null); // Clear error if a file is dropped
      setResumeError(null);
      if (file.type !== 'application/pdf') {
        setFileTypeError('Please upload a PDF file');
        setResume('');
        return;
      }
      setResume(`PDF file dropped: ${file.name} (Content will be processed by AI)`);
      console.log("Dropped file:", file.name);
    }
  }, [setResume, setResumeFile, setError]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return (
    // Main container for the page content
    <div className="container mx-auto px-6 py-10 md:py-16">
      {/* Loading Modal is rendered conditionally based on isLoading state */}
      <LoadingModal isVisible={isLoading} onComplete={handleLoadingComplete} />

      {/* Page Title and Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 md:mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-inter text-foreground mb-3 md:mb-4">
          Let's see what's working in your resume...
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          Paste your content below and let AI do the magic ✨
        </p>
      </motion.div>

      {/* Main Form Area */}
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Resume Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 bg-card p-6 rounded-xl shadow-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold font-inter text-foreground">
                Your Resume
              </h3>
            </div>
            <div className="relative">
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-64 md:h-80 p-4 rounded-lg border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 resize-none bg-background text-foreground placeholder:text-muted-foreground font-inter"
              />
              {resumeError && (
                <div className="text-red-600 text-sm mt-1" data-testid="resume-error">{resumeError}</div>
              )}
              {fileTypeError && (
                <div className="text-red-600 text-sm mt-1" data-testid="file-type-error">{fileTypeError}</div>
              )}
            </div>
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('resumeFileInput').click()} 
              whileHover={{ scale: 1.02 }}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
                isDragOver 
                  ? 'border-primary bg-primary/10' 
                  : 'border-input hover:border-primary/70'
              }`}
              data-testid="drop-zone"
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-inter">
                Or drag & drop your PDF resume here
              </p>
              {fileName && <p className="text-xs text-primary mt-1">Selected: {fileName}</p>}
              <input
                id="resumeFileInput" 
                type="file"
                accept=".pdf,.txt,.docx" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </motion.div>
          </motion.div>

          {/* Job Description Input Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 bg-card p-6 rounded-xl shadow-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold font-inter text-foreground">
                Job Description
              </h3>
            </div>
            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or LinkedIn job URL here..."
                className="w-full h-72 md:h-96 p-4 rounded-lg border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 resize-none bg-background text-foreground placeholder:text-muted-foreground font-inter"
                data-testid="job-description-input"
              />
              {jobDescriptionError && (
                <div className="text-red-600 text-sm mt-1" data-testid="job-description-error">{jobDescriptionError}</div>
              )}
            </div>
            <div className="bg-primary/10 rounded-md p-4 border border-primary/20">
              <p className="text-primary text-sm font-inter">
                💡 <strong>Pro tip:</strong> Include requirements, qualifications, and desired skills for the best analysis.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Evaluate Button Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8 md:mt-10"
        >
          <button
            onClick={handleSubmit}
            disabled={(!resumeFile && resume.trim() === '') || !jobDescription.trim() || isLoading}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground px-10 py-4 md:px-12 md:py-5 rounded-xl text-lg md:text-xl font-semibold font-inter shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
            data-testid="analyze-button"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                <span>Evaluate Match</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Add AnalysisResult component */}
        {analysisResult && <AnalysisResult />}
        
        {/* Display error if any */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600"
            data-testid="error-message"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
