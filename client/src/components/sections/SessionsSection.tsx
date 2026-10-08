import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useBookSession } from '../../hooks/useBookSession';
import api from '../../api/axios';

const staticSessions = [
  { _id: '1', title: 'AI & The Future of Work', description: 'An interactive session exploring how AI is reshaping industries and what skills professionals need to stay ahead.', date: new Date(Date.now() + 3 * 86400000).toISOString(), time: '7:00 PM IST', duration: '90 min', availableSlots: 50, instructor: 'AVIOX Expert', status: 'upcoming', category: 'Artificial Intelligence' },
  { _id: '2', title: 'MERN Stack Masterclass', description: 'Build a complete production-ready application from scratch. Covers React, Node, MongoDB and deployment workflows.', date: new Date(Date.now() + 7 * 86400000).toISOString(), time: '6:30 PM IST', duration: '2 hours', availableSlots: 40, instructor: 'AVIOX Dev Team', status: 'upcoming', category: 'Development' },
  { _id: '3', title: 'Career Strategy Workshop', description: 'Map your path from student to industry professional. Resume, LinkedIn, interview prep and networking strategies.', date: new Date(Date.now() + 10 * 86400000).toISOString(), time: '5:00 PM IST', duration: '2 hours', availableSlots: 60, instructor: 'AVIOX Career Team', status: 'upcoming', category: 'Career' },
];

const SessionsSection: React.FC = () => {


  const { data } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await api.get('/sessions');
      return res.data.data.sessions;
    },
    staleTime: 5 * 60 * 1000,
  });

  const sessions = data?.length ? data : staticSessions;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleBookSessionRaw = useBookSession();
  const handleBookSession = (e: React.MouseEvent, title?: string) => {
    const msg = title 
      ? `Hi AVIOX! 👋 I would like to book a slot for ${title}. Please share the available slots and registration details.`
      : "Hi AVIOX! Please share all upcoming session details.";
    handleBookSessionRaw(e, msg);
  };

  return (
    <section id="sessions" className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <span className="section-label">Live Learning</span>
            <h2 className="section-title">Upcoming<br />Sessions</h2>
          </div>
          <button
            onClick={(e) => handleBookSession(e)}
            className="btn-secondary"
          >
            View All Sessions <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {sessions.map((session: typeof staticSessions[0], i: number) => (
            <motion.div
              key={session._id}
              className="session-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              {/* Status + Category */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className={`status-badge status-${session.status}`}>{session.status}</span>
                <span className="tag">{session.category}</span>
              </div>

              {/* Title */}
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                {session.title}
              </h3>
              <p style={{ fontSize: '0.825rem', lineHeight: 1.7, color: 'var(--fg-muted)', marginBottom: '1.5rem' }}>
                {session.description}
              </p>

              {/* Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                  <Calendar size={13} />
                  <span>{formatDate(session.date)} — {session.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                  <Clock size={13} />
                  <span>{session.duration}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                  <Users size={13} />
                  <span>{session.availableSlots} slots available · {session.instructor}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={(e) => handleBookSession(e, session.title)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.65rem' }}
              >
                Book Slot <ArrowUpRight size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SessionsSection;
