import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Admin authenticated successfully.');
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', background: 'rgba(245,243,239,0.1)', marginBottom: '1.5rem' }}>
            <Shield size={20} color="#F5F3EF" />
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', color: 'var(--bg-primary)' }}>AVIOX</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.4)', marginTop: '0.25rem' }}>
            Admin Portal
          </div>
        </div>

        <div style={{ background: 'rgba(245,243,239,0.05)', border: '1px solid rgba(245,243,239,0.1)', padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.5)', marginBottom: '0.5rem' }}>
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aviox.com"
                required
                style={{
                  width: '100%', padding: '0.875rem 1rem',
                  background: 'rgba(245,243,239,0.05)', border: '1px solid rgba(245,243,239,0.15)',
                  color: 'var(--bg-primary)', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.5)', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '0.875rem 2.5rem 0.875rem 1rem',
                    background: 'rgba(245,243,239,0.05)', border: '1px solid rgba(245,243,239,0.15)',
                    color: 'var(--bg-primary)', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,243,239,0.4)', display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.875rem', background: 'var(--bg-primary)', border: 'none',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.75rem',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-primary)',
                cursor: 'pointer', opacity: isLoading ? 0.7 : 1, marginTop: '0.5rem',
              }}
            >
              {isLoading ? 'Authenticating...' : <>Access Dashboard <ArrowRight size={14} /></>}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(245,243,239,0.1)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(245,243,239,0.3)' }}>
              Unauthorized access is monitored and logged.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.7rem', color: 'rgba(245,243,239,0.3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <ArrowLeft size={12} /> Back to AVIOX
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
