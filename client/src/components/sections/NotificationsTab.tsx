import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Ticket as TicketIcon } from 'lucide-react';
import api, { adminApi } from '../../api/axios';

interface NotificationsTabProps {
  isAdmin?: boolean;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ isAdmin = false }) => {
  const qc = useQueryClient();
  const queryKey = isAdmin ? ['admin-notifications'] : ['user-notifications'];
  const endpoint = isAdmin ? '/notifications/admin' : '/notifications/my';
  const apiInstance = isAdmin ? adminApi : api;

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiInstance.get(endpoint);
      return res.data.data;
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => apiInstance.patch(`${endpoint}/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => apiInstance.post(`${endpoint}/read-all`),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fg-muted)' }}>Loading notifications...</div>;
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>
          Notifications {unreadCount > 0 && <span style={{ fontSize: '0.8rem', color: '#EF4444', marginLeft: '0.5rem' }}>({unreadCount} new)</span>}
        </h2>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllAsRead.mutate()}
            className="btn-ghost"
            style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Check size={14} /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fg-muted)', border: '1px dashed var(--border)' }}>
          <Bell size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          You're all caught up! No notifications right now.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notif: any) => (
            <div 
              key={notif._id} 
              className="card" 
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'flex-start',
                borderLeft: notif.isRead ? '1px solid var(--border)' : '3px solid #4F46E5',
                padding: '1.25rem'
              }}
            >
              <div style={{ 
                background: 'var(--bg-primary)', 
                padding: '0.75rem', 
                borderRadius: '8px',
                color: notif.type.includes('RESOLVED') ? '#10B981' : 
                       notif.type.includes('CLOSED') ? '#6B7280' : 
                       notif.type.includes('CHANGED') ? '#F59E0B' : '#4F46E5',
              }}>
                {notif.type.includes('RESOLVED') || notif.type.includes('CLOSED') ? <Check size={20} /> : <TicketIcon size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: notif.isRead ? 600 : 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {notif.title}
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)' }}>
                    {new Date(notif.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginTop: '0.5rem', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {notif.message}
                </div>
                
                {notif.relatedTicket && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#4F46E5', fontWeight: 500 }}>
                    Reference: #{notif.relatedTicket.ticketId}
                  </div>
                )}
                
                {!notif.isRead && (
                  <button 
                    onClick={() => markAsRead.mutate(notif._id)}
                    className="btn-ghost"
                    style={{ marginTop: '1rem', fontSize: '0.7rem', padding: '0.4rem 0.8rem', display: 'inline-flex' }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
