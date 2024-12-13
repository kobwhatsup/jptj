import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const navigation = {
    main: [
      { name: '关于我们', href: '/about' },
      { name: '联系方式', href: '/contact' },
      { name: '使用条款', href: '/terms' },
      { name: '隐私政策', href: '/privacy' },
    ],
    services: [
      { name: '法律法规', href: '/laws' },
      { name: '政策解读', href: '/policies' },
      { name: '行业动态', href: '/industry' },
      { name: '培训课程', href: '/courses' },
      { name: '知识论坛', href: '/forum' },
    ],
    social: [
      { name: '微信公众号', href: '#' },
      { name: '官方微博', href: '#' },
    ],
  };

  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">金牌调解员</span>
            </div>
            <p className="text-gray-600 text-sm">
              专业的调解员知识分享平台，助力调解行业发展，促进社会和谐。
            </p>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              联系我们
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                <span>400-888-8888</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2" />
                <span>contact@example.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>北京市朝阳区xxx街道xxx号</span>
              </div>
            </div>
          </div>

          {/* 服务导航 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              服务内容
            </h3>
            <ul className="space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 关注我们 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              关注我们
            </h3>
            <ul className="space-y-3">
              {navigation.social.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部导航和版权信息 */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <nav className="flex flex-wrap justify-center space-x-6">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <p className="mt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} 金牌调解员平台. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;