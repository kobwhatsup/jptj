import React from 'react';
import { Clock, Users, Star, Tag } from 'lucide-react';
import { Course } from '../../lib/types/training';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link 
      to={`/courses/${course.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 px-2 py-1 bg-indigo-600 text-white text-sm font-medium rounded">
          {course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="h-10 w-10 rounded-full"
          />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">{course.instructor.name}</h4>
            <p className="text-sm text-gray-500">{course.instructor.title}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.students}人学习
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            {course.rating}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-indigo-600">¥{course.price}</span>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
            立即报名
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;