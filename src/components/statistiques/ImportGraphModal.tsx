import { useState } from 'react';
import { Search, FolderOpen, Check, Sparkles } from 'lucide-react';
import { C } from './data';
import { ModalShell, ModalHeader, PrimaryBtn } from './Primitives';
import { RadarChart, BarChart, LineChart, HeatmapChart } from './SvgCharts';

interface ImportableGraph {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  chartType: 'radar' | 'bar' | 'line' | 'heatmap';
  folderName: string;
}

const IMPORTABLE_GRAPHS: ImportableGraph[] = [
  { id: 'imp-1', title: 'Mbappé vs Bellingham — Radar offensif', subtitle: '5 derniers matchs', date: '12 mars 2026', chartType: 'radar', folderName: 'Analyse offensive' },
  { id: 'imp-2', title: 'Buts par match — Mbappé', subtitle: '10 derniers matchs', date: '14 mars 2026', chartType: 'bar', folderName: 'Analyse offensive' },
  { id: 'imp-3', title: 'Buts & PD — Évolution équipe', subtitle: '8 derniers matchs', date: '18 mars 2026', chartType: 'line', folderName: 'Analyse offensive' },
  { id: 'imp-4', title: 'Distance & Sprints — Milieux', subtitle: 'Camavinga, Valverde, Bellingham', date: '28 fév 2026', chartType: 'line', folderName: 'Performance physique' },
  { id: 'imp-5', title: 'Disponibilité — Tous joueurs', subtitle: '10 derniers matchs', date: '3 mars 2026', chartType: 'heatmap', folderName: 'Performance physique' },
  { id: 'imp-6', title: 'Cartons par joueur — Discipline', subtitle: 'Saison 2025/2026', date: '5 avr 2026', chartType: 'bar', folderName: 'Discipline & cartons' },
  { id: 'imp-7', title: 'xG attendus vs réels — Attaquants', subtitle: 'Saison complète', date: '10 avr 2026', chartType: 'bar', folderName: 'Analyse offensive' },
  { id: 'imp-8', title: 'Charge physique — Semaine 14', subtitle: 'Distance & sprints', date: '5 avr 2026', chartType: 'line', folderName: 'Performance physique' },
  { id: 'imp-9', title: 'Radar défensif — Rüdiger vs Alaba', subtitle: '5 derniers matchs', date: '14 mars 2026', chartType: 'radar', folderName: 'Discipline & cartons' },
  { id: 'imp-10', title: 'Passes réussies — Top 5 joueurs', subtitle: 'Saison 2025/2026', date: '28 fév 2026', chartType: 'bar', folderName: 'Analyse offensive' },
];

const chartComponents: Record<string, (props: { width?: number; height?: number }) => JSX.Element> = {
  radar: RadarChart,
  bar: BarChart,
  line: LineChart,
  heatmap: HeatmapChart,
};

function ImportCard({ graph, selected, onToggle }: {
  graph: ImportableGraph;
  selected: boolean;
  onToggle: () => void;
}) {
  const ChartComp = chartComponents[graph.chartType] || RadarChart;

  return (
    <button
      onClick={onToggle}
      style={{
        background: selected ? `${C.brand}0d` : C.card,
        border: `1.5px solid ${selected ? C.brand : C.border}`,
        borderRadius: 10, overflow: 'hidden',
        cursor: 'pointer', textAlign: 'left',
        transition: 'all 180ms', position: 'relative',
        width: '100%', padding: 0,
        fontFamily: "'Rubik', sans-serif",
      }}
      onMouseEnter={e => {
        if (!selected) e.currentTarget.style.borderColor = C.border2;
      }}
      onMouseLeave={e => {
        if (!selected) e.currentTarget.style.borderColor = C.border;
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 2,
          width: 22, height: 22, borderRadius: 6,
          background: C.brand, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={13} color="#fff" strokeWidth={2.5} />
        </div>
      )}

      <div style={{
        padding: '14px 14px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: selected ? `${C.brand}08` : C.bg,
        borderBottom: `1px solid ${selected ? `${C.brand}30` : C.border}`,
        minHeight: 80,
      }}>
        <ChartComp width={160} height={80} />
      </div>

      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: C.text,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {graph.title}
        </div>
        <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>
          {graph.subtitle}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 8, paddingTop: 8, borderTop: `1px solid ${selected ? `${C.brand}20` : C.border}`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 10, color: C.n400, fontWeight: 500,
          }}>
            <FolderOpen size={10} />
            <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {graph.folderName}
            </span>
          </div>
          <div style={{ fontSize: 10, color: C.n400 }}>
            {graph.date}
          </div>
        </div>
      </div>
    </button>
  );
}

interface ImportGraphModalProps {
  onClose: () => void;
  onImport: (graphIds: string[]) => void;
}

export function ImportGraphModal({ onClose, onImport }: ImportGraphModalProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = search.trim()
    ? IMPORTABLE_GRAPHS.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.folderName.toLowerCase().includes(search.toLowerCase())
      )
    : IMPORTABLE_GRAPHS;

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(g => g.id)));
    }
  };

  return (
    <ModalShell onClose={onClose} width={720}>
      <ModalHeader
        title="Importer un graphique"
        subtitle="Sélectionnez des graphiques depuis votre bibliothèque"
        onClose={onClose}
      />

      <div style={{ padding: '16px 22px 0' }}>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={13} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: C.n400, pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Rechercher un graphique..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px 10px 34px',
              background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 8, color: C.text, fontSize: 12,
              fontFamily: "'Rubik', sans-serif",
              outline: 'none', transition: 'border-color 150ms',
            }}
            onFocus={e => e.currentTarget.style.borderColor = C.brand}
            onBlur={e => e.currentTarget.style.borderColor = C.border}
          />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 12, color: C.sub }}>
            {filtered.length} graphique{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={selectAll}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600, color: C.brand,
              fontFamily: "'Rubik', sans-serif", padding: '4px 8px',
              borderRadius: 6, transition: 'background 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${C.brand}15`}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            {selectedIds.size === filtered.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
        </div>
      </div>

      <div style={{
        padding: '0 22px', maxHeight: 400, overflowY: 'auto',
      }}>
        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '40px 20px',
          }}>
            <Search size={28} color={C.n300} />
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 12 }}>
              Aucun résultat
            </div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>
              Aucun graphique ne correspond à votre recherche
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          }}>
            {filtered.map(graph => (
              <ImportCard
                key={graph.id}
                graph={graph}
                selected={selectedIds.has(graph.id)}
                onToggle={() => toggle(graph.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{
        padding: '16px 22px', borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 16,
      }}>
        <div style={{ fontSize: 12, color: C.sub }}>
          {selectedIds.size > 0 ? (
            <span>
              <span style={{ fontWeight: 600, color: C.text }}>{selectedIds.size}</span>
              {' '}graphique{selectedIds.size !== 1 ? 's' : ''} sélectionné{selectedIds.size !== 1 ? 's' : ''}
            </span>
          ) : (
            'Sélectionnez au moins un graphique'
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: `1px solid ${C.border2}`,
              borderRadius: 8, padding: '9px 16px', color: C.sub,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Rubik', sans-serif", transition: 'all 150ms',
            }}
          >
            Annuler
          </button>
          <PrimaryBtn
            onClick={() => onImport(Array.from(selectedIds))}
            disabled={selectedIds.size === 0}
            style={{ fontSize: 12, padding: '9px 16px' }}
          >
            <Sparkles size={13} />
            Importer {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
          </PrimaryBtn>
        </div>
      </div>
    </ModalShell>
  );
}
