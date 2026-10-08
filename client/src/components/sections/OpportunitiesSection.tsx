import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, GraduationCap, Wrench, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const CATEGORIES = ['All', 'Internship', 'Job', 'Workshop', 'Industry Program', 'Career Opportunity'];

const categoryIcons: Record<string, React.ReactNode> = {
  Internship: <GraduationCap size={16} />,
  Job: <Briefcase size={16} />,
  Workshop: <Wrench size={16} />,
  'Industry Program': <Building2 size={16} />,
  'Career Opportunity': <ArrowUpRight size={16} />,
};

const staticOpps = [
  { _id: '1', title: 'Full-Stack Developer Intern', company: 'TechStartup Co.', description: 'Join a fast-growing startup to build and ship real features with the MERN stack.', category: 'Internship', location: 'Remote', stipend: '₹10,000 - ₹15,000/month', duration: '3 Months', skills: ['React', 'Node.js', 'MongoDB'], isFeatured: true },
  { _id: '2', title: 'AI Research Internship', company: 'AI Lab India', description: 'Work alongside AI researchers on cutting-edge NLP and computer vision projects.', category: 'Internship', location: 'Hybrid', stipend: '₹12,000 - ₹18,000/month', duration: '6 Months', skills: ['Python', 'TensorFlow'], isFeatured: true },
  { _id: '3', title: 'UI/UX Design Workshop', company: 'AVIOX', description: 'An intensive 2-day design thinking workshop with Figma and team collaboration.', category: 'Workshop', location: 'Online', skills: ['Figma', 'Design Thinking'] },
  { _id: '4', title: 'Junior Cybersecurity Analyst', company: 'SecureNet', description: 'Entry-level opportunity for cybersecurity students to support SOC operations.', category: 'Job', location: 'Bangalore', skills: ['Network Security', 'SIEM'] },
];

const OpportunitiesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const { data } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const res = await api.get('/opportunities');
      return res.data.data.opportunities;
    },
    staleTime: 5 * 60 * 1000,
  });

  const allOpps = data?.length ? data : staticOpps;
  const filtered = activeCategory === 'All' ? allOpps : allOpps.filter((o: typeof staticOpps[0]) => o.category === activeCategory);

  return (
    <section id="opportunities" className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-label">Open Opportunities</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h2 className="section-title">Launch Your<br />Career</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: activeCategory === cat ? 'var(--fg-primary)' : 'transparent',
                    color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--fg-muted)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((opp: typeof staticOpps[0], i: number) => (
            <motion.div
              key={opp._id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{ cursor: 'default', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--fg-muted)' }}>
                  {categoryIcons[opp.category] || <Briefcase size={16} />}
                  <span className="tag">{opp.category}</span>
                </div>
                {opp.isFeatured && <span className="tag" style={{ background: 'var(--fg-primary)', color: 'var(--bg-primary)', borderColor: 'var(--fg-primary)' }}>Featured</span>}
              </div>

              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{opp.title}</h3>
              {opp.company && <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginBottom: '0.75rem' }}>{opp.company} · {opp.location}</div>}
              <p style={{ fontSize: '0.8rem', lineHeight: 1.7, color: 'var(--fg-muted)', marginBottom: '1rem' }}>{opp.description}</p>

              {(opp.stipend || opp.duration) && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {opp.stipend && <span className="tag">{opp.stipend}</span>}
                  {opp.duration && <span className="tag">{opp.duration}</span>}
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
                {opp.skills.map((s: string) => <span key={s} className="tag">{s}</span>)}
              </div>

              <a
                href={`https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20am%20interested%20in%20the%20${encodeURIComponent(opp.title)}%20opportunity.%20Please%20share%20more%20details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.65rem', marginTop: 'auto' }}
              >
                Apply via WhatsApp <ArrowUpRight size={13} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;
