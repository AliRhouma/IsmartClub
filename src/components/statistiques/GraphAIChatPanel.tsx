import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Save, CheckCircle } from 'lucide-react';
import { C } from './data';
import { SkeletonPulse } from './Primitives';
import { RadarChart, BarChart, LineChart, HeatmapChart } from './SvgCharts';
import { GRAPH_CONVERSATIONS } from './graphChatData';
import type { GraphChatMessage } from './graphChatData';

interface GraphAIChatPanelProps {
  conversationId: string;
  isHistory: boolean;
  onClose: () => void;
  onSave: (title: string, chartType: string) => void;
}

const chartComponents: Record<string, (props: { width?: number; height?: number }) => JSX.Element> = {
  radar: RadarChart,
  bar: BarChart,
  line: LineChart,
  heatmap: HeatmapChart,
};

function AiAvatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, rgb(0,145,255), rgb(0,110,200))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Sparkles size={14} color="#fff" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
      background: C.card2, border: `1px solid ${C.border2}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 600, color: C.sub,
    }}>
      AS
    </div>
  );
}

function MessageBubble({ message, isLast, isHistory, isSaved, onSaveChart }: {
  message: GraphChatMessage;
  isLast: boolean;
  isHistory: boolean;
  isSaved: boolean;
  onSaveChart: () => void;
}) {
  const isUser = message.role === 'user';
  const ChartComponent = message.chartType ? chartComponents[message.chartType] : null;

  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'statFadeIn 300ms ease',
    }}>
      {isUser ? <UserAvatar /> : <AiAvatar />}

      <div style={{
        maxWidth: '75%', minWidth: 0,
      }}>
        <div style={{
          background: isUser ? `${C.brand}1a` : C.card2,
          border: `1px solid ${isUser ? `${C.brand}33` : C.border2}`,
          borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          padding: '12px 16px',
        }}>
          <div style={{
            fontSize: 13, color: C.text, lineHeight: 1.55,
            whiteSpace: 'pre-line',
          }}>
            {message.text}
          </div>

          {ChartComponent && (
            <div style={{
              marginTop: 14, padding: 16,
              background: C.bg, borderRadius: 10,
              border: `1px solid ${C.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}>
              {message.chartLabel && (
                <div style={{ fontSize: 11, fontWeight: 600, color: C.sub, textAlign: 'center' }}>
                  {message.chartLabel}
                </div>
              )}
              <ChartComponent width={280} height={160} />
              <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                <LegendDot color={C.brand} label="Mbappé" />
                <LegendDot color={C.ok} label="Bellingham" />
                {message.chartLabel?.includes('Vinícius') && (
                  <LegendDot color={C.warn} label="Vinícius" />
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 4, padding: '0 4px',
        }}>
          <div style={{ fontSize: 10, color: C.n400 }}>
            {message.time}
          </div>

          {!isUser && message.chartType && !isHistory && (
            <button
              onClick={onSaveChart}
              disabled={isSaved}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 600,
                color: isSaved ? C.ok : C.brand,
                background: isSaved ? C.ok50 : `${C.brand}1a`,
                border: `1px solid ${isSaved ? `${C.ok}33` : `${C.brand}33`}`,
                borderRadius: 8, padding: '5px 12px',
                cursor: isSaved ? 'default' : 'pointer',
                transition: 'all 150ms',
                fontFamily: "'Rubik', sans-serif",
              }}
              onMouseEnter={e => {
                if (!isSaved) {
                  e.currentTarget.style.background = `${C.brand}33`;
                }
              }}
              onMouseLeave={e => {
                if (!isSaved) {
                  e.currentTarget.style.background = `${C.brand}1a`;
                }
              }}
            >
              {isSaved ? <CheckCircle size={12} /> : <Save size={12} />}
              {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
            </button>
          )}

          {!isUser && message.chartType && isHistory && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 600, color: C.ok,
              background: C.ok50, borderRadius: 6, padding: '3px 8px',
            }}>
              <CheckCircle size={10} />
              Sauvegardé
            </span>
          )}
        </div>

        {!isUser && message.chartType && isLast && !isHistory && (
          <div style={{ marginTop: 10 }} />
        )}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span style={{ fontSize: 10, color: C.sub }}>{label}</span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', animation: 'statFadeIn 300ms ease' }}>
      <AiAvatar />
      <div style={{
        background: C.card2, border: `1px solid ${C.border2}`,
        borderRadius: '14px 14px 14px 4px', padding: '14px 18px',
      }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: '50%', background: C.sub,
              display: 'inline-block',
              animation: `statPulse 1.2s ease infinite ${i * 0.2}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GraphAIChatPanel({ conversationId, isHistory, onClose, onSave }: GraphAIChatPanelProps) {
  const conversation = GRAPH_CONVERSATIONS[conversationId];
  const allMessages = conversation?.messages || [];

  const [visibleCount, setVisibleCount] = useState(isHistory ? allMessages.length : 0);
  const [showTyping, setShowTyping] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [savedMsgIds, setSavedMsgIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isHistory) return;
    if (visibleCount >= allMessages.length) return;

    const nextMsg = allMessages[visibleCount];
    const delay = nextMsg.role === 'ai' ? 1200 : 600;
    const hasChart = nextMsg.role === 'ai' && nextMsg.chartType;

    if (nextMsg.role === 'ai') {
      setShowTyping(true);
      if (hasChart) {
        const t1 = setTimeout(() => {
          setShowTyping(false);
          setShowSkeleton(true);
        }, 800);
        const t2 = setTimeout(() => {
          setShowSkeleton(false);
          setVisibleCount(c => c + 1);
        }, 1800);
        return () => { clearTimeout(t1); clearTimeout(t2); };
      } else {
        const t = setTimeout(() => {
          setShowTyping(false);
          setVisibleCount(c => c + 1);
        }, delay);
        return () => clearTimeout(t);
      }
    } else {
      const t = setTimeout(() => {
        setVisibleCount(c => c + 1);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [visibleCount, allMessages, isHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount, showTyping, showSkeleton]);

  const visibleMessages = allMessages.slice(0, visibleCount);
  const chartMessages = visibleMessages.filter(m => m.role === 'ai' && m.chartType);
  const hasMultipleCharts = chartMessages.length > 1;

  const handleSaveChart = (msg: GraphChatMessage) => {
    if (savedMsgIds.has(msg.id)) return;
    setSavedMsgIds(prev => new Set(prev).add(msg.id));
    onSave(msg.chartLabel || 'Nouveau graphique', msg.chartType || 'radar');
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
        animation: 'statFadeIn 150ms ease',
        fontFamily: "'Rubik', sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '92vw', maxWidth: 820, height: '88vh', maxHeight: 700,
        background: C.bg, border: `1px solid ${C.border}`,
        borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,.6)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'statScaleIn 200ms ease',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgb(0,145,255), rgb(0,110,200))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Sparkles size={15} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
              Assistant Graphique IA
            </div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>
              {isHistory ? 'Historique de conversation' : 'Décrivez le graphique que vous souhaitez'}
            </div>
          </div>
          {isHistory && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: C.ok,
              background: C.ok50, borderRadius: 6, padding: '4px 10px',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <CheckCircle size={10} />
              Déjà sauvegardé
            </span>
          )}
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: C.card2, border: `1px solid ${C.border2}`,
              color: C.sub, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.sub; }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          {visibleMessages.map((msg, idx) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isLast={idx === visibleMessages.length - 1}
              isHistory={isHistory}
              isSaved={savedMsgIds.has(msg.id)}
              onSaveChart={() => handleSaveChart(msg)}
            />
          ))}

          {showTyping && <TypingIndicator />}

          {showSkeleton && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', animation: 'statFadeIn 300ms ease' }}>
              <AiAvatar />
              <div style={{
                background: C.card2, border: `1px solid ${C.border2}`,
                borderRadius: '14px 14px 14px 4px', padding: '14px 18px',
                width: '60%',
              }}>
                <div style={{ fontSize: 12, color: C.sub, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={12} color={C.brand} />
                  Génération du graphique en cours...
                </div>
                <SkeletonPulse height={120} borderRadius={10} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {!isHistory && visibleCount === allMessages.length && hasMultipleCharts && (
          <div style={{
            padding: '12px 20px', borderTop: `1px solid ${C.border}`,
            background: C.card, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexShrink: 0,
          }}>
            <div style={{ fontSize: 12, color: C.sub, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={12} color={C.brand} />
              {chartMessages.length} graphiques dans cette conversation
            </div>
            <div style={{ fontSize: 11, color: C.n400 }}>
              {savedMsgIds.size} / {chartMessages.length} sauvegardé{savedMsgIds.size > 1 ? 's' : ''}
            </div>
          </div>
        )}

        {(
          <div style={{
            padding: '14px 20px', borderTop: `1px solid ${C.border}`,
            display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0,
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Décrivez le graphique souhaité..."
              style={{
                flex: 1, background: C.card2, border: `1px solid ${C.border2}`,
                borderRadius: 10, padding: '11px 16px',
                color: C.text, fontSize: 13,
                fontFamily: "'Rubik', sans-serif",
                outline: 'none', transition: 'border-color 150ms',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = C.brand; }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border2; }}
            />
            <button
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: C.brand, border: 'none',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'opacity 150ms',
                opacity: inputValue.trim() ? 1 : 0.4,
              }}
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
