import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '../common/loading-spinner';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('LoginPage mounted, auth state:', {
      isAuthenticated,
      error,
      loading
    });
  }, [isAuthenticated, error, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted:', { username });
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {isAuthenticated ? (
        <div>Redirecting to dashboard...</div>
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
