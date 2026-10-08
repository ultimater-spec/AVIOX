import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Brain, Zap, MessageSquare, Code, Shield, Palette, BarChart2, Cloud, Users, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain size={18} />,
  Zap: <Zap size={18} />,
  MessageSquare: <MessageSquare size={18} />,
  Code: <Code size={18} />,
  Shield: <Shield size={18} />,
  Palette: <Palette size={18} />,
  BarChart: <BarChart2 size={18} />,
  Cloud: <Cloud size={18} />,
  Users: <Users size={18} />,
  TrendingUp: <TrendingUp size={18} />,
};

const staticPrograms = [
  { title: 'Artificial Intelligence', shortDescription: 'Build intelligent systems with real-world AI applications.', icon: 'Brain', category: 'Technology', duration: '3 Months' },
  { title: 'AI Tools & Automation', shortDescription: 'Master AI tools to supercharge your productivity 10x.', icon: 'Zap', category: 'Technology', duration: '4 Weeks' },
  { title: 'Prompt Engineering', shortDescription: 'The art and science of communicating with AI systems.', icon: 'MessageSquare', category: 'Technology', duration: '3 Weeks' },
  { title: 'MERN Stack Development', shortDescription: 'Full-stack web development from APIs to dynamic frontends.', icon: 'Code', category: 'Development', duration: '4 Months' },
  { title: 'Cybersecurity', shortDescription: 'Defend, detect, and respond to modern cyber threats.', icon: 'Shield', category: 'Security', duration: '3 Months' },
  { title: 'UI/UX Design', shortDescription: 'Design products that users love with modern principles.', icon: 'Palette', category: 'Design', duration: '2 Months' },
  { title: 'Data Science', shortDescription: 'Turn raw data into powerful business insights.', icon: 'BarChart', category: 'Technology', duration: '4 Months' },
  { title: 'Cloud Technologies', shortDescription: 'Build and deploy scalable applications on the cloud.', icon: 'Cloud', category: 'Technology', duration: '3 Months' },
  { title: 'Communication Skills', shortDescription: 'Professional communication for the modern tech workplace.', icon: 'Users', category: 'Career', duration: '6 Weeks' },
  { title: 'Career Development', shortDescription: 'Your roadmap from student to industry professional.', icon: 'TrendingUp', category: 'Career', duration: '6 Weeks' },
];

const ProgramsSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { data } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const res = await api.get('/programs');
      return res.data.data.programs;
    },
    staleTime: 5 * 60 * 1000,
  });

  const programs = data?.length ? data : staticPrograms;

  return (
    <section id="programs" className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem', alignItems: 'flex-end' }}>
          <div>
            <span className="section-label">What We Teach</span>
            <h2 className="section-title">
              Programs Built<br />for the Future
            </h2>
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--fg-muted)', maxWidth: '380px', marginLeft: 'auto' }}>
              Every program is designed with industry requirements at its core — practical, current, and built to make you job-ready from day one.
            </p>
          </div>
        </div>

        {/* Programs list */}
        <div style={{ position: 'relative' }}>
          {programs.map((program: typeof staticPrograms[0], i: number) => (
            <motion.div
              key={program.title}
              className="program-card"
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Number */}
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', fontWeight: 300, color: 'var(--fg-muted)', letterSpacing: '0.1em', minWidth: '1.5rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Icon */}
                <div style={{ width: '2.5rem', height: '2.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-primary)', flexShrink: 0 }}>
                  {iconMap[program.icon] || <Brain size={18} />}
                </div>
                {/* Title + desc */}
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' }}>{program.title}</div>
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginTop: '0.25rem', overflow: 'hidden' }}
                      >
                        {program.shortDescription}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                <span className="tag">{program.duration}</span>
                <span className="tag">{program.category}</span>
                <a
                  href={`https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20am%20interested%20in%20the%20${encodeURIComponent(program.title)}%20program.%20Please%20share%20details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--fg-muted)', transition: 'color 0.2s', display: 'flex' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-muted)')}
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
