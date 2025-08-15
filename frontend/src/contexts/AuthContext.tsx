import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isVIP: boolean;
  avatar?: string;
  bio?: string;
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string, invitationCode?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVIP: boolean;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化时检查本地存储的认证信息
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // 验证token有效性
          // await authAPI.getCurrentUser();
        } catch (error) {
          // Token无效，清除本地存储
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  // 登录函数
  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);
      const { token, user } = response.data;
      
      // 保存到状态和本地存储
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      throw error;
    }
  };

  // 注册函数
  const register = async (username: string, password: string, email: string, invitationCode?: string) => {
    try {
      await authAPI.register(username, password, email, invitationCode);
      // 注册成功后自动登录
      await login(username, password);
    } catch (error) {
      throw error;
    }
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // 计算认证状态
  const isAuthenticated = !!user && !!token;
  const isAdmin = isAuthenticated && user?.isAdmin;
  const isVIP = isAuthenticated && user?.isVIP;

  // 上下文值
  const contextValue: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isVIP
  };

  // 加载期间不渲染子组件
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义hook用于访问认证上下文
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;