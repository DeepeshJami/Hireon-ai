
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Copy, Check, Tag, Zap, Star, AlertCircle } from 'lucide-react';

interface Keyword {
  text: string;
  category: 'technical' | 'soft' | 'certification' | 'experience';
  importance: 'high' | 'medium' | 'low';
}

interface MissingKeywordsProps {
  keywords: Keyword[];
}

const categoryColors = {
  technical: 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border-blue-200 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 dark:border-blue-800',
  soft: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 dark:border-green-800',
  certification: 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-800 border-purple-200 dark:from-purple-900/30 dark:to-violet-900/30 dark:text-purple-300 dark:border-purple-800',
  experience: 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 border-orange-200 dark:from-orange-900/30 dark:to-amber-900/30 dark:text-orange-300 dark:border-orange-800'
};

const categoryIcons = {
  technical: '⚙️',
  soft: '🤝',
  certification: '📜',
  experience: '💼'
};

const importanceOrder = { high: 0, medium: 1, low: 2 };

const MissingKeywords = ({ keywords }: MissingKeywordsProps) => {
  const [copiedKeywords, setCopiedKeywords] = useState<Set<string>>(new Set());

  const sortedKeywords = [...keywords].sort((a, b) => 
    importanceOrder[a.importance] - importanceOrder[b.importance]
  );

  const handleCopy = async (keyword: string) => {
    try {
      await navigator.clipboard.writeText(keyword);
      setCopiedKeywords(prev => new Set(prev).add(keyword));
      setTimeout(() => {
        setCopiedKeywords(prev => {
          const newSet = new Set(prev);
          newSet.delete(keyword);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const groupedKeywords = sortedKeywords.reduce((acc, keyword) => {
    if (!acc[keyword.category]) {
      acc[keyword.category] = [];
    }
    acc[keyword.category].push(keyword);
    return acc;
  }, {} as Record<string, Keyword[]>);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.2 }}
      className="relative group"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 group-hover:border-purple-300/50 dark:group-hover:border-purple-600/50">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-inter text-gray-900 dark:text-white">Missing Keywords</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Add these to boost your score</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl"
          >
            🧩
          </motion.div>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedKeywords).map(([category, categoryKeywords], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
              className="space-y-4"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-700/80 px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-600/50">
                  <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize text-sm">
                    {category} Skills
                  </h4>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    <Zap className="w-3 h-3" />
                    {categoryKeywords.length}
                  </div>
                </div>
              </div>

              {/* Keywords Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryKeywords.map((keyword, index) => {
                  const isCopied = copiedKeywords.has(keyword.text);
                  
                  return (
                    <motion.button
                      key={keyword.text}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 400
                      }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCopy(keyword.text)}
                      className={`group relative p-4 rounded-2xl border text-sm font-medium transition-all duration-300 hover:shadow-lg ${categoryColors[keyword.category]}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="font-semibold">{keyword.text}</span>
                          
                          {/* Importance Badge */}
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                            keyword.importance === 'high' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                              : keyword.importance === 'medium' 
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' 
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {keyword.importance === 'high' && <AlertCircle className="w-3 h-3" />}
                            {keyword.importance === 'medium' && <Star className="w-3 h-3" />}
                            {keyword.importance === 'low' && <div className="w-2 h-2 bg-current rounded-full" />}
                            {keyword.importance}
                          </div>
                        </div>

                        {/* Copy/Check Icon */}
                        <div className="flex items-center">
                          {isCopied ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="text-green-600 dark:text-green-400"
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        initial={false}
                      />

                      {/* Success Animation */}
                      {isCopied && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                        >
                          <Check className="w-3 h-3" />
                        </motion.div>
                      )}

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                        {isCopied ? '✅ Copied to clipboard!' : '📋 Click to copy keyword'}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="grid grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50"
            >
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                {keywords.filter(k => k.importance === 'high').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">High Priority</div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">🔥 Critical</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50"
            >
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {keywords.filter(k => k.importance === 'medium').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Medium Priority</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">⭐ Important</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-1">
                {keywords.filter(k => k.importance === 'low').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Low Priority</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">💡 Nice to have</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MissingKeywords;
