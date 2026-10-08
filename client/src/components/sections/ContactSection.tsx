import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookSession } from '../../hooks/useBookSession';

const ContactSection: React.FC = () => {
  const handleBookSession = useBookSession();
  return (
    <section id="contact" className="section" style={{ background: 'var(--fg-primary)' }}>
      <div className="container">
        {/* CTA */}
        <div style={{ textAlign: 'center', paddingBottom: '6rem', borderBottom: '1px solid rgba(245,243,239,0.1)' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: 'var(--bg-primary)',
              marginBottom: '2rem',
            }}>
              BUILD YOUR<br />FUTURE.
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(245,243,239,0.5)', maxWidth: '400px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
              Join thousands of students who are building beyond their degrees. Start your journey with AVIOX today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  background: 'var(--bg-primary)', color: 'var(--fg-primary)',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.75rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                Explore AVIOX <ArrowUpRight size={14} />
              </Link>
              <button
                onClick={(e) => handleBookSession(e, "Hi AVIOX! I would like to book a session.")}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  background: 'transparent', color: 'var(--bg-primary)',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.75rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  border: '1px solid rgba(245,243,239,0.3)', textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--bg-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,243,239,0.3)'; }}
              >
                Book a Session <ArrowUpRight size={14} />
              </button>
              <a
                href="https://wa.me/918921757960"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  background: 'transparent', color: 'rgba(245,243,239,0.6)',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.75rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  border: '1px solid rgba(245,243,239,0.15)', textDecoration: 'none',
                }}
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>

        {/* Contact info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', paddingTop: '4rem' }}>
          <a
            href="https://wa.me/918921757960"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--bg-primary)' }}
          >
            <MessageCircle size={20} style={{ color: 'rgba(245,243,239,0.4)' }} />
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>WhatsApp</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,243,239,0.5)' }}>+91 8921757960</div>
          </a>
          <a
            href="mailto:futureaviox@gmail.com"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--bg-primary)' }}
          >
            <Mail size={20} style={{ color: 'rgba(245,243,239,0.4)' }} />
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>Email</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,243,239,0.5)' }}>futureaviox@gmail.com</div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
