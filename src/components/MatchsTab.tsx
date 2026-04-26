// MatchsTab.tsx
// Drop-in replacement for MatchsTab in PlayerProfilePage.tsx
// Requires: npm install recharts
// Usage: replace the MatchsTab function and move related types/data here,
//        then import { MatchsTab } in your page file.

import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PieChart, Pie, Cell as PieCell,
  PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import {
  Clock, Shield, Trophy, Target, Activity, Zap, Star,
  UserCheck, Calendar, Filter, X,
} from 'lucide-react';
import './match-stats-styles.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type Comp   = 'CL' | 'LL';
type Result = 'W'  | 'L'  | 'D';
type Status = 'titulaire' | 'remplacant' | 'non_entré' | 'non_convoqué';

interface Match {
  date: string;
  comp: Comp;
  home: string;
  away: string;
  hs: number;
  as: number;
  result: Result;
  min: string | null;
  g: number;
  a: number;
  yc: number;
  rc: number;
  playerHome: boolean;
  status: Status;
}

type CompFilter  = 'ALL' | Comp;
type DatePreset  = 'ALL' | 'LAST_5' | 'LAST_10' | 'JAN' | 'FEB' | 'MAR' | 'CUSTOM';

// ─── Match data ───────────────────────────────────────────────────────────────

const lastMatches: Match[] = [
  // ───── MARCH ─────
  { date: '11.03.26', comp: 'CL', home: 'Real Madrid', away: 'Manchester City', hs: 3, as: 0, result: 'W', min: "90'", g: 3, a: 0, yc: 1, rc: 0, playerHome: true,  status: 'titulaire' },
  { date: '09.03.26', comp: 'LL', home: 'Sevilla',     away: 'Real Madrid',     hs: 2, as: 2, result: 'D', min: "88'", g: 1, a: 1, yc: 0, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '06.03.26', comp: 'LL', home: 'Celta Vigo',  away: 'Real Madrid',     hs: 1, as: 2, result: 'W', min: "90'", g: 1, a: 0, yc: 0, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '04.03.26', comp: 'CL', home: 'Real Madrid', away: 'Bayern Munich',   hs: 1, as: 1, result: 'D', min: "90'", g: 0, a: 1, yc: 1, rc: 0, playerHome: true,  status: 'titulaire' },
  { date: '02.03.26', comp: 'LL', home: 'Real Madrid', away: 'Getafe',          hs: 0, as: 1, result: 'L', min: "90'", g: 0, a: 0, yc: 1, rc: 0, playerHome: true,  status: 'titulaire' },

  // ───── LATE FEB ─────
  { date: '27.02.26', comp: 'LL', home: 'Mallorca',    away: 'Real Madrid',     hs: 1, as: 3, result: 'W', min: "75'", g: 1, a: 1, yc: 0, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '25.02.26', comp: 'CL', home: 'Real Madrid', away: 'Benfica',         hs: 2, as: 1, result: 'W', min: "90'", g: 0, a: 2, yc: 0, rc: 0, playerHome: true,  status: 'titulaire' },
  { date: '23.02.26', comp: 'LL', home: 'Real Madrid', away: 'Almeria',         hs: 4, as: 2, result: 'W', min: "82'", g: 2, a: 0, yc: 1, rc: 0, playerHome: true,  status: 'titulaire' },
  { date: '21.02.26', comp: 'LL', home: 'Osasuna',     away: 'Real Madrid',     hs: 2, as: 1, result: 'L', min: "75'", g: 0, a: 1, yc: 0, rc: 1, playerHome: false, status: 'titulaire' },

  // ───── MID FEB ─────
  { date: '19.02.26', comp: 'CL', home: 'Inter',       away: 'Real Madrid',     hs: 0, as: 2, result: 'W', min: "90'", g: 1, a: 0, yc: 0, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '17.02.26', comp: 'CL', home: 'Benfica',     away: 'Real Madrid',     hs: 0, as: 1, result: 'W', min: null,  g: 0, a: 0, yc: 0, rc: 0, playerHome: false, status: 'non_entré' },
  { date: '15.02.26', comp: 'LL', home: 'Betis',       away: 'Real Madrid',     hs: 1, as: 1, result: 'D', min: "68'", g: 0, a: 0, yc: 1, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '14.02.26', comp: 'LL', home: 'Real Madrid', away: 'R. Sociedad',     hs: 4, as: 1, result: 'W', min: "73'", g: 1, a: 0, yc: 1, rc: 0, playerHome: true,  status: 'titulaire' },

  // ───── EARLY FEB ─────
  { date: '12.02.26', comp: 'LL', home: 'Granada',     away: 'Real Madrid',     hs: 0, as: 2, result: 'W', min: "90'", g: 0, a: 1, yc: 0, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '10.02.26', comp: 'CL', home: 'Real Madrid', away: 'Napoli',          hs: 3, as: 2, result: 'W', min: "90'", g: 2, a: 0, yc: 1, rc: 0, playerHome: true,  status: 'titulaire' },
  { date: '08.02.26', comp: 'LL', home: 'Valencia',    away: 'Real Madrid',     hs: 0, as: 2, result: 'W', min: null,  g: 0, a: 0, yc: 0, rc: 0, playerHome: false, status: 'non_convoqué' },
  { date: '06.02.26', comp: 'LL', home: 'Real Madrid', away: 'Villarreal',      hs: 1, as: 2, result: 'L', min: "85'", g: 1, a: 0, yc: 0, rc: 0, playerHome: true,  status: 'titulaire' },

  // ───── JAN END ─────
  { date: '03.02.26', comp: 'CL', home: 'PSG',         away: 'Real Madrid',     hs: 2, as: 2, result: 'D', min: "90'", g: 1, a: 1, yc: 0, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '01.02.26', comp: 'LL', home: 'Real Madrid', away: 'Rayo Vallecano',  hs: 2, as: 1, result: 'W', min: "25'", g: 0, a: 0, yc: 0, rc: 0, playerHome: true,  status: 'remplacant' },

  // ───── JAN MID ─────
  { date: '28.01.26', comp: 'LL', home: 'Cadiz',       away: 'Real Madrid',     hs: 0, as: 3, result: 'W', min: "70'", g: 1, a: 0, yc: 0, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '25.01.26', comp: 'CL', home: 'Real Madrid', away: 'Dortmund',        hs: 2, as: 0, result: 'W', min: "90'", g: 1, a: 0, yc: 1, rc: 0, playerHome: true,  status: 'titulaire' },
  { date: '22.01.26', comp: 'LL', home: 'Barcelona',   away: 'Real Madrid',     hs: 3, as: 1, result: 'L', min: "90'", g: 0, a: 0, yc: 1, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '19.01.26', comp: 'LL', home: 'Real Madrid', away: 'Athletic Club',   hs: 2, as: 2, result: 'D', min: "15'", g: 0, a: 0, yc: 0, rc: 0, playerHome: true,  status: 'remplacant' },

  // ───── JAN START ─────
  { date: '15.01.26', comp: 'CL', home: 'AC Milan',    away: 'Real Madrid',     hs: 1, as: 2, result: 'W', min: "90'", g: 0, a: 1, yc: 0, rc: 0, playerHome: false, status: 'titulaire' },
  { date: '12.01.26', comp: 'LL', home: 'Real Madrid', away: 'Girona',          hs: 3, as: 1, result: 'W', min: "90'", g: 2, a: 0, yc: 1, rc: 0, playerHome: true,  status: 'titulaire' },
  { date: '08.01.26', comp: 'LL', home: 'Espanyol',    away: 'Real Madrid',     hs: 1, as: 1, result: 'D', min: null,  g: 0, a: 0, yc: 0, rc: 0, playerHome: false, status: 'non_entré' },
];

