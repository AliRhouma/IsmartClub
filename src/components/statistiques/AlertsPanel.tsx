import { useState, useEffect, useCallback } from 'react';
import { X, Settings } from 'lucide-react';
import { C } from './data';
import type { ScreenId } from './data';
import { PrimaryBtn } from './Primitives';
import { MiniSparkline } from './SvgCharts';

interface Alert {
  id: string;
  severity: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  badge: string;
  actions: { label: string; action: 'expand' | 'navigate'; target?: ScreenId; expandContent?: string[] }[];
  sparkline?: boolean;
}

const ALERTS: Alert[] = [
  {
    id: 'a1', severity: 'urgent',
    title: 'Risque de suspension — Rüdiger',
    description: '4 cartons jaunes sur 5 en La Liga. Prochain carton = 1 match de suspension.',
    badge: 'Urgent',
    actions: [
      { label: 'Voir historique cartons', action: 'navigate', target: 'newChart' },
      { label: 'Options de rotation', action: 'expand', expandContent: ['Alaba (3 CJ)', 'Militão (1 CJ)'] },
    ],
  },
  {
    id: 'a2', severity: 'warning',
    title: 'Risque de fatigue — Bellingham',
    description: '120 min à Anfield + 8 titularisations consécutives. Cumulé : 762 min en 6 semaines.',
    badge: 'Attention',
    sparkline: true,
    actions: [
      { label: 'Planifier un repos', action: 'navigate', target: 'newChart' },
    ],
  },
  {
    id: 'a3', severity: 'warning',
    title: 'Charge élevée — Mbappé',
    description: 'Reposé une seule fois en 10 matchs. Distance parcourue en hausse de 12%.',
    badge: 'Attention',
    actions: [
      { label: 'Comparer avec Vinícius', action: 'navigate', target: 'aiGenerated' },
    ],
  },
  {
    id: 'a4', severity: 'info',
    title: 'Forme optimale — Mbappé',
    description: '5 buts sur les 4 derniers matchs. Meilleur B+PD/90 de l\'effectif (1.32).',
    badge: 'Insight',
    actions: [
      { label: 'Créer un graphique', action: 'navigate', target: 'newChart' },
    ],
  },
  {
    id: 'a5', severity: 'info',
    title: 'Tendance positive — Bellingham',
    description: '2 passes décisives vs Valencia montre un pic créatif. Combinaison avec Mbappé en hausse.',
    badge: 'Insight',
    actions: [
      { label: 'Voir la connexion Mbappé-Bellingham', action: 'navigate', target: 'aiGenerated' },
    ],
  },
];

const SCOLOR: Record<string, { border: string; badge: string; badgeBg: string }> = {
  urgent:  { border: C.err,  badge: C.err,  badgeBg: C.err50 },
  warning: { border: C.orange, badge: C.orange, badgeBg: C.orange50 },
  info:    { border: C.brand, badge: C.brand, badgeBg: C.brand50 },
};

export function AlertsPanel({
  onClose, onNavigate, onShowToast,
}: {
  onClose: () => void;
  onNavigate: (s: ScreenId) => void;
  onShowToast: (msg: string) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      animation: 'statFadeIn 150ms ease',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)',
      }} />

      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 360,
        background: C.card, borderLeft: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Rubik', sans-serif",
        boxShadow: '-12px 0 40px rgba(0,0,0,.4)',
        animation: 'statSlideInRight 250ms ease',
      }}>

        <div style={{
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Alertes actives</div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>Générées automatiquement par l'IA</div>
          </div>
          <button onClick={onClose} aria-label="Fermer" style={{
            width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
            background: C.card2, border: `1px solid ${C.border2}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub,
          }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ALERTS.map(a => {
            const sc = SCOLOR[a.severity];
            const isExpanded = !!expanded[a.id];
            return (
              <div key={a.id} style={{
                background: C.card2, border: `1px solid ${C.border2}`,
                borderLeft: `3px solid ${sc.border}`,
                borderRadius: 8, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.title}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: sc.badge,
                    background: sc.badgeBg, borderRadius: 4, padding: '2px 7px',
                    textTransform: 'uppercase', letterSpacing: '.04em',
                  }}>
                    {a.badge}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
                  {a.description}
                </div>
                {a.sparkline && (
                  <div style={{ marginTop: 8 }}>
                    <MiniSparkline />
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                  {a.actions.map(act => (
                    <button
                      key={act.label}
                      onClick={() => {
                        if (act.action === 'expand') {
                          setExpanded(e => ({ ...e, [a.id]: !e[a.id] }));
                        } else if (act.target) {
                          onNavigate(act.target);
                        }
                      }}
                      style={{
                        fontSize: 10, fontWeight: 600, color: sc.badge,
                        background: `${sc.badge}14`, border: `1px solid ${sc.badge}33`,
                        borderRadius: 99, padding: '4px 10px', cursor: 'pointer',
                        fontFamily: "'Rubik', sans-serif", transition: 'all 150ms',
                      }}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
                {isExpanded && a.actions.find(x => x.expandContent) && (
                  <div style={{
                    marginTop: 10, padding: '10px 12px',
                    background: C.bg, borderRadius: 6, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.n400, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      Alternatives
                    </div>
                    {a.actions.find(x => x.expandContent)!.expandContent!.map(alt => (
                      <div key={alt} style={{
                        fontSize: 12, color: C.sub, padding: '4px 0',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.ok }} />
                        {alt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          padding: '14px 16px', borderTop: `1px solid ${C.border}`,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, color: C.sub, fontFamily: "'Rubik', sans-serif",
          }}>
            <Settings size={12} />Configurer les alertes
          </button>
          <PrimaryBtn onClick={() => onShowToast('Rapport en cours de génération...')} style={{ width: '100%', justifyContent: 'center' }}>
            Générer un rapport pré-match
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}
