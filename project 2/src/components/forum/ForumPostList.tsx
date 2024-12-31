import React from 'react';
import { Calendar, Eye, ThumbsUp, MessageSquare, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ForumPost } from '../../lib/types/forum';

interface ForumPostListProps {
  posts: ForumPost[];
}

const ForumPostList: React.FC<ForumPostListProps> = ({ posts }) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link 
          key={post.id} 
          to={`/forum/${post.id}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full"
                  src={post.author.avatar}
                  alt={post.author.name}
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{post.author.name}</span>
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                      {post.author.role === 'mediator' ? '调解员' : post.author.role === 'expert' ? '专家' : '用户'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.publishDate}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {post.category}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600">
              {post.title}
            </h3>
            <p className="text-gray-600 mb-4">{post.summary}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.stats.views}
              </div>
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {post.stats.likes}
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {post.stats.comments}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ForumPostList;
