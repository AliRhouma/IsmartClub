import { Maximize2, X, Sparkles } from 'lucide-react';
import type { ChatMessage } from './chatData';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

const C = {
  card: 'rgb(24,24,24)',
  border: 'rgb(37,37,37)',
  text: 'rgb(250,250,250)',
  sub: 'rgb(163,163,163)',
  brand: 'rgb(0,145,255)',
};

interface CompactChatProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSend: (text: string) => void;
  onExpand: () => void;
  onClose: () => void;
  closing: boolean;
}

export function CompactChat({ messages, isTyping, onSend, onExpand, onClose, closing }: CompactChatProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 88,
        right: 24,
        width: 380,
        maxWidth: 'calc(100vw - 24px)',
        height: 520,
        maxHeight: 'calc(100vh - 120px)',
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        boxShadow: '0 16px 48px rgba(0,0,0,.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 10001,
        fontFamily: "'Rubik', sans-serif",
        transformOrigin: 'bottom right',
        animation: closing ? 'chatPopClose 150ms ease-in forwards' : 'chatPopOpen 200ms ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 14px 12px',
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgb(0,145,255), rgb(0,110,200))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Sparkles size={14} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Assistant IA</div>
          <div style={{ fontSize: 11, color: C.sub }}>Posez n'importe quelle question</div>
        </div>
        <button
          onClick={onExpand}
          aria-label="Agrandir"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: 'transparent',
            color: C.sub,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.sub)}
        >
          <Maximize2 size={14} />
        </button>
        <button
          onClick={onClose}
          aria-label="Fermer le chat"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: 'transparent',
            color: C.sub,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.sub)}
        >
          <X size={14} />
        </button>
      </div>

      <ChatMessages messages={messages} isTyping={isTyping} />

      <ChatInput onSend={onSend} showSuggestions={messages.length < 3} disabled={isTyping} />
    </div>
  );
}
