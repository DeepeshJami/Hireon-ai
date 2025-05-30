
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold font-inter text-gray-900 dark:text-white leading-tight">
                Your Resume.{' '}
                <span className="bg-gradient-to-r from-primary-500 to-indigo-600 bg-clip-text text-transparent">
                  Reimagined by AI.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-inter"
            >
              Paste your resume. Paste the job. See what's missing. Get hired smarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold font-inter shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Try It Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>20 free uses/month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>No account needed</span>
              </div>
            </motion.div>
          </div>

          {/* Right side - Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              {/* Main Resume Card */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotateY: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-primary-500" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32" />
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded w-20" />
                  <span className="text-xs text-green-600 font-semibold">94% Match</span>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-4/5" />
                </div>
              </motion.div>

              {/* Floating AI Indicators */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>

              {/* Pulse rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-64 h-64 border border-primary-200 dark:border-primary-800 rounded-full animate-pulse-ring" />
                <div className="w-64 h-64 border border-primary-300 dark:border-primary-700 rounded-full animate-pulse-ring animation-delay-75" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
