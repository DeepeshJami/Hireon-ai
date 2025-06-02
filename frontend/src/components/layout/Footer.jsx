import React from 'react';
//eslint-disable-next-line
import { motion } from 'framer-motion';
import { Heart, Coffee, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 sm:py-12"
    >
      <div className="container mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
          {/* Left - Brand */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-inter text-gray-900 dark:text-white">
                Hireon AI
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
              Your Resume. Reimagined by AI.
            </p>
          </div>

          {/* Center - Features */}
          <div className="text-center space-y-2 sm:space-y-3 mb-6 md:mb-0">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>No tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Just better resumes</span>
              </div>
            </div>
            
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              Built with AI • Designed for humans
            </motion.p>
          </div>

          {/* Right - Love */}
          <div className="text-center md:text-right">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center md:justify-end gap-2 text-gray-600 dark:text-gray-300"
            >
              <span className="text-xs sm:text-sm">Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-xs sm:text-sm">and</span>
              <Coffee className="w-4 h-4 text-amber-600" />
            </motion.div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {new Date().getFullYear()} Hireon AI. Helping you get hired smarter.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Developed by <a href="https://www.linkedin.com/in/deepeshjami/" className="text-blue-500 hover:underline">Deepesh Jami</a>
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-gray-500 dark:text-gray-400">
            <Link to="/about" className="hover:underline">About</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <span>Privacy First</span>
            <span>•</span>
            <span>Closed Source</span>
            <span>•</span>
            <span>Free Tier</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 