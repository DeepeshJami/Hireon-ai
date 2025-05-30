
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FileSearch, Brain, Lightbulb, CheckCircle } from 'lucide-react';

interface EvaluationLoaderProps {
  onComplete: () => void;
}

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

const EvaluationLoader = ({ onComplete }: EvaluationLoaderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepTimer);
        return prev;
      });
    }, 1500);

    return () => clearInterval(stepTimer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 border border-gray-100 dark:border-gray-700"
      >
        {/* AI Brain Animation */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold font-inter text-gray-900 dark:text-white">
            AI scanning in progress
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Grab a coffee ☕ or just breathe
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Processing...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: isActive ? 1 : isCompleted ? 0.7 : 0.3 
                }}
                className="flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : isActive 
                      ? 'bg-primary-100 dark:bg-primary-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Icon className={`w-5 h-5 ${
                      isActive 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-400'
                    }`} />
                  )}
                </div>

                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="whitespace-nowrap"
                        >
                          <p className="font-medium font-inter text-gray-900 dark:text-white">
                            {step.text}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <p className={`text-sm transition-colors duration-300 ${
                    isActive 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-400 dark:text-gray-500'
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
  );
};

export default EvaluationLoader;
