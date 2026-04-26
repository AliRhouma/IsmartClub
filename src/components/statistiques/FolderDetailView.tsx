import { useState } from 'react';
import { ArrowLeft, Plus, MessageSquare, Sparkles, Maximize2, Trash2, Download } from 'lucide-react';
import { C } from './data';
import { PrimaryBtn, SecondaryBtn } from './Primitives';
import { RadarChart, BarChart, LineChart, HeatmapChart } from './SvgCharts';
import type { StatsFolder, FolderGraph } from './graphChatData';
import { ChartDetailModal } from './ChartDetailModal';
import { ImportGraphModal } from './ImportGraphModal';

interface FolderDetailViewProps {
  folder: StatsFolder;
  onBack: () => void;
  onAddGraph: () => void;
  onViewConversation: (conversationId: string) => void;
}

const chartComponents: Record<string, (props: { width?: number; height?: number }) => JSX.Element> = {
  radar: RadarChart,
  bar: BarChart,
  line: LineChart,
  heatmap: HeatmapChart,
};

function GraphCard({ graph, onViewConversation, onExpand }: { graph: FolderGraph; onViewConversation: (id: string) => void; onExpand: () => void }) {
  const ChartComponent = chartComponents[graph.chartType] || RadarChart;

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 12, overflow: 'hidden',
      transition: 'border-color 200ms, transform 200ms',
      cursor: 'default',
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
        <ChartComponent width={220} height={120} />
      </div>

      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: C.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {graph.title}
            </div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 3 }}>
              {graph.subtitle} &middot; {graph.date}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
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
                width: 30, height: 30, borderRadius: 8,
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
              <Maximize2 size={13} />
            </button>
            <button
              onClick={() => onViewConversation(graph.conversationId)}
              aria-label="Voir la conversation"
              style={{
                width: 30, height: 30, borderRadius: 8,
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
              <MessageSquare size={13} />
            </button>
            <button
              aria-label="Supprimer"
              style={{
                width: 30, height: 30, borderRadius: 8,
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
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 20px',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: C.card2, border: `2px dashed ${C.border2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Plus size={28} color={C.n300} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>
        Aucun graphique dans ce dossier
      </div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 20, textAlign: 'center', maxWidth: 320 }}>
        Utilisez l'assistant IA pour générer votre premier graphique d'analyse
      </div>
      <PrimaryBtn onClick={onAdd}>
        <Sparkles size={14} />
        Générer avec l'IA
      </PrimaryBtn>
    </div>
  );
}

export function FolderDetailView({ folder, onBack, onAddGraph, onViewConversation }: FolderDetailViewProps) {
  const [expandedGraph, setExpandedGraph] = useState<FolderGraph | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div style={{ padding: '20px 24px', fontFamily: "'Rubik', sans-serif", animation: 'statFadeIn 200ms ease' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24,
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
              {folder.name}
            </div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
              {folder.graphs.length} graphique{folder.graphs.length !== 1 ? 's' : ''} &middot; Créé le {folder.createdAt}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <SecondaryBtn onClick={() => setShowImportModal(true)}>
            <Download size={14} />
            Importer un graphique
          </SecondaryBtn>
          <PrimaryBtn onClick={onAddGraph}>
            <Plus size={14} />
            Ajouter un graphique
          </PrimaryBtn>
        </div>
      </div>

      {folder.graphs.length === 0 ? (
        <EmptyState onAdd={onAddGraph} />
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
        }}>
          {folder.graphs.map(graph => (
            <GraphCard
              key={graph.id}
              graph={graph}
              onViewConversation={onViewConversation}
              onExpand={() => setExpandedGraph(graph)}
            />
          ))}

          <button
            onClick={onAddGraph}
            style={{
              background: 'transparent', border: `2px dashed ${C.border2}`,
              borderRadius: 12, cursor: 'pointer', padding: 24,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 150ms', color: C.n300, minHeight: 200,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = C.brand;
              e.currentTarget.style.color = C.brand;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border2;
              e.currentTarget.style.color = C.n300;
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: C.card2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={18} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Générer avec l'IA</span>
          </button>
        </div>
      )}

      {expandedGraph && (
        <ChartDetailModal
          graph={expandedGraph}
          onClose={() => setExpandedGraph(null)}
          onViewConversation={onViewConversation}
        />
      )}

      {showImportModal && (
        <ImportGraphModal
          onClose={() => setShowImportModal(false)}
          onImport={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
}
