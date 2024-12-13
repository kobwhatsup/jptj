import React from 'react';
import { MessageSquare } from 'lucide-react';
import { forumPosts } from '../lib/constants/forumData';
import ForumPostList from '../components/forum/ForumPostList';

const ForumPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-8">
        <MessageSquare className="h-8 w-8 text-indigo-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">知识论坛</h1>
      </div>
      <ForumPostList posts={forumPosts} />
    </div>
  );
};

export default ForumPage;