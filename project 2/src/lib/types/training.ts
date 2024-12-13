// 培训课程相关类型定义
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    title: string;
    avatar: string;
  };
  category: CourseCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  price: number;
  rating: number;
  students: number;
  coverImage: string;
  tags: string[];
  features: string[];
}

export type CourseCategory = 
  | '调解技能'
  | '法律知识'
  | '心理辅导'
  | '沟通技巧'
  | '案例研习';