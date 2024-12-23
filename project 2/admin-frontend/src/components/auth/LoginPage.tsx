import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '../common/loading-spinner';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, isAuthenticated, setError, setLoading } = useAuth();

  // Add loading state timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (loading) {
      timeoutId = setTimeout(() => {
        setError('登录请求超时，请刷新页面重试');
        setLoading(false);
      }, 15000);  // 15 second timeout
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, setError, setLoading]);

  // Debug logging effect
  useEffect(() => {
    console.log('LoginPage state:', {
      isAuthenticated,
      error,
      loading,
      hasUsername: Boolean(username),
      hasPassword: Boolean(password),
      timestamp: new Date().toISOString()
    });

    return () => {
      if (loading || error) {
        console.log('LoginPage unmounting - cleaning up states');
        setLoading(false);
        setError(null);
      }
    };
  }, [isAuthenticated, error, loading, setError, setLoading, username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', {
      username,
      timestamp: new Date().toISOString(),
      hasError: Boolean(error),
      isLoading: loading
    });
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {isAuthenticated ? (
        <Navigate to="/admin/dashboard" replace />
      ) : (
        <Card className="w-[400px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">金牌调解员平台</CardTitle>
            <p className="text-sm text-muted-foreground text-center">管理员登录</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                  data-devinid="username"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  data-devinid="password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-devinid="login-button"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    登录中...
                  </>
                ) : (
                  '登录'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoginPage;
