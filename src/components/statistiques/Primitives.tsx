import { useEffect, useCallback, useState, type ReactNode, type CSSProperties } from 'react';
import { X } from 'lucide-react';
import { C } from './data';

export function Overlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
        animation: 'statFadeIn 150ms ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}

export function ModalShell({
  children, onClose, width = 560,
}: { children: ReactNode; onClose: () => void; width?: number }) {
  return (
    <Overlay onClose={onClose}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 14, width, maxWidth: '94vw', maxHeight: '90vh',
        overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.5)',
        fontFamily: "'Rubik', sans-serif",
        animation: 'statScaleIn 150ms ease',
      }}>
        {children}
      </div>
    </Overlay>
  );
}

export function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 22px', borderBottom: `1px solid ${C.border}`,
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <button onClick={onClose} aria-label="Fermer" style={{
        width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
        background: C.card2, border: `1px solid ${C.border2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub,
      }}>
        <X size={14} />
      </button>
    </div>
  );
}

export function Pill({
  children, active, onClick, color,
}: { children: ReactNode; active: boolean; onClick: () => void; color?: string }) {
  const ac = color || C.brand;
  return (
    <button onClick={onClick} style={{
      borderRadius: 99, border: `1px solid ${active ? `${ac}4d` : C.border2}`,
      background: active ? `${ac}1e` : 'transparent',
      color: active ? ac : C.sub,
      fontSize: 11, fontWeight: 500, padding: '5px 12px', cursor: 'pointer',
      fontFamily: "'Rubik', sans-serif", transition: 'all 150ms',
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      {children}
    </button>
  );
}

export function PrimaryBtn({
  children, onClick, disabled, style: extra,
}: { children: ReactNode; onClick?: () => void; disabled?: boolean; style?: CSSProperties }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? C.n300 : C.brand, color: C.white,
      borderRadius: 8, border: 'none', padding: '9px 18px',
      fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: "'Rubik', sans-serif", transition: 'opacity 150ms',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      opacity: disabled ? .5 : 1,
      ...extra,
    }}>
      {children}
    </button>
  );
}

export function SecondaryBtn({
  children, onClick, style: extra,
}: { children: ReactNode; onClick?: () => void; style?: CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', color: C.sub,
      borderRadius: 8, border: `1px solid ${C.border2}`, padding: '9px 18px',
      fontSize: 13, fontWeight: 600, cursor: 'pointer',
      fontFamily: "'Rubik', sans-serif", transition: 'all 150ms',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      ...extra,
    }}>
      {children}
    </button>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: C.n400,
      textTransform: 'uppercase', letterSpacing: '.04em',
    }}>
      {children}
    </div>
  );
}

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 2600);
    const t2 = setTimeout(onDone, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      zIndex: 99999, opacity: visible ? 1 : 0, transition: 'opacity 300ms',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.ok}`, borderRadius: 10,
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,.5)',
        fontFamily: "'Rubik', sans-serif",
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8" fill={C.ok} />
          <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{message}</span>
      </div>
    </div>
  );
}

export function SkeletonPulse({ width = '100%', height = 80, borderRadius = 8 }: { width?: number | string; height?: number; borderRadius?: number }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: C.card2, animation: 'statPulse 1.2s ease infinite',
    }} />
  );
}
