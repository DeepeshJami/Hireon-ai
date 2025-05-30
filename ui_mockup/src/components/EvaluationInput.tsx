
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Upload, FileText, Briefcase, Zap } from 'lucide-react';

interface EvaluationInputProps {
  onEvaluate: (resume: string, jobDescription: string) => void;
}

const EvaluationInput = ({ onEvaluate }: EvaluationInputProps) => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = () => {
    if (resume.trim() && jobDescription.trim()) {
      onEvaluate(resume, jobDescription);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // In a real app, you'd parse the PDF here
      setResume(`PDF file uploaded: ${file.name}\n\n[PDF content would be extracted here]`);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(`PDF file uploaded: ${file.name}\n\n[PDF content would be extracted here]`);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold font-inter text-gray-900 dark:text-white mb-4">
            Let's see what's working in your resume…
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Paste your content below and let AI do the magic ✨
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Resume Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary-500" />
                <h3 className="text-xl font-semibold font-inter text-gray-900 dark:text-white">
                  Your Resume
                </h3>
              </div>

              <div className="relative">
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="w-full h-80 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 resize-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-inter"
                />
                
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl" />
              </div>

              {/* File Upload Area */}
              <motion.div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                  isDragOver 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-300 font-inter">
                  Or drag & drop your PDF resume here
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </motion.div>
            </motion.div>

            {/* Job Description Input */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-primary-500" />
                <h3 className="text-xl font-semibold font-inter text-gray-900 dark:text-white">
                  Job Description
                </h3>
              </div>

              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description or LinkedIn job URL here..."
                  className="w-full h-80 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 resize-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-inter"
                />
                
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl" />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 text-sm font-inter">
                  💡 <strong>Pro tip:</strong> Include requirements, qualifications, and desired skills for the best analysis.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Evaluate Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <button
              onClick={handleSubmit}
              disabled={!resume.trim() || !jobDescription.trim()}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-12 py-6 rounded-xl text-xl font-semibold font-inter shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>Evaluate Match</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  whileTap={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-white rounded-full"
                />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EvaluationInput;
