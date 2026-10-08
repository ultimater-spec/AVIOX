import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useBookSession } from '../hooks/useBookSession';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TicketsTab } from '../components/sections/TicketsTab';
import { NotificationsTab } from '../components/sections/NotificationsTab';
import { User, Calendar, Briefcase, Ticket, LogOut, Bot, ArrowUpRight, Bell } from 'lucide-react';

type Tab = 'overview' | 'sessions' | 'opportunities' | 'tickets' | 'notifications' | 'ai';

const DashboardPage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');


  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container" style={{ padding: '3rem 2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-label">My Dashboard</span>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                Hey, {user?.username} 👋
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginTop: '0.5rem' }}>{user?.email}</p>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem', overflowX: 'auto' }}>
            {[
              { id: 'overview', label: 'Overview', icon: <User size={14} /> },
              { id: 'sessions', label: 'Sessions', icon: <Calendar size={14} /> },
              { id: 'opportunities', label: 'Opportunities', icon: <Briefcase size={14} /> },
              { id: 'tickets', label: 'Support', icon: <Ticket size={14} /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
              { id: 'ai', label: 'AI Guide', icon: <Bot size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.25rem',
                  background: 'none', border: 'none',
                  fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: activeTab === tab.id ? 'var(--fg-primary)' : 'var(--fg-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--fg-primary)' : '2px solid transparent',
                  cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: '-1px',
                  transition: 'all 0.2s',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab user={user} />}
          {activeTab === 'sessions' && <SessionsTab />}
          {activeTab === 'opportunities' && <OpportunitiesTab />}
          {activeTab === 'tickets' && <TicketsTab />}
          {activeTab === 'notifications' && <NotificationsTab isAdmin={false} />}
          {activeTab === 'ai' && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Bot size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--fg-muted)', display: 'block' }} />
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.75rem' }}>AVIOX AI is ready!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '2rem' }}>Click the AI button in the bottom-right corner to chat with your career assistant.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const OverviewTab: React.FC<{ user: ReturnType<typeof useAuth>['user'] }> = ({ user }) => {
  const handleBookSession = useBookSession();
  
  return (
  <div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
      {[
        { label: 'Profile Complete', value: '80%', sub: 'Add more details' },
        { label: 'Sessions Booked', value: '0', sub: 'Book your first session' },
        { label: 'Tickets Raised', value: '0', sub: 'No open issues' },
        { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently', sub: 'AVIOX Student' },
      ].map((stat) => (
        <div key={stat.label} className="card" style={{ cursor: 'default' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em' }}>{stat.value}</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem' }}>{stat.label}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>{stat.sub}</div>
        </div>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <div className="card" style={{ cursor: 'default' }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Profile Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            ['Username', user?.username],
            ['Email', user?.email],
            ['Mobile', user?.mobile],
            ['Role', user?.role],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem', fontFamily: 'Outfit, sans-serif' }}>{label}</span>
              <span style={{ fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ cursor: 'default' }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Update Profile', url: '/profile' },
            { label: 'Book a Session', isBooking: true },
            { label: 'Explore Programs', url: '/#programs' },
            { label: 'View Opportunities', url: '/#opportunities' },
            { label: 'Contact AVIOX', url: 'https://wa.me/918921757960' },
          ].map((action) => (
            action.isBooking ? (
              <button
                key={action.label}
                onClick={(e) => handleBookSession(e, "Hi AVIOX! I want to book a session.")}
                className="btn-secondary"
                style={{ justifyContent: 'space-between', fontSize: '0.65rem', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                {action.label} <ArrowUpRight size={12} />
              </button>
            ) : action.url?.startsWith('http') || action.url?.startsWith('/#') ? (
              <a
                key={action.label}
                href={action.url}
                target={action.url.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ justifyContent: 'space-between', fontSize: '0.65rem' }}
              >
                {action.label} <ArrowUpRight size={12} />
              </a>
            ) : (
              <Link
                key={action.label}
                to={action.url || '/'}
                className="btn-secondary"
                style={{ justifyContent: 'space-between', fontSize: '0.65rem' }}
              >
                {action.label} <ArrowUpRight size={12} />
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

const SessionsTab: React.FC = () => {
  const handleBookSession = useBookSession();
  const { data, isLoading } = useQuery({
    queryKey: ['sessions-dashboard'],
    queryFn: async () => { const res = await api.get('/sessions'); return res.data.data.sessions; },
  });

  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Upcoming Sessions</h2>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fg-muted)' }}>Loading sessions...</div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(data || []).map((s: { _id: string; title: string; date: string; time: string; availableSlots: number; instructor: string; status: string }) => (
            <div key={s._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem' }}>{s.title}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>
                  {new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {s.time} · {s.availableSlots} slots · {s.instructor}
                </div>
              </div>
              <button 
                onClick={(e) => handleBookSession(e, `Hi AVIOX! I want to book a slot for ${s.title}.`)} 
                className="btn-primary" 
                style={{ fontSize: '0.65rem', padding: '0.625rem 1.25rem' }}
              >
                Book Slot <ArrowUpRight size={12} />
              </button>
            </div>
          ))}
          {!data?.length && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fg-muted)', border: '1px dashed var(--border)' }}>No upcoming sessions. Check back soon!</div>}
        </div>
      )}
    </div>
  );
};

const OpportunitiesTab: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['opps-dashboard'],
    queryFn: async () => { const res = await api.get('/opportunities'); return res.data.data.opportunities; },
  });

  return (
    <div>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Open Opportunities</h2>
      {isLoading ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fg-muted)' }}>Loading...</div> : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(data || []).map((o: { _id: string; title: string; company: string; category: string; location: string }) => (
            <div key={o._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="tag">{o.category}</span>
                  {o.location && <span className="tag">{o.location}</span>}
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem' }}>{o.title}</h3>
                {o.company && <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>{o.company}</div>}
              </div>
              <a href={`https://wa.me/918921757960?text=Hi%20AVIOX!%20I%20am%20interested%20in%20the%20${encodeURIComponent(o.title)}%20opportunity.`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.65rem', padding: '0.625rem 1.25rem' }}>
                Apply <ArrowUpRight size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
