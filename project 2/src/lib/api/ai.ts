import axios from 'axios';

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';

interface GenerateDesignResponse {
  success: boolean;
  image_url: string;
}

export async function generateDesign(prompt: string): Promise<string> {
  try {
    const response = await axios.post<GenerateDesignResponse>(
      `${AI_API_BASE_URL}/generate-design`,
      { prompt },
      { timeout: 10000 } // 10秒超时
    );

    if (response.data.success && response.data.image_url) {
      return response.data.image_url;
    }
    
    console.error('生成设计失败：返回数据格式不正确');
    return '';
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      console.error('生成设计超时');
    } else {
      console.error('生成设计失败：', error);
    }
    return '';
  }
}
