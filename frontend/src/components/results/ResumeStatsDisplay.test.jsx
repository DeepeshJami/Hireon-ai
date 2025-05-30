import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import ResumeStatsDisplay from './ResumeStatsDisplay';

describe('ResumeStatsDisplay', () => {
  const mockStats = {
    word_count: 500,
    readability_score: 75
  };

  it('renders stats correctly', () => {
    render(<ResumeStatsDisplay stats={mockStats} />);
    
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('Word Count')).toBeInTheDocument();
    expect(screen.getByText('Readability Score')).toBeInTheDocument();
  });

  it('renders empty state message when no stats are provided', () => {
    render(<ResumeStatsDisplay stats={null} />);
    
    expect(screen.getByText('No statistics available.')).toBeInTheDocument();
  });

  it('renders empty state message when stats is undefined', () => {
    render(<ResumeStatsDisplay stats={undefined} />);
    
    expect(screen.getByText('No statistics available.')).toBeInTheDocument();
  });

  it('renders empty state message when stats object is empty', () => {
    render(<ResumeStatsDisplay stats={{}} />);
    
    expect(screen.getByText('No statistics available.')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ResumeStatsDisplay stats={mockStats} />);
    
    const container = screen.getByTestId('stats-container');
    expect(container).toHaveClass('grid', 'grid-cols-2', 'gap-4', 'p-4', 'rounded-lg', 'bg-white', 'dark:bg-gray-800', 'shadow-sm');
    
    const statItems = screen.getAllByTestId('stat-item');
    statItems.forEach(item => {
      expect(item).toHaveClass('flex', 'flex-col', 'items-center', 'p-3', 'rounded-lg', 'bg-gray-50', 'dark:bg-gray-700');
    });
  });
}); 