import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VerificationContextType {
  promptVerification: (redirectMsg?: string) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) throw new Error('useVerification must be used within VerificationProvider');
  return context;
};

export const VerificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMsg, setPendingMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const promptVerification = (redirectMsg?: string) => {
    if (redirectMsg) setPendingMsg(redirectMsg);
    setIsOpen(true);
  };

  const handleVerifyNow = () => {
    if (pendingMsg) sessionStorage.setItem('pendingBookingMsg', pendingMsg);
    setIsOpen(false);
    navigate('/profile');
  };

  const handleCancel = () => {
    setIsOpen(false);
    setPendingMsg(null);
  };

  return (
    <VerificationContext.Provider value={{ promptVerification }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            padding: '1rem'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: 'var(--fg-primary)',
                color: 'var(--bg-primary)',
                padding: '2.5rem 2rem',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              <button 
                onClick={handleCancel}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'rgba(245,243,239,0.5)', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#F5F3EF'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245,243,239,0.5)'}
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 0 rgba(245,243,239,0)', '0 0 20px rgba(245,243,239,0.2)', '0 0 0 rgba(245,243,239,0)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'rgba(245,243,239,0.05)', border: '1px solid rgba(245,243,239,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem', color: '#F5F3EF'
                  }}
                >
                  <Smartphone size={32} />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}
                >
                  Mobile Verification Required
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  style={{ fontSize: '0.9rem', color: 'rgba(245,243,239,0.6)', marginBottom: '2.5rem', lineHeight: 1.5, padding: '0 1rem' }}
                >
                  Please verify your mobile number before booking a session.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  style={{ display: 'flex', gap: '1rem', width: '100%' }}
                >
                  <button 
                    onClick={handleCancel}
                    style={{ flex: 1, padding: '0.875rem', borderRadius: '8px', background: 'rgba(245,243,239,0.05)', color: '#F5F3EF', border: '1px solid rgba(245,243,239,0.1)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,243,239,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245,243,239,0.05)'; }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleVerifyNow}
                    style={{ flex: 1, padding: '0.875rem', borderRadius: '8px', background: '#F5F3EF', color: 'var(--fg-primary)', border: '1px solid #F5F3EF', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    Verify Now
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </VerificationContext.Provider>
  );
};
