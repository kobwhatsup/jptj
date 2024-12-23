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
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios defaults
const apiUrl = import.meta.env.VITE_API_URL;
console.log('API URL from env:', apiUrl);

if (!apiUrl) {
  console.error('API URL not found in environment variables');
  throw new Error('API URL not configured. Please check environment variables.');
}

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Connection': 'keep-alive',
    'Keep-Alive': 'timeout=60, max=1000'
  },
  timeout: 10000 // 10 second timeout
});

console.log('Axios client configured with baseURL:', apiClient.defaults.baseURL);

// Custom type guard for Axios errors
interface AxiosErrorResponse {
  response?: {
    status?: number;
    data?: any;
  };
  code?: string;
  message?: string;
}

function isAxiosError(error: unknown): error is AxiosErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'code' in error || 'message' in error)
  );
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize authentication state
  React.useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      apiClient.interceptors.request.use((config) => {
        const newConfig = { ...config };
        if (!newConfig.headers) {
          newConfig.headers = {};
        }
        newConfig.headers.Authorization = `Bearer ${token}`;
        return newConfig;
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    console.log('Starting login process...');
    if (loading) {
      console.log('Login already in progress, returning...');
      return;
    }

    let retryCount = 0;
    const maxRetries = 3;        // Increased from 2 to 3
    const retryDelay = 2000;     // Increased from 1000 to 2000ms
    const backoffFactor = 1.5;   // Added exponential backoff factor

    const attemptLogin = async () => {
      try {
        console.log(`Login attempt ${retryCount + 1}/${maxRetries + 1}`);
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await apiClient.post<LoginResponse>(
          '/api/v1/auth/login',
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        return response;
      } catch (error: unknown) {
        if (isAxiosError(error) &&
            (error.code === 'ECONNABORTED' ||
             error.message?.includes('timeout') ||
             (error.response?.status && error.response.status >= 500)) &&
            retryCount < maxRetries) {
          retryCount++;
          const currentDelay = retryDelay * Math.pow(backoffFactor, retryCount - 1);
          console.log(`Retrying login after ${currentDelay}ms (attempt ${retryCount + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, currentDelay));
          return attemptLogin();
        }
        throw error;
      }
    };

    setLoading(true);
    setError(null);

    try {
      const response = await attemptLogin();
      console.log('Login response:', response);
      const { access_token } = response.data;

      if (access_token) {
        localStorage.setItem('adminToken', access_token);
        console.log('Token stored in localStorage');

        apiClient.interceptors.request.use((config) => {
          const newConfig = { ...config };
          if (!newConfig.headers) {
            newConfig.headers = {};
          }
          newConfig.headers.Authorization = `Bearer ${access_token}`;
          return newConfig;
        });

        setIsAuthenticated(true);
        console.log('Authentication state updated');
        navigate('/admin/dashboard');
        console.log('Navigation triggered');
      } else {
        throw new Error('未收到访问令牌');
      }
    } catch (error) {
      console.error('Login error details:', error);

      if (isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setError('服务器连接超时，正在重试...');
        } else if (error.response?.status === 401) {
          setError('用户名或密码错误，请重新输入');
        } else if (error.response?.status === 429) {
          setError('登录请求过于频繁，请等待1分钟后重试');
        } else if (error.response?.status && error.response.status >= 500) {
          setError('服务器暂时无法响应，系统正在恢复中...');
        } else if (error.response?.data) {
          const errorData = error.response.data as ErrorResponse;
          setError(errorData.detail || '登录失败，请重试');
        } else {
          setError('登录失败，请稍后重试');
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('登录失败，请稍后重试');
      }

      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    } finally {
      console.log('Login process completed, resetting loading state');
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, error, login, logout, setError, setLoading }}>
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
