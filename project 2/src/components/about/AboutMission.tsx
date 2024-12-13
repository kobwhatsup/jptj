import React from 'react';
import { Target, Users, TrendingUp } from 'lucide-react';

const missions = [
  {
    title: '我们的使命',
    description: '通过知识分享和经验交流，提升调解员专业能力，推动调解行业发展。',
    icon: Target,
  },
  {
    title: '我们的愿景',
    description: '打造中国最具影响力的调解员专业社区，促进多元化纠纷解决机制的完善。',
    icon: Users,
  },
  {
    title: '发展目标',
    description: '到2025年，服务10万+调解员，建立完善的调解知识体系和培训体系。',
    icon: TrendingUp,
  },
];

const AboutMission: React.FC = () => {
  return (
    <div className="bg-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">使命与愿景</h2>
          <p className="mt-4 text-lg text-gray-600">
            致力于为调解员提供专业的知识服务，推动调解行业发展
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {missions.map((mission) => (
            <div
              key={mission.title}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <div className="flex justify-center">
                <mission.icon className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {mission.title}
              </h3>
              <p className="mt-4 text-gray-600">{mission.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutMission;