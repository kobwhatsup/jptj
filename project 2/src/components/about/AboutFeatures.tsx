import React from 'react';
import { Book, Users, GraduationCap, MessageSquare } from 'lucide-react';

const features = [
  {
    name: '法律法规库',
    description: '提供最新、最全面的调解相关法律法规资源，帮助调解员及时了解政策变化。',
    icon: Book,
  },
  {
    name: '专家资源',
    description: '汇聚全国各地调解领域专家，分享专业知识和实践经验。',
    icon: Users,
  },
  {
    name: '培训课程',
    description: '开设专业培训课程，提供系统化的学习路径，提升调解技能。',
    icon: GraduationCap,
  },
  {
    name: '知识论坛',
    description: '搭建交流平台，促进同行交流，分享调解经验和案例。',
    icon: MessageSquare,
  },
];

const AboutFeatures: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            平台特色
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            专业的调解知识服务平台
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            为调解员提供全方位的知识支持和能力提升服务
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default AboutFeatures;