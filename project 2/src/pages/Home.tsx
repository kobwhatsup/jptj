import React from 'react';
import Hero from '../components/home/Hero';
import NewsList from '../components/home/NewsList';
import LawLibrary from '../components/law/LawLibrary';
import PolicyLibrary from '../components/policy/PolicyLibrary';
import IndustryNews from '../components/industry/IndustryNews';
import Training from '../components/training/Training';
import Forum from '../components/forum/Forum';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <div className="space-y-0">
        <NewsList />
        <LawLibrary />
        <PolicyLibrary />
        <IndustryNews />
        <Training />
        <Forum />
      </div>
    </main>
  );
};

export default Home;