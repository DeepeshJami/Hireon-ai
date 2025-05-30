
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TrendingUp, Award, Target } from 'lucide-react';

interface MatchScoreProps {
  score: number;
}

const getScoreLabel = (score: number) => {
  if (score >= 90) return { text: "Exceptional Match", emoji: "🎯", color: "text-emerald-600", bgColor: "from-emerald-500 to-green-500" };
  if (score >= 80) return { text: "Great Match", emoji: "✨", color: "text-green-500", bgColor: "from-green-500 to-emerald-500" };
  if (score >= 70) return { text: "Good Match", emoji: "👍", color: "text-blue-500", bgColor: "from-blue-500 to-cyan-500" };
  if (score >= 60) return { text: "Fair Match", emoji: "⚡", color: "text-yellow-500", bgColor: "from-yellow-500 to-orange-500" };
  return { text: "Needs Work", emoji: "🔧", color: "text-red-500", bgColor: "from-red-500 to-pink-500" };
};

const MatchScore = ({ score }: MatchScoreProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  
  const scoreInfo = getScoreLabel(score);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = score / 50;
      const interval = setInterval(() => {
        setDisplayScore(prev => {
          if (prev >= score) {
            clearInterval(interval);
            setIsAnimating(false);
            return score;
          }
          return Math.min(prev + increment, score);
        });
      }, 30);
      
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className="relative group"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 group-hover:border-purple-300/50 dark:group-hover:border-purple-600/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-inter text-gray-900 dark:text-white">Match Score</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">AI Analysis Result</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl"
          >
            🎯
          </motion.div>
        </div>

        {/* Enhanced Circular Progress */}
        <div className="relative w-56 h-56 mx-auto mb-8">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-sm" />
          
          <svg className="transform -rotate-90 w-full h-full relative z-10">
            {/* Background circle */}
            <circle
              cx="112"
              cy="112"
              r="90"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="112"
              cy="112"
              r="90"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                key={Math.floor(displayScore)}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-bold font-inter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                {Math.round(displayScore)}
              </motion.div>
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">out of 100</div>
            </div>
          </div>

          {/* Floating Particles */}
          {isAnimating && (
            <>
              <motion.div
                animate={{ 
                  y: [-10, -30, -10],
                  x: [0, 10, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="absolute top-4 right-8 w-2 h-2 bg-blue-400 rounded-full"
              />
              <motion.div
                animate={{ 
                  y: [-5, -25, -5],
                  x: [0, -15, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-400 rounded-full"
              />
              <motion.div
                animate={{ 
                  y: [-8, -28, -8],
                  x: [0, 8, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute top-8 left-4 w-1 h-1 bg-cyan-400 rounded-full"
              />
            </>
          )}
        </div>

        {/* Enhanced Score Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-3xl"
            >
              {scoreInfo.emoji}
            </motion.span>
            <span className={`text-2xl font-bold font-inter ${scoreInfo.color}`}>
              {scoreInfo.text}
            </span>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {score >= 85 
                ? "Outstanding! Your resume is perfectly aligned with this position. You're ready to apply with confidence!" 
                : score >= 70 
                  ? "Great foundation! A few strategic improvements will make your resume truly shine." 
                  : score >= 55
                    ? "Good potential! Let's optimize your resume to better match this specific role."
                    : "Significant opportunity for improvement. Follow our AI suggestions to dramatically boost your match score."
              }
            </p>
          </div>
        </motion.div>

        {/* Enhanced Progress Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-8 grid grid-cols-4 gap-3"
        >
          {[25, 50, 75, 100].map((threshold, index) => (
            <motion.div
              key={threshold}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1, type: "spring" }}
              className="relative"
            >
              <div className={`h-3 rounded-full transition-all duration-1000 ${
                displayScore >= threshold 
                  ? `bg-gradient-to-r ${scoreInfo.bgColor} shadow-lg` 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              {displayScore >= threshold && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Score Insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>AI Powered</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>Industry Standard</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MatchScore;
