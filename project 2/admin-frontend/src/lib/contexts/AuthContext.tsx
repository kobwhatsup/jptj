import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface ErrorResponse {
  detail: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    console.log('Starting login process...');
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post<LoginResponse>('/api/v1/auth/login',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('adminToken', access_token);
        console.log('Token stored in localStorage');
        setIsAuthenticated(true);
        console.log('Authentication state updated');
        navigate('/dashboard');
        console.log('Navigating to dashboard');
      } else {
        throw new Error('未收到访问令牌');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const errorData = (err.response as any).data as ErrorResponse;
        setError(errorData.detail || '登录失败');
      } else if (err instanceof Error) {
        setError(err.message || '登录失败');
      } else {
        setError('登录失败');
      }
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, error, login, logout }}>
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

export default AuthContext;
