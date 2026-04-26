import { useState } from 'react';
import { BarChart2, TrendingUp, Clock, AlertTriangle, Home, Zap, Sparkles, ChevronDown } from 'lucide-react';
import { C, ANALYSIS_TYPES, QUICK_TEMPLATES } from './data';
import type { ScreenId } from './data';
import { ModalShell, ModalHeader, PrimaryBtn, SecondaryBtn } from './Primitives';

const ICONS: Record<string, React.ReactNode> = {
  bar:     <BarChart2 size={18} />,
  line:    <TrendingUp size={18} />,
  clock:   <Clock size={18} />,
  warning: <AlertTriangle size={18} />,
  home:    <Home size={18} />,
  zap:     <Zap size={18} />,
};

export function NewChartModal({
  onClose, onNavigate, onSelectAnalysis, focusAI,
}: {
  onClose: () => void;
  onNavigate: (s: ScreenId) => void;
  onSelectAnalysis: (id: string) => void;
  focusAI?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  return (
    <ModalShell onClose={onClose} width={620}>
      <ModalHeader title="Nouveau graphique" onClose={onClose} />

      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
            Quel type d'analyse ?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {ANALYSIS_TYPES.map(a => {
              const active = selected === a.id;
              return (
                <button key={a.id} onClick={() => setSelected(a.id)} style={{
                  background: active ? C.brand50 : C.card2,
                  border: `1px solid ${active ? `${C.brand}4d` : C.border2}`,
                  borderRadius: 10, padding: '14px 14px 12px', cursor: 'pointer',
                  textAlign: 'left', transition: 'all 150ms',
                  fontFamily: "'Rubik', sans-serif",
                }}>
                  <div style={{ color: active ? C.brand : C.sub, marginBottom: 8 }}>
                    {ICONS[a.icon]}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: active ? C.brand : C.text }}>
                    {a.label}
                  </div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                    {a.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <button onClick={() => setTemplatesOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 6, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: "'Rubik', sans-serif",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Modèles rapides</span>
            <ChevronDown size={14} style={{
              color: C.sub, transform: templatesOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 150ms',
            }} />
          </button>
          {templatesOpen && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {QUICK_TEMPLATES.map(t => (
                <button key={t} onClick={() => onNavigate('aiGenerated')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: C.card2, border: `1px solid ${C.border2}`,
                  borderRadius: 99, padding: '6px 12px', cursor: 'pointer',
                  fontSize: 11, color: C.sub, fontFamily: "'Rubik', sans-serif",
                  transition: 'all 150ms',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.color = C.purple; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.sub; }}
                >
                  <Sparkles size={10} style={{ color: C.purple }} />
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: C.border2 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.n400 }}>OU</span>
          <div style={{ flex: 1, height: 1, background: C.border2 }} />
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
            Ou décrivez votre besoin
          </div>
          <div style={{
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 10,
              padding: '10px 14px',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={11} color="#fff" />
              </div>
              <input
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                autoFocus={focusAI}
                placeholder="ex. « Compare les défenseurs sur les duels aériens »"
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: C.text, fontSize: 13, fontFamily: "'Rubik', sans-serif",
                }}
              />
            </div>
            <button onClick={() => { if (aiQuery.trim()) onNavigate('aiGenerated'); }} style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`,
              border: 'none', borderRadius: 10, padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Rubik', sans-serif", opacity: aiQuery.trim() ? 1 : .5,
              transition: 'opacity 150ms',
            }}>
              <Sparkles size={12} />Générer
            </button>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 10,
        padding: '14px 22px', borderTop: `1px solid ${C.border}`,
      }}>
        <SecondaryBtn onClick={onClose}>Annuler</SecondaryBtn>
        <PrimaryBtn
          disabled={!selected}
          onClick={() => {
            if (selected) {
              onSelectAnalysis(selected);
              onNavigate('configure');
            }
          }}
        >
          Configurer &rarr;
        </PrimaryBtn>
      </div>
    </ModalShell>
  );
}
