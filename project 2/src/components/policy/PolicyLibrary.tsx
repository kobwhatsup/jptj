import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { policies } from '../../lib/constants/policyData';
import PolicyList from './PolicyList';

const PolicyLibrary: React.FC = () => {
  // 只展示最新的3条政策解读
  const recentPolicies = policies.slice(0, 3);

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">政策解读</h2>
          </div>
          <a href="#" className="text-indigo-600 hover:text-indigo-500 flex items-center">
            查看更多
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
        <PolicyList policies={recentPolicies} />
      </div>
    </div>
  );
};

export default PolicyLibrary;