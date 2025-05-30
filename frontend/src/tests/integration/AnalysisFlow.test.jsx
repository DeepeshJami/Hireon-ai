import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext';
import UploadPage from '../../pages/UploadPage';
import { analyzeResumeWithAPI } from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  analyzeResumeWithAPI: vi.fn()
}));

// Mock file for testing
const mockFile = new File(['dummy resume content'], 'resume.pdf', { type: 'application/pdf' });

// Mock API response
const mockAnalysisResult = {
  match_score: 85,
  match_rating: 'Strong Match',
  missing_keywords: ['React', 'TypeScript'],
  suggestions: ['Add more technical skills', 'Include project experience'],
  resume_stats: {
    word_count: 500,
    readability_score: 75
  }
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AppProvider>
        {component}
      </AppProvider>
    </BrowserRouter>
  );
};

describe('Analysis Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes the full analysis flow successfully', async () => {
    // Mock successful API response
    analyzeResumeWithAPI.mockResolvedValueOnce(mockAnalysisResult);

    renderWithRouter(<UploadPage />);

    // 1. Upload resume file
    const fileInput = screen.getByLabelText(/resume file/i);
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // 2. Enter job description
    const jobDescriptionInput = screen.getByLabelText(/job description/i);
    fireEvent.change(jobDescriptionInput, { target: { value: 'Sample job description' } });

    // 3. Submit the form
    const submitButton = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(submitButton);

    // 4. Verify loading state
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();

    // 5. Wait for analysis to complete and verify results
    await waitFor(() => {
      // Check if match score is displayed
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('Strong Match')).toBeInTheDocument();

      // Check if missing keywords are displayed
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();

      // Check if suggestions are displayed
      expect(screen.getByText('Add more technical skills')).toBeInTheDocument();
      expect(screen.getByText('Include project experience')).toBeInTheDocument();

      // Check if resume stats are displayed
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    // 6. Verify API was called with correct parameters
    expect(analyzeResumeWithAPI).toHaveBeenCalledWith(
      expect.any(File),
      'Sample job description'
    );
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    const errorMessage = 'Failed to analyze resume';
    analyzeResumeWithAPI.mockRejectedValueOnce(new Error(errorMessage));

    renderWithRouter(<UploadPage />);

    // Fill in the form
    const fileInput = screen.getByLabelText(/resume file/i);
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const jobDescriptionInput = screen.getByLabelText(/job description/i);
    fireEvent.change(jobDescriptionInput, { target: { value: 'Sample job description' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(submitButton);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('validates form inputs before submission', async () => {
    renderWithRouter(<UploadPage />);

    // Try to submit without any inputs
    const submitButton = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(submitButton);

    // Verify validation messages
    expect(screen.getByText(/please provide a resume/i)).toBeInTheDocument();
    expect(screen.getByText(/please provide a job description/i)).toBeInTheDocument();

    // Verify API was not called
    expect(analyzeResumeWithAPI).not.toHaveBeenCalled();
  });

  it('handles file drag and drop', async () => {
    renderWithRouter(<UploadPage />);

    const dropZone = screen.getByTestId('drop-zone');

    // Simulate drag over
    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveClass('border-blue-500');

    // Simulate drop
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [mockFile]
      }
    });

    // Verify file was accepted
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
  });
}); 