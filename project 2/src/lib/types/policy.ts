// 政策解读类型定义
export interface Policy {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: PolicyCategory;
  publishDate: string;
  department: string;
  author: string;
  relatedLaws: string[];
  tags: string[];
}

export type PolicyCategory = 
  | '最新政策'
  | '重点解读'
  | '实务指南'
  | '案例分析'
  | '专家观点';