import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, overflow: 'hidden', pointerEvents: 'none', background: 'var(--bg-primary)' }}>
      {/* Orb 1 */}
      <motion.div
        animate={{
          x: ['-5vw', '25vw', '-5vw'],
          y: ['-10vh', '30vh', '-10vh'],
          scale: [1, 1.4, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 25, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(200, 185, 160, 0.4) 0%, rgba(200, 185, 160, 0) 60%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />

      {/* Orb 2 */}
      <motion.div
        animate={{
          x: ['40vw', '10vw', '40vw'],
          y: ['60vh', '10vh', '60vh'],
          scale: [1.2, 0.8, 1.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 30, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '30%',
          right: '-10%',
          width: '70vw',
          height: '70vw',
          background: 'radial-gradient(circle, rgba(160, 175, 200, 0.25) 0%, rgba(160, 175, 200, 0) 60%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />

      {/* Orb 3 */}
      <motion.div
        animate={{
          x: ['20vw', '-20vw', '20vw'],
          y: ['10vh', '50vh', '10vh'],
          scale: [0.9, 1.3, 0.9],
        }}
        transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '20%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(10, 10, 10, 0.08) 0%, rgba(10, 10, 10, 0) 60%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
