// 行业动态类型定义
export interface IndustryNews {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: IndustryCategory;
  publishDate: string;
  source: string;
  author: string;
  views: number;
  tags: string[];
  imageUrl?: string;
}

export type IndustryCategory = 
  | '行业要闻'
  | '发展趋势'
  | '经验分享'
  | '活动报道'
  | '人物访谈';