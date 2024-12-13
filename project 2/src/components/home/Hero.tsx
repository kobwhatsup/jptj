import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BannerSlide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: "金牌调解员平台",
    description: "专业的调解员知识分享平台，助力调解行业发展，促进社会和谐",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  },
  {
    id: 2,
    title: "专业调解培训",
    description: "汇聚行业精英，提供专业培训课程，提升调解技能",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  },
  {
    id: 3,
    title: "知识经验分享",
    description: "搭建交流平台，分享调解经验，共同进步成长",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleStartClick = () => {
    navigate('/register');
  };

  const handleLearnMoreClick = () => {
    navigate('/about');
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* 轮播图片 */}
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-50" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* 内容 */}
      <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        <Scale className="mx-auto h-16 w-16 text-white opacity-80" />
        <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          {bannerSlides[currentSlide].title}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-white">
          {bannerSlides[currentSlide].description}
        </p>
        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
          <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
            <button
              onClick={handleStartClick}
              className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 sm:px-10"
            >
              开始使用
            </button>
            <button
              onClick={handleLearnMoreClick}
              className="flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:bg-opacity-20 sm:px-10"
            >
              了解更多
            </button>
          </div>
        </div>
      </div>

      {/* 轮播指示器 */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;