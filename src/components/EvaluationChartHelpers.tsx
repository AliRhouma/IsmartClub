import React from 'react';

export const COLOR_BRAND   = 'rgb(0, 145, 255)';
export const COLOR_SUCCESS = 'rgb(70, 167, 88)';
export const COLOR_ERROR   = 'rgb(229, 72, 77)';
export const COLOR_CYAN    = 'rgb(104, 221, 253)';
export const COLOR_AMBER   = 'rgb(245, 166, 35)';
export const COLOR_NEUTRAL = 'rgb(82, 82, 82)';

export const TICK_STYLE  = { fill: 'rgb(163, 163, 163)', fontSize: 11, fontFamily: 'Rubik, sans-serif' };
export const AXIS_LINE   = { stroke: 'rgb(48, 48, 48)' };
export const GRID_STYLE  = { strokeDasharray: '3 3', stroke: 'rgb(37, 37, 37)' };
export const TOOLTIP_STYLE = {
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

export const ChartLegend = ({ items }: { items: { color: string; label: string }[] }) => (
  <div className="ev-chart-legend">
    {items.map(({ color, label }) => (
      <div key={label} className="ev-chart-legend-item">
        <span className="ev-chart-legend-dot" style={{ background: color }} />
        <span className="ev-chart-legend-label">{label}</span>
      </div>
    ))}
  </div>
);

export const ChartCard = ({
  title, subtitle, legend, children, className = '',
}: {
  title: string;
  subtitle?: string;
  legend?: { color: string; label: string }[];
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`ev-chart-card ${className}`}>
    <div className="ev-chart-card-header">
      <div>
        <div className="ev-chart-card-title">{title}</div>
        {subtitle && <span className="ev-chart-card-subtitle">{subtitle}</span>}
      </div>
    </div>
    {legend && <ChartLegend items={legend} />}
    {children}
  </div>
);

export function scoreColor(score: number): string {
  if (score >= 75) return COLOR_SUCCESS;
  if (score >= 60) return COLOR_AMBER;
  return COLOR_ERROR;
}

export function scoreBadge(score: number): string {
  if (score >= 75) return 'bg-success-50 text-success-600 border border-success-200';
  if (score >= 60) return 'bg-warning-50 text-warning-600 border border-warning-200';
  return 'bg-error-50 text-error-600 border border-error-200';
}

export function heatmapColor(value: number): string {
  if (value >= 75) return 'rgba(70, 167, 88, 0.85)';
  if (value >= 68) return 'rgba(70, 167, 88, 0.5)';
  if (value >= 60) return 'rgba(245, 166, 35, 0.55)';
  if (value >= 52) return 'rgba(245, 166, 35, 0.35)';
  return 'rgba(229, 72, 77, 0.5)';
}

export function heatmapTextColor(value: number): string {
  if (value >= 60) return 'rgb(250, 250, 250)';
  return 'rgb(250, 250, 250)';
}

export const sessionTypeBadge: Record<string, string> = {
  'Entraînement':          'bg-brand-50 text-brand-600',
  'Tactique':              'bg-warning-50 text-warning-600',
  'Préparation physique':  'bg-success-50 text-success-600',
};
