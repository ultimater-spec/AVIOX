import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { Plus, CheckCircle, Send, X, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface Message {
  _id: string;
  sender: 'user' | 'admin';
  senderName: string;
  content: string;
  createdAt: string;
}

interface Ticket {
  _id: string;
  ticketId: string;
  subject: string;
  category: string;
  priority: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  description: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export const TicketsTab: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'success' | 'detail'>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: async () => {
      const res = await api.get('/tickets/my');
      return res.data.data.tickets as Ticket[];
    },
  });

  const openTicketsCount = tickets?.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length || 0;
  const resolvedTicketsCount = tickets?.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length || 0;

  const handleViewTicket = (id: string) => {
    setSelectedTicketId(id);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTicketId(null);
    setCreatedTicketId(null);
    refetch();
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Stats Header */}
      {view === 'list' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ cursor: 'default' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em' }}>{openTicketsCount}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem' }}>Open Tickets</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>Awaiting resolution</div>
            </div>
            <div className="card" style={{ cursor: 'default' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em' }}>{resolvedTicketsCount}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem' }}>Resolved Tickets</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>Successfully closed</div>
            </div>
            <div className="card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px dashed var(--border)', transition: 'all 0.2s' }} onClick={() => setView('create')} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--fg-primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
              <Plus size={24} style={{ marginBottom: '0.5rem', color: 'var(--fg-primary)' }} />
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}>Create New Ticket</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>My Tickets</h2>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--fg-muted)' }}>
              <Loader2 size={24} className="spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
              Loading your tickets...
            </div>
          ) : tickets?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed var(--border)', borderRadius: '1rem', background: 'var(--bg-secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>No support tickets yet</h3>
              <p style={{ color: 'var(--fg-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Need help? Create a ticket and our team will assist you.</p>
              <button onClick={() => setView('create')} className="btn-primary" style={{ margin: '0 auto', fontSize: '0.75rem', padding: '0.625rem 1.25rem' }}>
                Create Your First Ticket
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tickets?.map(t => (
                <div key={t._id} className="card hover-scale" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', cursor: 'pointer', padding: '1.25rem' }} onClick={() => handleViewTicket(t._id)}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--fg-primary)' }}>{t.ticketId}</span>
                      <span className="tag" style={{ fontSize: '0.6rem' }}>{t.category}</span>
                      {t.priority === 'HIGH' || t.priority === 'URGENT' ? (
                        <span className="tag" style={{ fontSize: '0.6rem', color: '#ff4d4f', background: 'rgba(255, 77, 79, 0.1)', borderColor: 'rgba(255, 77, 79, 0.2)' }}>{t.priority}</span>
                      ) : null}
                    </div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{t.subject}</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', display: 'flex', gap: '1rem' }}>
                      <span>Created: {new Date(t.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(t.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`status-badge status-${t.status.toLowerCase().replace('_', '-')}`}>{t.status.replace('_', ' ')}</span>
                    <div style={{ color: 'var(--fg-muted)' }}><ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'create' && (
        <CreateTicketForm 
          onCancel={() => setView('list')} 
          onSuccess={(ticketId) => {
            setCreatedTicketId(ticketId);
            setView('success');
            queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
          }} 
        />
      )}

      {view === 'success' && (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border)', animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={32} />
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ticket Created Successfully</h2>
          <p style={{ color: 'var(--fg-muted)', marginBottom: '2rem' }}>Your support request has been submitted successfully.<br/>Ticket <strong style={{ color: 'var(--fg-primary)' }}>{createdTicketId}</strong> has been created.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={handleBackToList} className="btn-secondary" style={{ fontSize: '0.75rem' }}>Back to Tickets</button>
            <button onClick={() => {
              const ticket = tickets?.find(t => t.ticketId === createdTicketId);
              if (ticket) handleViewTicket(ticket._id);
              else handleBackToList();
            }} className="btn-primary" style={{ fontSize: '0.75rem' }}>View Ticket</button>
          </div>
        </div>
      )}

      {view === 'detail' && selectedTicketId && (
        <TicketDetail ticketId={selectedTicketId} onBack={handleBackToList} />
      )}
    </div>
  );
};

const CreateTicketForm: React.FC<{ onCancel: () => void; onSuccess: (ticketId: string) => void }> = ({ onCancel, onSuccess }) => {
  const [form, setForm] = useState({ subject: '', category: '', priority: 'MEDIUM', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.subject.trim()) newErrors.subject = "Please enter a subject.";
    if (!form.category) newErrors.category = "Please select a category.";
    if (!form.description.trim()) newErrors.description = "Please describe your issue.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const res = await api.post('/tickets', form);
      onSuccess(res.data.data.ticket.ticketId);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Something went wrong while creating your ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', animation: 'slideUp 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>Create New Ticket</h2>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--fg-muted)', cursor: 'pointer' }}><X size={20} /></button>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="input-label">Subject <span style={{ color: '#ff4d4f' }}>*</span></label>
          <input 
            type="text" 
            className={`input ${errors.subject ? 'error' : ''}`} 
            value={form.subject} 
            onChange={(e) => { setForm(f => ({ ...f, subject: e.target.value })); if(errors.subject) setErrors(e => ({...e, subject: ''})); }} 
            placeholder="e.g. Unable to book AI session" 
            style={{ borderColor: errors.subject ? '#ff4d4f' : undefined }}
          />
          {errors.subject && <div style={{ color: '#ff4d4f', fontSize: '0.7rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12}/> {errors.subject}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="input-label">Category <span style={{ color: '#ff4d4f' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <select 
                className={`input ${errors.category ? 'error' : ''}`} 
                value={form.category} 
                onChange={(e) => { setForm(f => ({ ...f, category: e.target.value })); if(errors.category) setErrors(e => ({...e, category: ''})); }} 
                style={{ cursor: 'pointer', appearance: 'none', borderColor: errors.category ? '#ff4d4f' : undefined }}
              >
                <option value="" disabled>Select category</option>
                {['Account', 'Course', 'Session Booking', 'Payment', 'Technical Issue', 'Certificate', 'Other'].map((c) => (
                  <option key={c} value={c === 'Account' ? 'General' : c === 'Session Booking' ? 'Session' : c === 'Payment' ? 'Billing' : c === 'Technical Issue' ? 'Technical' : c === 'Certificate' ? 'Course' : c}>{c}</option>
                ))}
              </select>
            </div>
            {errors.category && <div style={{ color: '#ff4d4f', fontSize: '0.7rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12}/> {errors.category}</div>}
          </div>

          <div>
            <label className="input-label">Priority</label>
            <select 
              className="input" 
              value={form.priority} 
              onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))} 
              style={{ cursor: 'pointer', appearance: 'none' }}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="input-label">Description <span style={{ color: '#ff4d4f' }}>*</span></label>
          <textarea 
            className={`input ${errors.description ? 'error' : ''}`} 
            value={form.description} 
            onChange={(e) => { setForm(f => ({ ...f, description: e.target.value })); if(errors.description) setErrors(e => ({...e, description: ''})); }} 
            placeholder="Describe your issue in detail..." 
            rows={5} 
            style={{ resize: 'vertical', borderColor: errors.description ? '#ff4d4f' : undefined }} 
          />
          {errors.description && <div style={{ color: '#ff4d4f', fontSize: '0.7rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12}/> {errors.description}</div>}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ flex: 1, justifyContent: 'center' }}>
            {isSubmitting ? <Loader2 size={16} className="spin" /> : 'Submit Ticket'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting} style={{ flex: 1, justifyContent: 'center' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const TicketDetail: React.FC<{ ticketId: string; onBack: () => void }> = ({ ticketId, onBack }) => {
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const res = await api.get(`/tickets/my/${ticketId}`);
      return res.data.data.ticket as Ticket;
    },
    refetchInterval: 10000, // Poll for updates
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    
    setIsReplying(true);
    try {
      await api.post(`/tickets/${ticketId}/reply`, { content: reply });
      setReply('');
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
    } catch {
      toast.error('Failed to send reply. Please try again.');
    } finally {
      setIsReplying(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--fg-muted)' }}>
        <Loader2 size={32} className="spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
        Loading ticket details...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--fg-muted)' }}>
        Ticket not found. <button onClick={onBack} className="btn-ghost" style={{ textDecoration: 'underline' }}>Go back</button>
      </div>
    );
  }

  const isClosed = ticket.status === 'CLOSED' || ticket.status === 'RESOLVED';

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', maxHeight: '800px', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
        <button onClick={onBack} className="btn-ghost" style={{ padding: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--fg-muted)' }}>
          <ArrowLeft size={16} /> Back to Tickets
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--fg-primary)' }}>{ticket.ticketId}</span>
              <span className={`status-badge status-${ticket.status.toLowerCase().replace('_', '-')}`}>{ticket.status.replace('_', ' ')}</span>
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{ticket.subject}</h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', display: 'flex', gap: '1rem' }}>
              <span>Category: {ticket.category}</span>
              <span>Priority: {ticket.priority}</span>
              <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {ticket.messages.map((msg, i) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg._id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--fg-muted)' }}>{isUser ? 'You' : 'AVIOX Support'}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--border)' }}>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ 
                maxWidth: '80%', 
                padding: '1rem', 
                borderRadius: '0.75rem', 
                background: isUser ? 'var(--fg-primary)' : 'var(--bg-primary)', 
                color: isUser ? 'var(--bg-primary)' : 'var(--fg-primary)',
                border: isUser ? 'none' : '1px solid var(--border)',
                borderTopRightRadius: isUser ? 0 : '0.75rem',
                borderTopLeftRadius: isUser ? '0.75rem' : 0,
                fontSize: '0.9rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply Box */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
        {isClosed ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--fg-muted)', fontSize: '0.85rem' }}>
            This ticket is {ticket.status.toLowerCase()}. You cannot reply to a closed ticket.
          </div>
        ) : (
          <form onSubmit={handleReply} style={{ display: 'flex', gap: '1rem' }}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              className="input"
              rows={1}
              style={{ flex: 1, resize: 'none', padding: '0.875rem 1rem', minHeight: '3rem', maxHeight: '8rem', height: 'auto' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleReply(e);
                }
              }}
            />
            <button type="submit" disabled={!reply.trim() || isReplying} className="btn-primary" style={{ padding: '0 1.5rem', height: 'auto' }}>
              {isReplying ? <Loader2 size={16} className="spin" /> : <><Send size={16} style={{ marginRight: '0.5rem' }} /> Send</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
