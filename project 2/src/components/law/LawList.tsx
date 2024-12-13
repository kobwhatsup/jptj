import React from 'react';
import { FileText, Calendar, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Law } from '../../lib/types/law';

interface LawListProps {
  laws: Law[];
}

const LawList: React.FC<LawListProps> = ({ laws }) => {
  return (
    <div className="space-y-4">
      {laws.map((law) => (
        <Link 
          key={law.id} 
          to={`/laws/${law.id}`}
          className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                {law.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{law.content}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {law.category}
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>生效日期：{law.effectiveDate}</span>
            </div>
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              <span>{law.department}</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>{law.level}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LawList;