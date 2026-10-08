import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const manifesto = "We believe education is just the beginning. The real curriculum is in building things, solving problems, and creating value in the real world. AVIOX exists because degrees alone no longer open doors. Skills do. Vision does. Action does. We are building a generation of technologists, creators, and leaders who think beyond their classroom. Students who don't just study for exams — but study beyond degrees.";

const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const words = textRef.current.querySelectorAll('.word');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.1, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.5,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const words = manifesto.split(' ');

  return (
    <section id="about" className="section" ref={containerRef} style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '6rem', alignItems: 'flex-start' }}>
          <div>
            <span className="section-label">Our Manifesto</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
              Study<br />Beyond<br />Degrees.
            </h2>
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                ['Education', 'The foundation.'],
                ['Skills', 'The differentiator.'],
                ['Technology', 'The accelerator.'],
                ['Industry', 'The destination.'],
              ].map(([label, desc]) => (
                <div key={label} style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={textRef}>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
              color: 'var(--fg-primary)',
            }}>
              {words.map((word, i) => (
                <span key={i} className="word" style={{ display: 'inline-block', marginRight: '0.35em' }}>
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
