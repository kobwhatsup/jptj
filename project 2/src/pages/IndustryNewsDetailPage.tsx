import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, User, Eye, Tag } from 'lucide-react';
import { industryNews } from '../lib/constants/industryData';

const IndustryNewsDetailPage: React.FC = () => {
  const { id } = useParams();
  const news = industryNews.find(n => n.id === id);

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">未找到相关行业动态</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {news.imageUrl && (
          <div className="w-full h-64 relative">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{news.publishDate}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{news.author}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                <span>{news.views} 阅读</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {news.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="prose prose-indigo max-w-none">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">{news.summary}</p>
            </div>
            
            <div className="space-y-4 text-gray-700">
              {news.content.split('\n').map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                来源：{news.source}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default IndustryNewsDetailPage;