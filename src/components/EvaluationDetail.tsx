import { ArrowLeft, TrendingUp, TrendingDown, Minus, Crosshair, Brain, Shield, Swords } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  type Evaluation, type GroupName,
  evaluations, getGroupRatingAvg, getOverallScore,
  GROUP_NAMES, GROUP_COLORS, GROUP_BG, GROUP_TEXT,
  getAllRatingCriteria,
} from '../data/evaluationsData';
import {
  ChartCard,
  TICK_STYLE, AXIS_LINE, GRID_STYLE, TOOLTIP_STYLE,
  COLOR_BRAND, COLOR_AMBER,
  scoreColor, heatmapColor, heatmapTextColor,
  sessionTypeBadge,
} from './EvaluationChartHelpers';

const GROUP_ICONS: Record<GroupName, JSX.Element> = {
  'Technique':              <Crosshair className="w-4 h-4" />,
  'Intelligence Tactique':  <Brain className="w-4 h-4" />,
  'Physique & Défensif':    <Shield className="w-4 h-4" />,
  'Attaque & Collectif':    <Swords className="w-4 h-4" />,
};

function getCriterionSeasonAvg(criterionName: string): number {
  const vals: number[] = [];
  for (const ev of evaluations) {
    for (const g of ev.groups) {
      const c = g.criteria.find(cr => cr.name === criterionName && cr.type === 'rating');
      if (c) vals.push(c.value);
    }
  }
  return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

function getGroupSeasonAvg(groupName: string): number {
  const vals: number[] = [];
  for (const ev of evaluations) {
    const g = ev.groups.find(gr => gr.group === groupName);
    if (g) vals.push(getGroupRatingAvg(g));
  }
  return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

interface Props {
  evaluation: Evaluation;
  onBack: () => void;
}

export function EvaluationDetail({ evaluation, onBack }: Props) {
  const overallScore = getOverallScore(evaluation);
  const allRatingNames = getAllRatingCriteria();

  const comparisonData = evaluation.groups.flatMap(g =>
    g.criteria
      .filter(c => c.type === 'rating')
      .map(c => ({
        name: c.name.length > 14 ? c.name.slice(0, 13) + '.' : c.name,
        fullName: c.name,
        Séance: c.value,
        Moyenne: getCriterionSeasonAvg(c.name),
      }))
  );

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 mb-5 bg-transparent border-none cursor-pointer p-0 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />Retour aux évaluations
      </button>

      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 mb-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-sm font-semibold text-default-font">{evaluation.sessionName}</h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sessionTypeBadge[evaluation.sessionType]}`}>
                {evaluation.sessionType}
              </span>
            </div>
            <p className="text-xs text-subtext-color">{evaluation.coach} · {evaluation.date}</p>
          </div>
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <span className="text-2xl font-bold" style={{ color: scoreColor(overallScore), fontFamily: 'Rubik, sans-serif' }}>
              {overallScore}
            </span>
            <span className="text-xs text-subtext-color">/100</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-neutral-200">
          {evaluation.groups.map(g => {
            const avg = getGroupRatingAvg(g);
            const seasonAvg = getGroupSeasonAvg(g.group);
            const diff = avg - seasonAvg;
            const gn = g.group as GroupName;
            return (
              <div key={g.group} className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${GROUP_BG[gn]} ${GROUP_TEXT[gn]} flex items-center justify-center flex-shrink-0`}>
                  {GROUP_ICONS[gn]}
                </div>
                <div>
                  <div className="text-xs text-subtext-color leading-tight">{g.group}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold" style={{ color: GROUP_COLORS[gn] }}>{avg}</span>
                    <span className={`text-xs font-medium ${diff > 0 ? 'text-success-600' : diff < 0 ? 'text-error-600' : 'text-subtext-color'}`}>
                      {diff > 0 ? '+' : ''}{diff}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-5">
        {evaluation.groups.map(g => {
          const gn = g.group as GroupName;
          return (
            <div key={g.group} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded-md ${GROUP_BG[gn]} ${GROUP_TEXT[gn]} flex items-center justify-center flex-shrink-0`}>
                  {GROUP_ICONS[gn]}
                </div>
                <span className="text-sm font-semibold text-default-font">{g.group}</span>
                <span className="text-xs text-subtext-color ml-auto">Moy. {getGroupRatingAvg(g)}/100</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                {g.criteria.map(c => {
                  if (c.type === 'stat') {
                    return (
                      <div key={c.name} className="ev-criterion-row">
                        <span className="ev-criterion-label">{c.name}</span>
                        <span className="text-sm font-bold text-default-font">{c.value}</span>
                      </div>
                    );
                  }
                  const seasonAvg = getCriterionSeasonAvg(c.name);
                  const diff = c.value - seasonAvg;
                  return (
                    <div key={c.name} className="ev-criterion-row">
                      <span className="ev-criterion-label">{c.name}</span>
                      <div className="ev-progress-track" style={{ maxWidth: 120 }}>
                        <div
                          className="ev-progress-fill"
                          style={{ width: `${c.value}%`, background: GROUP_COLORS[gn] }}
                        />
                      </div>
                      <span className="ev-criterion-value" style={{ color: scoreColor(c.value) }}>{c.value}</span>
                      <span className={`ev-criterion-compare ${diff > 0 ? 'text-success-600' : diff < 0 ? 'text-error-600' : 'text-subtext-color'}`}>
                        {diff > 0 ? <TrendingUp className="w-3 h-3" /> : diff < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {diff > 0 ? '+' : ''}{diff}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <ChartCard
        title="Séance vs Moyenne saison"
        subtitle="Tous les critères de notation — comparaison directe"
        legend={[
          { color: COLOR_BRAND, label: 'Cette séance' },
          { color: COLOR_AMBER, label: 'Moy. 12 séances' },
        ]}
        className="mb-5"
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={comparisonData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid {...GRID_STYLE} vertical={false} />
            <XAxis dataKey="name" tick={TICK_STYLE} axisLine={AXIS_LINE} tickLine={false} interval={0} angle={-25} textAnchor="end" height={50} />
            <YAxis domain={[0, 100]} tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(v: number, name: string) => [v, name]}
              labelFormatter={(label: string) => {
                const item = comparisonData.find(d => d.name === label);
                return item ? item.fullName : label;
              }}
            />
            <Bar dataKey="Séance" fill={COLOR_BRAND} radius={[3, 3, 0, 0]} maxBarSize={20} fillOpacity={0.9} />
            <Bar dataKey="Moyenne" fill={COLOR_AMBER} radius={[3, 3, 0, 0]} maxBarSize={20} fillOpacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xs font-semibold text-subtext-color uppercase tracking-wide">Carte de chaleur — 12 séances</h3>
        </div>
        <div className="ev-heatmap-wrap">
          <div style={{ minWidth: 600 }}>
            <div className="flex mb-2" style={{ paddingLeft: 150 }}>
              {evaluations.map((ev, i) => (
                <div
                  key={ev.id}
                  style={{ flex: 1, minWidth: 0 }}
                  className={`text-center text-xs font-medium ${ev.id === evaluation.id ? 'text-brand-600' : 'text-subtext-color'}`}
                >
                  S{i + 1}
                </div>
              ))}
            </div>
            {allRatingNames.map(criterionName => (
              <div key={criterionName} className="flex items-center mb-1.5">
                <div style={{ width: 150, flexShrink: 0 }} className="text-xs text-subtext-color pr-3 text-right truncate" title={criterionName}>
                  {criterionName}
                </div>
                {evaluations.map(ev => {
                  let val = 0;
                  for (const g of ev.groups) {
                    const c = g.criteria.find(cr => cr.name === criterionName && cr.type === 'rating');
                    if (c) { val = c.value; break; }
                  }
                  const isCurrent = ev.id === evaluation.id;
                  return (
                    <div key={ev.id} style={{ flex: 1, minWidth: 0, padding: '0 2px' }}>
                      <div
                        className="ev-heatmap-cell"
                        style={{
                          background: heatmapColor(val),
                          color: heatmapTextColor(val),
                          outline: isCurrent ? '2px solid rgb(0, 145, 255)' : 'none',
                          outlineOffset: '-1px',
                        }}
                        title={`${criterionName}: ${val} — ${ev.date}`}
                      >
                        {val}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3" style={{ paddingLeft: 150 }}>
              <span className="text-xs text-subtext-color">Faible</span>
              {[
                'rgba(229, 72, 77, 0.5)',
                'rgba(245, 166, 35, 0.35)',
                'rgba(245, 166, 35, 0.55)',
                'rgba(70, 167, 88, 0.5)',
                'rgba(70, 167, 88, 0.85)',
              ].map(c => (
                <div key={c} style={{ width: 20, height: 10, borderRadius: 3, background: c }} />
              ))}
              <span className="text-xs text-subtext-color">Élevé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
