import React from 'react';
import { Calendar, User, Eye, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IndustryNews } from '../../lib/types/industry';

interface IndustryNewsListProps {
  news: IndustryNews[];
}

const IndustryNewsList: React.FC<IndustryNewsListProps> = ({ news }) => {
  return (
    <div className="space-y-6">
      {news.map((item) => (
        <Link 
          key={item.id} 
          to={`/industry/${item.id}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="md:flex">
            {item.imageUrl && (
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:w-48"
                  src={item.imageUrl}
                  alt={item.title}
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.summary}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {item.category}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{item.publishDate}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  <span>{item.views} 阅读</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-500">
                来源：{item.source}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default IndustryNewsList;