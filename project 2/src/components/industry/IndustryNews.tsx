import React from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';
import { industryNews } from '../../lib/constants/industryData';
import IndustryNewsList from './IndustryNewsList';

const IndustryNews: React.FC = () => {
  // 只展示最新的3条行业动态
  const recentNews = industryNews.slice(0, 3);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Newspaper className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">行业动态</h2>
          </div>
          <a href="#" className="text-indigo-600 hover:text-indigo-500 flex items-center">
            查看更多
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
        <IndustryNewsList news={recentNews} />
      </div>
    </div>
  );
};

export default IndustryNews;