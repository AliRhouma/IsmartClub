import { AlertTriangle, Bell, Download, Pencil, Plus, Share2, Sparkles } from 'lucide-react';
import { C } from './data';
import type { ScreenId } from './data';
import { PrimaryBtn, SecondaryBtn } from './Primitives';
import { LineChart, BarChart, HeatmapChart } from './SvgCharts';

const kpiData = [
  { label: 'Matchs joués', value: '10', sub: '22 fév — 5 avr', color: C.text },
  { label: 'Taux victoire', value: '70%', sub: '7V · 3N · 0D', color: C.ok },
  { label: 'Buts marqués', value: '23', sub: 'Équipe', color: C.brand },
  { label: 'Meilleur buteur', value: 'Mbappé (8)', sub: '0.96 / 90 min', color: C.brand },
  { label: 'Meilleur passeur', value: 'Bellingham (5)', sub: '0.59 / 90 min', color: C.ok },
];

export function DashboardHome({
  onNavigate, editMode,
}: {
  onNavigate: (s: ScreenId) => void;
  editMode: boolean;
}) {
  return (
    <div style={{ padding: '20px 24px', fontFamily: "'Rubik', sans-serif" }}>

      <div style={{
        background: `${C.warn50}`, border: `1px solid rgba(104,221,253,.2)`,
        borderRadius: 10, padding: '10px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={14} style={{ color: C.warn }} />
          <span style={{ fontSize: 12, color: C.warn, fontWeight: 500 }}>
            Rüdiger : 4 cartons jaunes sur 5 — risque de suspension
          </span>
        </div>
        <button onClick={() => onNavigate('alerts')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 11, fontWeight: 600, color: C.warn, textDecoration: 'underline',
          fontFamily: "'Rubik', sans-serif",
        }}>
          Voir détails
        </button>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18,
      }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>
            Tableau de bord analytique
          </h2>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>
            10 matchs · 22 fév — 5 avr 2026 · 7V 3N 0D
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onNavigate('alerts')} aria-label="Alertes" style={{
            width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
            background: C.card2, border: `1px solid ${C.border2}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub,
          }}>
            <Bell size={15} />
          </button>
          <SecondaryBtn onClick={() => onNavigate('editMode')}>
            <Pencil size={13} />Réorganiser
          </SecondaryBtn>
          <SecondaryBtn onClick={() => onNavigate('export')}>
            <Download size={13} />Export PDF
          </SecondaryBtn>
          <SecondaryBtn onClick={() => onNavigate('export')}>
            <Share2 size={13} />Partager
          </SecondaryBtn>
          <PrimaryBtn onClick={() => onNavigate('newChart')}>
            <Plus size={14} />Nouveau graphique
          </PrimaryBtn>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16,
      }}>
        {kpiData.map(k => (
          <div key={k.label} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.n400, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              {k.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.color, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
              {k.value}
            </div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
        <ChartCard title="Buts & PD — Évolution" subtitle="Derniers 8 matchs" editMode={editMode} onNavigate={onNavigate}>
          <div style={{ padding: '8px 0' }}>
            <LineChart width={420} height={110} />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
            <LegendDot color={C.brand} label="Buts" />
            <LegendDot color={C.ok} label="Passes déc." />
          </div>
        </ChartCard>

        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 18,
          position: 'relative',
        }}>
          {editMode && <EditOverlay onNavigate={onNavigate} />}
          <div style={{ fontSize: 10, fontWeight: 600, color: C.n400, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Minutes totales — Mbappé
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.brand, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
            752'
          </div>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600, color: C.ok,
            background: C.ok50, borderRadius: 99, padding: '2px 8px', marginTop: 4,
          }}>
            +8%
          </span>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { k: 'Titularisations', v: '8 / 10' },
              { k: 'Moy. min / match', v: '75.2' },
              { k: 'Buts / 90', v: '0.96' },
            ].map(r => (
              <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: C.sub }}>{r.k}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        <ChartCard title="Disponibilité" subtitle="Joueurs × Matchs" editMode={editMode} onNavigate={onNavigate}>
          <div style={{ padding: '8px 0' }}>
            <HeatmapChart width={240} height={90} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <LegendDot color={C.ok} label="Titulaire" />
            <LegendDot color="rgb(60,60,30)" label="Remplaçant" />
            <LegendDot color={C.err50} label="Absent" />
          </div>
        </ChartCard>

        <ChartCard title="Buts par match — Mbappé" subtitle="10 derniers matchs" editMode={editMode} onNavigate={onNavigate}>
          <div style={{ padding: '8px 0' }}>
            <BarChart width={240} height={90} />
          </div>
        </ChartCard>

        <button onClick={() => onNavigate('newChart')} style={{
          background: 'transparent', border: `2px dashed ${C.border2}`,
          borderRadius: 8, cursor: 'pointer', padding: 24,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'all 150ms', color: C.n300,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand; e.currentTarget.style.color = C.brand; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.n300; }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: C.card2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plus size={18} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Ajouter un graphique</span>
        </button>
      </div>

      <button onClick={() => onNavigate('newChart')} style={{
        width: '100%', background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: '14px 20px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: "'Rubik', sans-serif", transition: 'border-color 150ms',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={14} color="#fff" />
        </div>
        <span style={{ flex: 1, textAlign: 'left', fontSize: 13, color: C.n300 }}>
          Demander à l'IA : « Qui devrait commencer le prochain match ? »...
        </span>
        <span style={{
          fontSize: 12, fontWeight: 600, color: C.purple,
          background: `${C.purple}1a`, borderRadius: 6, padding: '5px 12px',
        }}>
          Envoyer
        </span>
      </button>
    </div>
  );
}

function ChartCard({
  title, subtitle, children, editMode, onNavigate,
}: {
  title: string; subtitle: string; children: React.ReactNode;
  editMode: boolean; onNavigate: (s: ScreenId) => void;
}) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
      padding: 18, position: 'relative',
    }}>
      {editMode && <EditOverlay onNavigate={onNavigate} />}
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</div>
      <div style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>{subtitle}</div>
      {children}
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

function EditOverlay({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 8, zIndex: 2,
      background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <button aria-label="Glisser" style={{
        position: 'absolute', top: 8, left: 8, width: 26, height: 26, borderRadius: 6,
        background: C.card, border: `1px solid ${C.border2}`, cursor: 'grab',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub, fontSize: 12,
      }}>
        ⠿
      </button>
      <button aria-label="Supprimer" style={{
        position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 6,
        background: C.err50, border: `1px solid ${C.err}33`, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.err, fontSize: 13,
      }}>
        ✕
      </button>
      <button onClick={() => onNavigate('configure')} aria-label="Modifier" style={{
        width: 32, height: 32, borderRadius: 8,
        background: C.card, border: `1px solid ${C.border2}`, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub, fontSize: 13,
      }}>
        ⚙
      </button>
      <button aria-label="Dupliquer" style={{
        width: 32, height: 32, borderRadius: 8,
        background: C.card, border: `1px solid ${C.border2}`, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub, fontSize: 13,
      }}>
        📋
      </button>
    </div>
  );
}
