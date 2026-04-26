import { useState, useMemo } from 'react';
import { ArrowLeft, Eye, Sparkles, ChevronDown, Check } from 'lucide-react';
import { C, PLAYERS, METRICS, CHART_TYPES, COMPETITIONS, ANALYSIS_TYPES } from './data';
import type { ScreenId } from './data';
import { ModalShell, Pill, PrimaryBtn, SecondaryBtn, SectionLabel } from './Primitives';
import { RadarChart, LineChart, BarChart, HeatmapChart, DonutChart, ScatterChart, StackedBarChart, ButterflyChart } from './SvgCharts';

const LOCATIONS = [
  { id: 'all', label: 'Tous' },
  { id: 'home', label: 'Domicile' },
  { id: 'away', label: 'Extérieur' },
];

const MINI_CHARTS: Record<string, React.ReactNode> = {
  radar: <RadarChart width={120} height={120} />,
  bar: <BarChart width={120} height={70} />,
  line: <LineChart width={120} height={70} />,
  scatter: <ScatterChart width={120} height={70} />,
  heatmap: <HeatmapChart width={120} height={70} />,
  stacked: <StackedBarChart width={120} height={70} />,
  donut: <DonutChart width={80} height={80} />,
  butterfly: <ButterflyChart width={120} height={80} />,
};

