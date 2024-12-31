import React, { useState } from 'react';
import { ASRMonitor } from '../asr/ASRMonitor';

export const ConversationManager: React.FC = () => {
  const [conversations, setConversations] = useState<Array<{id: string, text: string}>>([]);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [currentCallId] = useState(() => Date.now().toString());

  const handleRecognitionResult = (text: string) => {
    setRecognizedText(text);
    if (text.trim()) {
      setConversations(prev => [...prev, { id: Date.now().toString(), text }]);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">对话管理</h1>
      <ASRMonitor callId={currentCallId} onRecognitionResult={handleRecognitionResult} />
      <div className="mt-4" data-testid="conversation-context">
        <h2 className="text-xl font-semibold mb-2">实时识别</h2>
        <div className="p-2 bg-gray-50 rounded min-h-[50px]">
          {recognizedText || '等待语音输入...'}
        </div>
        <h2 className="text-xl font-semibold mt-4 mb-2">对话历史</h2>
        <div className="space-y-2">
          {conversations.map(conv => (
            <div key={conv.id} className="p-2 bg-gray-50 rounded">
              {conv.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
