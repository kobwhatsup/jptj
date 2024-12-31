import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// 环境变量
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CallStats {
  totalCalls: number;
  activeCalls: number;
  successRate: number;
}

export default function CallManagementPage() {
  const [stats, setStats] = useState<CallStats>({
    totalCalls: 0,
    activeCalls: 0,
    successRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/call-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 每30秒更新一次
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">外呼管理系统</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>总通话数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalCalls}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>当前活跃通话</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeCalls}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>成功率</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.successRate}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
