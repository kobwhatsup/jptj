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
  },
  timeout: 10000, // 10 second timeout
});

console.log('Axios client configured with baseURL:', apiClient.defaults.baseURL);

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
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      console.log('Making login request to:', `${apiClient.defaults.baseURL}/api/v1/auth/login`);
      const response = await apiClient.post<LoginResponse>(
        '/api/v1/auth/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

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
    } catch (error: unknown) {
      console.error('Login error details:', error);

      // Type guard for axios error response
      type AxiosErrorResponse = {
        response?: {
          status?: number;
          data?: ErrorResponse;
        };
        code?: string;
        message?: string;
      };

      const axiosError = error as AxiosErrorResponse;

      if (axiosError.code === 'ECONNABORTED') {
        setError('登录超时，请重试');
      } else if (axiosError.response?.status === 401) {
        setError('用户名或密码错误');
      } else if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        setError(errorData.detail || '登录失败');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('登录失败，请重试');
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
