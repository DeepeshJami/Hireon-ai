import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';

const HomePage = () => {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    navigate('/upload');
  };

  return (
    <>
      <HeroSection onCTAClick={handleCTAClick} />
      {/* We can add more sections to the HomePage later if needed */}
    </>
  );
};

export default HomePage; 