import { Course } from '../types/training';

export const courses: Course[] = [
  {
    id: '1',
    title: '人民调解实务技能提升班',
    description: '系统学习调解工作流程、技巧和方法，提升调解工作实务能力。',
    instructor: {
      id: 'inst1',
      name: '王大明',
      title: '资深调解员',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: '调解技能',
    level: 'intermediate',
    duration: '24课时',
    lessons: 12,
    price: 1999,
    rating: 4.8,
    students: 328,
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    tags: ['实务技能', '案例分析', '流程规范'],
    features: ['专家授课', '实战演练', '结业证书']
  },
  {
    id: '2',
    title: '民商事纠纷调解法律实务',
    description: '深入学习民商事纠纷调解相关法律知识，提升法律应用能力。',
    instructor: {
      id: 'inst2',
      name: '李红',
      title: '法学教授',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: '法律知识',
    level: 'advanced',
    duration: '36课时',
    lessons: 18,
    price: 2999,
    rating: 4.9,
    students: 256,
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    tags: ['民商法', '案例分析', '实务指导'],
    features: ['专家授课', '案例研讨', '在线答疑']
  },
  {
    id: '3',
    title: '调解沟通技巧与心理疏导',
    description: '掌握调解沟通技巧，学习心理疏导方法，提升调解成功率。',
    instructor: {
      id: 'inst3',
      name: '张明',
      title: '心理咨询师',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: '沟通技巧',
    level: 'beginner',
    duration: '18课时',
    lessons: 9,
    price: 1599,
    rating: 4.7,
    students: 412,
    coverImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    tags: ['沟通技巧', '心理疏导', '案例分析'],
    features: ['专家授课', '互动练习', '结业证书']
  }
];