// ─── Badges & colors ──────────────────────────────────────────────────────────

const resultBadge: Record<Result, string> = {
  W: 'bg-success-50 text-success-600 border border-success-200',
  L: 'bg-error-50   text-error-600   border border-error-200',
  D: 'bg-warning-50 text-warning-600 border border-warning-200',
};
const resultLabel: Record<Result, string> = { W: 'V', L: 'D', D: 'N' };

const compBadge: Record<Comp, string> = {
  CL: 'bg-brand-50 text-brand-600',
  LL: 'bg-warning-50 text-warning-600',
};

const COLOR_BRAND   = 'rgb(0, 145, 255)';
const COLOR_SUCCESS = 'rgb(70, 167, 88)';
const COLOR_ERROR   = 'rgb(229, 72, 77)';
const COLOR_CYAN    = 'rgb(104, 221, 253)';
const COLOR_NEUTRAL = 'rgb(82, 82, 82)';
const COLOR_AMBER   = 'rgb(251, 191, 36)';

const STATUS_COLORS: Record<Status, string> = {
  titulaire:     COLOR_BRAND,
  remplacant:    COLOR_AMBER,
  non_entré:     COLOR_NEUTRAL,
  non_convoqué:  'rgb(60, 30, 32)',
};

const STATUS_LABELS: Record<Status, string> = {
  titulaire:     'Titulaire',
  remplacant:    'Remplaçant',
  non_entré:     'Non entré',
  non_convoqué:  'Non convoqué',
};

const resultDotStyles: Record<Result, { bg: string; color: string }> = {
  W: { bg: 'rgb(22, 48, 29)',  color: COLOR_SUCCESS },
  L: { bg: 'rgb(60, 24, 26)',  color: COLOR_ERROR },
  D: { bg: 'rgb(48, 48, 48)',  color: 'rgb(163, 163, 163)' },
};

// ─── Recharts shared style helpers ───────────────────────────────────────────

const TICK_STYLE   = { fill: 'rgb(163, 163, 163)', fontSize: 11, fontFamily: 'Rubik, sans-serif' };
const AXIS_LINE    = { stroke: 'rgb(48, 48, 48)' };
const GRID_STYLE   = { strokeDasharray: '3 3', stroke: 'rgb(37, 37, 37)' };
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

// ─── Helper functions ─────────────────────────────────────────────────────────

const parseMin = (m: Match): number => m.min ? parseInt(m.min) : 0;

const getOpponent = (m: Match) =>
  (m.playerHome ? m.away : m.home)
    .replace('Real Madrid', 'R. Madrid')
    .replace('Manchester City', 'Man City')
    .replace('Rayo Vallecano', 'Rayo');

