import { ForumPost } from '../types/forum';

export const forumPosts: ForumPost[] = [
  {
    id: '1',
    title: '如何提高商事调解的成功率？',
    content: '基于多年商事调解经验，分享几点提高调解成功率的心得...',
    summary: '资深调解员分享商事调解技巧和经验，帮助提升调解效果。',
    category: '经验交流',
    publishDate: '2024-03-15',
    author: {
      id: 'user1',
      name: '张志强',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: 'mediator'
    },
    stats: {
      views: 1250,
      likes: 86,
      comments: 32
    },
    tags: ['商事调解', '经验分享', '调解技巧']
  },
  {
    id: '2',
    title: '一起物业纠纷调解案例分析',
    content: '近期处理的一起物业纠纷案例，从中总结经验教训...',
    summary: '详细分析物业纠纷调解案例，探讨调解要点和解决方案。',
    category: '案例分享',
    publishDate: '2024-03-14',
    author: {
      id: 'user2',
      name: '李红',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: 'expert'
    },
    stats: {
      views: 980,
      likes: 65,
      comments: 28
    },
    tags: ['物业纠纷', '案例分析', '实务技巧']
  },
  {
    id: '3',
    title: '新版《调解协议》模板使用指南',
    content: '详细解读新版调解协议模板的重点条款及注意事项...',
    summary: '全面介绍新版调解协议模板的使用方法和注意事项。',
    category: '技能提升',
    publishDate: '2024-03-13',
    author: {
      id: 'user3',
      name: '王建国',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: 'mediator'
    },
    stats: {
      views: 1560,
      likes: 120,
      comments: 45
    },
    tags: ['调解协议', '文书制作', '实务指南']
  }
];