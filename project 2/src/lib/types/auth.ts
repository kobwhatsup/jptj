// 用户认证相关类型定义
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'mediator' | 'expert' | 'user';
  avatar?: string;
  profile?: {
    name: string;
    location?: string;
    organization?: string;
    title?: string;
    expertise?: string[];
  };
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'mediator' | 'expert' | 'user';
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}