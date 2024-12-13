import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { forumPosts } from '../../lib/constants/forumData';
import ForumPostList from './ForumPostList';

const Forum: React.FC = () => {
  // 只展示最新的3条帖子
  const recentPosts = forumPosts.slice(0, 3);

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">知识论坛</h2>
          </div>
          <a href="#" className="text-indigo-600 hover:text-indigo-500 flex items-center">
            查看更多
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
        <ForumPostList posts={recentPosts} />
      </div>
    </div>
  );
};

export default Forum;