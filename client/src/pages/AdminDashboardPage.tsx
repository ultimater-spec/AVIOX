import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAdminAuth } from '../context/AdminAuthContext';
import { adminApi } from '../api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard, Users, BookOpen, Calendar, Briefcase, Ticket,
  Brain, Shield, LogOut, Plus, Trash2, Check, X, RefreshCw, Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NotificationDropdown from '../components/ui/NotificationDropdown';
import { NotificationsTab } from '../components/sections/NotificationsTab';

type AdminTab = 'dashboard' | 'users' | 'programs' | 'sessions' | 'opportunities' | 'tickets' | 'ai-knowledge' | 'admins' | 'security' | 'notifications';

const AdminDashboardPage: React.FC = () => {
  const { admin, logout, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  if (!isAuthenticated) { navigate('/admin/login'); return null; }

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
    { id: 'users', label: 'Users', icon: <Users size={14} /> },
    { id: 'programs', label: 'Programs', icon: <BookOpen size={14} /> },
    { id: 'sessions', label: 'Sessions', icon: <Calendar size={14} /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Briefcase size={14} /> },
    { id: 'tickets', label: 'Tickets', icon: <Ticket size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'ai-knowledge', label: 'AI Knowledge', icon: <Brain size={14} /> },
    { id: 'admins', label: 'Admins', icon: <Shield size={14} /> },
    { id: 'security', label: 'Security Logs', icon: <Shield size={14} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(245,243,239,0.1)', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--bg-primary)' }}>AVIOX</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.3)', marginTop: '0.25rem' }}>Admin Portal</div>
        </div>

        <div style={{ padding: '0 0.5rem' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem 1rem 0', borderTop: '1px solid rgba(245,243,239,0.1)' }}>
          <div style={{ padding: '0.75rem 0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(245,243,239,0.8)' }}>{admin?.username}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(245,243,239,0.4)', marginTop: '0.125rem' }}>{admin?.role}</div>
          </div>
          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="admin-nav-item"
            style={{ color: 'rgba(239,68,68,0.7)' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content" style={{ flex: 1, width: '100%', minWidth: 0, overflowX: 'hidden' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div>
            <NotificationDropdown isAdmin={true} />
          </div>
        </div>

        {activeTab === 'dashboard' && <DashboardStats />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'programs' && <ProgramsTab />}
        {activeTab === 'sessions' && <SessionsTab />}
        {activeTab === 'opportunities' && <OpportunitiesTab />}
        {activeTab === 'tickets' && <TicketsTab />}
        {activeTab === 'notifications' && <NotificationsTab isAdmin={true} />}
        {activeTab === 'ai-knowledge' && <AIKnowledgeTab />}
        {activeTab === 'admins' && <AdminsTab admin={admin} />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────
const growthData = [
  { name: 'Jan', users: 120, sessions: 20 },
  { name: 'Feb', users: 250, sessions: 45 },
  { name: 'Mar', users: 400, sessions: 80 },
  { name: 'Apr', users: 750, sessions: 150 },
  { name: 'May', users: 1200, sessions: 280 },
  { name: 'Jun', users: 1850, sessions: 400 },
];

const DashboardStats: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => { const res = await adminApi.get('/admin/dashboard/stats'); return res.data.data.stats; },
  });

  const stats = data || { users: 0, sessions: 0, tickets: 0, openTickets: 0, opportunities: 0 };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Users', value: stats.users, color: '#4F46E5' },
          { label: 'Sessions', value: stats.sessions, color: '#0891B2' },
          { label: 'Opportunities', value: stats.opportunities, color: '#059669' },
          { label: 'Total Tickets', value: stats.tickets, color: '#D97706' },
          { label: 'Open Tickets', value: stats.openTickets, color: '#DC2626' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '1.5rem' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.04em', color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ 
        width: '100%',
        background: 'rgba(234, 231, 225, 0.4)', 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(200, 200, 200, 0.2)', 
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        borderRadius: '16px',
        padding: '2rem' 
      }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--fg-primary)' }}>Website Growth</h3>
        <div style={{ width: '100%', height: 450 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10, 10, 10, 0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--fg-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--fg-muted)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(245, 243, 239, 0.8)', 
                  backdropFilter: 'blur(10px)', 
                  border: '1px solid rgba(200,200,200,0.3)', 
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}
                itemStyle={{ color: 'var(--fg-primary)', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}
                labelStyle={{ color: 'var(--fg-muted)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                cursor={{ fill: 'var(--bg-secondary)', opacity: 0.4 }}
              />
              <Bar dataKey="users" name="Total Users" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sessions" name="Sessions" fill="#0891B2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ─── Users Tab ────────────────────────────────────────────────────────────
const UsersTab: React.FC = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => { const res = await adminApi.get('/admin/users'); return res.data.data.users; },
  });

  const toggleUser = useMutation({
    mutationFn: async (id: string) => adminApi.patch(`/admin/users/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <div>
      <AdminTable
        headers={['Username', 'Email', 'Mobile', 'Status', 'Joined', 'Actions']}
        rows={(data || []).map((u: { _id: string; username: string; email: string; mobile: string; isActive: boolean; createdAt: string }) => [
          u.username,
          u.email,
          u.mobile,
          <span key={`status-${u._id}`} className={`status-badge ${u.isActive ? 'status-resolved' : 'status-closed'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>,
          new Date(u.createdAt).toLocaleDateString('en-IN'),
          <button key={`btn-${u._id}`} onClick={() => toggleUser.mutate(u._id)} className="btn-ghost" style={{ fontSize: '0.6rem', padding: '0.25rem 0.5rem' }}>
            {u.isActive ? 'Deactivate' : 'Activate'}
          </button>,
        ])}
      />
    </div>
  );
};

// ─── Programs Tab ─────────────────────────────────────────────────────────
const ProgramsTab: React.FC = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', shortDescription: '', description: '', category: 'Technology', duration: '', level: 'All Levels' });

  const { data } = useQuery({
    queryKey: ['admin-programs'],
    queryFn: async () => { const res = await adminApi.get('/programs/all'); return res.data.data.programs; },
  });

  const create = useMutation({
    mutationFn: async (d: typeof form) => adminApi.post('/programs', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-programs'] }); setShowForm(false); setForm({ title: '', shortDescription: '', description: '', category: 'Technology', duration: '', level: 'All Levels' }); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/programs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-programs'] }),
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>{data?.length || 0} programs</span>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: '0.65rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Plus size={12} /> Add Program
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(form); }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="input-label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
              {['Technology', 'Development', 'Security', 'Design', 'Career'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Duration</label>
            <input className="input" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 3 Months" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Short Description</label>
            <input className="input" value={form.shortDescription} onChange={(e) => setForm(f => ({ ...f, shortDescription: e.target.value }))} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Full Description</label>
            <textarea className="input" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.65rem' }}>Create Program</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ fontSize: '0.65rem' }}>Cancel</button>
          </div>
        </form>
      )}

      <AdminTable
        headers={['Title', 'Category', 'Duration', 'Level', 'Status', 'Actions']}
        rows={(data || []).map((p: { _id: string; title: string; category: string; duration: string; level: string; isActive: boolean }) => [
          p.title,
          p.category,
          p.duration,
          p.level,
          <span key={`status-${p._id}`} className={`status-badge ${p.isActive ? 'status-resolved' : 'status-closed'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>,
          <button key={`btn-${p._id}`} onClick={() => { if (confirm('Delete this program?')) del.mutate(p._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex' }}><Trash2 size={14} /></button>,
        ])}
      />
    </div>
  );
};

// ─── Sessions Tab ─────────────────────────────────────────────────────────
const SessionsTab: React.FC = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', duration: '', availableSlots: 50, instructor: '', category: 'Technology' });

  const { data } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: async () => { const res = await adminApi.get('/sessions/all'); return res.data.data.sessions; },
  });

  const create = useMutation({
    mutationFn: async (d: typeof form) => adminApi.post('/sessions', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sessions'] }); setShowForm(false); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/sessions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-sessions'] }),
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>{data?.length || 0} sessions</span>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: '0.65rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Plus size={12} /> Add Session
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(form); }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Session Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="input-label">Date</label>
            <input type="date" className="input" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} required />
          </div>
          <div>
            <label className="input-label">Time</label>
            <input className="input" value={form.time} onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))} placeholder="7:00 PM IST" required />
          </div>
          <div>
            <label className="input-label">Duration</label>
            <input className="input" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="90 min" required />
          </div>
          <div>
            <label className="input-label">Available Slots</label>
            <input type="number" className="input" value={form.availableSlots} onChange={(e) => setForm(f => ({ ...f, availableSlots: Number(e.target.value) }))} required />
          </div>
          <div>
            <label className="input-label">Instructor</label>
            <input className="input" value={form.instructor} onChange={(e) => setForm(f => ({ ...f, instructor: e.target.value }))} required />
          </div>
          <div>
            <label className="input-label">Category</label>
            <input className="input" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Description</label>
            <textarea className="input" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ resize: 'vertical' }} required />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.65rem' }}>Create Session</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ fontSize: '0.65rem' }}>Cancel</button>
          </div>
        </form>
      )}

      <AdminTable
        headers={['Title', 'Date', 'Time', 'Slots', 'Instructor', 'Status', 'Actions']}
        rows={(data || []).map((s: { _id: string; title: string; date: string; time: string; availableSlots: number; instructor: string; status: string }) => [
          s.title,
          new Date(s.date).toLocaleDateString('en-IN'),
          s.time,
          s.availableSlots,
          s.instructor,
          <span key={`status-${s._id}`} className={`status-badge status-${s.status}`}>{s.status}</span>,
          <button key={`btn-${s._id}`} onClick={() => { if (confirm('Delete?')) del.mutate(s._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex' }}><Trash2 size={14} /></button>,
        ])}
      />
    </div>
  );
};

// ─── Opportunities Tab ────────────────────────────────────────────────────
const OpportunitiesTab: React.FC = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', description: '', category: 'Internship', location: 'Remote', stipend: '', duration: '', skills: '' });

  const { data } = useQuery({
    queryKey: ['admin-opps'],
    queryFn: async () => { const res = await adminApi.get('/opportunities/all'); return res.data.data.opportunities; },
  });

  const create = useMutation({
    mutationFn: async (d: typeof form) => adminApi.post('/opportunities', { ...d, skills: d.skills.split(',').map(s => s.trim()).filter(Boolean) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-opps'] }); setShowForm(false); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/opportunities/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-opps'] }),
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>{data?.length || 0} opportunities</span>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: '0.65rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Plus size={12} /> Add Opportunity
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(form); }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="input-label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="input-label">Company</label>
            <input className="input" value={form.company} onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
              {['Internship', 'Job', 'Workshop', 'Industry Program', 'Career Opportunity'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Location</label>
            <input className="input" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Stipend / Salary</label>
            <input className="input" value={form.stipend} onChange={(e) => setForm(f => ({ ...f, stipend: e.target.value }))} placeholder="₹10,000/month" />
          </div>
          <div>
            <label className="input-label">Duration</label>
            <input className="input" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="3 Months" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Skills (comma-separated)</label>
            <input className="input" value={form.skills} onChange={(e) => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="React, Node.js, Python" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Description</label>
            <textarea className="input" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ resize: 'vertical' }} required />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.65rem' }}>Create Opportunity</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ fontSize: '0.65rem' }}>Cancel</button>
          </div>
        </form>
      )}

      <AdminTable
        headers={['Title', 'Company', 'Category', 'Location', 'Actions']}
        rows={(data || []).map((o: { _id: string; title: string; company: string; category: string; location: string }) => [
          o.title,
          o.company || '-',
          o.category,
          o.location,
          <button key={`btn-${o._id}`} onClick={() => { if (confirm('Delete?')) del.mutate(o._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex' }}><Trash2 size={14} /></button>,
        ])}
      />
    </div>
  );
};

// ─── Tickets Tab ──────────────────────────────────────────────────────────
const TicketsTab: React.FC = () => {
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ status: 'All', priority: 'All', category: 'All', search: '' });
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');

  const { data, isFetching } = useQuery({
    queryKey: ['admin-tickets', filters],
    queryFn: async () => { 
      const res = await adminApi.get('/tickets/admin/all', { params: filters }); 
      return res.data.data; 
    },
    // We want to refetch when filters change.
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, status, priority }: { id: string; status?: string; priority?: string }) => adminApi.patch(`/tickets/admin/${id}/status`, { status, priority }),
    onSuccess: (res) => { 
      qc.invalidateQueries({ queryKey: ['admin-tickets'] }); 
      qc.invalidateQueries({ queryKey: ['admin-tickets-stats'] }); 
      if (selectedTicket) setSelectedTicket(res.data.data.ticket);
    },
  });

  const sendReply = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => adminApi.post(`/tickets/admin/${id}/reply`, { content }),
    onSuccess: (res) => { 
      qc.invalidateQueries({ queryKey: ['admin-tickets'] }); 
      setReplyContent(''); 
      setSelectedTicket(res.data.data.ticket);
    },
  });

  const tickets = data?.tickets || [];
  
  const { data: statsData } = useQuery({
    queryKey: ['admin-tickets-stats'],
    queryFn: async () => { const res = await adminApi.get('/tickets/admin/all', { params: { limit: 1000 } }); return res.data.data.tickets; }
  });

  const allTicketsForStats = statsData || [];
  const stats = {
    total: allTicketsForStats.length,
    open: allTicketsForStats.filter((t:any) => t.status === 'OPEN').length,
    inProgress: allTicketsForStats.filter((t:any) => t.status === 'IN_PROGRESS').length,
    resolved: allTicketsForStats.filter((t:any) => t.status === 'RESOLVED').length,
    closed: allTicketsForStats.filter((t:any) => t.status === 'CLOSED').length,
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return '#EF4444'; // Red
      case 'IN_PROGRESS': return '#F59E0B'; // Amber
      case 'RESOLVED': return '#10B981'; // Green
      case 'CLOSED': return '#6B7280'; // Gray
      default: return '#6B7280';
    }
  };

  if (selectedTicket) {
    return (
      <div className="fade-in">
        <button onClick={() => setSelectedTicket(null)} className="btn-ghost" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
           ← Back to Tickets
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main Chat/Timeline Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'Outfit, sans-serif', marginBottom: '0.25rem' }}>{selectedTicket.subject}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginBottom: '1.5rem' }}>Ticket #{selectedTicket.ticketId} • Opened on {new Date(selectedTicket.createdAt).toLocaleString('en-IN')}</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedTicket.messages?.map((msg: any, i: number) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', marginBottom: '0.25rem' }}>
                      {msg.senderName} ({msg.sender === 'admin' ? 'Admin' : 'User'}) • {new Date(msg.createdAt).toLocaleString('en-IN')}
                    </div>
                    <div style={{ 
                      background: msg.sender === 'admin' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(245, 243, 239, 0.05)',
                      border: `1px solid ${msg.sender === 'admin' ? 'rgba(79, 70, 229, 0.2)' : 'var(--border)'}`,
                      padding: '1rem',
                      borderRadius: '8px',
                      maxWidth: '85%',
                      fontSize: '0.85rem',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Box */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', marginBottom: '1rem' }}>Send Reply</h4>
              <textarea 
                className="input" 
                rows={4} 
                style={{ resize: 'vertical', marginBottom: '1rem' }}
                placeholder="Type your response here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button 
                className="btn-primary" 
                style={{ fontSize: '0.75rem', padding: '0.6rem 1.5rem' }}
                onClick={() => sendReply.mutate({ id: selectedTicket._id, content: replyContent })}
                disabled={!replyContent.trim() || sendReply.isPending}
              >
                {sendReply.isPending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Ticket Details</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.75rem' }}>
                <div>
                  <div style={{ color: 'var(--fg-muted)', marginBottom: '0.25rem' }}>User</div>
                  <div style={{ fontWeight: 500 }}>{selectedTicket.user?.username || 'Unknown User'}</div>
                  <div style={{ color: 'var(--fg-muted)' }}>{selectedTicket.user?.email || 'N/A'}</div>
                </div>
                
                <div>
                  <div style={{ color: 'var(--fg-muted)', marginBottom: '0.25rem' }}>Category</div>
                  <div style={{ fontWeight: 500 }}>{selectedTicket.category}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--fg-muted)', marginBottom: '0.25rem' }}>Status</div>
                  <select 
                    className="input" 
                    value={selectedTicket.status} 
                    onChange={(e) => updateTicket.mutate({ id: selectedTicket._id, status: e.target.value })}
                    style={{ padding: '0.4rem', fontSize: '0.75rem' }}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <div style={{ color: 'var(--fg-muted)', marginBottom: '0.25rem' }}>Priority</div>
                  <select 
                    className="input" 
                    value={selectedTicket.priority || 'MEDIUM'} 
                    onChange={(e) => updateTicket.mutate({ id: selectedTicket._id, priority: e.target.value })}
                    style={{ padding: '0.4rem', fontSize: '0.75rem' }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Tickets', value: stats.total, color: '#4F46E5' },
          { label: 'Open', value: stats.open, color: '#EF4444' },
          { label: 'In Progress', value: stats.inProgress, color: '#F59E0B' },
          { label: 'Resolved', value: stats.resolved, color: '#10B981' },
          { label: 'Closed', value: stats.closed, color: '#6B7280' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em', color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <select className="input" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="All">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        
        <select className="input" value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}>
          <option value="All">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
        
        <select className="input" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
          <option value="All">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Billing">Billing</option>
          <option value="Course">Course</option>
          <option value="Session">Session</option>
          <option value="General">General</option>
          <option value="Career">Career</option>
          <option value="Other">Other</option>
        </select>
        
        <input 
          className="input" 
          placeholder="Search ticket ID, subject, or user..." 
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        />
      </div>

      {/* Tickets Table */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', position: 'relative' }}>
        {isFetching && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--accent)', animation: 'pulse 1.5s infinite' }} />
        )}
        <AdminTable
          headers={['Ticket ID', 'User', 'Subject', 'Category', 'Priority', 'Status', 'Date', 'Action']}
          rows={tickets.map((t: any) => [
            <span key={`id-${t._id}`} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 600 }}>{t.ticketId}</span>,
            <div key={`user-${t._id}`}><div style={{ fontSize: '0.75rem', fontWeight: 500 }}>{t.user?.username || 'User'}</div><div style={{ fontSize: '0.65rem', color: 'var(--fg-muted)' }}>{t.user?.email}</div></div>,
            <span key={`sub-${t._id}`} style={{ maxWidth: '200px', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</span>,
            t.category,
            <span key={`pri-${t._id}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>{t.priority || 'MEDIUM'}</span>,
            <div key={`stat-${t._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(t.status) }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: getStatusColor(t.status) }}>{t.status.replace('_', ' ')}</span>
            </div>,
            <span key={`dt-${t._id}`} style={{ fontSize: '0.7rem' }}>{new Date(t.createdAt).toLocaleDateString('en-IN')}</span>,
            <button 
              key={`act-${t._id}`} 
              onClick={() => setSelectedTicket(t)}
              className="btn-primary" 
              style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}
            >
              Open Ticket
            </button>
          ])}
        />
      </div>
    </div>
  );
};

// ─── AI Knowledge Tab ─────────────────────────────────────────────────────
const AIKnowledgeTab: React.FC = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ topic: '', keywords: '', content: '', category: 'About', priority: 0 });

  const { data } = useQuery({
    queryKey: ['admin-ai-knowledge'],
    queryFn: async () => { const res = await adminApi.get('/ai/knowledge'); return res.data.data.knowledge; },
  });

  const create = useMutation({
    mutationFn: async (d: typeof form) => adminApi.post('/ai/knowledge', { ...d, keywords: d.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-ai-knowledge'] }); setShowForm(false); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/ai/knowledge/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-ai-knowledge'] }),
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>{data?.length || 0} knowledge entries</span>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: '0.65rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Plus size={12} /> Add Knowledge
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(form); }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="input-label">Topic</label>
            <input className="input" value={form.topic} onChange={(e) => setForm(f => ({ ...f, topic: e.target.value }))} required />
          </div>
          <div>
            <label className="input-label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
              {['About', 'Programs', 'Sessions', 'Booking', 'Career', 'Internships', 'Jobs', 'FAQs', 'Contact', 'Platform', 'Policies'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Keywords (comma-separated, lowercase)</label>
            <input className="input" value={form.keywords} onChange={(e) => setForm(f => ({ ...f, keywords: e.target.value }))} placeholder="ai, machine learning, artificial intelligence" required />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Response Content</label>
            <textarea className="input" value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={5} style={{ resize: 'vertical' }} required placeholder="The AI will respond with this content when a matching query is received." />
          </div>
          <div>
            <label className="input-label">Priority (higher = preferred)</label>
            <input type="number" className="input" value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: Number(e.target.value) }))} />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.65rem' }}>Add Knowledge</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ fontSize: '0.65rem' }}>Cancel</button>
          </div>
        </form>
      )}

      <AdminTable
        headers={['Topic', 'Category', 'Keywords', 'Priority', 'Actions']}
        rows={(data || []).map((k: { _id: string; topic: string; category: string; keywords: string[]; priority: number }) => [
          k.topic,
          k.category,
          k.keywords.slice(0, 4).join(', ') + (k.keywords.length > 4 ? '...' : ''),
          k.priority,
          <button key={`btn-${k._id}`} onClick={() => { if (confirm('Delete this knowledge entry?')) del.mutate(k._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex' }}><Trash2 size={14} /></button>,
        ])}
      />
    </div>
  );
};

// ─── Admins Tab ───────────────────────────────────────────────────────────
const AdminsTab: React.FC<{ admin: { role?: string } | null }> = ({ admin }) => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-list'],
    queryFn: async () => { const res = await adminApi.get('/admin/list'); return res.data.data.admins; },
    enabled: admin?.role === 'SUPER_ADMIN',
  });

  const approve = useMutation({
    mutationFn: async (id: string) => adminApi.post(`/admin/approve/${id}`),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['admin-list'] });
      alert(`Approval code: ${res.data.data.approvalCode}\nShare this with ${res.data.data.adminEmail}`);
    },
  });

  const toggle = useMutation({
    mutationFn: async (id: string) => adminApi.patch(`/admin/toggle/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-list'] }),
  });

  if (admin?.role !== 'SUPER_ADMIN') {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--fg-muted)' }}>Only Super Admins can manage other admins.</div>;
  }

  return (
    <AdminTable
      headers={['Username', 'Email', 'Role', 'Status', 'Approved', 'Actions']}
      rows={(data || []).map((a: { _id: string; username: string; email: string; role: string; isActive: boolean; isApproved: boolean; registrationStatus: string }) => [
        a.username,
        a.email,
        <span key={`role-${a._id}`} className="tag">{a.role}</span>,
        <span key={`status-${a._id}`} className={`status-badge ${a.isActive ? 'status-resolved' : 'status-closed'}`}>{a.isActive ? 'Active' : 'Inactive'}</span>,
        <span key={`appr-${a._id}`} className={`status-badge ${a.isApproved ? 'status-resolved' : 'status-open'}`}>{a.isApproved ? 'Approved' : 'Pending'}</span>,
        <div key={`acts-${a._id}`} style={{ display: 'flex', gap: '0.5rem' }}>
          {!a.isApproved && (
            <button onClick={() => approve.mutate(a._id)} className="btn-ghost" style={{ fontSize: '0.6rem', padding: '0.25rem 0.5rem', color: '#16A34A' }}>
              <Check size={12} /> Approve
            </button>
          )}
          <button onClick={() => toggle.mutate(a._id)} className="btn-ghost" style={{ fontSize: '0.6rem', padding: '0.25rem 0.5rem' }}>
            {a.isActive ? <X size={12} /> : <Check size={12} />}
          </button>
        </div>,
      ])}
    />
  );
};

// ─── Security Logs Tab ────────────────────────────────────────────────────
const SecurityTab: React.FC = () => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['security-logs'],
    queryFn: async () => { const res = await adminApi.get('/admin/security-logs'); return res.data.data.logs; },
  });

  const severityColors: Record<string, string> = { LOW: '#16A34A', MEDIUM: '#D97706', HIGH: '#DC2626', CRITICAL: '#7C3AED' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={() => refetch()} className="btn-secondary" style={{ fontSize: '0.65rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <RefreshCw size={12} className={isFetching ? 'spin' : ''} /> Refresh
        </button>
      </div>
      <AdminTable
        headers={['Action', 'Email', 'IP', 'Severity', 'Status', 'Timestamp']}
        rows={(data || []).map((l: { action: string; userEmail: string; ip: string; severity: string; status: string; timestamp: string }, i: number) => [
          <span key={`act-${i}`} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 500 }}>{l.action}</span>,
          l.userEmail || '-',
          l.ip,
          <span key={`sev-${i}`} style={{ color: severityColors[l.severity] || '#6B7280', fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 600 }}>{l.severity}</span>,
          <span key={`stat-${i}`} className={`status-badge ${l.status === 'SUCCESS' ? 'status-resolved' : l.status === 'BLOCKED' ? 'status-closed' : 'status-open'}`}>{l.status}</span>,
          new Date(l.timestamp).toLocaleString('en-IN'),
        ])}
      />
    </div>
  );
};

// ─── Reusable Admin Table ─────────────────────────────────────────────────
const AdminTable: React.FC<{ headers: string[]; rows: React.ReactNode[][] }> = ({ headers, rows }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--border)' }}>
          {headers.map((h) => (
            <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: '3rem', color: 'var(--fg-muted)' }}>No data available.</td></tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '0.875rem 1rem', verticalAlign: 'middle' }}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default AdminDashboardPage;
