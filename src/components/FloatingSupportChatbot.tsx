import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
}

const DEFAULT_WELCOME: ChatMessage = {
  id: 'welcome-1',
  sender: 'support',
  text: "👋 Hello! I'm your ReviewInsight Support Assistant.\n\nI can help you troubleshoot website issues, understand review sentiment calculations, handle 1-star complaints, and guide you through the analytics dashboard.\n\nWhat can I help you with today?",
  time: 'Just now'
};

const QUICK_PROMPTS = [
  'How to analyze customer reviews?',
  'Troubleshoot login / password',
  'How is sentiment score calculated?',
  'Tips for handling 1-star complaints',
  'How to export or print PDF report?'
];

export const FloatingSupportChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
      setHasUnread(false);
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply || "I'm here to help! Please let me know which feature or error you'd like assistance with.";
        
        const supportMessage: ChatMessage = {
          id: `support-${Date.now()}`,
          sender: 'support',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, supportMessage]);
        setIsTyping(false);
        if (!isOpen || isMinimized) {
          setHasUnread(true);
        }
        return;
      }
    } catch {
      // offline fallback
    }

    // Local fallback support response
    setTimeout(() => {
      let fallbackText = "Our support team is always ready to help. For urgent technical issues, ensure your server is active on port 3000 and verify network connectivity.";
      const q = trimmed.toLowerCase();
      if (q.includes('login') || q.includes('password') || q.includes('21062006')) {
        fallbackText = "Login Support:\n1. The demo owner password is 21062006.\n2. Click the eye icon to verify digits.\n3. Re-enter the password if your session expires.";
      } else if (q.includes('sentiment') || q.includes('score')) {
        fallbackText = "Sentiment Support:\n• Reviews are tokenized and scored against 180+ business polarity terms.\n• 70%+ is Positive, 45-69% is Neutral, <45% is Negative.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `support-${Date.now()}`,
          sender: 'support',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
      if (!isOpen || isMinimized) {
        setHasUnread(true);
      }
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <aside
      className="floating-support-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        fontFamily: 'inherit'
      }}
      aria-label="Customer Support Chatbot"
    >
      {/* Floating Chat Trigger Button (shown when closed or minimized) */}
      {!isOpen && (
        <button
          type="button"
          id="open-support-chat"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setHasUnread(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            backgroundColor: '#0f3c88',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            boxShadow: '0 8px 24px rgba(15, 60, 136, 0.35)',
            cursor: 'pointer',
            fontSize: '0.92rem',
            fontWeight: 700,
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          title="Open Customer Support Chatbot"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem' }}>💬</span>
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '10px',
                height: '10px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                border: '2px solid #0f3c88'
              }}
            />
          </div>
          <span>Support &amp; Help</span>
          {hasUnread && (
            <span
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 800
              }}
            >
              1
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="support-chat-window"
          style={{
            width: '360px',
            maxWidth: 'calc(100vw - 32px)',
            height: isMinimized ? '54px' : '520px',
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(7, 26, 59, 0.22)',
            border: '1px solid #bfd2f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'height 0.2s ease-in-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #071a3b, #1546b3)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1rem'
                }}
              >
                🛠️
              </div>
              <div>
                <b style={{ display: 'block', fontSize: '0.9rem', lineHeight: '1.2' }}>Support &amp; Troubleshooting</b>
                <span style={{ fontSize: '0.72rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                  Online · Instant Guidance
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                id="minimize-chat-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '4px'
                }}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? '□' : '−'}
              </button>
              <button
                type="button"
                id="close-chat-btn"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '4px'
                }}
                title="Close Support Chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body (only when not minimized) */}
          {!isMinimized && (
            <>
              {/* Quick Prompt Chips */}
              <div
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#f1f5fd',
                  borderBottom: '1px solid #e2ebfa',
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  scrollbarWidth: 'none'
                }}
              >
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    style={{
                      padding: '4px 9px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      backgroundColor: '#ffffff',
                      color: '#0f3c88',
                      border: '1px solid #bfd2f0',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Message History */}
              <div
                id="chat-messages-container"
                style={{
                  flex: 1,
                  padding: '14px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: '#f8fafc'
                }}
              >
                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          backgroundColor: isUser ? '#1546b3' : '#ffffff',
                          color: isUser ? '#ffffff' : '#1e293b',
                          fontSize: '0.84rem',
                          lineHeight: '1.45',
                          whiteSpace: 'pre-line',
                          boxShadow: isUser ? '0 2px 8px rgba(21, 70, 179, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.05)',
                          border: isUser ? 'none' : '1px solid #e2ebfa'
                        }}
                      >
                        {m.text}
                      </div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: '#64748b',
                          marginTop: '3px',
                          padding: '0 4px'
                        }}
                      >
                        {m.time}
                      </span>
                    </div>
                  );
                })}

                {isTyping && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      fontSize: '0.78rem',
                      color: '#64748b',
                      fontStyle: 'italic',
                      padding: '4px 8px'
                    }}
                  >
                    Support Specialist is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#ffffff',
                  borderTop: '1px solid #e2ebfa',
                  display: 'flex',
                  gap: '8px'
                }}
              >
                <input
                  ref={inputRef}
                  id="support-chat-input"
                  type="text"
                  placeholder="Ask a support or troubleshooting question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #bfd2f0',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    outline: 'none',
                    color: '#071a3b'
                  }}
                />
                <button
                  type="button"
                  id="send-support-msg"
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: input.trim() ? '#1546b3' : '#cbd5e1',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: input.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
};
