import React from 'react';
import { Filter } from 'lucide-react';
import { LawCategory, LawLevel } from '../../lib/types/law';

interface LawFilterProps {
  onCategoryChange: (category: LawCategory | '') => void;
  onLevelChange: (level: LawLevel | '') => void;
  selectedCategory: LawCategory | '';
  selectedLevel: LawLevel | '';
}

const LawFilter: React.FC<LawFilterProps> = ({
  onCategoryChange,
  onLevelChange,
  selectedCategory,
  selectedLevel,
}) => {
  const categories: LawCategory[] = ['民事调解', '商事调解', '劳动争议调解', '行政调解', '基层调解'];
  const levels: LawLevel[] = ['法律', '行政法规', '部门规章', '地方性法规', '司法解释'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-indigo-600 mr-2" />
        <h3 className="text-lg font-semibold">筛选条件</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            法规类别
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as LawCategory | '')}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            效力级别
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value as LawLevel | '')}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">全部级别</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LawFilter;