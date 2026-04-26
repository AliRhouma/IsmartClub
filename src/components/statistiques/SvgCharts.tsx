import { C } from './data';

export function LineChart({ width = 200, height = 100 }: { width?: number; height?: number }) {
  const pts1 = [
    [0, 70], [30, 55], [60, 60], [90, 35], [120, 40], [150, 20], [180, 30], [200, 15],
  ];
  const pts2 = [
    [0, 85], [30, 78], [60, 50], [90, 65], [120, 55], [150, 45], [180, 50], [200, 40],
  ];
  const toPath = (pts: number[][]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lgBrand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.brand} stopOpacity=".25" />
          <stop offset="100%" stopColor={C.brand} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${toPath(pts1)} L200,${height} L0,${height} Z`} fill="url(#lgBrand)" />
      <polyline points={pts1.map(p => p.join(',')).join(' ')} fill="none" stroke={C.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts2.map(p => p.join(',')).join(' ')} fill="none" stroke={C.ok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
      {pts1.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={C.brand} />)}
    </svg>
  );
}

export function BarChart({ width = 200, height = 100 }: { width?: number; height?: number }) {
  const bars = [65, 45, 80, 35, 70, 55, 90, 40, 60, 50];
  const bw = (width - 10 * (bars.length - 1)) / bars.length;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {bars.map((h, i) => {
        const bh = (h / 100) * (height - 8);
        return (
          <rect key={i} x={i * (bw + 10)} y={height - bh} width={bw} height={bh} rx={3}
            fill={i === 6 ? C.brand : C.card2} stroke={i === 6 ? C.brand : C.border2} strokeWidth=".5" />
        );
      })}
    </svg>
  );
}

export function RadarChart({ width = 160, height = 160 }: { width?: number; height?: number }) {
  const cx = width / 2, cy = height / 2, r = Math.min(cx, cy) - 10;
  const n = 6;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const gridPt = (i: number, scale: number) =>
    `${cx + r * scale * Math.cos(angle(i))},${cy + r * scale * Math.sin(angle(i))}`;

  const data1 = [0.9, 0.7, 0.6, 0.8, 0.5, 0.85];
  const data2 = [0.6, 0.85, 0.75, 0.5, 0.7, 0.65];
  const poly = (d: number[]) => d.map((v, i) =>
    `${cx + r * v * Math.cos(angle(i))},${cy + r * v * Math.sin(angle(i))}`
  ).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} points={Array.from({ length: n }, (_, i) => gridPt(i, s)).join(' ')}
          fill="none" stroke={C.border2} strokeWidth=".5" />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle(i))} y2={cy + r * Math.sin(angle(i))}
          stroke={C.border2} strokeWidth=".5" />
      ))}
      <polygon points={poly(data1)} fill="rgba(0,145,255,.15)" stroke={C.brand} strokeWidth="1.5" />
      <polygon points={poly(data2)} fill="rgba(70,167,88,.1)" stroke={C.ok} strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  );
}

export function HeatmapChart({ width = 200, height = 100 }: { width?: number; height?: number }) {
  const rows = 5, cols = 10;
  const cw = (width - (cols - 1) * 2) / cols;
  const ch = (height - (rows - 1) * 2) / rows;
  const vals = [
    [1, 1, 0, 1, 1, 1, 0.5, 1, 1, 1],
    [0.5, 1, 1, 0, 1, 1, 1, 1, 0.5, 1],
    [1, 0, 1, 1, 1, 0.5, 1, 0, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 0.5],
    [0.5, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  ];
  const color = (v: number) =>
    v === 1 ? C.ok : v === 0.5 ? 'rgb(60,60,30)' : C.err50;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {vals.map((row, ri) =>
        row.map((v, ci) => (
          <rect key={`${ri}-${ci}`} x={ci * (cw + 2)} y={ri * (ch + 2)} width={cw} height={ch}
            rx={2} fill={color(v)} opacity={.7} />
        ))
      )}
    </svg>
  );
}

export function DonutChart({ width = 100, height = 100 }: { width?: number; height?: number }) {
  const cx = width / 2, cy = height / 2, r = 36, sw = 10;
  const pct = 0.7;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.card2} strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.brand} strokeWidth={sw}
        strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={C.text} fontSize="14" fontWeight="700" fontFamily="Rubik, sans-serif">
        70%
      </text>
    </svg>
  );
}

export function ScatterChart({ width = 200, height = 100 }: { width?: number; height?: number }) {
  const points = [
    { x: 20, y: 30, c: C.brand }, { x: 55, y: 60, c: C.brand }, { x: 80, y: 25, c: C.ok },
    { x: 110, y: 50, c: C.ok }, { x: 140, y: 35, c: C.err }, { x: 165, y: 70, c: C.warn },
    { x: 45, y: 80, c: C.orange }, { x: 185, y: 45, c: C.purple },
  ];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <line x1="0" y1={height} x2={width} y2={height} stroke={C.border2} strokeWidth=".5" />
      <line x1="0" y1="0" x2="0" y2={height} stroke={C.border2} strokeWidth=".5" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill={p.c} opacity=".7" />
      ))}
    </svg>
  );
}

export function StackedBarChart({ width = 200, height = 100 }: { width?: number; height?: number }) {
  const data = [
    [30, 20, 15], [40, 15, 25], [25, 30, 10], [50, 10, 20],
    [35, 25, 15], [20, 35, 20], [45, 20, 10], [30, 15, 30],
  ];
  const colors = [C.brand, C.ok, C.orange];
  const bw = (width - 8 * (data.length - 1)) / data.length;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {data.map((segs, bi) => {
        let y = height;
        return segs.map((s, si) => {
          const h = (s / 80) * height;
          y -= h;
          return (
            <rect key={`${bi}-${si}`} x={bi * (bw + 8)} y={y} width={bw} height={h}
              rx={si === segs.length - 1 ? 3 : 0} fill={colors[si]} opacity=".8" />
          );
        });
      })}
    </svg>
  );
}

export function ButterflyChart({ width = 200, height = 120 }: { width?: number; height?: number }) {
  const labels = ['Buts', 'PD', 'Tirs', 'Note', 'km'];
  const left = [70, 55, 80, 65, 50];
  const right = [50, 70, 60, 55, 75];
  const rowH = height / labels.length;
  const midX = width / 2;
  const maxW = midX - 30;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <line x1={midX} y1="0" x2={midX} y2={height} stroke={C.border2} strokeWidth="1" />
      {labels.map((_, i) => {
        const y = i * rowH + rowH * 0.3;
        const bh = rowH * 0.4;
        const lw = (left[i] / 100) * maxW;
        const rw = (right[i] / 100) * maxW;
        return (
          <g key={i}>
            <rect x={midX - lw} y={y} width={lw} height={bh} rx={2} fill={C.brand} opacity=".8" />
            <rect x={midX} y={y} width={rw} height={bh} rx={2} fill={C.ok} opacity=".8" />
          </g>
        );
      })}
    </svg>
  );
}

export function MiniSparkline({ width = 80, height = 28, color = C.warn }: { width?: number; height?: number; color?: string }) {
  const pts = [[0, 22], [12, 18], [24, 20], [36, 14], [48, 16], [60, 8], [72, 10], [80, 4]];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
