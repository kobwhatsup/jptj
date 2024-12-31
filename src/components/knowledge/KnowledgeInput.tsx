import React, { useState } from 'react';
import { TextKnowledgeInput, DocumentKnowledgeInput, LinkKnowledgeInput } from '../../lib/types/knowledge';
import { knowledgeAPI } from '../../lib/api/knowledge';

interface KnowledgeInputProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export const KnowledgeInput: React.FC<KnowledgeInputProps> = ({ onSuccess, onError }) => {
  const [inputType, setInputType] = useState<'text' | 'document' | 'link'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (inputType) {
        case 'text': {
          const input: TextKnowledgeInput = {
            title,
            content,
            category,
            tags,
          };
          await knowledgeAPI.addTextKnowledge(input);
          break;
        }
        case 'document': {
          if (!file) return;
          const input: DocumentKnowledgeInput = {
            title,
            file,
            category,
            tags,
          };
          await knowledgeAPI.addDocumentKnowledge(input);
          break;
        }
        case 'link': {
          const input: LinkKnowledgeInput = {
            title,
            url,
            category,
            tags,
          };
          await knowledgeAPI.addLinkKnowledge(input);
          break;
        }
      }
      onSuccess();
      // Reset form
      setTitle('');
      setContent('');
      setCategory('');
      setTags([]);
      setFile(null);
      setUrl('');
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <select
          value={inputType}
          onChange={(e) => setInputType(e.target.value as 'text' | 'document' | 'link')}
          className="w-full p-2 border rounded"
        >
          <option value="text">文本输入</option>
          <option value="document">文档上传</option>
          <option value="link">链接导入</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {inputType === 'text' && (
          <textarea
            placeholder="输入知识内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
          />
        )}

        {inputType === 'document' && (
          <input
            type="file"
            onChange={(e) => setFile(e.files?.[0] || null)}
            className="w-full p-2 border rounded"
            required
          />
        )}

        {inputType === 'link' && (
          <input
            type="url"
            placeholder="输入链接地址"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        )}

        <input
          type="text"
          placeholder="分类"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="标签（用逗号分隔）"
          value={tags.join(',')}
          onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          提交
        </button>
      </form>
    </div>
  );
};
