import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookSession } from '../../hooks/useBookSession';
import CyberpunkGlitchText from '../ui/CyberpunkGlitchText';

const phrases = [
  'Learn Beyond Classrooms.',
  'Build Beyond Degrees.',
  'Grow Beyond Limits.',
];

const HeroSection: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);



  const handleBookSessionRaw = useBookSession();
  const handleBookSession = (e: React.MouseEvent) => {
    handleBookSessionRaw(e, "Hi AVIOX! 👋 I would like to book a session. Please share the available slots and registration details.");
  };

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    if (!isDeleting) {
      if (displayed.length < currentPhrase.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(currentPhrase.slice(0, displayed.length + 1));
        }, 45);
      } else {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 25);
      } else {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      }
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, isDeleting, phraseIndex]);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 2rem 5rem',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        style={{ position: 'absolute', top: '8rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}
      >
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
          EST. 2024
        </span>
      </motion.div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: '4rem' }}>
        <div>
          {/* Brand with Cyberpunk Glitch */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.9, ease: [0.76, 0, 0.24, 1] }}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(5rem, 14vw, 14rem)',
              fontWeight: 800,
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              color: 'var(--fg-primary)',
            }}
          >
            <CyberpunkGlitchText text="AVIOX" />
          </motion.div>

          {/* Typing animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.1 }}
            style={{ marginTop: '1.5rem', minHeight: '3rem' }}
          >
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
              fontWeight: 300,
              color: 'var(--fg-muted)',
              letterSpacing: '-0.01em',
            }}>
              {displayed}
              <span className="animate-pulse" style={{ borderRight: '2px solid var(--fg-muted)', marginLeft: '2px' }}>&nbsp;</span>
            </div>
          </motion.div>

          {/* Tagline & description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            style={{ marginTop: '2rem', display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}
          >
            <div style={{ maxWidth: '420px' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--fg-muted)', fontWeight: 300 }}>
                AVIOX empowers students with practical skills, emerging technologies, career guidance and real-world opportunities to build a future beyond their degree.
              </p>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}
          >
            <Link to="/register" className="btn-primary">
              Explore AVIOX <ArrowRight size={14} />
            </Link>
            <button
              onClick={handleBookSession}
              className="btn-secondary"
            >
              Book a Session <ArrowUpRight size={14} />
            </button>
          </motion.div>
        </div>

        {/* Right column — stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '160px' }}
          className="hidden-mobile"
        >
          {[
            { value: '10+', label: 'Programs' },
            { value: '5K+', label: 'Students' },
            { value: '100%', label: 'Practical' },
          ].map((stat) => (
            <div key={stat.label} style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{stat.value}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Tagline bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.6 }}
        style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span className="section-label" style={{ marginBottom: 0 }}>STUDY BEYOND DEGREES</span>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
          Kerala, India
        </span>
      </motion.div>

      <style>{`@media (max-width: 768px) { .hidden-mobile { display: none !important; } }`}</style>
    </section>
  );
};

export default HeroSection;
