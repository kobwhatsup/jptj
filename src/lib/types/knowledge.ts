export default {};

export interface KnowledgeSource {
  id: string;
  type: 'text' | 'document' | 'link';
  content: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  sources: KnowledgeSource[];
  createdAt: string;
  updatedAt: string;
}

export interface TextKnowledgeInput {
  content: string;
  title: string;
  tags?: string[];
  category: string;
}

export interface DocumentKnowledgeInput {
  file: File;
  title: string;
  tags?: string[];
  category: string;
}

export interface LinkKnowledgeInput {
  url: string;
  title: string;
  tags?: string[];
  category: string;
}

export interface KnowledgeSearchParams {
  query: string;
  category?: string;
  tags?: string[];
  page: number;
  pageSize: number;
}

export interface KnowledgeSearchResult {
  items: KnowledgeSource[];
  total: number;
  page: number;
  pageSize: number;
}
