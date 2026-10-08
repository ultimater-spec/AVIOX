import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);

  useEffect(() => {
    let lastColorCheck = 0;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const now = Date.now();
      if (now - lastColorCheck > 50) {
        lastColorCheck = now;
        const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
        if (target) {
          let curr: HTMLElement | null = target;
          let bg = 'rgba(0, 0, 0, 0)';
          
          while (curr) {
            const style = window.getComputedStyle(curr);
            bg = style.backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              break;
            }
            curr = curr.parentElement;
          }
          
          if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
            bg = window.getComputedStyle(document.body).backgroundColor;
          }

          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            const r = parseInt(match[1], 10);
            const g = parseInt(match[2], 10);
            const b = parseInt(match[3], 10);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            // If background is dark (brightness <= 128), cursor should be light.
            setIsDarkBg(brightness <= 128);
          }
        }
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="cursor-dot hidden-mobile"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
          backgroundColor: isDarkBg ? '#F5F3EF' : '#0A0A0A',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
      />
      <motion.div
        className="cursor-ring hidden-mobile"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering 
            ? (isDarkBg ? 'rgba(245, 243, 239, 0.1)' : 'rgba(10, 10, 10, 0.1)') 
            : 'transparent',
          borderColor: isHovering 
            ? 'transparent' 
            : (isDarkBg ? 'rgba(245, 243, 239, 0.5)' : 'rgba(10, 10, 10, 0.5)'),
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
      />
    </>
  );
};

export default CustomCursor;
