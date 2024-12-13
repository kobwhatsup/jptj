import React from 'react';
import { Filter } from 'lucide-react';
import { PolicyCategory } from '../../lib/types/policy';

interface PolicyFilterProps {
  onCategoryChange: (category: PolicyCategory | '') => void;
  selectedCategory: PolicyCategory | '';
}

const PolicyFilter: React.FC<PolicyFilterProps> = ({
  onCategoryChange,
  selectedCategory,
}) => {
  const categories: PolicyCategory[] = [
    '最新政策',
    '重点解读',
    '实务指南',
    '案例分析',
    '专家观点'
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-indigo-600 mr-2" />
        <h3 className="text-lg font-semibold">筛选条件</h3>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          政策类别
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as PolicyCategory | '')}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">全部类别</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PolicyFilter;