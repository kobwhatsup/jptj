import React from 'react';
import { Book } from 'lucide-react';
import { laws } from '../lib/constants/lawData';
import LawList from '../components/law/LawList';

const LawLibraryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-8">
        <Book className="h-8 w-8 text-indigo-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">法律法规库</h1>
      </div>
      <LawList laws={laws} />
    </div>
  );
};

export default LawLibraryPage;