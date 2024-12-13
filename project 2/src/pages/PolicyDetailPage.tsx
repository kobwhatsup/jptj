import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, User, Building, Tag } from 'lucide-react';
import { policies } from '../lib/constants/policyData';

const PolicyDetailPage: React.FC = () => {
  const { id } = useParams();
  const policy = policies.find(p => p.id === id);

  if (!policy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">未找到相关政策解读</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{policy.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{policy.publishDate}</span>
            </div>
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              <span>{policy.department}</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{policy.author}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {policy.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="prose prose-indigo max-w-none">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">{policy.summary}</p>
          </div>
          
          <div className="space-y-4 text-gray-700">
            {policy.content.split('\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {policy.relatedLaws.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">相关法规</h2>
              <ul className="list-disc list-inside space-y-2">
                {policy.relatedLaws.map((law, index) => (
                  <li key={index} className="text-gray-700">{law}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default PolicyDetailPage;