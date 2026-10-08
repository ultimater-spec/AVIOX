import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
  { label: 'Contains uppercase', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Contains special character', test: (p: string) => /[!@#$%^&*]/.test(p) },
];

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ username: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    if (!form.username || form.username.length < 3) return 'Username must be at least 3 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email.';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return 'Please enter a valid 10-digit Indian mobile number.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { toast.error(validationError); return; }
    setIsLoading(true);
    try {
      await register({ username: form.username, email: form.email, mobile: form.mobile, password: form.password });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.25rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '480px' }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--fg-muted)', marginBottom: '2.5rem' }}>
            <ArrowLeft size={14} />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>AVIOX</span>
          </Link>
          <span className="section-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Create Account</span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>Join AVIOX</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginTop: '0.75rem' }}>Start your journey beyond your degree. Free forever.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="input-label" htmlFor="reg-username">Username</label>
              <input id="reg-username" type="text" className="input" value={form.username} onChange={set('username')} placeholder="yourname" required />
            </div>
            <div>
              <label className="input-label" htmlFor="reg-mobile">Mobile</label>
              <input id="reg-mobile" type="tel" className="input" value={form.mobile} onChange={set('mobile')} placeholder="9876543210" required maxLength={10} />
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="reg-email">Email Address</label>
            <input id="reg-email" type="email" className="input" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
          </div>

          <div>
            <label className="input-label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', display: 'flex' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password strength */}
            {form.password && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {passwordRules.map((rule) => {
                  const passes = rule.test(form.password);
                  return (
                    <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.7rem', color: passes ? '#16A34A' : 'var(--fg-muted)' }}>
                      {passes ? <Check size={11} /> : <X size={11} />}
                      {rule.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="input-label" htmlFor="reg-confirm">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                className="input"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="••••••••"
                required
                style={{ paddingRight: '2.5rem', borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#EF4444' : undefined }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', display: 'flex' }}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Creating Account...' : <>Create Account <ArrowRight size={14} /></>}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--fg-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