const getMonthKey = (date: string): string => {
  const parts = date.split('.');
  const monthNames: Record<string, string> = {
    '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
    '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Aoû',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc',
  };
  return `${monthNames[parts[1]]} ${parts[2]}`;
};

const parseDate = (d: string): Date => {
  const [dd, mm, yy] = d.split('.');
  return new Date(2000 + parseInt(yy), parseInt(mm) - 1, parseInt(dd));
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const CardIcon = ({ color }: { color: string }) => (
  <div style={{ width: 12, height: 16, borderRadius: 2, background: color, margin: '0 auto' }} />
);

const ChartLegend = ({ items }: { items: { color: string; label: string }[] }) => (
  <div className="ms-chart-legend">
    {items.map(({ color, label }) => (
      <div key={label} className="ms-chart-legend-item">
        <span className="ms-chart-legend-dot" style={{ background: color }} />
        <span className="ms-chart-legend-label">{label}</span>
      </div>
    ))}
  </div>
);

const ChartCard = ({
  title, subtitle, legend, children, className = '', style = {},
}: {
  title: string;
  subtitle?: string;
  legend?: { color: string; label: string }[];
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div className={`ms-chart-card ${className}`} style={style}>
    <div className="ms-chart-card-header">
      <div>
        <div className="ms-chart-card-title">{title}</div>
        {subtitle && <span className="ms-chart-card-subtitle">{subtitle}</span>}
      </div>
    </div>
    {legend && <ChartLegend items={legend} />}
    {children}
  </div>
);

const MinuteBarLabel = (props: any) => {
  const { x, y, width, index, data } = props;
  const m: { yc: number; rc: number } = data[index];
  if (!m?.yc && !m?.rc) return null;
  const cards: string[] = [
    ...Array(m.yc).fill('#fbbf24'),
    ...Array(m.rc).fill(COLOR_ERROR),
  ];
  const totalW = cards.length * 7 - 1;
  return (
    <g>
      {cards.map((fill, i) => (
        <rect key={i} x={x + width / 2 - totalW / 2 + i * 7} y={y - 11} width={5} height={8} rx={1} fill={fill} />
      ))}
    </g>
  );
};

const GhostBar = (props: any) => {
  const { x, y, width, height } = props;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={4}
        fill="none" stroke="rgb(60, 30, 32)" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="central"
        fill="rgb(82, 82, 82)" fontSize={7} fontFamily="Rubik, sans-serif" fontWeight={500}>NC</text>
    </g>
  );
};

const PillButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`ms-pill-btn ${active ? 'ms-pill-btn-active' : ''}`}>
    {children}
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────

