import { X, Sparkles, Calendar, Layers, Download, MessageSquare } from 'lucide-react';
import { C, PLAYERS } from './data';
import { RadarChart, BarChart, LineChart, HeatmapChart } from './SvgCharts';
import type { FolderGraph } from './graphChatData';

interface ChartDetailModalProps {
  graph: FolderGraph;
  onClose: () => void;
  onViewConversation: (conversationId: string) => void;
}

const chartComponents: Record<string, (props: { width?: number; height?: number }) => JSX.Element> = {
  radar: RadarChart,
  bar: BarChart,
  line: LineChart,
  heatmap: HeatmapChart,
};

const chartTypeLabels: Record<string, string> = {
  radar: 'Radar',
  bar: 'Barres',
  line: 'Lignes',
  heatmap: 'Heatmap',
};

const mockInsights: Record<string, string[]> = {
  radar: [
    'Mbappé domine sur les Buts (8) et Tirs (22)',
    'Bellingham excelle en Passes décisives (6) et Distance (58.3 km)',
    'Profils complémentaires avec peu de chevauchement',
  ],
  bar: [
    'Pic de performance au match 7 avec un doublé',
    'Régularité : au moins 1 but dans 7 matchs sur 10',
    'Moyenne de 1.2 buts par match sur la période',
  ],
  line: [
    'Tendance positive depuis le match 5',
    'Accélération offensive corrélée au retour de Bellingham',
    'Pic de passes décisives au match 6',
  ],
  heatmap: [
    'Courtois et Mbappé : 9 titularisations sur 10',
    'Rüdiger a manqué 2 matchs pour suspension',
    'Disponibilité globale de l\'effectif : 87%',
  ],
};

const samplePlayers = PLAYERS.slice(0, 4);

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'transparent', border: `1px solid ${C.border2}`,
        color: C.sub, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = C.brand;
        e.currentTarget.style.borderColor = C.brand;
        e.currentTarget.style.background = `${C.brand}1a`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = C.sub;
        e.currentTarget.style.borderColor = C.border2;
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

export function ChartDetailModal({ graph, onClose, onViewConversation }: ChartDetailModalProps) {
  const ChartComponent = chartComponents[graph.chartType] || RadarChart;
  const insights = mockInsights[graph.chartType] || mockInsights.radar;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(6px)',
        animation: 'statFadeIn 150ms ease',
        fontFamily: "'Rubik', sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, width: 820, maxWidth: '94vw', maxHeight: '92vh',
          overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,.6)',
          animation: 'statScaleIn 200ms ease',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${C.brand}1a`, border: `1px solid ${C.brand}26`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Layers size={18} color={C.brand} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 16, fontWeight: 700, color: C.text,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {graph.title}
              </div>
              <div style={{ fontSize: 12, color: C.sub, marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={11} />
                  {graph.date}
                </span>
                <span style={{ color: C.border2 }}>|</span>
                <span>{graph.subtitle}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 9, fontWeight: 600, color: C.brand,
                  background: `${C.brand}1a`, borderRadius: 6, padding: '2px 7px',
                  textTransform: 'uppercase', letterSpacing: '.04em',
                }}>
                  <Sparkles size={9} />
                  IA
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <IconBtn label="Voir la conversation" onClick={() => onViewConversation(graph.conversationId)}>
              <MessageSquare size={15} />
            </IconBtn>
            <IconBtn label="Exporter">
              <Download size={15} />
            </IconBtn>
            <button
              onClick={onClose}
              aria-label="Fermer"
              style={{
                width: 36, height: 36, borderRadius: 10, cursor: 'pointer',
                background: C.card2, border: `1px solid ${C.border2}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.sub, transition: 'all 150ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = C.text;
                e.currentTarget.style.borderColor = C.n300;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = C.sub;
                e.currentTarget.style.borderColor = C.border2;
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div style={{
          padding: '28px 24px',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          <div style={{
            background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '32px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 320,
          }}>
            <ChartComponent width={560} height={300} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{
              background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: '18px 20px',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: C.n400,
                textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 14,
              }}>
                Points clés
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {insights.map((insight, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: i === 0 ? C.brand : i === 1 ? C.ok : C.warn,
                      marginTop: 5, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: '18px 20px',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: C.n400,
                textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 14,
              }}>
                Informations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <InfoRow label="Type de graphique" value={chartTypeLabels[graph.chartType] || graph.chartType} />
                <InfoRow label="Période" value={graph.subtitle} />
                <InfoRow label="Créé le" value={graph.date} />
                <InfoRow label="Source" value="Généré par IA" />

                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <div style={{ fontSize: 11, color: C.sub, marginBottom: 8 }}>Joueurs inclus</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {samplePlayers.map(p => (
                      <span key={p.id} style={{
                        fontSize: 11, fontWeight: 500, color: p.color,
                        background: `${p.color}1a`, borderRadius: 6, padding: '3px 9px',
                      }}>
                        {p.initials}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 12, color: C.sub }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{value}</span>
    </div>
  );
}
