import React, { useState, useEffect, useRef } from 'react';
import { volcanoService } from '../../lib/services/volcanoService';

interface ConversationState {
  status: 'idle' | 'listening' | 'processing' | 'speaking';
  currentText: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
}

interface AudioStreamConfig {
  sampleRate: number;
  channels: number;
  bitDepth: number;
}

export const ConversationManager: React.FC = () => {
  const [state, setState] = useState<ConversationState>({
    status: 'idle',
    currentText: '',
    history: []
  });

  const audioContext = useRef<AudioContext | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioQueue = useRef<ArrayBuffer[]>([]);
  const isProcessing = useRef<boolean>(false);

  // 音频流配置
  const streamConfig: AudioStreamConfig = {
    sampleRate: 16000,
    channels: 1,
    bitDepth: 16
  };

  useEffect(() => {
    initializeAudio();
    return () => {
      cleanupAudio();
    };
  }, []);

  /**
   * 初始化音频系统
   */
  const initializeAudio = async () => {
    try {
      audioContext.current = new AudioContext({
        sampleRate: streamConfig.sampleRate,
        latencyHint: 'interactive'
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: streamConfig.channels,
          sampleRate: streamConfig.sampleRate,
          sampleSize: streamConfig.bitDepth
        }
      });

      setupMediaRecorder(stream);
    } catch (error) {
      console.error('音频系统初始化失败:', error);
    }
  };

  /**
   * 设置媒体录音器
   */
  const setupMediaRecorder = (stream: MediaStream) => {
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
        await processAudioChunk(event.data);
      }
    };

    // 每100ms处理一次音频数据，实现低延迟
    mediaRecorder.current.start(100);
  };

  /**
   * 处理音频数据块
   */
  const processAudioChunk = async (chunk: Blob) => {
    if (isProcessing.current) {
      // 如果正在处理，将数据加入队列
      const buffer = await chunk.arrayBuffer();
      audioQueue.current.push(buffer);
      return;
    }

    isProcessing.current = true;
    try {
      const buffer = await chunk.arrayBuffer();
      const result = await volcanoService.speechToText(buffer);

      if (result.confidence > 0.7) {
        setState(prev => ({
          ...prev,
          currentText: result.text,
          status: 'processing'
        }));

        // 生成对话响应
        const response = await volcanoService.generateDialogueResponse(
          result.text,
          '', // 上下文可以从知识库获取
          state.history
        );

        // 合成语音
        const speech = await volcanoService.textToSpeech(response.text);

        // 播放合成的语音
        await playAudioResponse(speech.audioData);

        // 更新对话历史
        setState(prev => ({
          ...prev,
          status: 'idle',
          history: [
            ...prev.history,
            {
              role: 'user',
              content: result.text,
              timestamp: Date.now()
            },
            {
              role: 'assistant',
              content: response.text,
              timestamp: Date.now()
            }
          ]
        }));
      }
    } catch (error) {
      console.error('音频处理错误:', error);
      setState(prev => ({ ...prev, status: 'idle' }));
    } finally {
      isProcessing.current = false;
      // 处理队列中的下一个音频块
      if (audioQueue.current.length > 0) {
        const nextBuffer = audioQueue.current.shift()!;
        await processAudioChunk(new Blob([nextBuffer]));
      }
    }
  };

  /**
   * 播放音频响应
   */
  const playAudioResponse = async (audioData: ArrayBuffer) => {
    if (!audioContext.current) return;

    setState(prev => ({ ...prev, status: 'speaking' }));
    try {
      const audioBuffer = await audioContext.current.decodeAudioData(audioData);
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.current.destination);
      
      source.onended = () => {
        setState(prev => ({ ...prev, status: 'idle' }));
      };

      source.start();
    } catch (error) {
      console.error('音频播放错误:', error);
      setState(prev => ({ ...prev, status: 'idle' }));
    }
  };

  /**
   * 清理音频系统
   */
  const cleanupAudio = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">实时对话</h2>
        <p className="text-gray-600">状态: {state.status}</p>
      </div>

      {/* 当前识别文本 */}
      {state.currentText && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p>{state.currentText}</p>
        </div>
      )}

      {/* 对话历史 */}
      <div className="space-y-4">
        {state.history.map((entry, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              entry.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
            }`}
          >
            <p className="font-semibold">{entry.role === 'user' ? '用户' : '助手'}</p>
            <p>{entry.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
