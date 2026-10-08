import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './ui/NotificationDropdown';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/#programs' },
  { label: 'Sessions', href: '/#sessions' },
  { label: 'Opportunities', href: '/#opportunities' },
  { label: 'About', href: '/#about' },
  { label: 'Insights', href: '/#insights' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--fg-primary)' }}>
              AVIOX
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="hidden-mobile">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-muted)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-muted)')}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="hidden-mobile">
            {isAuthenticated ? (
              <>
                <NotificationDropdown isAdmin={false} />
                <Link to="/dashboard" className="btn-ghost" style={{ fontSize: '0.65rem' }}>
                  {user?.username}
                </Link>
                <button onClick={logout} className="btn-ghost" style={{ fontSize: '0.65rem' }}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn-ghost" style={{ fontSize: '0.65rem' }}>Login</Link>
            )}
            <a
              href="https://wa.me/918921757960?text=Hi%20AVIOX!%20I%27d%20like%20to%20know%20more%20about%20your%20programs."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.65rem', padding: '0.625rem 1.25rem', gap: '0.4rem' }}
            >
              Let's Talk <ArrowUpRight size={12} />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--fg-primary)' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              top: '4rem',
              left: 0,
              right: 0,
              background: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border)',
              zIndex: 999,
              padding: '1.5rem 1.25rem 2rem',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderTop: '1px solid var(--border)',
                    padding: '1.25rem 0',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--fg-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Dashboard</Link>
                ) : (
                  <Link to="/login" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
                )}
                <a
                  href="https://wa.me/918921757960?text=Hi%20AVIOX!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Let's Talk
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </>
  );
};

export default Navbar;
