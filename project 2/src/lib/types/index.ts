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

// 商品评论类型定义
export interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  date: string;
}

// 商品类型定义
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  reviews: Review[];
  tags: string[];
}

// 购物车商品类型定义
export interface CartItem extends Product {
  quantity: number;
}
