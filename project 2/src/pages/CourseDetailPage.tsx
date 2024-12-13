import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, Star, Tag, CheckCircle } from 'lucide-react';
import { courses } from '../lib/constants/trainingData';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">未找到相关课程</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* 课程主要信息 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {course.students}人学习
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  {course.rating}分
                </div>
              </div>

              <div className="prose prose-indigo max-w-none">
                <h2 className="text-xl font-semibold mb-4">课程介绍</h2>
                <p className="text-gray-600 mb-6">{course.description}</p>

                <h2 className="text-xl font-semibold mb-4">课程特色</h2>
                <ul className="space-y-2">
                  {course.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-indigo-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 课程信息卡片 */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-indigo-600">¥{course.price}</div>
            </div>

            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mb-4">
              立即报名
            </button>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">{course.instructor.name}</h4>
                  <p className="text-sm text-gray-500">{course.instructor.title}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">课程标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">课程信息</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>课程类别：{course.category}</li>
                    <li>课程难度：{course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}</li>
                    <li>课时数量：{course.lessons}课时</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;