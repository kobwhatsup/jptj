import React from 'react';
import { Calendar, User, Building, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Policy } from '../../lib/types/policy';

interface PolicyListProps {
  policies: Policy[];
}

const PolicyList: React.FC<PolicyListProps> = ({ policies }) => {
  return (
    <div className="space-y-4">
      {policies.map((policy) => (
        <Link 
          key={policy.id} 
          to={`/policies/${policy.id}`}
          className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                {policy.title}
              </h3>
              <p className="text-gray-600 mb-4">{policy.summary}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {policy.category}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{policy.publishDate}</span>
            </div>
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              <span>{policy.department}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{policy.author}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {policy.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {policy.relatedLaws.length > 0 && (
            <div className="text-sm text-gray-500">
              相关法规：{policy.relatedLaws.join('、')}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default PolicyList;