import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const staticInsights = [
  { _id: '1', title: 'Why AI Skills Are the Most Valuable Asset for Students in 2025', category: 'AI', description: 'Artificial Intelligence is not just a trend — it\'s the defining technology of our generation.', readTime: '5 min read', publishedAt: new Date().toISOString() },
  { _id: '2', title: 'From Student to Software Engineer: A Practical Roadmap', category: 'Career', description: 'Breaking into the tech industry requires more than a degree. Here\'s the exact roadmap.', readTime: '8 min read', publishedAt: new Date().toISOString() },
  { _id: '3', title: 'The MERN Stack Explained: Why It\'s the Perfect Starting Point', category: 'Technology', description: 'Four technologies that power some of the world\'s most successful startups.', readTime: '6 min read', publishedAt: new Date().toISOString() },
  { _id: '4', title: 'Top 10 AI Tools Every Student Should Master in 2025', category: 'AI', description: 'From ChatGPT to Midjourney — the 10 most impactful AI tools for students.', readTime: '7 min read', publishedAt: new Date().toISOString() },
  { _id: '5', title: 'Cybersecurity Careers: The Highest-Paying Path in Tech', category: 'Industry', description: 'The global cybersecurity talent shortage means exceptional opportunity for those who specialize.', readTime: '6 min read', publishedAt: new Date().toISOString() },
  { _id: '6', title: 'Why Degrees Alone No Longer Guarantee Success', category: 'Education', description: 'The era of degree-dependent employment is over. Industry leaders now prioritize skills.', readTime: '5 min read', publishedAt: new Date().toISOString() },
];

const InsightsSection: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const res = await api.get('/insights');
      return res.data.data.insights;
    },
    staleTime: 5 * 60 * 1000,
  });

  const insights = data?.length ? data : staticInsights;

  return (
    <section id="insights" className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <span className="section-label">Knowledge Hub</span>
            <h2 className="section-title">AVIOX<br />Insights</h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {insights.map((insight: typeof staticInsights[0], i: number) => (
            <InsightRow key={insight._id} insight={insight} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const InsightRow: React.FC<{ insight: typeof staticInsights[0]; index: number }> = ({ insight, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - 100);
    mouseY.set(e.clientY - rect.top - 70);
  };

  return (
    <motion.div
      ref={rowRef}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: '2rem',
        padding: '1.75rem 0',
        borderTop: '1px solid var(--border)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span className="tag">{insight.category}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--fg-muted)' }}>{insight.readTime}</span>
        </div>
        <h3 style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 600,
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          transition: 'color 0.2s',
          color: isHovered ? 'var(--fg-primary)' : 'var(--fg-primary)',
          maxWidth: '600px',
        }}>
          {insight.title}
        </h3>
        {isHovered && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}
          >
            {insight.description}
          </motion.p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          style={{ color: 'var(--fg-primary)' }}
        >
          <ArrowUpRight size={20} />
        </motion.div>
      </div>

      {/* Cursor follow image placeholder */}
      <motion.div
        style={{
          position: 'absolute',
          top: springY,
          left: springX,
          width: '200px',
          height: '130px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.2s ease',
        }}
      >
        <div style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '0.6rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--fg-muted)',
          textAlign: 'center',
          padding: '1rem',
        }}>
          {insight.category}<br />
          <span style={{ fontWeight: 300 }}>Read Article</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InsightsSection;
