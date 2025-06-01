import axios from 'axios';

// Use environment variable for API base URL without /api prefix
const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json', // Default, might be overridden for FormData
  },
  withCredentials: true, // Enable sending cookies if needed
});

// Add interceptor to include Google ID token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('g_id_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Calls the backend API to analyze the resume and job description.
 * @param {File} resumeFile - The resume file (PDF).
 * @param {string} jobDescription - The job description text.
 * @returns {Promise<object>} The analysis result from the backend.
 */
export const analyzeResumeWithAPI = async (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append('resume_file', resumeFile);
  formData.append('job_description', jobDescription);

  try {
    console.log('Sending analysis request to:', `${API_URL}/api/analyze`);
    const response = await apiClient.post('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Analysis response:', response.data);
    return response.data; // This should match FullAnalysisResponse from backend
  } catch (error) {
    console.error("Error calling analysis API:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      if (error.response.status === 401) {
        const err = new Error('Login required');
        err.code = 401;
        throw err;
      }
      throw new Error(error.response.data.detail || 'API request failed');
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error('No response received from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
      throw new Error('Failed to make request. Please try again.');
    }
  }
};

// Example of how AnalysisResponse type might look (should match backend)
// interface AnalysisResponse {
//   match_score: number;
//   match_rating: string;
//   missing_keywords: string[];
//   suggestions: string[];
//   resume_stats: {
//     word_count: number;
//     readability_score: number;
//   };
// } 