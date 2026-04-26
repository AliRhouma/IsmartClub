import { ArrowLeft, Sparkles, FolderOpen, Maximize2, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { C } from './data';
import { RadarChart, BarChart, LineChart, HeatmapChart } from './SvgCharts';
import { ChartDetailModal } from './ChartDetailModal';
import type { FolderGraph } from './graphChatData';

interface LibraryGraph {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  sortDate: string;
  chartType: 'radar' | 'bar' | 'line' | 'heatmap';
  folderName: string;
  conversationId: string;
}

const LIBRARY_GRAPHS: LibraryGraph[] = [
  { id: 'lg-1', title: 'Mbappé vs Bellingham — Radar offensif', subtitle: '5 derniers matchs', date: '10 avr 2026', sortDate: '2026-04-10', chartType: 'radar', folderName: 'Analyse offensive', conversationId: 'conv-off-1' },
  { id: 'lg-2', title: 'xG attendus vs réels — Attaquants', subtitle: 'Saison complète', date: '10 avr 2026', sortDate: '2026-04-10', chartType: 'bar', folderName: 'Analyse offensive', conversationId: 'conv-off-2' },
  { id: 'lg-3', title: 'Cartons par joueur — Discipline', subtitle: 'Saison 2025/2026', date: '5 avr 2026', sortDate: '2026-04-05', chartType: 'bar', folderName: 'Discipline & cartons', conversationId: 'conv-disc-1' },
  { id: 'lg-4', title: 'Charge physique — Semaine 14', subtitle: 'Distance & sprints', date: '5 avr 2026', sortDate: '2026-04-05', chartType: 'line', folderName: 'Performance physique', conversationId: 'conv-phys-1' },
  { id: 'lg-5', title: 'Disponibilité joueurs — Mars', subtitle: '10 derniers matchs', date: '3 avr 2026', sortDate: '2026-04-03', chartType: 'heatmap', folderName: 'Performance physique', conversationId: 'conv-phys-2' },
  { id: 'lg-6', title: 'Buts & PD — Évolution équipe', subtitle: '8 derniers matchs', date: '18 mars 2026', sortDate: '2026-03-18', chartType: 'line', folderName: 'Analyse offensive', conversationId: 'conv-off-3' },
  { id: 'lg-7', title: 'Buts par match — Mbappé', subtitle: '10 derniers matchs', date: '14 mars 2026', sortDate: '2026-03-14', chartType: 'bar', folderName: 'Analyse offensive', conversationId: 'conv-off-2' },
  { id: 'lg-8', title: 'Radar défensif — Rüdiger vs Alaba', subtitle: '5 derniers matchs', date: '14 mars 2026', sortDate: '2026-03-14', chartType: 'radar', folderName: 'Discipline & cartons', conversationId: 'conv-disc-1' },
  { id: 'lg-9', title: 'Distance & Sprints — Milieux', subtitle: 'Camavinga, Valverde, Bellingham', date: '28 fév 2026', sortDate: '2026-02-28', chartType: 'line', folderName: 'Performance physique', conversationId: 'conv-phys-1' },
  { id: 'lg-10', title: 'Passes réussies — Top 5 joueurs', subtitle: 'Saison 2025/2026', date: '28 fév 2026', sortDate: '2026-02-28', chartType: 'bar', folderName: 'Analyse offensive', conversationId: 'conv-off-2' },
  { id: 'lg-11', title: 'Heatmap présence — Février', subtitle: 'Tous joueurs', date: '28 fév 2026', sortDate: '2026-02-28', chartType: 'heatmap', folderName: 'Performance physique', conversationId: 'conv-phys-2' },
  { id: 'lg-12', title: 'Mbappé vs Vinícius — Dribbles', subtitle: 'Champions League', date: '15 fév 2026', sortDate: '2026-02-15', chartType: 'radar', folderName: 'Analyse offensive', conversationId: 'conv-off-1' },
];

const chartComponents: Record<string, (props: { width?: number; height?: number }) => JSX.Element> = {
  radar: RadarChart,
  bar: BarChart,
  line: LineChart,
  heatmap: HeatmapChart,
};

function groupByDate(graphs: LibraryGraph[]): { date: string; graphs: LibraryGraph[] }[] {
  const grouped: Record<string, LibraryGraph[]> = {};
  for (const g of graphs) {
    if (!grouped[g.date]) grouped[g.date] = [];
    grouped[g.date].push(g);
  }
  return Object.entries(grouped)
    .sort((a, b) => b[1][0].sortDate.localeCompare(a[1][0].sortDate))
    .map(([date, graphs]) => ({ date, graphs }));
}

function LibraryCard({ graph, onExpand }: { graph: LibraryGraph; onExpand: () => void }) {
  const ChartComp = chartComponents[graph.chartType] || RadarChart;

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 12, overflow: 'hidden',
      transition: 'border-color 200ms, transform 200ms',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.border2;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        padding: '20px 20px 12px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: C.bg, borderBottom: `1px solid ${C.border}`,
        minHeight: 130,
      }}>
        <ChartComp width={220} height={120} />
      </div>

      <div style={{ padding: '14px 18px' }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: C.text,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {graph.title}
        </div>
        <div style={{ fontSize: 11, color: C.sub, marginTop: 3 }}>
          {graph.subtitle}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, color: C.sub, fontWeight: 500,
          }}>
            <FolderOpen size={11} color={C.n400} />
            <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {graph.folderName}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 9, fontWeight: 600, color: C.brand,
              background: `${C.brand}1a`, borderRadius: 6, padding: '3px 7px',
              textTransform: 'uppercase', letterSpacing: '.04em',
            }}>
              <Sparkles size={9} />
              IA
            </span>
            <button
              onClick={onExpand}
              aria-label="Voir en détail"
              style={{
                width: 28, height: 28, borderRadius: 7,
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
              <Maximize2 size={12} />
            </button>
            <button
              aria-label="Supprimer"
              style={{
                width: 28, height: 28, borderRadius: 7,
                background: 'transparent', border: `1px solid ${C.border2}`,
                color: C.sub, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = C.sub;
                e.currentTarget.style.borderColor = C.border2;
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GraphLibraryViewProps {
  onBack: () => void;
}

export function GraphLibraryView({ onBack }: GraphLibraryViewProps) {
  const [search, setSearch] = useState('');
  const [expandedGraph, setExpandedGraph] = useState<FolderGraph | null>(null);

  const filtered = search.trim()
    ? LIBRARY_GRAPHS.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.folderName.toLowerCase().includes(search.toLowerCase())
      )
    : LIBRARY_GRAPHS;

  const groups = groupByDate(filtered);
  const totalCount = filtered.length;

  return (
    <div style={{ padding: '20px 24px', fontFamily: "'Rubik', sans-serif", animation: 'statFadeIn 200ms ease' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onBack}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: C.card, border: `1px solid ${C.border}`,
              color: C.sub, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = C.text;
              e.currentTarget.style.borderColor = C.border2;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = C.sub;
              e.currentTarget.style.borderColor = C.border;
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
              Bibliothèque de graphiques
            </div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
              {totalCount} graphique{totalCount !== 1 ? 's' : ''} générés au total
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: 'relative', marginBottom: 24,
      }}>
        <Search size={14} style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: C.n400, pointerEvents: 'none',
        }} />
        <input
          type="text"
          placeholder="Rechercher un graphique ou un dossier..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '11px 16px 11px 38px',
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 10, color: C.text, fontSize: 13,
            fontFamily: "'Rubik', sans-serif",
            outline: 'none', transition: 'border-color 150ms',
          }}
          onFocus={e => e.currentTarget.style.borderColor = C.brand}
          onBlur={e => e.currentTarget.style.borderColor = C.border}
        />
      </div>

      {groups.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '60px 20px',
        }}>
          <Search size={32} color={C.n300} />
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginTop: 16 }}>
            Aucun résultat
          </div>
          <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>
            Aucun graphique ne correspond à votre recherche
          </div>
        </div>
      ) : (
        groups.map(group => (
          <div key={group.date} style={{ marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 14,
            }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: C.text,
                whiteSpace: 'nowrap',
              }}>
                {group.date}
              </div>
              <div style={{
                flex: 1, height: 1, background: C.border,
              }} />
              <div style={{
                fontSize: 11, color: C.n400, fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>
                {group.graphs.length} graphique{group.graphs.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
            }}>
              {group.graphs.map(graph => (
                <LibraryCard
                  key={graph.id}
                  graph={graph}
                  onExpand={() => setExpandedGraph({
                    id: graph.id,
                    title: graph.title,
                    subtitle: graph.subtitle,
                    date: graph.date,
                    chartType: graph.chartType,
                    conversationId: graph.conversationId,
                  })}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {expandedGraph && (
        <ChartDetailModal
          graph={expandedGraph}
          onClose={() => setExpandedGraph(null)}
          onViewConversation={() => {}}
        />
      )}
    </div>
  );
}
