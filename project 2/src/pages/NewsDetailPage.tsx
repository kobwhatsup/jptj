import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, User } from 'lucide-react';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams();

  // 模拟新闻详情数据
  const newsDetail = {
    id: '1',
    title: '最高法发布人民调解工作新规定',
    date: '2024-03-15',
    author: '最高人民法院',
    content: `
      为进一步规范人民调解工作，提高调解效率和质量，最高人民法院近日发布《关于人民调解工作的若干规定》。

      一、主要内容
      1. 明确人民调解的基本原则
      - 坚持自愿、合法、公平公正
      - 尊重当事人意愿
      - 注重保护当事人合法权益

      2. 规范调解程序
      - 细化调解工作流程
      - 规定调解期限要求
      - 明确调解协议效力

      3. 完善工作机制
      - 建立调解与诉讼对接机制
      - 健全调解员管理制度
      - 加强调解工作保障

      二、重要意义
      1. 提升调解工作规范化水平
      2. 增强调解工作实效性
      3. 促进矛盾纠纷及时化解

      三、具体要求
      1. 各级法院要认真学习贯彻
      2. 加强调解工作指导
      3. 确保各项规定落实到位
    `
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{newsDetail.title}</h1>
        <div className="flex items-center space-x-6 text-gray-500 mb-8">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <span>{newsDetail.date}</span>
          </div>
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <span>{newsDetail.author}</span>
          </div>
        </div>
        <div className="prose prose-indigo max-w-none">
          {newsDetail.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;