import React from 'react';
import { Newspaper } from 'lucide-react';
import { industryNews } from '../lib/constants/industryData';
import IndustryNewsList from '../components/industry/IndustryNewsList';

const IndustryNewsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-8">
        <Newspaper className="h-8 w-8 text-indigo-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">行业动态</h1>
      </div>
      <IndustryNewsList news={industryNews} />
    </div>
  );
};

export default IndustryNewsPage;