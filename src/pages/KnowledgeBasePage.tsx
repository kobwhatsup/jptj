import React, { useState, useEffect } from 'react';
import { KnowledgeInput } from '../components/knowledge/KnowledgeInput';
import { KnowledgeSource, KnowledgeSearchResult } from '../lib/types/knowledge';
import { knowledgeAPI } from '../lib/api/knowledge';

const KnowledgeBasePage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<KnowledgeSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const results = await knowledgeAPI.searchKnowledge({
        query: searchQuery,
        page: currentPage,
        pageSize: 10
      });
      setSearchResults(results);
      setError(null);
    } catch (err) {
      setError('搜索知识库时出错');
      console.error(err);
    }
  };

  const handleKnowledgeSuccess = () => {
    // 刷新搜索结果
    handleSearch();
  };

  const handleKnowledgeError = (error: Error) => {
    setError(error.message);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">知识库管理</h1>
      
      {/* 知识输入组件 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">添加知识</h2>
        <KnowledgeInput
          onSuccess={handleKnowledgeSuccess}
          onError={handleKnowledgeError}
        />
      </div>

      {/* 搜索区域 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">知识搜索</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="输入搜索关键词"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            搜索
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 搜索结果 */}
      {searchResults && (
        <div>
          <h2 className="text-xl font-semibold mb-4">搜索结果</h2>
          <div className="space-y-4">
            {searchResults.items.map((item: KnowledgeSource) => (
              <div key={item.id} className="p-4 border rounded">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">类型: {item.type}</span>
                  {item.tags.length > 0 && (
                    <div className="mt-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="mr-2 px-2 py-1 bg-gray-100 text-sm rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-4 py-2">
              第 {currentPage} 页 / 共 {Math.ceil(searchResults.total / searchResults.pageSize)} 页
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage * searchResults.pageSize >= searchResults.total}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBasePage;
