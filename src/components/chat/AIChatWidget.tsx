import { useState, useCallback, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { CONVERSATIONS, CANNED_RESPONSES } from './chatData';
import type { ChatMessage, Conversation } from './chatData';
import { CompactChat } from './CompactChat';
import { ExpandedChat } from './ExpandedChat';

type ViewMode = 'closed' | 'compact' | 'expanded';

export function AIChatWidget() {
  const [mode, setMode] = useState<ViewMode>('closed');
  const [closing, setClosing] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState(CONVERSATIONS[0].id);
  const [isTyping, setIsTyping] = useState(false);
  const [responseIdx, setResponseIdx] = useState(0);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const activeMessages = activeConv?.messages || [];

  const handleClose = useCallback(() => {
    if (mode === 'compact') {
      setClosing(true);
      setTimeout(() => {
        setMode('closed');
        setClosing(false);
      }, 150);
    } else {
      setMode('closed');
    }
  }, [mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode !== 'closed') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mode, handleClose]);

  const handleSend = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        text,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, messages: [...c.messages, userMsg] } : c))
      );

      setIsTyping(true);

      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'ai',
          text: CANNED_RESPONSES[responseIdx % CANNED_RESPONSES.length],
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConvId ? { ...c, messages: [...c.messages, aiMsg] } : c))
        );
        setIsTyping(false);
        setResponseIdx((i) => i + 1);
      }, 1200);
    },
    [activeConvId, responseIdx]
  );

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConvId(id);
  }, []);

  const toggleOpen = () => {
    if (mode === 'closed') {
      setMode('compact');
    } else {
      handleClose();
    }
  };

  return (
    <>
      {mode === 'compact' && (
        <CompactChat
          messages={activeMessages}
          isTyping={isTyping}
          onSend={handleSend}
          onExpand={() => setMode('expanded')}
          onClose={handleClose}
          closing={closing}
        />
      )}

      {mode === 'expanded' && (
        <ExpandedChat
          conversations={conversations}
          activeConversationId={activeConvId}
          messages={activeMessages}
          isTyping={isTyping}
          onSend={handleSend}
          onSelectConversation={handleSelectConversation}
          onMinimize={() => setMode('compact')}
          onClose={handleClose}
        />
      )}

      {mode !== 'expanded' && (
        <button
          onClick={toggleOpen}
          aria-label={mode === 'closed' ? "Ouvrir l'assistant IA" : 'Fermer le chat'}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, rgb(0,145,255), rgb(0,110,200))',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,145,255,.35)',
            zIndex: 10000,
            transition: 'transform 150ms ease, box-shadow 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,145,255,.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,145,255,.35)';
          }}
        >
          {mode === 'closed' ? <Sparkles size={22} /> : <X size={22} />}
        </button>
      )}
    </>
  );
}
