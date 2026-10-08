import React, { useState, useEffect } from 'react';

const CyberpunkGlitchText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [isGlitching, setIsGlitching] = useState(true);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((letter, index) => {
        if (index < iteration) return letter;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));

      if (iteration >= text.length) {
        clearInterval(interval);
        setTimeout(() => setIsGlitching(false), 500);
      }
      iteration += 1 / 3;
    }, 40);

    const randomGlitch = setInterval(() => {
      if (iteration >= text.length && Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
      }
    }, 3000);

    return () => { clearInterval(interval); clearInterval(randomGlitch); };
  }, [text]);

  return (
    <>
      <div 
        className={`cyberpunk-glitch ${isGlitching ? 'is-glitching' : ''}`} 
        data-text={displayText || text}
        style={{
          position: 'relative',
          display: 'inline-block',
          color: 'inherit',
        }}
      >
        {displayText || text}
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .cyberpunk-glitch.is-glitching::before,
          .cyberpunk-glitch.is-glitching::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
            background: transparent;
          }

          .cyberpunk-glitch.is-glitching::before {
            color: #ff003c;
            z-index: -1;
            animation: glitch-anim-1 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
          }

          .cyberpunk-glitch.is-glitching::after {
            color: #00f0ff;
            z-index: -2;
            animation: glitch-anim-2 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite reverse;
          }

          @keyframes glitch-anim-1 {
            0% { clip-path: inset(20% 0 80% 0); transform: translate(-0.04em, 0.02em); }
            20% { clip-path: inset(60% 0 10% 0); transform: translate(0.04em, -0.02em); }
            40% { clip-path: inset(40% 0 50% 0); transform: translate(-0.04em, 0.01em); }
            60% { clip-path: inset(80% 0 5% 0); transform: translate(0.04em, 0.02em); }
            80% { clip-path: inset(10% 0 70% 0); transform: translate(-0.02em, -0.02em); }
            100% { clip-path: inset(30% 0 50% 0); transform: translate(0.02em, 0.01em); }
          }

          @keyframes glitch-anim-2 {
            0% { clip-path: inset(10% 0 60% 0); transform: translate(0.04em, -0.02em); }
            20% { clip-path: inset(30% 0 20% 0); transform: translate(-0.04em, 0.02em); }
            40% { clip-path: inset(70% 0 10% 0); transform: translate(0.04em, 0.01em); }
            60% { clip-path: inset(20% 0 50% 0); transform: translate(-0.04em, -0.02em); }
            80% { clip-path: inset(50% 0 30% 0); transform: translate(0.02em, 0.02em); }
            100% { clip-path: inset(5% 0 80% 0); transform: translate(-0.02em, -0.01em); }
          }
        }
      `}</style>
    </>
  );
};

export default CyberpunkGlitchText;
