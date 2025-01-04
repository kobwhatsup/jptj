import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { generateDesign } from '../lib/api/ai';
import { Loader2 } from 'lucide-react';

export default function AIDesigner() {
  const [prompt, setPrompt] = useState('');
  const [iterationPrompt, setIterationPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [error, setError] = useState('');
  const [previousPrompts, setPreviousPrompts] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入设计描述');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const imageUrl = await generateDesign(prompt);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
        setPreviousPrompts([...previousPrompts, prompt]);
      } else {
        setError('生成设计失败，请重试');
      }
    } catch (err) {
      setError('生成设计时发生错误，请重试');
      console.error('设计生成错误:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIterate = async () => {
    if (!iterationPrompt.trim()) {
      setError('请输入迭代描述');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const combinedPrompt = [...previousPrompts, iterationPrompt].join(' 并且 ');
      const imageUrl = await generateDesign(combinedPrompt);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
        setPreviousPrompts([...previousPrompts, iterationPrompt]);
        setIterationPrompt('');
      } else {
        setError('生成设计失败，请重试');
      }
    } catch (err) {
      setError('生成设计时发生错误，请重试');
      console.error('设计生成错误:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI T恤设计师</h1>
      
      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              描述你想要的T恤设计
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一只可爱的熊猫在竹林中玩耍"
              className="w-full"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                正在生成...
              </>
            ) : (
              '生成设计'
            )}
          </Button>
        </div>
      </Card>

      {generatedImage && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">生成的设计</h2>
          <img
            src={generatedImage}
            alt="AI生成的T恤设计"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg mb-6"
          />
          
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">优化设计</h3>
            {previousPrompts.length > 0 && (
              <div className="text-sm text-gray-600 mb-2">
                已使用的描述：{previousPrompts.join(' → ')}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={iterationPrompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIterationPrompt(e.target.value)}
                placeholder="添加更多细节来优化设计..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                onClick={handleIterate}
                disabled={loading || !iterationPrompt.trim()}
                className="whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    优化中...
                  </>
                ) : (
                  '优化设计'
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
