import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Building, FileText } from 'lucide-react';
import { laws } from '../lib/constants/lawData';

const LawDetailPage: React.FC = () => {
  const { id } = useParams();
  const law = laws.find(l => l.id === id);

  if (!law) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">未找到相关法规</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{law.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>生效日期：{law.effectiveDate}</span>
            </div>
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              <span>{law.department}</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <span>{law.level}</span>
            </div>
          </div>
        </div>
        
        <div className="prose prose-indigo max-w-none">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <span className="text-sm font-medium text-gray-500">法规类别：</span>
            <span className="text-sm text-gray-900">{law.category}</span>
          </div>
          
          <div className="space-y-4 text-gray-700">
            {law.content.split('\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default LawDetailPage;