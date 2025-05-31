import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from './layouts/MainLayout';
import UploadPage from './pages/UploadPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
// We will create these pages later
// import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          {/* <Route path="landing" element={<LandingPage />} /> */}
          {/* <Route path="results" element={<ResultsPage />} /> */}
          {/* Add other routes here as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
