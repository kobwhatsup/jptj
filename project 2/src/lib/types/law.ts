// 法律法规类型定义
export interface Law {
  id: string;
  title: string;
  content: string;
  category: LawCategory;
  publishDate: string;
  effectiveDate: string;
  department: string;
  level: LawLevel;
  status: 'active' | 'expired' | 'draft';
}

export type LawCategory = 
  | '民事调解'
  | '商事调解'
  | '劳动争议调解'
  | '行政调解'
  | '基层调解';

export type LawLevel = 
  | '法律'
  | '行政法规'
  | '部门规章'
  | '地方性法规'
  | '司法解释';