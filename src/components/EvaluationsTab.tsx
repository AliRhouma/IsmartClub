import { useState, useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Calendar, User, Clock, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, Award, BarChart3, Filter,
} from 'lucide-react';
import {
  evaluations,
  GROUP_NAMES,
  GROUP_COLORS,
  GROUP_BG,
  GROUP_TEXT,
  CRITERIA_BY_GROUP,
  getGroupRatingAvg,
  getOverallScore,
  type Evaluation,
  type GroupName,
} from '../data/evaluationsData';

// ─── Colors ───────────────────────────────────────────────────────────────────

const COLOR_BRAND   = 'rgb(0, 145, 255)';
const COLOR_SUCCESS = 'rgb(70, 167, 88)';
const COLOR_ERROR   = 'rgb(229, 72, 77)';

const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'rgb(36, 36, 36)',
    border: '1px solid rgb(48, 48, 48)',
    borderRadius: '8px',
    color: 'rgb(250, 250, 250)',
    fontSize: '12px',
    fontFamily: 'Rubik, sans-serif',
    padding: '8px 12px',
  },
  labelStyle: { color: 'rgb(163, 163, 163)', marginBottom: '4px', fontSize: '11px' },
  itemStyle:  { color: 'rgb(250, 250, 250)', padding: '2px 0' },
  cursor:     { fill: 'rgba(255,255,255,0.03)' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGroupAvgAcrossAll(groupName: GroupName): number {
  const vals = evaluations.map(e => {
    const g = e.groups.find(gr => gr.group === groupName);
    return g ? getGroupRatingAvg(g) : 0;
  });
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function getCriteriaAvg(name: string): number {
  let sum = 0;
  let count = 0;
  for (const e of evaluations) {
    for (const g of e.groups) {
      const c = g.criteria.find(cr => cr.name === name && cr.type === 'rating');
      if (c) { sum += c.value; count++; }
    }
  }
  return count > 0 ? Math.round(sum / count) : 0;
}

function getCriteriaTrend(name: string): number {
  if (evaluations.length < 4) return 0;
  const first3: number[] = [];
  const last3: number[] = [];
  for (let i = 0; i < 3; i++) {
    for (const g of evaluations[i].groups) {
      const c = g.criteria.find(cr => cr.name === name && cr.type === 'rating');
      if (c) first3.push(c.value);
    }
  }
  for (let i = evaluations.length - 3; i < evaluations.length; i++) {
    for (const g of evaluations[i].groups) {
      const c = g.criteria.find(cr => cr.name === name && cr.type === 'rating');
      if (c) last3.push(c.value);
    }
  }
  const firstAvg = first3.reduce((a, b) => a + b, 0) / first3.length;
  const lastAvg = last3.reduce((a, b) => a + b, 0) / last3.length;
  return Math.round(lastAvg - firstAvg);
}

function getRadarData() {
  return GROUP_NAMES.map(gn => ({
    subject: gn,
    value: getGroupAvgAcrossAll(gn),
    fullMark: 100,
  }));
}

function getTrendData() {
  return evaluations.map((e, i) => ({
    session: `S${i + 1}`,
    overall: getOverallScore(e),
    ...Object.fromEntries(
      e.groups.map(g => [g.group, getGroupRatingAvg(g)])
    ),
  }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SessionCard({ eval: ev }: { eval: Evaluation }) {
  const [expanded, setExpanded] = useState(false);
  const overall = getOverallScore(ev);

  return (
    <div className="border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
            <Award className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-default-font">{ev.sessionName}</div>
            <div className="flex items-center gap-2 text-xs text-subtext-color mt-0.5">
              <Calendar className="w-3 h-3" /> {ev.date}
              <span className="text-neutral-300">|</span>
              <User className="w-3 h-3" /> {ev.coach}
              <span className="text-neutral-300">|</span>
              <Clock className="w-3 h-3" /> {ev.duration} min
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                ev.sessionType === 'Entraînement' ? 'bg-brand-50 text-brand-600' :
                ev.sessionType === 'Tactique' ? 'bg-purple-50 text-purple-600' :
                'bg-error-50 text-error-600'
              }`}>
                {ev.sessionType}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: overall >= 85 ? COLOR_SUCCESS : overall >= 70 ? COLOR_BRAND : COLOR_ERROR }}>
              {overall}
            </div>
            <div className="text-[10px] text-subtext-color">/ 100</div>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-subtext-color" /> : <ChevronDown className="w-4 h-4 text-subtext-color" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {ev.groups.map(g => {
              const avg = getGroupRatingAvg(g);
              const color = GROUP_COLORS[g.group];
              const bg = GROUP_BG[g.group];
              const text = GROUP_TEXT[g.group];
              return (
                <div key={g.group} className={`${bg} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-semibold ${text}`}>{g.group}</span>
                    <span className={`text-sm font-bold ${text}`}>{avg}</span>
                  </div>
                  <div className="space-y-1">
                    {g.criteria.map(c => (
                      <div key={c.name} className="flex items-center justify-between">
                        <span className="text-xs text-subtext-color">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${c.type === 'rating' ? c.value : Math.min(c.value * 5, 100)}%`, background: color }}
                            />
                          </div>
                          <span className="text-xs font-medium text-default-font w-6 text-right">
                            {c.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {ev.notes && (
            <div className="mt-3 px-3 py-2 bg-neutral-100 rounded-lg text-xs text-subtext-color italic">
              {ev.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EvaluationsTab() {
  const [filterType, setFilterType] = useState<'ALL' | 'Entraînement' | 'Tactique' | 'Préparation physique'>('ALL');

  const filtered = useMemo(() => {
    if (filterType === 'ALL') return evaluations;
    return evaluations.filter(e => e.sessionType === filterType);
  }, [filterType]);

  const overallAvg = useMemo(() => {
    const scores = filtered.map(e => getOverallScore(e));
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [filtered]);

  const groupAvgs = useMemo(() => {
    return GROUP_NAMES.map(gn => ({
      name: gn,
      avg: getGroupAvgAcrossAll(gn),
      color: GROUP_COLORS[gn],
    }));
  }, []);

  const topCriteria = useMemo(() => {
    const all: { name: string; value: number; trend: number }[] = [];
    for (const gn of GROUP_NAMES) {
      const names = CRITERIA_BY_GROUP[gn].filter(c => c.type === 'rating').map(c => c.name);
      for (const name of names) {
        all.push({ name, value: getCriteriaAvg(name), trend: getCriteriaTrend(name) });
      }
    }
    return all.sort((a, b) => b.value - a.value).slice(0, 5);
  }, []);

  const bottomCriteria = useMemo(() => {
    const all: { name: string; value: number; trend: number }[] = [];
    for (const gn of GROUP_NAMES) {
      const names = CRITERIA_BY_GROUP[gn].filter(c => c.type === 'rating').map(c => c.name);
      for (const name of names) {
        all.push({ name, value: getCriteriaAvg(name), trend: getCriteriaTrend(name) });
      }
    }
    return all.sort((a, b) => a.value - b.value).slice(0, 5);
  }, []);

  const radarData = useMemo(() => getRadarData(), []);
  const trendData = useMemo(() => getTrendData(), []);

  // ── Render ──
  return (
    <div className="p-6 space-y-6">
      {/* ═══ HEADER / SCORE ═══════════════════════════════════════════════ */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-2 text-default-font mb-1">Évaluations</h2>
          <p className="text-body text-subtext-color">{filtered.length} séances d'évaluation enregistrées</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-caption text-subtext-color">Score global</div>
            <div className="text-heading-1 font-bold" style={{ color: overallAvg >= 85 ? COLOR_SUCCESS : overallAvg >= 70 ? COLOR_BRAND : COLOR_ERROR }}>
              {overallAvg}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center" style={{ borderColor: overallAvg >= 85 ? COLOR_SUCCESS : overallAvg >= 70 ? COLOR_BRAND : COLOR_ERROR }}>
            <span className="text-xs font-bold text-default-font">/100</span>
          </div>
        </div>
      </div>

      {/* ═══ FILTER BAR ═══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-subtext-color" />
        <span className="text-xs text-subtext-color font-medium">Type de séance</span>
        {(['ALL', 'Entraînement', 'Tactique', 'Préparation physique'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === type
                ? 'bg-brand-50 text-brand-600 border border-brand-200'
                : 'bg-neutral-100 text-subtext-color hover:bg-neutral-150 border border-transparent'
            }`}
          >
            {type === 'ALL' ? 'Toutes' : type}
          </button>
        ))}
      </div>

      {/* ═══ GROUP AVERAGES CARDS ═════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {groupAvgs.map(({ name, avg, color }) => (
          <div key={name} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-subtext-color font-medium">{name}</span>
              <BarChart3 className="w-4 h-4 text-subtext-color" />
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color }}>{avg}</div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${avg}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>

      {/* ═══ RADAR + TREND ════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-default-font mb-4">Profil par groupe</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
              <PolarGrid stroke="rgb(48,48,48)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgb(163,163,163)', fontSize: 11, fontFamily: 'Rubik, sans-serif' }} />
              <Radar name="Moyenne" dataKey="value" stroke={COLOR_BRAND} fill={COLOR_BRAND} fillOpacity={0.18} strokeWidth={2} dot={{ fill: COLOR_BRAND, r: 3, strokeWidth: 0 }} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`${v} / 100`, '']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-default-font mb-4">Évolution du score global</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(37,37,37)" />
              <XAxis dataKey="session" tick={{ fill: 'rgb(163,163,163)', fontSize: 11, fontFamily: 'Rubik, sans-serif' }} axisLine={{ stroke: 'rgb(48,48,48)' }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgb(163,163,163)', fontSize: 11, fontFamily: 'Rubik, sans-serif' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="overall" stroke={COLOR_BRAND} strokeWidth={2} dot={{ fill: COLOR_BRAND, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: COLOR_BRAND }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══ TOP / BOTTOM CRITERIA ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <h3 className="text-sm font-semibold text-default-font">Points forts</h3>
          </div>
          <div className="space-y-2">
            {topCriteria.map(({ name, value, trend }) => (
              <div key={name} className="flex items-center justify-between py-1.5 border-b border-neutral-200 last:border-0">
                <span className="text-xs text-default-font">{name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-success-600 rounded-full" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-xs font-bold text-success-600 w-6 text-right">{value}</span>
                  <span className={`text-[10px] ${trend > 0 ? 'text-success-600' : trend < 0 ? 'text-error-600' : 'text-subtext-color'}`}>
                    {trend > 0 ? '↑' : trend < 0 ? '↓' : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-error-600" />
            <h3 className="text-sm font-semibold text-default-font">Points à améliorer</h3>
          </div>
          <div className="space-y-2">
            {bottomCriteria.map(({ name, value, trend }) => (
              <div key={name} className="flex items-center justify-between py-1.5 border-b border-neutral-200 last:border-0">
                <span className="text-xs text-default-font">{name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-error-600 rounded-full" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-xs font-bold text-error-600 w-6 text-right">{value}</span>
                  <span className={`text-[10px] ${trend > 0 ? 'text-success-600' : trend < 0 ? 'text-error-600' : 'text-subtext-color'}`}>
                    {trend > 0 ? '↑' : trend < 0 ? '↓' : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SESSIONS LIST ════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-default-font">Historique des séances</h3>
          <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">
            {filtered.length} séances
          </span>
        </div>
        <div className="space-y-3">
          {filtered.map((ev) => (
            <SessionCard key={ev.id} eval={ev} />
          ))}
        </div>
      </div>
    </div>
  );
}
