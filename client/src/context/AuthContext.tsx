import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface User {
  _id: string;
  username: string;
  email: string;
  mobile: string;
  dob?: string;
  maritalStatus?: string;
  place?: string;
  pincode?: string;
  isMobileVerified?: boolean;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; mobile: string; password: string }) => Promise<void>;
  updateUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('aviox_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('aviox_token');
      if (savedToken) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.data.user);
        } catch {
          localStorage.removeItem('aviox_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = data.data;
    localStorage.setItem('aviox_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (formData: { username: string; email: string; mobile: string; password: string }) => {
    const { data } = await api.post('/auth/register', formData);
    const { token: newToken, user: newUser } = data.data;
    localStorage.setItem('aviox_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('aviox_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