export function ConfigureModal({
  analysisId, onClose, onNavigate, onDone,
}: {
  analysisId: string;
  onClose: () => void;
  onNavigate: (s: ScreenId) => void;
  onDone: () => void;
}) {
  const analysis = ANALYSIS_TYPES.find(a => a.id === analysisId) ?? ANALYSIS_TYPES[0];

  const [selPlayers, setSelPlayers] = useState<string[]>(['mbp', 'bel']);
  const [selMetrics, setSelMetrics] = useState<string[]>(analysis.preMetrics);
  const [selChart, setSelChart] = useState(analysis.preChart);
  const [selComp, setSelComp] = useState('all');
  const [selLoc, setSelLoc] = useState('all');
  const [dateStart, setDateStart] = useState('2026-02-22');
  const [dateEnd, setDateEnd] = useState('2026-04-05');
  const [customTitle, setCustomTitle] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [normalize, setNormalize] = useState(false);
  const [showValues, setShowValues] = useState(false);
  const [showTeamAvg, setShowTeamAvg] = useState(false);
  const [showTrend, setShowTrend] = useState(false);
  const [granularity, setGranularity] = useState('match');
  const [leagueCompare, setLeagueCompare] = useState(false);

  const grouped = useMemo(() => {
    const m = new Map<string, typeof METRICS>();
    METRICS.forEach(met => {
      if (!m.has(met.category)) m.set(met.category, []);
      m.get(met.category)!.push(met);
    });
    return m;
  }, []);

  const togglePlayer = (id: string) =>
    setSelPlayers(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleMetric = (id: string) =>
    setSelMetrics(m => m.includes(id) ? m.filter(x => x !== id) : [...m, id]);

  const modalWidth = previewOpen ? 720 : 560;

  return (
    <ModalShell onClose={onClose} width={modalWidth}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 22px', borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={() => onNavigate('newChart')} aria-label="Retour" style={{
          width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
          background: C.card2, border: `1px solid ${C.border2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub,
        }}>
          <ArrowLeft size={14} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{analysis.label}</span>
        <span style={{
          fontSize: 10, fontWeight: 600, color: C.n400,
          background: C.card2, borderRadius: 4, padding: '2px 8px',
          textTransform: 'uppercase', letterSpacing: '.04em',
        }}>
          Configuration
        </span>
        <div style={{ flex: 1 }} />
        <button onClick={onClose} aria-label="Fermer" style={{
          width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
          background: C.card2, border: `1px solid ${C.border2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub,
        }}>
          ✕
        </button>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{
          flex: 1, padding: '18px 22px', overflowY: 'auto', maxHeight: '65vh',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>

          <div>
            <SectionLabel>Sélectionner les joueurs</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {PLAYERS.map(p => {
                const on = selPlayers.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePlayer(p.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '5px 12px 5px 6px', borderRadius: 99, cursor: 'pointer',
                    background: on ? `${p.color}1a` : 'transparent',
                    border: `1px solid ${on ? `${p.color}4d` : C.border2}`,
                    fontFamily: "'Rubik', sans-serif", transition: 'all 150ms',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', fontSize: 9, fontWeight: 700,
                      background: on ? p.color : C.card2, color: on ? '#fff' : C.sub,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {p.initials}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: on ? C.text : C.sub }}>
                      {p.name.split(' ').pop()}
                    </span>
                    {on && <span style={{ fontSize: 10, color: p.color, marginLeft: 2 }}>✕</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <SectionLabel>Métriques à comparer</SectionLabel>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from(grouped.entries()).map(([cat, mets]) => (
                <div key={cat}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: C.n300, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                    {cat}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {mets.map(m => {
                      const on = selMetrics.includes(m.id);
                      return (
                        <Pill key={m.id} active={on} onClick={() => toggleMetric(m.id)} color={C.ok}>
                          {on && <Check size={10} />}{m.label}
                        </Pill>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Type de graphique</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 8 }}>
              {CHART_TYPES.map(ct => {
                const on = selChart === ct.id;
                const rec = ct.id === analysis.preChart;
                return (
                  <button key={ct.id} onClick={() => setSelChart(ct.id)} style={{
                    background: on ? C.brand50 : C.card2,
                    border: `1px solid ${on ? `${C.brand}4d` : C.border2}`,
                    borderRadius: 8, padding: '10px 8px', cursor: 'pointer',
                    textAlign: 'center', fontFamily: "'Rubik', sans-serif",
                    transition: 'all 150ms', position: 'relative',
                  }}>
                    {rec && (
                      <span style={{
                        position: 'absolute', top: 4, right: 4,
                        fontSize: 8, fontWeight: 700, color: C.brand,
                        background: C.brand50, borderRadius: 3, padding: '1px 4px',
                        textTransform: 'uppercase', letterSpacing: '.04em',
                      }}>
                        Reco.
                      </span>
                    )}
                    <div style={{ fontSize: 18, color: on ? C.brand : C.sub, marginBottom: 4 }}>
                      {ct.icon}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: on ? C.brand : C.text }}>
                      {ct.label}
                    </div>
                    <div style={{ fontSize: 9, color: C.sub, marginTop: 2 }}>
                      {ct.bestFor}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <SectionLabel>Filtrer par compétition</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
              {COMPETITIONS.map(c => (
                <Pill key={c.id} active={selComp === c.id} onClick={() => setSelComp(c.id)}>
                  {c.label}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Filtrer par lieu</SectionLabel>
            <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
              {LOCATIONS.map(l => (
                <Pill key={l.id} active={selLoc === l.id} onClick={() => setSelLoc(l.id)}>
                  {l.label}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Plage de dates</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
              <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} style={{
                padding: '9px 12px', borderRadius: 8, background: C.card2,
                border: `1px solid ${C.border2}`, color: C.text, fontSize: 12,
                fontFamily: "'Rubik', sans-serif", outline: 'none',
                colorScheme: 'dark',
              }} />
              <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} style={{
                padding: '9px 12px', borderRadius: 8, background: C.card2,
                border: `1px solid ${C.border2}`, color: C.text, fontSize: 12,
                fontFamily: "'Rubik', sans-serif", outline: 'none',
                colorScheme: 'dark',
              }} />
            </div>
          </div>

          <div>
            <SectionLabel>Titre personnalisé (optionnel)</SectionLabel>
            <input
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder={`${analysis.label} — ${CHART_TYPES.find(c => c.id === selChart)?.label ?? ''}`}
              style={{
                width: '100%', boxSizing: 'border-box', marginTop: 8,
                padding: '9px 12px', borderRadius: 8, background: C.card2,
                border: `1px solid ${C.border2}`, color: C.text, fontSize: 12,
                fontFamily: "'Rubik', sans-serif", outline: 'none',
              }}
            />
          </div>

          <div>
            <button onClick={() => setAdvancedOpen(o => !o)} style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'Rubik', sans-serif",
            }}>
              <span style={{ fontSize: 12, color: C.sub }}>⚙</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>Options avancées</span>
              <ChevronDown size={12} style={{
                color: C.sub, transform: advancedOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 150ms',
              }} />
            </button>

            {advancedOpen && (
              <div style={{
                marginTop: 12, padding: 16, background: C.card2,
                border: `1px solid ${C.border2}`, borderRadius: 10,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Normaliser par 90 minutes</div>
                    <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>Divise chaque métrique par les minutes jouées x 90</div>
                  </div>
                  <ToggleSwitch on={normalize} onToggle={() => setNormalize(o => !o)} />
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>Seuils & alertes</div>
                  <div style={{ fontSize: 10, color: C.sub, marginBottom: 8 }}>Les valeurs hors seuils seront colorées sur le graphique</div>
                  {selMetrics.slice(0, 4).map(mid => {
                    const met = METRICS.find(m => m.id === mid);
                    return (
                      <div key={mid} style={{
                        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
                      }}>
                        <span style={{ fontSize: 11, color: C.sub, width: 120 }}>{met?.label}</span>
                        <input type="number" placeholder="Bas" defaultValue={0} style={{
                          width: 60, padding: '5px 8px', borderRadius: 6, fontSize: 11,
                          background: C.bg, border: `1px solid ${C.border}`, color: C.text,
                          fontFamily: "'Rubik', sans-serif", outline: 'none',
                        }} />
                        <div style={{ display: 'flex', gap: 2 }}>
                          <span style={{ width: 14, height: 6, borderRadius: 2, background: C.ok }} />
                          <span style={{ width: 14, height: 6, borderRadius: 2, background: 'rgb(251,191,36)' }} />
                          <span style={{ width: 14, height: 6, borderRadius: 2, background: C.err }} />
                        </div>
                        <input type="number" placeholder="Haut" defaultValue={5} style={{
                          width: 60, padding: '5px 8px', borderRadius: 6, fontSize: 11,
                          background: C.bg, border: `1px solid ${C.border}`, color: C.text,
                          fontFamily: "'Rubik', sans-serif", outline: 'none',
                        }} />
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Affichage</div>
                  <CheckboxRow checked={showValues} onChange={() => setShowValues(v => !v)} label="Afficher les valeurs sur le graphique" />
                  <CheckboxRow checked={showTeamAvg} onChange={() => setShowTeamAvg(v => !v)} label="Afficher la moyenne de l'équipe en arrière-plan" />
                  <CheckboxRow checked={showTrend} onChange={() => setShowTrend(v => !v)} label="Afficher la tendance (ligne de régression)" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: C.sub }}>Granularité</span>
                    <select value={granularity} onChange={e => setGranularity(e.target.value)} style={{
                      padding: '5px 10px', borderRadius: 6, fontSize: 11,
                      background: C.bg, border: `1px solid ${C.border}`, color: C.text,
                      fontFamily: "'Rubik', sans-serif", outline: 'none',
                    }}>
                      <option value="match">Par match</option>
                      <option value="week">Par semaine</option>
                      <option value="month">Par mois</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Comparer avec les moyennes de la ligue</div>
                    <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>Données moyennes La Liga 2025-26</div>
                  </div>
                  <ToggleSwitch on={leagueCompare} onToggle={() => setLeagueCompare(o => !o)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {previewOpen && (
          <div style={{
            width: 280, borderLeft: `1px solid ${C.border}`, padding: 18,
            display: 'flex', flexDirection: 'column', gap: 14,
            animation: 'statSlideInRight 200ms ease',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Aperçu</div>
            <div style={{
              background: C.card2, borderRadius: 10, padding: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {MINI_CHARTS[selChart] ?? <RadarChart width={120} height={120} />}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selPlayers.map(pid => {
                const pl = PLAYERS.find(p => p.id === pid);
                return pl ? (
                  <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: pl.color }} />
                    <span style={{ fontSize: 10, color: C.sub }}>{pl.name.split(' ').pop()}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div style={{ fontSize: 11, color: C.sub }}>
              {selPlayers.length} joueurs · {selMetrics.length} métriques · {COMPETITIONS.find(c => c.id === selComp)?.label} · {CHART_TYPES.find(c => c.id === selChart)?.label}
            </div>
            <div style={{
              background: `${C.purple}12`, border: `1px solid ${C.purple}22`,
              borderRadius: 8, padding: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <Sparkles size={11} style={{ color: C.purple }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: C.purple }}>Suggestion IA</span>
              </div>
              <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5 }}>
                L'IA suggère d'ajouter la métrique 'xG' pour enrichir cette comparaison
              </div>
              <button onClick={() => { if (!selMetrics.includes('xg')) setSelMetrics(m => [...m, 'xg']); }} style={{
                marginTop: 8, fontSize: 10, fontWeight: 600, color: C.purple,
                background: `${C.purple}1a`, border: `1px solid ${C.purple}33`,
                borderRadius: 99, padding: '3px 10px', cursor: 'pointer',
                fontFamily: "'Rubik', sans-serif",
              }}>
                Ajouter xG
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 10,
        padding: '14px 22px', borderTop: `1px solid ${C.border}`,
      }}>
        <SecondaryBtn onClick={() => setPreviewOpen(o => !o)}>
          <Eye size={13} />Aperçu
        </SecondaryBtn>
        <PrimaryBtn onClick={onDone}>Ajouter au tableau de bord</PrimaryBtn>
      </div>
    </ModalShell>
  );
}

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} aria-label="Basculer" style={{
      width: 36, height: 20, borderRadius: 99, cursor: 'pointer',
      background: on ? C.brand : C.card2, border: `1px solid ${on ? C.brand : C.border2}`,
      padding: 2, display: 'flex', alignItems: 'center',
      transition: 'background 150ms, border-color 150ms',
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: '50%', background: C.white,
        transition: 'transform 150ms',
        transform: on ? 'translateX(16px)' : 'translateX(0)',
      }} />
    </button>
  );
}

function CheckboxRow({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        background: checked ? C.brand : 'transparent',
        border: `1px solid ${checked ? C.brand : C.border2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms',
      }}>
        {checked && <Check size={10} color="#fff" />}
      </span>
      <span style={{ fontSize: 11, color: C.sub }}>{label}</span>
    </label>
  );
}
