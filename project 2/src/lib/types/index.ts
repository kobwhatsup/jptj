// 文章类型定义
export interface Article {
  id: string;
  title: string;
  content: string;
  category: 'law' | 'policy' | 'news' | 'industry';
  author: string;
  publishDate: string;
  tags: string[];
  summary: string;
}

// 用户类型定义
export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'mediator' | 'admin' | 'user';
  location: string;
  expertise: string[];
}

// 论坛帖子类型定义
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  publishDate: string;
  comments: Comment[];
  likes: number;
  views: number;
}