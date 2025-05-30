import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchScoreDisplay from './MatchScoreDisplay';
import '@testing-library/jest-dom';

describe('MatchScoreDisplay', () => {
  test('renders score and rating correctly', () => {
    render(<MatchScoreDisplay score={85} rating="Excellent" />);
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  test('applies correct color for high score', () => {
    render(<MatchScoreDisplay score={90} rating="Excellent" />);
    const scoreElement = screen.getByText('90%');
    expect(scoreElement).toHaveClass('text-green-500');
  });

  test('applies correct color for medium score', () => {
    render(<MatchScoreDisplay score={75} rating="Good" />);
    const scoreElement = screen.getByText('75%');
    expect(scoreElement).toHaveClass('text-yellow-500');
  });

  test('applies correct color for low score', () => {
    render(<MatchScoreDisplay score={40} rating="Needs Improvement" />);
    const scoreElement = screen.getByText('40%');
    expect(scoreElement).toHaveClass('text-red-500');
  });

  test('does not render if score is null', () => {
    const { container } = render(<MatchScoreDisplay score={null} rating="N/A" />);
    expect(container.firstChild).toBeNull();
  });

  test('renders rating with correct background for excellent rating', () => {
    render(<MatchScoreDisplay score={90} rating="Excellent Match" />);
    const ratingElement = screen.getByText('Excellent Match');
    expect(ratingElement).toHaveClass('bg-green-500/10');
  });

  test('renders rating with correct background for good rating', () => {
    render(<MatchScoreDisplay score={70} rating="Good Fit" />);
    const ratingElement = screen.getByText('Good Fit');
    expect(ratingElement).toHaveClass('bg-yellow-500/10');
  });

  test('renders rating with correct background for poor rating', () => {
    render(<MatchScoreDisplay score={30} rating="Poor Alignment" />);
    const ratingElement = screen.getByText('Poor Alignment');
    expect(ratingElement).toHaveClass('bg-red-500/10');
  });
}); 