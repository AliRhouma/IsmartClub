import { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { SUGGESTIONS } from './chatData';

const C = {
  card: 'rgb(24,24,24)',
  card2: 'rgb(36,36,36)',
  border: 'rgb(37,37,37)',
  border2: 'rgb(48,48,48)',
  sub: 'rgb(163,163,163)',
  text: 'rgb(250,250,250)',
  brand: 'rgb(0,145,255)',
};

interface ChatInputProps {
  onSend: (text: string) => void;
  showSuggestions?: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, showSuggestions = false, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, padding: '10px 14px 14px' }}>
      {showSuggestions && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setValue(s);
                inputRef.current?.focus();
              }}
              style={{
                padding: '5px 12px',
                borderRadius: 99,
                border: `1px solid ${C.border2}`,
                background: 'transparent',
                color: C.sub,
                fontSize: 11,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'Rubik', sans-serif",
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.brand;
                e.currentTarget.style.color = C.brand;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border2;
                e.currentTarget.style.color = C.sub;
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: C.card2,
          borderRadius: 12,
          padding: '4px 4px 4px 14px',
          border: `1px solid ${C.border}`,
          transition: 'border-color 150ms',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez une question..."
          disabled={disabled}
          aria-label="Message à l'assistant IA"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: C.text,
            fontSize: 13,
            fontFamily: "'Rubik', sans-serif",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          aria-label="Envoyer"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: 'none',
            background: value.trim() && !disabled ? C.brand : C.border,
            color: value.trim() && !disabled ? '#fff' : C.sub,
            cursor: value.trim() && !disabled ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 150ms',
            flexShrink: 0,
          }}
        >
          <SendHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
