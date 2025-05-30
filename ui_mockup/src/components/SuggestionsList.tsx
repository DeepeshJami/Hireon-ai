
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Copy, Check, Lightbulb, CheckCircle } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  example: string;
  priority: 'high' | 'medium' | 'low';
  category: 'content' | 'format' | 'skills' | 'experience';
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
}

const categoryIcons = {
  content: '📝',
  format: '🎨',
  skills: '🛠️',
  experience: '💼'
};

const priorityColors = {
  high: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
  medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  low: 'border-l-gray-500 bg-gray-50 dark:bg-gray-800/50'
};

const SuggestionsList = ({ suggestions }: SuggestionsListProps) => {
  const [copiedSuggestions, setCopiedSuggestions] = useState<Set<string>>(new Set());
  const [completedSuggestions, setCompletedSuggestions] = useState<Set<string>>(new Set());

  const handleCopy = async (suggestion: Suggestion) => {
    try {
      const textToCopy = `${suggestion.title}\n\n${suggestion.description}\n\nExample: ${suggestion.example}`;
      await navigator.clipboard.writeText(textToCopy);
      
      setCopiedSuggestions(prev => new Set(prev).add(suggestion.id));
      setTimeout(() => {
        setCopiedSuggestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(suggestion.id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleCompleted = (suggestionId: string) => {
    setCompletedSuggestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(suggestionId)) {
        newSet.delete(suggestionId);
      } else {
        newSet.add(suggestionId);
      }
      return newSet;
    });
  };

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, Suggestion[]>);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold font-inter text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          AI Suggestions
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Here's what's missing, and what you can do next
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
              <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                {category} Improvements
              </h4>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                {categorySuggestions.length}
              </span>
            </div>

            <div className="space-y-3">
              {categorySuggestions.map((suggestion, index) => {
                const isCopied = copiedSuggestions.has(suggestion.id);
                const isCompleted = completedSuggestions.has(suggestion.id);
                
                return (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    className={`relative border-l-4 rounded-lg p-4 transition-all duration-300 ${
                      priorityColors[suggestion.priority]
                    } ${isCompleted ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className={`w-4 h-4 ${
                            suggestion.priority === 'high' 
                              ? 'text-red-600' 
                              : suggestion.priority === 'medium' 
                                ? 'text-yellow-600' 
                                : 'text-gray-500'
                          }`} />
                          <h5 className={`font-medium font-inter ${
                            isCompleted 
                              ? 'line-through text-gray-500 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {suggestion.title}
                          </h5>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            suggestion.priority === 'high' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                              : suggestion.priority === 'medium' 
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' 
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {suggestion.priority}
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-3 ${
                          isCompleted 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {suggestion.description}
                        </p>
                        
                        <div className={`text-xs p-3 rounded-lg border-l-2 ${
                          isCompleted 
                            ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600' 
                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-blue-800 dark:text-blue-300">Example:</span>
                          </div>
                          <code className={`font-mono ${
                            isCompleted 
                              ? 'text-gray-500 dark:text-gray-400' 
                              : 'text-blue-700 dark:text-blue-200'
                          }`}>
                            {suggestion.example}
                          </code>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Copy button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCopy(suggestion)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group relative"
                        >
                          {isCopied ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-green-600"
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          )}

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {isCopied ? 'Copied!' : 'Copy suggestion'}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900 dark:border-t-gray-100" />
                          </div>
                        </motion.button>

                        {/* Complete checkbox */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleCompleted(suggestion.id)}
                          className={`p-2 rounded-lg transition-all ${
                            isCompleted 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Completion animation */}
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                      >
                        <Check className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Progress: {completedSuggestions.size} of {suggestions.length} completed
          </div>
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedSuggestions.size / suggestions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
              />
            </div>
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {Math.round((completedSuggestions.size / suggestions.length) * 100)}%
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuggestionsList;
