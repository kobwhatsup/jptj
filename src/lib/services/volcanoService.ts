import { VOLCANO_CONFIG } from '../config/volcano';

interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  segments: Array<{
    text: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }>;
}

interface SpeechSynthesisResult {
  audioData: ArrayBuffer;
  duration: number;
}

interface DialogueResponse {
  text: string;
  intent: string;
  confidence: number;
  entities: Array<{
    name: string;
    value: string;
    confidence: number;
  }>;
}

export class VolcanoService {
  private config = VOLCANO_CONFIG;

  /**
   * 语音识别 - 将语音转换为文本
   */
  async speechToText(audioData: ArrayBuffer): Promise<SpeechRecognitionResult> {
    try {
      const response = await fetch(`${this.config.MODEL_ENDPOINT}/asr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.API_KEY}`
        },
        body: JSON.stringify({
          audio: Buffer.from(audioData).toString('base64'),
          config: {
            model: 'volcano-asr-v2',
            language: 'zh',
            enablePunctuation: true,
            enableTimestamps: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`语音识别失败: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('语音识别错误:', error);
      throw error;
    }
  }

  /**
   * 语音合成 - 将文本转换为语音
   */
  async textToSpeech(text: string): Promise<SpeechSynthesisResult> {
    try {
      const response = await fetch(`${this.config.MODEL_ENDPOINT}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.API_KEY}`
        },
        body: JSON.stringify({
          text,
          config: {
            model: 'volcano-tts-v2',
            language: 'zh',
            voice: 'professional-female',
            speed: 1.0,
            pitch: 1.0
          }
        })
      });

      if (!response.ok) {
        throw new Error(`语音合成失败: ${response.statusText}`);
      }

      const audioData = await response.arrayBuffer();
      const duration = await this.getAudioDuration(audioData);

      return {
        audioData,
        duration
      };
    } catch (error) {
      console.error('语音合成错误:', error);
      throw error;
    }
  }

  /**
   * 自然对话 - 使用火山方舟大模型生成对话响应
   */
  async generateDialogueResponse(
    userInput: string,
    context: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<DialogueResponse> {
    try {
      const response = await fetch(`${this.config.MODEL_ENDPOINT}/dialogue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.API_KEY}`
        },
        body: JSON.stringify({
          input: userInput,
          context,
          history,
          config: {
            model: 'volcano-dialogue-v2',
            temperature: 0.7,
            maxTokens: 1024,
            topP: 0.9
          }
        })
      });

      if (!response.ok) {
        throw new Error(`对话生成失败: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('对话生成错误:', error);
      throw error;
    }
  }

  /**
   * 获取音频时长
   */
  private async getAudioDuration(audioData: ArrayBuffer): Promise<number> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([audioData], { type: 'audio/wav' });
      const audio = new Audio();
      audio.src = URL.createObjectURL(blob);

      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
        URL.revokeObjectURL(audio.src);
      });

      audio.addEventListener('error', () => {
        reject(new Error('无法获取音频时长'));
        URL.revokeObjectURL(audio.src);
      });
    });
  }
}

export const volcanoService = new VolcanoService();
