// 论坛相关类型定义
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: ForumCategory;
  publishDate: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'mediator' | 'expert' | 'user';
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  tags: string[];
}

export type ForumCategory = 
  | '经验交流'
  | '案例分享'
  | '技能提升'
  | '政策讨论'
  | '调解心得';

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'mediator' | 'expert' | 'user';
  };
  publishDate: string;
  likes: number;
  replies?: Comment[];
}