import React, { useEffect, useState } from 'react';
import { VolcanoASRService } from '../../lib/services/volcanoService';

interface ASRMonitorProps {
  callId: string;
  onRecognitionResult?: (text: string) => void;
}

export const ASRMonitor: React.FC<ASRMonitorProps> = ({ callId, onRecognitionResult }) => {
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let asrService: VolcanoASRService | null = null;

    const initializeASR = async () => {
      setStatus('connecting');
      try {
        asrService = new VolcanoASRService({
          mode: 'stream',
          onResult: (text, isFinal) => {
            setRecognizedText(text);
            if (isFinal && onRecognitionResult) {
              onRecognitionResult(text);
            }
          },
          onError: (err) => {
            setError(err.message);
            setStatus('error');
          }
        });

        await asrService.connect();
        setStatus('active');
      } catch (err) {
        setError(err instanceof Error ? err.message : '连接失败');
        setStatus('error');
      }
    };

    initializeASR();

    return () => {
      if (asrService) {
        asrService.disconnect();
      }
    };
  }, [callId, onRecognitionResult]);

  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">语音识别监控</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
          status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status === 'active' ? '运行中' :
           status === 'connecting' ? '连接中' :
           status === 'error' ? '错误' :
           '空闲'}
        </span>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-3 rounded min-h-[100px] max-h-[200px] overflow-y-auto">
        {recognizedText || '等待语音输入...'}
      </div>
    </div>
  );
};
