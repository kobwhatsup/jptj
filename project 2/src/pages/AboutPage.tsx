import React from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutFeatures from '../components/about/AboutFeatures';
import AboutMission from '../components/about/AboutMission';
import AboutTeam from '../components/about/AboutTeam';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AboutHero />
      <AboutFeatures />
      <AboutMission />
      <AboutTeam />
    </div>
  );
};

export default AboutPage;