import React from 'react';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { courses } from '../../lib/constants/trainingData';
import CourseCard from './CourseCard';

const Training: React.FC = () => {
  // 只展示最新的3门课程
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">培训课程</h2>
          </div>
          <a href="#" className="text-indigo-600 hover:text-indigo-500 flex items-center">
            查看更多
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Training;