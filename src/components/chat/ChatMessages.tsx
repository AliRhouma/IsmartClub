import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import type { ChatMessage } from './chatData';

const C = {
  bg: 'rgb(19,19,19)',
  card: 'rgb(24,24,24)',
  card2: 'rgb(36,36,36)',
  border: 'rgb(37,37,37)',
  sub: 'rgb(163,163,163)',
  text: 'rgb(250,250,250)',
  brand: 'rgb(0,145,255)',
};

function AiAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgb(0,145,255), rgb(0,110,200))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sparkles size={size * 0.5} color="#fff" />
    </div>
  );
}

function MessageBubble({ msg, showTimestamp }: { msg: ChatMessage; showTimestamp?: boolean }) {
  const isUser = msg.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: 4,
        animation: 'chatSlideUp 200ms ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
          maxWidth: '85%',
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}
      >
        {!isUser && <AiAvatar />}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
            background: isUser ? C.brand : C.card2,
            color: isUser ? '#fff' : C.text,
            fontSize: 13,
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {msg.text}
        </div>
      </div>
      {showTimestamp && (
        <span style={{ fontSize: 10, color: C.sub, padding: isUser ? '0 4px 0 0' : '0 0 0 36px' }}>
          {msg.time}
        </span>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', animation: 'chatSlideUp 200ms ease-out' }}>
      <AiAvatar />
      <div
        style={{
          padding: '12px 18px',
          borderRadius: '14px 14px 14px 4px',
          background: C.card2,
          display: 'flex',
          gap: 4,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: C.sub,
              animation: `chatDotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div
      role="log"
      aria-live="polite"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {messages.map((msg, i) => {
        const showTs = i === messages.length - 1 || messages[i + 1]?.role !== msg.role;
        return <MessageBubble key={msg.id} msg={msg} showTimestamp={showTs} />;
      })}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
