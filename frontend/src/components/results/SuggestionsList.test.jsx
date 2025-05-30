import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import SuggestionsList from './SuggestionsList';

describe('SuggestionsList', () => {
  const mockSuggestions = [
    'Add more technical skills',
    'Include project experience',
    'Highlight achievements'
  ];

  it('renders suggestions list correctly', () => {
    render(<SuggestionsList suggestions={mockSuggestions} />);
    
    // Check if all suggestions are rendered
    mockSuggestions.forEach(suggestion => {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    });
  });

  it('renders empty state message when no suggestions are provided', () => {
    render(<SuggestionsList suggestions={[]} />);
    
    expect(screen.getByText('No suggestions available.')).toBeInTheDocument();
  });

  it('renders empty state message when suggestions is null', () => {
    render(<SuggestionsList suggestions={null} />);
    
    expect(screen.getByText('No suggestions available.')).toBeInTheDocument();
  });

  it('renders empty state message when suggestions is undefined', () => {
    render(<SuggestionsList suggestions={undefined} />);
    
    expect(screen.getByText('No suggestions available.')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<SuggestionsList suggestions={mockSuggestions} />);
    
    const listElement = screen.getByRole('list');
    expect(listElement).toHaveClass('space-y-2');
    
    const listItems = screen.getAllByRole('listitem');
    listItems.forEach(item => {
      expect(item).toHaveClass('flex', 'items-start', 'gap-2', 'p-2', 'rounded-lg', 'bg-gray-50', 'dark:bg-gray-800');
    });
  });
}); 