export function MatchsTab() {
  const [compFilter, setCompFilter]     = useState<CompFilter>('ALL');
  const [datePreset, setDatePreset]     = useState<DatePreset>('ALL');
  const [customFrom, setCustomFrom]     = useState<string>('');
  const [customTo, setCustomTo]         = useState<string>('');
  const [showCustom, setShowCustom]     = useState(false);

  // ── Global filtered list ──
  const filtered = useMemo(() => {
    let list = [...lastMatches];
    if (compFilter !== 'ALL') list = list.filter(m => m.comp === compFilter);
    if (datePreset === 'LAST_5')       list = list.slice(0, 5);
    else if (datePreset === 'LAST_10') list = list.slice(0, 10);
    else if (datePreset === 'JAN')     list = list.filter(m => m.date.split('.')[1] === '01');
    else if (datePreset === 'FEB')     list = list.filter(m => m.date.split('.')[1] === '02');
    else if (datePreset === 'MAR')     list = list.filter(m => m.date.split('.')[1] === '03');
    else if (datePreset === 'CUSTOM' && customFrom && customTo) {
      const from = new Date(customFrom);
      const to   = new Date(customTo);
      list = list.filter(m => { const d = parseDate(m.date); return d >= from && d <= to; });
    }
    return list;
  }, [compFilter, datePreset, customFrom, customTo]);

  const activeFilterCount = (compFilter !== 'ALL' ? 1 : 0) + (datePreset !== 'ALL' ? 1 : 0);
  const clearFilters = () => { setCompFilter('ALL'); setDatePreset('ALL'); setCustomFrom(''); setCustomTo(''); setShowCustom(false); };

  // ── Stats ──
  const wins    = filtered.filter(m => m.result === 'W').length;
  const losses  = filtered.filter(m => m.result === 'L').length;
  const draws   = filtered.filter(m => m.result === 'D').length;
  const goals   = filtered.reduce((s, m) => s + m.g, 0);
  const assists = filtered.reduce((s, m) => s + m.a, 0);

  const chrono         = [...filtered].reverse();
  const playedFiltered = filtered.filter(m => m.status === 'titulaire' || m.status === 'remplacant');
  const playedChrono   = chrono.filter(m => m.status === 'titulaire' || m.status === 'remplacant');

  const timelineData = playedChrono.map(m => ({ match: getOpponent(m), Buts: m.g, 'Passes D.': m.a }));

  const minutesData = chrono.map(m => ({
    match: getOpponent(m), minutes: parseMin(m), yc: m.yc, rc: m.rc,
    result: m.result as Result, status: m.status,
    displayMinutes: m.status === 'non_convoqué' || m.status === 'non_entré' ? 8 : parseMin(m),
  }));

  const totalG   = playedFiltered.reduce((s, m) => s + m.g, 0);
  const totalA   = playedFiltered.reduce((s, m) => s + m.a, 0);
  const totalMin = playedFiltered.reduce((s, m) => s + parseMin(m), 0);
  const g90      = totalMin > 0 ? ((totalG / totalMin) * 90).toFixed(2) : '0.00';
  const a90      = totalMin > 0 ? ((totalA / totalMin) * 90).toFixed(2) : '0.00';

  const sparkData = playedChrono.map((_, i) => {
    const slice = playedChrono.slice(0, i + 1);
    const sg = slice.reduce((s, x) => s + x.g, 0);
    const sm = slice.reduce((s, x) => s + parseMin(x), 0);
    return { i, v: sm > 0 ? parseFloat(((sg / sm) * 90).toFixed(2)) : 0 };
  });

  const clPlayed = playedFiltered.filter(m => m.comp === 'CL');
  const llPlayed = playedFiltered.filter(m => m.comp === 'LL');
  const competitionData = [
    { stat: 'Buts',      CL: clPlayed.reduce((s, m) => s + m.g, 0),         LL: llPlayed.reduce((s, m) => s + m.g, 0) },
    { stat: 'Passes D.', CL: clPlayed.reduce((s, m) => s + m.a, 0),         LL: llPlayed.reduce((s, m) => s + m.a, 0) },
    { stat: 'Cartons',   CL: clPlayed.reduce((s, m) => s + m.yc + m.rc, 0), LL: llPlayed.reduce((s, m) => s + m.yc + m.rc, 0) },
  ];

  const matchesPlayed   = playedFiltered.length;
  const totalMinPoss    = matchesPlayed * 90;
  const winRate         = filtered.length > 0 ? Math.round((wins / filtered.length) * 100) : 0;
  const cleanGames      = playedFiltered.filter(m => m.yc === 0 && m.rc === 0).length;
  const disciplineScore = matchesPlayed > 0 ? Math.round((cleanGames / matchesPlayed) * 100) : 0;
  const minutesPct      = totalMinPoss > 0 ? Math.round((totalMin / totalMinPoss) * 100) : 0;
  const titulairePct    = filtered.length > 0 ? Math.round((filtered.filter(m => m.status === 'titulaire').length / filtered.length) * 100) : 0;

  const radarData = [
    { subject: 'Buts',       value: Math.min(Math.round((totalG / 8) * 100), 100) },
    { subject: 'Passes D.',  value: Math.min(Math.round((totalA / 6) * 100), 100) },
    { subject: 'Minutes',    value: minutesPct },
    { subject: 'Victoires',  value: winRate },
    { subject: 'Discipline', value: disciplineScore },
    { subject: 'Titulaire',  value: titulairePct },
  ];

  const monthlyGoals: Record<string, { Buts: number; 'Passes D.': number }> = {};
  playedFiltered.forEach(m => {
    const key = getMonthKey(m.date);
    if (!monthlyGoals[key]) monthlyGoals[key] = { Buts: 0, 'Passes D.': 0 };
    monthlyGoals[key].Buts += m.g;
    monthlyGoals[key]['Passes D.'] += m.a;
  });
  const monthOrder = ['Jan 26', 'Fév 26', 'Mar 26'];
  const monthlyData = monthOrder.filter(k => monthlyGoals[k]).map(k => ({ month: k, ...monthlyGoals[k] }));

  // ── Status data ──
  const statusCounts: Record<Status, number> = {
    titulaire:     filtered.filter(m => m.status === 'titulaire').length,
    remplacant:    filtered.filter(m => m.status === 'remplacant').length,
    non_entré:     filtered.filter(m => m.status === 'non_entré').length,
    non_convoqué:  filtered.filter(m => m.status === 'non_convoqué').length,
  };
  const convoqué = statusCounts.titulaire + statusCounts.remplacant + statusCounts.non_entré;

  const donutData = (Object.keys(statusCounts) as Status[])
    .filter(s => statusCounts[s] > 0)
    .map(s => ({ name: STATUS_LABELS[s], value: statusCounts[s], color: STATUS_COLORS[s], status: s }));

  const monthlyStatus: Record<string, Record<Status, number>> = {};
  filtered.forEach(m => {
    const key = getMonthKey(m.date);
    if (!monthlyStatus[key]) monthlyStatus[key] = { titulaire: 0, remplacant: 0, non_entré: 0, non_convoqué: 0 };
    monthlyStatus[key][m.status]++;
  });
  const statusMonthlyData = monthOrder.filter(k => monthlyStatus[k]).map(k => ({ month: k, ...monthlyStatus[k] }));

  // ── Table summary ──
  const tableTotalMin = filtered.reduce((s, m) => s + parseMin(m), 0);
  const tableYC       = filtered.reduce((s, m) => s + m.yc, 0);
  const tableRC       = filtered.reduce((s, m) => s + m.rc, 0);

  // ── KPI strip ──
  const summaryCards = [
    { label: 'Matchs joués', value: filtered.length, icon: <Shield className="w-4 h-4 text-brand-600" />,    cls: 'text-default-font' },
    { label: 'Victoires',    value: wins,             icon: <Trophy className="w-4 h-4 text-success-600" />,   cls: 'text-success-600' },
    { label: 'Défaites',     value: losses,           icon: <Target className="w-4 h-4 text-error-600" />,     cls: 'text-error-600' },
    { label: 'Nuls',         value: draws,            icon: <Activity className="w-4 h-4 text-warning-600" />, cls: 'text-default-font' },
    { label: 'Buts',         value: goals,            icon: <Zap className="w-4 h-4 text-brand-600" />,        cls: 'text-brand-600' },
    { label: 'Passes déc.',  value: assists,          icon: <Star className="w-4 h-4 text-brand-600" />,       cls: 'text-brand-600' },
  ];

  const statusTagClass: Record<Status, string> = {
    titulaire:     'ms-status-tag ms-status-tag-titulaire',
    remplacant:    'ms-status-tag ms-status-tag-remplacant',
    non_entré:     'ms-status-tag ms-status-tag-non_entre',
    non_convoqué:  'ms-status-tag ms-status-tag-non_convoque',
  };
  const statusTagLabel: Record<Status, string> = {
    titulaire: 'TIT', remplacant: 'REM', non_entré: 'NE', non_convoqué: 'NC',
  };

  const dateOptions: { value: DatePreset; label: string }[] = [
    { value: 'ALL',     label: 'Toute la saison' },
    { value: 'LAST_5',  label: '5 derniers' },
    { value: 'LAST_10', label: '10 derniers' },
    { value: 'JAN',     label: 'Janvier' },
    { value: 'FEB',     label: 'Février' },
    { value: 'MAR',     label: 'Mars' },
    { value: 'CUSTOM',  label: 'Personnalisé' },
  ];

  const compOptions: { value: CompFilter; label: string }[] = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'CL',  label: 'Champions Lge' },
    { value: 'LL',  label: 'Liga' },
  ];

  // ── Render ──
  return (
    <div className="p-6">

      {/* ═══ GLOBAL FILTER BAR ═══════════════════════════════════════════════ */}
      <div className="ms-filter-bar">
        <div className="ms-filter-bar-inner">
          <div className="ms-filter-bar-left">
            <Filter className="w-4 h-4" style={{ color: 'rgb(163, 163, 163)' }} />
            <span className="ms-filter-bar-label">Filtres</span>
            {activeFilterCount > 0 && (
              <span className="ms-filter-active-badge">{activeFilterCount}</span>
            )}
          </div>

          <div className="ms-filter-groups">
            {/* Competition */}
            <div className="ms-filter-group">
              <span className="ms-filter-group-label">Compétition</span>
              <div className="ms-pill-group">
                {compOptions.map(({ value, label }) => (
                  <PillButton key={value} active={compFilter === value} onClick={() => setCompFilter(value)}>
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>

            <div className="ms-filter-divider" />

            {/* Date */}
            <div className="ms-filter-group">
              <span className="ms-filter-group-label">
                <Calendar className="w-3 h-3" style={{ color: 'rgb(163, 163, 163)', marginRight: 4 }} />
                Période
              </span>
              <div className="ms-pill-group">
                {dateOptions.map(({ value, label }) => (
                  <PillButton key={value} active={datePreset === value}
                    onClick={() => { setDatePreset(value); setShowCustom(value === 'CUSTOM'); }}>
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="ms-filter-clear-btn">
              <X className="w-3 h-3" />
              Effacer
            </button>
          )}
        </div>

        {showCustom && datePreset === 'CUSTOM' && (
          <div className="ms-filter-custom-dates">
            <div className="ms-filter-date-field">
              <label className="ms-filter-date-label">Du</label>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="ms-filter-date-input" />
            </div>
            <span style={{ color: 'rgb(82, 82, 82)', fontSize: 12 }}>→</span>
            <div className="ms-filter-date-field">
              <label className="ms-filter-date-label">Au</label>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="ms-filter-date-input" />
            </div>
          </div>
        )}
      </div>

      {/* ═══ KPI Strip ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-3 md:grid-cols-6 border border-neutral-200 rounded-lg mb-6 divide-x divide-neutral-200 bg-neutral-50">
        {summaryCards.map(({ label, value, icon, cls }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 py-4 px-2">
            <div className="p-2 bg-brand-50 rounded-lg">{icon}</div>
            <span className="text-xs text-subtext-color text-center leading-tight">{label}</span>
            <span className={`text-lg font-semibold ${cls}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* ═══ CHARTS SECTION ══════════════════════════════════════════════════ */}
      <div className="ms-section">
        <div className="ms-section-header">
          <h2 className="ms-section-title">Analyse des performances</h2>
          <span className="ms-section-badge">{filtered.length} matchs · saison 25/26</span>
        </div>

        {/* ── STATUS OVERVIEW ─────────────────────────────────────────────── */}
        <div className="ms-charts-row ms-charts-row-1-1-1 mb-4">
          <ChartCard title="Statut — Saison" subtitle="Répartition sur les matchs filtrés">
            <div className="ms-donut-wrapper" style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={72}
                    paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {donutData.map((entry, i) => (<PieCell key={i} fill={entry.color} />))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: number, n: string) => [`${v} matchs`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="ms-donut-center">
                <span className="ms-donut-center-value">{filtered.length}</span>
                <span className="ms-donut-center-label">matchs</span>
              </div>
            </div>
            <div className="ms-status-list">
              {donutData.map(d => (
                <div key={d.status} className="ms-status-item">
                  <div className="ms-status-item-left">
                    <span className="ms-status-item-dot" style={{ background: d.color }} />
                    <span className="ms-status-item-label">{d.name}</span>
                  </div>
                  <div>
                    <span className="ms-status-item-value">{d.value}</span>
                    <span className="ms-status-item-pct">({filtered.length > 0 ? Math.round((d.value / filtered.length) * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Statut par mois" subtitle="Évolution titulaire / remplaçant / absent"
            legend={[
              { color: STATUS_COLORS.titulaire, label: 'Titulaire' },
              { color: STATUS_COLORS.remplacant, label: 'Remplaçant' },
              { color: STATUS_COLORS.non_entré, label: 'Non entré' },
              { color: STATUS_COLORS.non_convoqué, label: 'Non convoqué' },
            ]}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusMonthlyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid {...GRID_STYLE} vertical={false} />
                <XAxis dataKey="month" tick={TICK_STYLE} axisLine={AXIS_LINE} tickLine={false} />
                <YAxis allowDecimals={false} tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="titulaire"    stackId="s" fill={STATUS_COLORS.titulaire}    radius={[0,0,0,0]} maxBarSize={36} fillOpacity={0.9} name="Titulaire" />
                <Bar dataKey="remplacant"   stackId="s" fill={STATUS_COLORS.remplacant}   radius={[0,0,0,0]} maxBarSize={36} fillOpacity={0.9} name="Remplaçant" />
                <Bar dataKey="non_entré"    stackId="s" fill={STATUS_COLORS.non_entré}    radius={[0,0,0,0]} maxBarSize={36} fillOpacity={0.9} name="Non entré" />
                <Bar dataKey="non_convoqué" stackId="s" fill={STATUS_COLORS.non_convoqué} radius={[4,4,0,0]} maxBarSize={36} fillOpacity={0.9} name="Non convoqué" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Convocation">
            <div className="ms-kpi-container">
              <div className="ms-kpi-big">
                {filtered.length > 0 ? Math.round((convoqué / filtered.length) * 100) : 0}
                <span className="ms-kpi-unit">%</span>
              </div>
              <div className="ms-kpi-label">taux de convocation</div>
              <div className="ms-kpi-divider" />
              <div className="ms-kpi-stat-row"><span className="ms-kpi-stat-label">Convoqué</span><span className="ms-kpi-stat-value">{convoqué} / {filtered.length}</span></div>
              <div className="ms-kpi-stat-row"><span className="ms-kpi-stat-label">Non convoqué</span><span className="ms-kpi-stat-value" style={{ color: COLOR_ERROR }}>{statusCounts.non_convoqué}</span></div>
              <div className="ms-kpi-divider" />
              <div className="ms-kpi-stat-row"><span className="ms-kpi-stat-label">Titulaire</span><span className="ms-kpi-stat-value" style={{ color: COLOR_BRAND }}>{statusCounts.titulaire}</span></div>
              <div className="ms-kpi-stat-row"><span className="ms-kpi-stat-label">Remplaçant</span><span className="ms-kpi-stat-value" style={{ color: COLOR_AMBER }}>{statusCounts.remplacant}</span></div>
              <div className="ms-kpi-stat-row"><span className="ms-kpi-stat-label">Non entré</span><span className="ms-kpi-stat-value" style={{ color: 'rgb(163,163,163)' }}>{statusCounts.non_entré}</span></div>
              <div className="ms-kpi-divider" />
              <div className="ms-kpi-stat-row"><span className="ms-kpi-stat-label">% Titulaire</span><span className="ms-kpi-stat-value" style={{ color: COLOR_BRAND }}>{titulairePct}%</span></div>
              <div style={{ width: '100%', height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', marginTop: '0.5rem', background: 'rgb(37,37,37)' }}>
                {filtered.length > 0 && <>
                  <div style={{ width: `${(statusCounts.titulaire / filtered.length) * 100}%`,    background: STATUS_COLORS.titulaire,    transition: 'width 0.4s' }} />
                  <div style={{ width: `${(statusCounts.remplacant / filtered.length) * 100}%`,   background: STATUS_COLORS.remplacant,   transition: 'width 0.4s' }} />
                  <div style={{ width: `${(statusCounts.non_entré / filtered.length) * 100}%`,    background: STATUS_COLORS.non_entré,    transition: 'width 0.4s' }} />
                  <div style={{ width: `${(statusCounts.non_convoqué / filtered.length) * 100}%`, background: STATUS_COLORS.non_convoqué, transition: 'width 0.4s' }} />
                </>}
              </div>
            </div>
          </ChartCard>
        </div>

        {/* ── Performance Timeline ────────────────────────────────────────── */}
        <ChartCard title="Évolution buts & passes décisives" subtitle="Par match joué — ordre chronologique"
          legend={[{ color: COLOR_BRAND, label: 'Buts' }, { color: COLOR_SUCCESS, label: 'Passes D.' }]}
          className="mb-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timelineData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis dataKey="match" tick={TICK_STYLE} axisLine={AXIS_LINE} tickLine={false} />
              <YAxis allowDecimals={false} tick={TICK_STYLE} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="Buts" stroke={COLOR_BRAND} strokeWidth={2}
                dot={{ fill: COLOR_BRAND, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: COLOR_BRAND }} />
              <Line type="monotone" dataKey="Passes D." stroke={COLOR_SUCCESS} strokeWidth={2} strokeDasharray="4 3"
                dot={{ fill: COLOR_SUCCESS, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: COLOR_SUCCESS }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Minutes + G/90 ──────────────────────────────────────────────── */}
        <div className="ms-charts-row ms-charts-row-2-1 mb-4">
          <ChartCard title="Minutes jouées par match" subtitle="Couleurs = statut · Points = résultat · Icônes = cartons">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={minutesData} margin={{ top: 18, right: 8, left: -24, bottom: 22 }}>
                <CartesianGrid {...GRID_STYLE} vertical={false} />
                <XAxis dataKey="match" tick={TICK_STYLE} axisLine={AXIS_LINE} tickLine={false} />
                <YAxis domain={[0, 95]} tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE}
                  formatter={(_: number, __: string, props: any) => {
                    const e = props.payload;
                    if (e.status === 'non_convoqué') return ['Non convoqué', 'Statut'];
                    if (e.status === 'non_entré')    return ['Non entré (banc)', 'Statut'];
                    return [`${e.minutes}'`, 'Minutes'];
                  }} />
                <Bar dataKey="displayMinutes" radius={[4,4,0,0]} maxBarSize={32}
                  label={<MinuteBarLabel data={minutesData} />}
                  shape={(props: any) => {
                    const entry = minutesData[props.index];
                    if (!entry) return <rect {...props} />;
                    if (entry.status === 'non_convoqué' || entry.status === 'non_entré') return <GhostBar {...props} />;
                    return <rect x={props.x} y={props.y} width={props.width} height={props.height}
                      rx={4} fill={STATUS_COLORS[entry.status]} fillOpacity={0.85} />;
                  }} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 30px', marginTop: -8 }}>
              {minutesData.map((entry, i) => {
                const s = resultDotStyles[entry.result];
                return (
                  <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 7, fontWeight: 800, color: s.color, fontFamily: 'Rubik, sans-serif', flexShrink: 0 }}>
                    {resultLabel[entry.result]}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 8 }}>
              <ChartLegend items={[
                { color: STATUS_COLORS.titulaire, label: 'Titulaire' },
                { color: STATUS_COLORS.remplacant, label: 'Remplaçant' },
                { color: 'rgb(60,30,32)', label: 'NC / Non entré' },
                { color: '#fbbf24', label: '🟨 Jaune' },
                { color: COLOR_ERROR, label: '🟥 Rouge' },
              ]} />
              <ChartLegend items={[
                { color: resultDotStyles.W.bg, label: '● Victoire' },
                { color: resultDotStyles.L.bg, label: '● Défaite' },
                { color: resultDotStyles.D.bg, label: '● Nul' },
              ]} />
            </div>
          </ChartCard>

          <ChartCard title="Buts par 90 min">
            <div className="ms-kpi-container">
              <div className="ms-kpi-big">{g90}<span className="ms-kpi-unit">/ 90</span></div>
              <div className="ms-kpi-label">moyenne sur la période</div>
              {playedChrono.length >= 3 && <div className="ms-kpi-trend ms-kpi-trend-up">↑ derniers 3 matchs</div>}
              <div className="ms-sparkline-label">Tendance g/90 par match</div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={sparkData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <Line type="monotone" dataKey="v" stroke={COLOR_BRAND} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: COLOR_BRAND }} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [v.toFixed(2), 'G/90']} labelFormatter={() => ''} />
                </LineChart>
              </ResponsiveContainer>
              <div className="ms-kpi-divider" />
              <div className="ms-kpi-stat-row"><span className="ms-kpi-stat-label">Passes D./90</span><span className="ms-kpi-stat-value" style={{ color: COLOR_SUCCESS }}>{a90}</span></div>
              <div className="ms-kpi-stat-row"><span className="ms-kpi-stat-label">Min. totales</span><span className="ms-kpi-stat-value">{totalMin}'</span></div>
              <div className="ms-kpi-stat-row"><span className="ms-kpi-stat-label">Matchs joués</span><span className="ms-kpi-stat-value">{playedFiltered.length}</span></div>
            </div>
          </ChartCard>
        </div>

        {/* ── Radar + Competition ─────────────────────────────────────────── */}
        <div className="ms-charts-row ms-charts-row-1-1 mb-4">
          <ChartCard title="Profil du joueur" subtitle="Normalisé sur 100 — période sélectionnée">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                <PolarGrid stroke="rgb(48,48,48)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgb(163,163,163)', fontSize: 11, fontFamily: 'Rubik, sans-serif' }} />
                <Radar name="Joueur" dataKey="value" stroke={COLOR_BRAND} fill={COLOR_BRAND} fillOpacity={0.18} strokeWidth={2} dot={{ fill: COLOR_BRAND, r: 3, strokeWidth: 0 }} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v} / 100`, '']} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Stats par compétition" subtitle="CL vs Liga — période sélectionnée"
            legend={[{ color: COLOR_BRAND, label: 'Champions League' }, { color: COLOR_CYAN, label: 'La Liga' }]}>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={competitionData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid {...GRID_STYLE} vertical={false} />
                <XAxis dataKey="stat" tick={TICK_STYLE} axisLine={AXIS_LINE} tickLine={false} />
                <YAxis allowDecimals={false} tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="CL" fill={COLOR_BRAND} radius={[3,3,0,0]} maxBarSize={28} fillOpacity={0.9} />
                <Bar dataKey="LL" fill={COLOR_CYAN}  radius={[3,3,0,0]} maxBarSize={28} fillOpacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Monthly Aggregation ─────────────────────────────────────────── */}
        <ChartCard title="Progression mensuelle" subtitle="Buts et passes décisives par mois"
          legend={[{ color: COLOR_BRAND, label: 'Buts' }, { color: COLOR_SUCCESS, label: 'Passes D.' }]}
          className="mb-6">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis dataKey="month" tick={TICK_STYLE} axisLine={AXIS_LINE} tickLine={false} />
              <YAxis allowDecimals={false} tick={TICK_STYLE} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="Buts"      stackId="a" fill={COLOR_BRAND}   radius={[0,0,0,0]} maxBarSize={40} fillOpacity={0.9} />
              <Bar dataKey="Passes D." stackId="a" fill={COLOR_SUCCESS} radius={[4,4,0,0]} maxBarSize={40} fillOpacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ═══ MATCH TABLE ═════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-default-font">Derniers matchs</h2>
          <span className="text-xs text-subtext-color bg-neutral-100 px-2 py-0.5 rounded-full">
            {filtered.length} matchs
          </span>
        </div>
      </div>

   

      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-subtext-color w-24">Date</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color w-12">Comp.</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-subtext-color">Match</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color w-14">Résultat</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-subtext-color w-16">
                <UserCheck className="w-3.5 h-3.5 text-subtext-color mx-auto" />
              </th>
              <th className="text-center px-3 py-3 w-10" title="Minutes jouées">
                <Clock className="w-3.5 h-3.5 text-subtext-color mx-auto" />
              </th>
              <th className="text-center px-3 py-3 w-10" title="Buts"><span className="text-xs font-medium text-subtext-color">⚽</span></th>
              <th className="text-center px-3 py-3 w-10" title="Passes décisives"><span className="text-xs font-medium text-subtext-color">A</span></th>
              <th className="text-center px-3 py-3 w-10" title="Cartons jaunes"><CardIcon color="#fbbf24" /></th>
              <th className="text-center px-3 py-3 w-10" title="Cartons rouges"><CardIcon color="#dc2626" /></th>
            </tr>
          </thead>
          <tbody className="bg-neutral-50 divide-y divide-neutral-200">
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-10 text-center text-subtext-color text-sm">Aucun match pour les filtres sélectionnés.</td></tr>
            )}
            {filtered.map((m, i) => (
              <tr key={i} className="hover:bg-neutral-100 transition-colors"
                style={m.status === 'non_convoqué' ? { opacity: 0.5 } : m.status === 'non_entré' ? { opacity: 0.65 } : {}}>
                <td className="px-4 py-3 text-subtext-color text-xs tabular-nums">{m.date}</td>
                <td className="px-3 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${compBadge[m.comp]}`}>{m.comp}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-4 max-w-[220px]">
                      <span className={`text-sm ${m.playerHome ? 'font-semibold text-default-font' : 'text-subtext-color'}`}>{m.home}</span>
                      <span className={`tabular-nums text-sm font-semibold ${m.playerHome ? 'text-default-font' : 'text-subtext-color'}`}>{m.hs}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 max-w-[220px]">
                      <span className={`text-sm ${!m.playerHome ? 'font-semibold text-default-font' : 'text-subtext-color'}`}>{m.away}</span>
                      <span className={`tabular-nums text-sm font-semibold ${!m.playerHome ? 'text-default-font' : 'text-subtext-color'}`}>{m.as}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${resultBadge[m.result]}`}>{resultLabel[m.result]}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={statusTagClass[m.status]}>{statusTagLabel[m.status]}</span>
                </td>
                <td className="px-3 py-3 text-center text-subtext-color text-xs tabular-nums">{m.min ?? '—'}</td>
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm font-semibold ${m.g > 0 ? 'text-brand-600' : 'text-subtext-color'}`}>{m.g}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm font-semibold ${m.a > 0 ? 'text-brand-600' : 'text-subtext-color'}`}>{m.a}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm ${m.yc > 0 ? 'font-semibold' : 'text-subtext-color'}`} style={m.yc > 0 ? { color: '#fbbf24' } : {}}>{m.yc}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm ${m.rc > 0 ? 'text-error-600 font-semibold' : 'text-subtext-color'}`}>{m.rc}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}