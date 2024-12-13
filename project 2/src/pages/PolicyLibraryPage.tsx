import React from 'react';
import { BookOpen } from 'lucide-react';
import { policies } from '../lib/constants/policyData';
import PolicyList from '../components/policy/PolicyList';

const PolicyLibraryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-8">
        <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">政策解读</h1>
      </div>
      <PolicyList policies={policies} />
    </div>
  );
};

export default PolicyLibraryPage;