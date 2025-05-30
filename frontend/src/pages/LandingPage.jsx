import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <HeroSection onCTAClick={() => navigate('/upload')} />
    </div>
  );
};

export default LandingPage; 