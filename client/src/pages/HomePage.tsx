import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/sections/HeroSection';
import ProgramsSection from '../components/sections/ProgramsSection';
import SessionsSection from '../components/sections/SessionsSection';
import AboutSection from '../components/sections/AboutSection';
import OpportunitiesSection from '../components/sections/OpportunitiesSection';
import InsightsSection from '../components/sections/InsightsSection';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/Footer';

const AIFeatureSection: React.FC = () => (
  <section id="ai" style={{ padding: '8rem 0', background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
        <div>
          <span className="section-label">AI-Powered Learning</span>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Your AI<br />Career<br />Guide
          </h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--fg-muted)', marginBottom: '2rem' }}>
            AVIOX AI is your personal career development assistant — available 24/7 to answer questions about programs, guide your learning path, help with session bookings, and connect you with opportunities.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Program recommendations based on your goals', 'Session booking & scheduling assistance', 'Career roadmap guidance', 'Internship & job opportunity matching'].map((feature) => (
              <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--fg-primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'var(--fg-primary)',
            padding: '2rem',
            border: '1px solid var(--border-strong)',
            position: 'relative',
          }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.4)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22C55E' }} />
              AVIOX AI · Online
            </div>
            {[
              { from: 'user', text: 'What programs does AVIOX offer?' },
              { from: 'ai', text: 'AVIOX offers 10 specialized programs — from AI and MERN Stack to Cybersecurity and Career Development. All programs are practical and industry-aligned.' },
              { from: 'user', text: 'How do I book a session?' },
              { from: 'ai', text: 'Click "Book Slot" on any session to connect with us on WhatsApp, or I can connect you directly!' },
            ].map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                  background: msg.from === 'user' ? 'rgba(245,243,239,0.1)' : 'rgba(245,243,239,0.05)',
                  color: 'rgba(245,243,239,0.85)',
                  border: '1px solid rgba(245,243,239,0.1)',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ProgramsSection />
      <SessionsSection />
      <AIFeatureSection />
      <OpportunitiesSection />
      <AboutSection />
      <InsightsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;
