import React from 'react';

const team = [
  {
    name: '张志强',
    role: '首席专家',
    description: '资深调解员，20年调解经验，专注商事调解领域',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: '李红',
    role: '培训总监',
    description: '法学博士，10年调解培训经验，擅长课程体系设计',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: '王建国',
    role: '资深顾问',
    description: '前法院调解室主任，擅长民商事纠纷调解',
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const AboutTeam: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">专家团队</h2>
          <p className="mt-4 text-lg text-gray-600">
            汇聚调解领域的专业人才，为平台提供强大的智力支持
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                className="w-full h-48 object-cover"
                src={member.image}
                alt={member.name}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="mt-1 text-indigo-600">{member.role}</p>
                <p className="mt-3 text-gray-600">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutTeam;