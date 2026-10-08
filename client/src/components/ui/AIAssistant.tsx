import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, ArrowUpRight } from 'lucide-react';
import { useBookSession } from '../../hooks/useBookSession';
import api from '../../api/axios';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  actionButtons?: Array<{ label: string; action: string; url: string }>;
}

const INITIAL_MESSAGE: Message = {
  id: '0',
  type: 'ai',
  content: "Hey there! 👋 Welcome to AVIOX. How can I help you today?",
  actionButtons: [
    { label: 'Explore Programs', action: 'navigate', url: '/#programs' },
    { label: 'Book a Session', action: 'book_session', url: 'Hi AVIOX! I want to book a session.' },
  ],
};

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const handleBookSession = useBookSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowGreeting(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: text });
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.data.content,
        actionButtons: data.data.actionButtons,
      };
      setMessages((m) => [...m, aiMsg]);
    } catch {
      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now. Please reach us directly on WhatsApp at +91 8921757960 or email futureaviox@gmail.com",
        actionButtons: [{ label: 'WhatsApp Us', action: 'whatsapp', url: 'https://wa.me/918921757960' }],
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (btn: { action: string; url: string }) => {
    if (btn.action === 'book_session') {
      handleBookSession(undefined, btn.url);
    } else if (btn.action === 'whatsapp' || btn.action === 'email') {
      window.open(btn.url, '_blank');
    } else if (btn.action === 'navigate') {
      const hash = btn.url.replace('/#', '');
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <div className="ai-chat">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div style={{ padding: '1rem 1.25rem', background: 'var(--fg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'var(--bg-primary)', letterSpacing: '-0.01em' }}>AVIOX AI</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.4)' }}>Career Assistant</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,243,239,0.5)', padding: '0.25rem', display: 'flex' }}>
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }} data-lenis-prevent>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '0.75rem 1rem',
                      fontSize: '0.8rem',
                      lineHeight: 1.6,
                      background: msg.type === 'user' ? 'var(--fg-primary)' : 'var(--bg-secondary)',
                      color: msg.type === 'user' ? 'var(--bg-primary)' : 'var(--fg-primary)',
                      border: msg.type === 'ai' ? '1px solid var(--border)' : 'none',
                      whiteSpace: 'pre-line',
                    }}>
                      {msg.content}
                    </div>
                  </div>

                  {msg.actionButtons && msg.actionButtons.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {msg.actionButtons.map((btn, bi) => (
                        <button
                          key={bi}
                          onClick={() => handleAction(btn)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '0.6rem',
                            fontWeight: 500,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--fg-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--fg-primary)'; e.currentTarget.style.color = 'var(--bg-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
                        >
                          {btn.label} <ArrowUpRight size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <div style={{ display: 'flex', gap: '4px', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', alignSelf: 'flex-start' }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--fg-muted)' }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask AVIOX AI anything..."
                className="input"
                style={{ flex: 1, fontSize: '0.8rem', padding: '0.625rem 0.875rem' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  width: '2.5rem', height: '2.5rem', background: 'var(--fg-primary)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)',
                  opacity: !input.trim() || isLoading ? 0.5 : 1, transition: 'opacity 0.2s', flexShrink: 0,
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button & Greeting */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence>
          {showGreeting && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '1rem',
                background: 'var(--fg-primary)',
                color: 'var(--bg-primary)',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                borderBottomRightRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 500,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                fontFamily: 'Outfit, sans-serif',
                border: '1px solid var(--border-strong)'
              }}
            >
              Hi 👋 I’m AVIOX AI! Need any help?
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="ai-chat-trigger"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: isOpen ? 0 : [0, -8, 0] }}
          transition={{ y: { duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }}
          aria-label="Open AVIOX AI Assistant"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={20} color="#F5F3EF" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#F5F3EF" />
                <motion.span
                  animate={{ rotate: [0, 20, -10, 20, -10, 20, 0, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                  style={{ position: 'absolute', top: 5, right: 6, fontSize: '14px', transformOrigin: 'bottom center' }}
                >
                  👋
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default AIAssistant;
