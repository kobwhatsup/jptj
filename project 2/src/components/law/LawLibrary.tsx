import React from 'react';
import { Book, ArrowRight } from 'lucide-react';
import { laws } from '../../lib/constants/lawData';
import LawList from './LawList';

const LawLibrary: React.FC = () => {
  // 只展示最新的3条法律法规
  const recentLaws = laws.slice(0, 3);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Book className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">法律法规库</h2>
          </div>
          <a href="#" className="text-indigo-600 hover:text-indigo-500 flex items-center">
            查看更多
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
        <LawList laws={recentLaws} />
      </div>
    </div>
  );
};

export default LawLibrary;