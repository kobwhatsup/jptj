import { KnowledgeBase, KnowledgeSource, TextKnowledgeInput, DocumentKnowledgeInput, LinkKnowledgeInput, KnowledgeSearchParams, KnowledgeSearchResult } from '../types/knowledge';

class KnowledgeAPI {
  private baseUrl = '/api/knowledge';

  // 添加文本知识
  async addTextKnowledge(input: TextKnowledgeInput): Promise<KnowledgeSource> {
    const response = await fetch(`${this.baseUrl}/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    const source = await response.json();
    
    // 处理知识
    const { knowledgeProcessor } = await import('../services/knowledgeProcessor');
    const result = await knowledgeProcessor.processKnowledge(source);
    
    if (result.status === 'failure') {
      throw new Error(result.error);
    }
    
    return source;
  }

  // 添加文档知识
  async addDocumentKnowledge(input: DocumentKnowledgeInput): Promise<KnowledgeSource> {
    const formData = new FormData();
    formData.append('file', input.file);
    formData.append('title', input.title);
    formData.append('category', input.category);
    if (input.tags) {
      formData.append('tags', JSON.stringify(input.tags));
    }

    const response = await fetch(`${this.baseUrl}/document`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  // 添加链接知识
  async addLinkKnowledge(input: LinkKnowledgeInput): Promise<KnowledgeSource> {
    const response = await fetch(`${this.baseUrl}/link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return response.json();
  }

  // 搜索知识
  async searchKnowledge(params: KnowledgeSearchParams): Promise<KnowledgeSearchResult> {
    const queryParams = new URLSearchParams({
      query: params.query,
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
    });

    if (params.category) {
      queryParams.append('category', params.category);
    }
    if (params.tags) {
      queryParams.append('tags', JSON.stringify(params.tags));
    }

    const response = await fetch(`${this.baseUrl}/search?${queryParams}`);
    return response.json();
  }

  // 获取知识库详情
  async getKnowledgeBase(id: string): Promise<KnowledgeBase> {
    const response = await fetch(`${this.baseUrl}/base/${id}`);
    return response.json();
  }

  // 删除知识源
  async deleteKnowledgeSource(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/source/${id}`, {
      method: 'DELETE',
    });
  }

  // 更新知识源
  async updateKnowledgeSource(id: string, updates: Partial<KnowledgeSource>): Promise<KnowledgeSource> {
    const response = await fetch(`${this.baseUrl}/source/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return response.json();
  }
}

export const knowledgeAPI = new KnowledgeAPI();
