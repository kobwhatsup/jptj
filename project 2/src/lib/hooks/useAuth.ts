import { useState, useCallback } from 'react';
import { AuthUser, LoginForm, RegisterForm } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功登录
      const mockUser: AuthUser = {
        id: '1',
        username: 'test_user',
        email: data.email,
        role: 'mediator',
        profile: {
          name: '张三',
          location: '北京',
          organization: '某调解委员会',
          title: '高级调解员',
          expertise: ['民事调解', '商事调解']
        }
      };
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return mockUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterForm) => {
    setLoading(true);
    setError(null);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功注册
      const mockUser: AuthUser = {
        id: '1',
        username: data.username,
        email: data.email,
        role: data.role,
        profile: {
          name: data.username,
        }
      };
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return mockUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};