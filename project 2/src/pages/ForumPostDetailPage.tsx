import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Eye, ThumbsUp, MessageSquare, Tag } from 'lucide-react';
import { forumPosts } from '../lib/constants/forumData';

const ForumPostDetailPage: React.FC = () => {
  const { id } = useParams();
  const post = forumPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">未找到相关帖子</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center mb-6">
            <img
              className="h-12 w-12 rounded-full"
              src={post.author.avatar}
              alt={post.author.name}
            />
            <div className="ml-4">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{post.author.name}</span>
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

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="prose prose-indigo max-w-none">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">{post.summary}</p>
          </div>
          
          <div className="space-y-4 text-gray-700">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              <span>{post.stats.views} 阅读</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-5 w-5 mr-2" />
              <span>{post.stats.likes} 点赞</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>{post.stats.comments} 评论</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ForumPostDetailPage;
