import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--fg-primary)', color: 'var(--bg-primary)', paddingBottom: '3rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(245,243,239,0.1)' }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>AVIOX</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.4)', marginBottom: '1.5rem' }}>Study Beyond Degrees</div>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(245,243,239,0.4)', maxWidth: '280px' }}>
              Empowering students with practical skills and real-world opportunities to build a future beyond their degree.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href="https://wa.me/918921757960" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'rgba(245,243,239,0.6)', textDecoration: 'none' }}>+91 8921757960</a>
              <span style={{ color: 'rgba(245,243,239,0.2)' }}>·</span>
              <a href="mailto:futureaviox@gmail.com" style={{ fontSize: '0.75rem', color: 'rgba(245,243,239,0.6)', textDecoration: 'none' }}>futureaviox@gmail.com</a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.3)', marginBottom: '1.25rem' }}>Programs</div>
            {['Artificial Intelligence', 'MERN Stack', 'Cybersecurity', 'Data Science', 'UI/UX Design'].map((p) => (
              <div key={p} style={{ marginBottom: '0.625rem' }}>
                <a href="/#programs" style={{ fontSize: '0.8rem', color: 'rgba(245,243,239,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--bg-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,243,239,0.6)')}
                >{p}</a>
              </div>
            ))}
          </div>

          {/* Platform */}
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.3)', marginBottom: '1.25rem' }}>Platform</div>
            {[
              { label: 'Sessions', href: '/#sessions' },
              { label: 'Opportunities', href: '/#opportunities' },
              { label: 'About', href: '/#about' },
              { label: 'Insights', href: '/#insights' },
            ].map((l) => (
              <div key={l.label} style={{ marginBottom: '0.625rem' }}>
                <a href={l.href} style={{ fontSize: '0.8rem', color: 'rgba(245,243,239,0.6)', textDecoration: 'none' }}>{l.label}</a>
              </div>
            ))}
          </div>

          {/* Account */}
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.3)', marginBottom: '1.25rem' }}>Account</div>
            {[
              { label: 'Register', href: '/register' },
              { label: 'Login', href: '/login' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Support', href: '/dashboard' },
            ].map((l) => (
              <div key={l.label} style={{ marginBottom: '0.625rem' }}>
                <Link to={l.href} style={{ fontSize: '0.8rem', color: 'rgba(245,243,239,0.6)', textDecoration: 'none' }}>{l.label}</Link>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(245,243,239,0.3)' }}>
            © {new Date().getFullYear()} AVIOX. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ fontSize: '0.7rem', color: 'rgba(245,243,239,0.3)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: '0.7rem', color: 'rgba(245,243,239,0.3)', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
