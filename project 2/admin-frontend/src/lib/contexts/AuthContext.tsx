import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('adminToken');
    console.log('Initial auth check - token exists:', !!token);
    return !!token;
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // We'll use location later for redirect after login
  // const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log('Auth state effect - token exists:', !!token);
    setIsAuthenticated(!!token);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    if (loading) {
      console.log('Login already in progress, skipping...');
      return;
    }
    console.log('Starting login process...');
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('grant_type', 'password');

      const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/auth/login`;
      console.log('Sending login request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        credentials: 'include',
        mode: 'cors',
      });

      console.log('Received response:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || '登录失败');
      }

      if (!data.access_token) {
        console.error('No access token in response:', data);
        throw new Error('登录失败：无效的响应格式');
      }

      console.log('Login successful, storing token...');
      localStorage.setItem('adminToken', data.access_token);
      setIsAuthenticated(true);
      console.log('Authentication state updated, navigating...');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : '登录失败，请检查用户名和密码');
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    } finally {
      console.log('Login process completed');
      setLoading(false);
    }
  }, [navigate, loading]);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
