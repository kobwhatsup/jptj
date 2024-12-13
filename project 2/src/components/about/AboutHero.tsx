import React from 'react';
import { Scale } from 'lucide-react';

const AboutHero: React.FC = () => {
  return (
    <div className="relative bg-indigo-800">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2048&q=80"
          alt="金牌调解员平台"
        />
        <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <Scale className="h-16 w-16 text-white mb-8" />
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          关于金牌调解员平台
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-indigo-100">
          我们致力于打造中国最专业的调解员知识分享平台，通过连接调解员、专家和用户，
          促进行业交流，推动调解事业发展，为构建和谐社会贡献力量。
        </p>
      </div>
    </div>
  );
};

export default AboutHero;