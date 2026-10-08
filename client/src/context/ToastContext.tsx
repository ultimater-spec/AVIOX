import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context.toast;
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const DURATION = 4000;

  React.useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 size={18} color="#22C55E" />;
      case 'error': return <AlertCircle size={18} color="#EF4444" />;
      case 'warning': return <AlertTriangle size={18} color="#F59E0B" />;
      case 'info': return <Info size={18} color="#3B82F6" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{
        position: 'relative',
        background: 'var(--fg-primary)',
        color: 'var(--bg-primary)',
        padding: '0.875rem 1rem',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        width: '100%',
        maxWidth: '350px',
        pointerEvents: 'auto',
        overflow: 'hidden',
        border: '1px solid var(--border-strong)',
        fontFamily: 'Outfit, sans-serif'
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ flexShrink: 0, display: 'flex', marginTop: '2px' }}
      >
        {getIcon()}
      </motion.div>
      <div style={{ flex: 1, fontSize: '0.85rem', lineHeight: 1.4, fontWeight: 500, paddingRight: '1rem' }}>
        {toast.message}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          color: 'rgba(245,243,239,0.5)', display: 'flex', flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#F5F3EF'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245,243,239,0.5)'}
      >
        <X size={16} />
      </button>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: DURATION / 1000, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: toast.type === 'success' ? '#22C55E' : toast.type === 'error' ? '#EF4444' : toast.type === 'warning' ? '#F59E0B' : '#3B82F6',
          opacity: 0.8
        }}
      />
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = React.useMemo(() => ({
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    warning: (msg: string) => addToast(msg, 'warning'),
    info: (msg: string) => addToast(msg, 'info')
  }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          pointerEvents: 'none',
          alignItems: 'flex-end',
          maxWidth: '100vw',
          padding: '0 1rem'
        }}
        className="toast-container-mobile"
      >
        <AnimatePresence>
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
