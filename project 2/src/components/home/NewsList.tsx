import React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsList = () => {
  const news = [
    {
      id: 1,
      title: '最高法发布人民调解工作新规定',
      date: '2024-03-15',
      summary: '为进一步规范人民调解工作，提高调解效率和质量...',
    },
    {
      id: 2,
      title: '全国调解员培训认证计划启动',
      date: '2024-03-14',
      summary: '为提升调解员专业素养，建立规范的职业认证体系...',
    },
    {
      id: 3,
      title: '2024年度优秀调解案例评选开始',
      date: '2024-03-13',
      summary: '展示调解工作典型案例，推广先进调解经验...',
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">最新资讯</h2>
          <Link to="/news" className="text-indigo-600 hover:text-indigo-500">
            查看全部
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {news.map((item) => (
            <Link 
              key={item.id} 
              to={`/news/${item.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  {item.date}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsList;