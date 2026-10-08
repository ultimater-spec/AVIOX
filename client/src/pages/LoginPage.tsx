import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Successfully logged in.');
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '4fr 6fr' }}>
      {/* Left - Brand */}
      <div style={{ background: 'var(--fg-primary)', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--bg-primary)' }}>
          <ArrowLeft size={16} />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Back to AVIOX</span>
        </Link>

        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(3rem, 6vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--bg-primary)', marginBottom: '1.5rem' }}>
            AVIOX
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.4)', marginBottom: '3rem' }}>
            Study Beyond Degrees
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.8, color: 'rgba(245,243,239,0.5)', maxWidth: '320px' }}>
            Access your dashboard, track sessions, explore opportunities, and get AI-powered career guidance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Programs', 'Sessions', 'Career', 'AI'].map((item) => (
            <span key={item} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.3)' }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Right - Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: 'var(--bg-primary)' }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="section-label" style={{ marginBottom: '0.75rem' }}>Welcome Back</span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>Sign In</h1>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="input-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Signing In...' : <>Sign In <ArrowRight size={14} /></>}
            </button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--fg-primary)', fontWeight: 600, textDecoration: 'none' }}>
                Register for free
              </Link>
            </p>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/admin/login" style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', textDecoration: 'none' }}>
              Admin Login →
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`@media (max-width: 768px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } div[style*="background: var(--fg-primary)"] { display: none; } }`}</style>
    </div>
  );
};

export default LoginPage;
