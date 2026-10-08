import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading && progressRef.current) {
      gsap.to(progressRef.current, {
        width: '100%',
        duration: 1.6,
        ease: 'power2.inOut',
      });
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{ textAlign: 'center' }}
          >
            <div
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: '#F5F3EF',
                lineHeight: 1,
              }}
            >
              AVIOX
            </div>
            <div
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.25em',
                color: 'rgba(245,243,239,0.4)',
                textTransform: 'uppercase',
                marginTop: '0.75rem',
              }}
            >
              Study Beyond Degrees
            </div>
          </motion.div>

          <div
            style={{
              width: '200px',
              height: '1px',
              background: 'rgba(245,243,239,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              ref={progressRef}
              style={{
                position: 'absolute',
                inset: 0,
                width: '0%',
                background: '#F5F3EF',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
