import { useState } from 'react';
import { Minimize2, X, Plus, Search, Sparkles, Menu } from 'lucide-react';
import type { ChatMessage, Conversation } from './chatData';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

const C = {
  bg: 'rgb(19,19,19)',
  card: 'rgb(24,24,24)',
  card2: 'rgb(36,36,36)',
  border: 'rgb(37,37,37)',
  border2: 'rgb(48,48,48)',
  sub: 'rgb(163,163,163)',
  text: 'rgb(250,250,250)',
  brand: 'rgb(0,145,255)',
  brand50: 'rgb(16,36,62)',
};

interface ExpandedChatProps {
  conversations: Conversation[];
  activeConversationId: string;
  messages: ChatMessage[];
  isTyping: boolean;
  onSend: (text: string) => void;
  onSelectConversation: (id: string) => void;
  onMinimize: () => void;
  onClose: () => void;
}

function ConversationList({
  conversations,
  activeId,
  onSelect,
  searchQuery,
  onSearchChange,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Conversations</span>
          <button
            aria-label="Nouvelle conversation"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `1px solid ${C.border2}`,
              background: 'transparent',
              color: C.sub,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.brand;
              e.currentTarget.style.borderColor = C.brand;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.sub;
              e.currentTarget.style.borderColor = C.border2;
            }}
          >
            <Plus size={14} />
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: C.card2,
            borderRadius: 8,
            padding: '6px 10px',
            border: `1px solid ${C.border}`,
          }}
        >
          <Search size={13} color={C.sub} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: C.text,
              fontSize: 12,
              fontFamily: "'Rubik', sans-serif",
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {filtered.map((conv) => {
          const isActive = conv.id === activeId;
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 10,
                border: 'none',
                background: isActive ? C.brand50 : 'transparent',
                borderLeft: isActive ? `3px solid ${C.brand}` : '3px solid transparent',
                cursor: 'pointer',
                marginBottom: 2,
                transition: 'all 150ms',
                fontFamily: "'Rubik', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = C.card2;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: C.text, marginBottom: 3 }}>
                {conv.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.sub,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {conv.preview}
              </div>
              <div style={{ fontSize: 10, color: C.sub, marginTop: 4, opacity: 0.7 }}>{conv.date}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ExpandedChat({
  conversations,
  activeConversationId,
  messages,
  isTyping,
  onSend,
  onSelectConversation,
  onMinimize,
  onClose,
}: ExpandedChatProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const activeConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        display: 'flex',
        background: 'rgba(0,0,0,.6)',
        backdropFilter: 'blur(4px)',
        animation: 'chatFadeIn 200ms ease-out',
        fontFamily: "'Rubik', sans-serif",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          margin: 'auto',
          width: '92vw',
          maxWidth: 1100,
          height: '88vh',
          maxHeight: 750,
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,.6)',
          display: 'flex',
          overflow: 'hidden',
          animation: 'chatScaleIn 200ms ease-out',
        }}
      >
        <div
          style={{
            width: sidebarOpen ? 280 : 0,
            minWidth: sidebarOpen ? 280 : 0,
            borderRight: sidebarOpen ? `1px solid ${C.border}` : 'none',
            background: C.card,
            overflow: 'hidden',
            transition: 'all 250ms ease',
            flexShrink: 0,
          }}
        >
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={onSelectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 18px',
              borderBottom: `1px solid ${C.border}`,
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Basculer la barre latérale"
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
              <Menu size={14} />
            </button>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgb(0,145,255), rgb(0,110,200))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={13} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeConv?.title || 'Assistant IA'}
              </div>
            </div>
            <button
              onClick={onMinimize}
              aria-label="Réduire"
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
              <Minimize2 size={14} />
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
      </div>
    </div>
  );
}
