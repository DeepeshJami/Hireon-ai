import React from 'react';
import { render, screen } from '@testing-library/react';
import MissingKeywordsList from './MissingKeywordsList';
import '@testing-library/jest-dom';

describe('MissingKeywordsList', () => {
  test('renders list of missing keywords', () => {
    const keywords = ['Java', 'Spring Boot', 'Microservices'];
    render(<MissingKeywordsList keywords={keywords} />);
    keywords.forEach(keyword => {
      expect(screen.getByText(`- ${keyword}`)).toBeInTheDocument();
    });
    expect(screen.getByText(/Consider incorporating these terms/i)).toBeInTheDocument();
  });

  test('renders fallback message when no keywords are provided', () => {
    render(<MissingKeywordsList keywords={[]} />);
    expect(screen.getByText(/No significant missing keywords identified/i)).toBeInTheDocument();
  });

  test('renders fallback message when keywords prop is null', () => {
    render(<MissingKeywordsList keywords={null} />);
    expect(screen.getByText(/No significant missing keywords identified/i)).toBeInTheDocument();
  });
}); 