import React, { useState } from 'react';

interface KnowledgeInputProps {
  onSubmit: (input: string) => void;
}

export const KnowledgeInput: React.FC<KnowledgeInputProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="knowledge-input" className="block text-sm font-medium text-gray-700">
          输入知识内容
        </label>
        <textarea
          id="knowledge-input"
          data-testid="knowledge-input"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入文字、粘贴文档内容或链接..."
        />
      </div>
      <button
        type="submit"
        data-testid="submit-knowledge"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        提交
      </button>
    </form>
  );
};
