
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import EvaluationInput from '@/components/EvaluationInput';
import EvaluationLoader from '@/components/EvaluationLoader';
import MatchScore from '@/components/MatchScore';
import MissingKeywords from '@/components/MissingKeywords';
import SuggestionsList from '@/components/SuggestionsList';
import Footer from '@/components/Footer';

type AppStep = 'hero' | 'input' | 'loading' | 'results';

// Mock data for demonstration
const mockResults = {
  score: 82,
  keywords: [
    { text: 'React', category: 'technical' as const, importance: 'high' as const },
    { text: 'TypeScript', category: 'technical' as const, importance: 'high' as const },
    { text: 'Node.js', category: 'technical' as const, importance: 'medium' as const },
    { text: 'Leadership', category: 'soft' as const, importance: 'high' as const },
    { text: 'Agile', category: 'experience' as const, importance: 'medium' as const },
    { text: 'AWS Certified', category: 'certification' as const, importance: 'low' as const },
    { text: 'Team Collaboration', category: 'soft' as const, importance: 'medium' as const },
    { text: 'Project Management', category: 'experience' as const, importance: 'high' as const }
  ],
  suggestions: [
    {
      id: '1',
      title: 'Add React Experience',
      description: 'Include specific React projects and frameworks you\'ve used. Mention version numbers and any advanced features you\'ve implemented.',
      example: '• Built responsive web applications using React 18+ with hooks, context API, and Redux for state management',
      priority: 'high' as const,
      category: 'content' as const
    },
    {
      id: '2',
      title: 'Quantify Your Leadership Impact',
      description: 'Add specific metrics about team size, project outcomes, or improvements you led.',
      example: '• Led a team of 8 developers to deliver a $2M project 2 weeks ahead of schedule, improving client satisfaction by 40%',
      priority: 'high' as const,
      category: 'content' as const
    },
    {
      id: '3',
      title: 'Highlight TypeScript Proficiency',
      description: 'Mention your TypeScript experience and how it improved code quality or team productivity.',
      example: '• Migrated legacy JavaScript codebase to TypeScript, reducing runtime errors by 60% and improving development velocity',
      priority: 'medium' as const,
      category: 'skills' as const
    },
    {
      id: '4',
      title: 'Format: Use Action Verbs',
      description: 'Start each bullet point with strong action verbs to make your achievements more impactful.',
      example: 'Change "Was responsible for..." to "Managed, Led, Developed, Implemented, Optimized..."',
      priority: 'medium' as const,
      category: 'format' as const
    },
    {
      id: '5',
      title: 'Add Agile Experience',
      description: 'Include your experience with Agile methodologies, Scrum ceremonies, and sprint planning.',
      example: '• Facilitated daily standups and sprint planning for 3 cross-functional teams using Agile methodologies',
      priority: 'low' as const,
      category: 'experience' as const
    }
  ]
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('hero');
  const [resumeData, setResumeData] = useState({ resume: '', jobDescription: '' });

  const handleGetStarted = () => {
    setCurrentStep('input');
  };

  const handleEvaluate = (resume: string, jobDescription: string) => {
    setResumeData({ resume, jobDescription });
    setCurrentStep('loading');
  };

  const handleLoadingComplete = () => {
    setCurrentStep('results');
  };

  const handleNewAnalysis = () => {
    setCurrentStep('input');
    setResumeData({ resume: '', jobDescription: '' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-inter">
      <AnimatePresence mode="wait">
        {currentStep === 'hero' && (
          <Hero key="hero" onGetStarted={handleGetStarted} />
        )}

        {currentStep === 'input' && (
          <EvaluationInput key="input" onEvaluate={handleEvaluate} />
        )}

        {currentStep === 'results' && (
          <div key="results" className="min-h-screen relative overflow-hidden">
            {/* Enhanced Background with Multiple Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent dark:from-purple-900/15" />
            
            {/* Floating Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float animation-delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-float animation-delay-2000" />

            <div className="relative z-10 py-12 lg:py-20">
              <div className="container mx-auto px-6">
                {/* Enhanced Header */}
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-3 mb-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analysis Complete</span>
                  </div>
                  
                  <h2 className="text-5xl lg:text-6xl font-bold font-inter bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
                    Your Resume Analysis
                  </h2>
                  
                  <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Discover insights, optimize your content, and 
                    <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> land your dream job</span>
                  </p>
                  
                  <button
                    onClick={handleNewAnalysis}
                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                    <span className="relative">✨ Analyze Another Resume</span>
                    <div className="relative w-2 h-2 bg-white/80 rounded-full animate-pulse" />
                  </button>
                </div>

                {/* Enhanced Results Grid - First Row */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                  <div>
                    <MatchScore score={mockResults.score} />
                  </div>
                  <div>
                    <MissingKeywords keywords={mockResults.keywords} />
                  </div>
                </div>

                {/* AI Suggestions - Second Row (Full Width) */}
                <div className="mb-16">
                  <SuggestionsList suggestions={mockResults.suggestions} />
                </div>

                {/* Additional Insights Section */}
                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                  {/* Quick Stats */}
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                    <h3 className="text-2xl font-bold font-inter text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span className="text-3xl">📊</span>
                      Quick Insights
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">8</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Missing Keywords</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">5</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">AI Suggestions</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">3</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">High Priority</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">2min</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Est. Fix Time</div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                    <h3 className="text-2xl font-bold font-inter text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span className="text-3xl">🎯</span>
                      Next Steps
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">Add Missing Keywords</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Focus on high-priority technical terms</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">Implement AI Suggestions</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Start with content improvements</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">Re-analyze</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Check your improved score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {currentStep === 'loading' && (
          <EvaluationLoader key="loading" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* Footer - always visible except on hero */}
      {currentStep !== 'hero' && <Footer />}
    </div>
  );
};

export default Index;
