import React, { useState } from 'react';
import { KnowledgeInput } from '../components/knowledge/KnowledgeInput';

export const KnowledgeBasePage: React.FC = () => {
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>([]);

  const handleKnowledgeInput = (input: string) => {
    setKnowledgeBase(prev => [...prev, input]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">知识库管理</h1>
      <KnowledgeInput onSubmit={handleKnowledgeInput} />
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">已录入知识</h2>
        <ul className="space-y-2">
          {knowledgeBase.map((item, index) => (
            <li key={index} className="p-2 bg-gray-50 rounded">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
