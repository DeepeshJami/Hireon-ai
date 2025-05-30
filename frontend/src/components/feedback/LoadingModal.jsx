import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, Brain, Lightbulb, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: FileSearch,
    text: "Parsing resume...",
    subtext: "Reading your experience and skills"
  },
  {
    icon: FileSearch,
    text: "Analyzing job description...",
    subtext: "Understanding what they're looking for"
  },
  {
    icon: Brain,
    text: "Matching keywords...",
    subtext: "Finding connections and gaps"
  },
  {
    icon: Lightbulb,
    text: "Generating suggestions...",
    subtext: "Creating personalized recommendations"
  }
];

const LoadingModal = ({ onComplete, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            // setTimeout(onComplete, 500); // onComplete will be called by parent when API is done
            return 100;
          }
          return prev + 2; // Simulate progress increment
        });
      }, 60); // Adjust timing as needed
    } else {
      setProgress(0); // Reset progress when not visible
      setCurrentStep(0); // Reset step when not visible
    }
    return () => clearInterval(timer);
  }, [isVisible]); // Removed onComplete from dependencies as it's handled by parent

  useEffect(() => {
    let stepTimer;
    if (isVisible) {
      setCurrentStep(0); // Start from first step when modal becomes visible
      setProgress(0); // Reset progress as well
      stepTimer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          clearInterval(stepTimer);
          return prev;
        });
      }, 1500); // Duration per step
    } else {
        setCurrentStep(0);
    }
    return () => clearInterval(stepTimer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
    <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-testid="loading-modal"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border p-6 md:p-8"
      >
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.05, 1] // Slightly reduced scale animation
            }}
            transition={{ 
              rotate: { duration: 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <Brain className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
          </motion.div>
          <h3 className="text-lg md:text-xl font-semibold font-inter text-foreground">
            AI scanning in progress
          </h3>
          <p className="text-muted-foreground text-sm mt-1 md:mt-2">
            Grab a coffee ☕ or just breathe
          </p>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="flex justify-between text-xs md:text-sm text-muted-foreground mb-1.5 md:mb-2">
            <span>Processing...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
            />
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: isActive ? 1 : isCompleted ? 0.7 : 0.5 
                }}
                className="flex items-center gap-3 md:gap-4"
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                  isCompleted 
                    ? 'bg-green-500/10 text-green-500' 
                    : isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted/30 text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Icon className={`w-4 h-4 md:w-5 md:h-5`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium font-inter text-sm md:text-base transition-colors duration-300 ${
                     isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground' 
                  }`}>
                    {step.text}
                  </p>
                  <p className={`text-xs md:text-sm transition-colors duration-300 ${
                    isActive ? 'text-muted-foreground' : 'text-muted-foreground/70'
                  }`}>
                    {step.subtext}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingModal; 