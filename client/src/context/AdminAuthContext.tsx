import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { adminApi } from '../api/axios';

interface Admin {
  _id: string;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT_ADMIN';
  isApproved: boolean;
  isActive: boolean;
}

interface AdminAuthContextType {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('aviox_admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('aviox_admin_token');
    const savedAdmin = localStorage.getItem('aviox_admin_data');
    if (savedToken && savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch {
        localStorage.removeItem('aviox_admin_token');
        localStorage.removeItem('aviox_admin_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await adminApi.post('/admin/auth/login', { email, password });
    const { token: newToken, admin: newAdmin } = data.data;
    localStorage.setItem('aviox_admin_token', newToken);
    localStorage.setItem('aviox_admin_data', JSON.stringify(newAdmin));
    setToken(newToken);
    setAdmin(newAdmin);
  };

  const logout = () => {
    localStorage.removeItem('aviox_admin_token');
    localStorage.removeItem('aviox_admin_data');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, isLoading, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
