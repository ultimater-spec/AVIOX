import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Ticket as TicketIcon } from 'lucide-react';
import api, { adminApi } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  isAdmin?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const queryKey = isAdmin ? ['admin-notifications'] : ['user-notifications'];
  const endpoint = isAdmin ? '/notifications/admin' : '/notifications/my';
  const apiInstance = isAdmin ? adminApi : api;

  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiInstance.get(endpoint);
      return res.data.data;
    },
    refetchInterval: 30000, // auto refetch every 30s
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => apiInstance.patch(`${endpoint}/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => apiInstance.post(`${endpoint}/read-all`),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: any) => {
    if (!notif.isRead) markAsRead.mutate(notif._id);
    setIsOpen(false);
    
    // Navigate to respective dashboard tickets section
    if (isAdmin) {
      // Assuming AdminDashboard manages tabs internally, navigate to dashboard 
      // Ideally we would want to open the specific ticket, but linking to the tickets page is fine for now
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.notifications || [];

  return (
    <div className="relative" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--fg-primary)'
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-8px',
            background: '#EF4444',
            color: 'white',
            fontSize: '0.6rem',
            fontWeight: 'bold',
            padding: '2px 5px',
            borderRadius: '10px',
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          width: '320px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 600, margin: 0 }}>Notifications</h4>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAllAsRead.mutate()}
                style={{ background: 'none', border: 'none', fontSize: '0.65rem', color: '#4F46E5', cursor: 'pointer', fontWeight: 500 }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--fg-muted)', fontSize: '0.8rem' }}>
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif: any) => (
                <div 
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid var(--border)', 
                    cursor: 'pointer',
                    background: notif.isRead ? 'transparent' : 'rgba(79, 70, 229, 0.05)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(79, 70, 229, 0.05)')}
                >
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ 
                      color: notif.type.includes('RESOLVED') ? '#10B981' : 
                             notif.type.includes('CLOSED') ? '#6B7280' : 
                             notif.type.includes('CHANGED') ? '#F59E0B' : '#4F46E5',
                      marginTop: '0.2rem'
                    }}>
                      {notif.type.includes('RESOLVED') || notif.type.includes('CLOSED') ? <Check size={16} /> : <TicketIcon size={16} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: notif.isRead ? 500 : 700, fontFamily: 'Outfit, sans-serif' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                        {notif.message}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--fg-muted)', marginTop: '0.5rem', opacity: 0.7 }}>
                        {new Date(notif.createdAt).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
              }}
              style={{ background: 'none', border: 'none', fontSize: '0.7rem', color: 'var(--fg-primary)', cursor: 'pointer', fontWeight: 500 }}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
