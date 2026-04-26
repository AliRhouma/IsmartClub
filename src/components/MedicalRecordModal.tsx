import { useEffect, useState } from 'react';
import {
  X, Stethoscope, Droplets, AlertCircle, AlertTriangle,
  Calendar, User, Activity, Heart, CheckCircle2,
  Shield, Syringe, TrendingUp, Zap, XCircle, Plus,
  ClipboardCheck, ChevronRight,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════ */
const C = {
  bg:         'rgb(12,12,12)',
  card:       'rgb(24,24,24)',
  card2:      'rgb(36,36,36)',
  card3:      'rgb(28,28,28)',
  border:     'rgb(37,37,37)',
  border2:    'rgb(48,48,48)',
  muted:      'rgb(82,82,82)',
  sub:        'rgb(163,163,163)',
  text:       'rgb(250,250,250)',
  brand:      'rgb(0,145,255)',
  brandDim:   'rgb(16,36,62)',
  errBg:      'rgb(60,24,26)',
  errBorder:  'rgb(84,27,31)',
  err:        'rgb(229,72,77)',
  errBright:  'rgb(255,99,105)',
  warnBg:     'rgb(8,38,54)',
  warnBorder: 'rgb(8,53,76)',
  warn:       'rgb(104,221,253)',
  okBg:       'rgb(19,40,25)',
  okBorder:   'rgb(25,57,33)',
  ok:         'rgb(70,167,88)',
  okBright:   'rgb(99,193,116)',
};

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */
export interface Injury {
  id: string;
  type: string;
  date: string;
  expectedRecoveryDate?: string;
  status: 'active' | 'recovered' | 'rehabilitating';
  notes?: string;
}

export interface PhysicalMetrics {
  heightCm: number;
  weightKg: number;
  heartRateBpm: number;
  bloodPressure: string;
  bodyFatPercentage: number;
  vo2Max?: number;
}

export interface MedicalRecord {
  playerId: string;
  playerName: string;
  dateOfBirth: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  metrics: PhysicalMetrics;
  currentStatus: {
    isClearedToPlay: boolean;
    condition: 'excellent' | 'good' | 'injured' | 'recovering';
  };
  allergies: string[];
  chronicConditions: string[];
  injuryHistory: Injury[];
  vaccinations: string[];
  lastCheckupDate: string;
  nextCheckupDate: string;
  assignedDoctor: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════════════ */
export const MEDICAL_RECORD: MedicalRecord = {
  playerId: 'PLR-8472',
  playerName: 'Abdelmalek Smaili',
  dateOfBirth: '05/07/2010',
  bloodType: 'O+',
  metrics: {
    heightCm: 162,
    weightKg: 48,
    heartRateBpm: 60,
    bloodPressure: '110/70',
    bodyFatPercentage: 9.8,
    vo2Max: 52.4,
  },
  currentStatus: {
    isClearedToPlay: false,
    condition: 'injured',
  },
  allergies: ['Pénicilline', 'Poussière'],
  chronicConditions: ['Asthme léger (sous contrôle)'],
  injuryHistory: [
    {
      id: 'INJ-001',
      type: 'Entorse cheville gauche — degré 2',
      date: '23/02/2026',
      expectedRecoveryDate: '15/04/2026',
      status: 'active',
      notes: 'Immobilisation 3 semaines puis rééducation progressive. Pas de mise en charge avant validation kiné.',
    },
    {
      id: 'INJ-002',
      type: 'Contusion genou droit',
      date: '10/11/2025',
      expectedRecoveryDate: '01/12/2025',
      status: 'recovered',
      notes: 'Récupération complète après 3 semaines de repos et cryothérapie quotidienne.',
    },
    {
      id: 'INJ-003',
      type: 'Déchirure musculaire ischio-jambiers',
      date: '05/07/2025',
      expectedRecoveryDate: '20/08/2025',
      status: 'recovered',
      notes: 'Protocole de rééducation respecté. Retour progressif aux entraînements le 22/08.',
    },
  ],
  vaccinations: [
    'Covid-19 (rappel 2024)',
    'Grippe saisonnière 2025',
    'Hépatite B (série complète)',
    'Tétanos (rappel 2022)',
  ],
  lastCheckupDate: '15/01/2026',
  nextCheckupDate: '15/07/2026',
  assignedDoctor: 'Dr. Tariq Mahmoud — Médecin du sport & rééducation',
};

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════════════════ */
type BadgeColor = 'brand' | 'ok' | 'warn' | 'err' | 'muted';

function Badge({ children, color = 'brand' }: { children: React.ReactNode; color?: BadgeColor }) {
  const map: Record<BadgeColor, { bg: string; color: string; border: string }> = {
    brand: { bg: C.brandDim, color: C.brand,  border: 'rgba(0,145,255,.2)' },
    ok:    { bg: C.okBg,     color: C.ok,     border: C.okBorder            },
    warn:  { bg: C.warnBg,   color: C.warn,   border: C.warnBorder          },
    err:   { bg: C.errBg,    color: C.err,    border: C.errBorder           },
    muted: { bg: C.card2,    color: C.sub,    border: C.border2             },
  };
  const t = map[color];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, fontWeight: 600, letterSpacing: '.02em',
      padding: '3px 10px', borderRadius: 100,
      background: t.bg, color: t.color, border: `1px solid ${t.border}`,
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {children}
    </span>
  );
}

function MetricCard({ icon, label, value, unit, accent }: {
  icon: React.ReactNode; label: string; value: string | number; unit?: string; accent?: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', background: C.card2,
      borderRadius: 10, border: `1px solid ${C.border}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: accent ? `${accent}18` : C.brandDim,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent || C.brand,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1 }}>
          {value}
          {unit && <span style={{ fontSize: 11, color: C.sub, fontWeight: 400, marginLeft: 3 }}>{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: C.muted,
      textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, right }: {
  icon: React.ReactNode; title: string; right?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: C.brand, display: 'flex' }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: '.01em' }}>{title}</span>
      </div>
      {right}
    </div>
  );
}

/* ── Input field shared style ──────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: C.card2, border: `1px solid ${C.border2}`,
  color: C.text, fontSize: 13, outline: 'none',
  boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, color: C.sub,
  textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6,
};

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-MODAL: CLOSE INJURY
═══════════════════════════════════════════════════════════════════════════ */
function CloseInjuryModal({
  injury, onCancel, onSave,
}: {
  injury: Injury;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [date, setDate]       = useState('');
  const [notes, setNotes]     = useState('');

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: C.card, borderRadius: 14,
          border: `1px solid ${C.okBorder}`,
          boxShadow: '0 24px 60px rgba(0,0,0,.7)',
          fontFamily: "'Rubik', sans-serif",
          overflow: 'hidden',
        }}
      >
        {/* header */}
        <div style={{
          padding: '16px 20px',
          background: `linear-gradient(90deg, ${C.okBg} 0%, ${C.card} 100%)`,
          borderBottom: `1px solid ${C.okBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: C.okBg, border: `1px solid ${C.okBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.ok,
            }}>
              <ClipboardCheck size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Clôturer la blessure</div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>Marquer comme guéri</div>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              width: 30, height: 30, borderRadius: 7,
              background: C.card2, border: `1px solid ${C.border2}`,
              color: C.sub, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={13} />
          </button>
        </div>

        {/* injury summary */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{
            display: 'flex', gap: 10, padding: '10px 14px',
            background: C.errBg, border: `1px solid ${C.errBorder}`, borderRadius: 9,
          }}>
            <AlertTriangle size={14} style={{ color: C.err, flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.errBright, marginBottom: 2 }}>{injury.type}</div>
              <div style={{ fontSize: 11, color: C.err }}>Diagnostiquée le {injury.date}</div>
            </div>
          </div>
        </div>

        {/* form */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Date de guérison *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
              placeholder="jj/mm/aaaa"
            />
          </div>
          <div>
            <label style={labelStyle}>Remarques médicales</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Observations du médecin, résultat du suivi, conditions de reprise..."
              style={{
                ...inputStyle,
                resize: 'vertical',
                lineHeight: 1.5,
                minHeight: 80,
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 9,
                background: C.card2, border: `1px solid ${C.border2}`,
                color: C.sub, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              onClick={onSave}
              style={{
                flex: 2, padding: '10px 0', borderRadius: 9,
                background: C.ok, border: 'none',
                color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <CheckCircle2 size={14} />Confirmer la guérison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-MODAL: ADD NEW INJURY
═══════════════════════════════════════════════════════════════════════════ */
function AddInjuryModal({
  onCancel, onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) {
  const [name, setName]       = useState('');
  const [date, setDate]       = useState('');
  const [recovery, setRecovery] = useState('');
  const [notes, setNotes]     = useState('');

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: C.card, borderRadius: 14,
          border: `1px solid ${C.errBorder}`,
          boxShadow: '0 24px 60px rgba(0,0,0,.7)',
          fontFamily: "'Rubik', sans-serif",
          overflow: 'hidden',
        }}
      >
        {/* header */}
        <div style={{
          padding: '16px 20px',
          background: `linear-gradient(90deg, ${C.errBg} 0%, ${C.card} 100%)`,
          borderBottom: `1px solid ${C.errBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: C.errBg, border: `1px solid ${C.errBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.err,
            }}>
              <Plus size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Nouvelle blessure</div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>Enregistrer un incident médical</div>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              width: 30, height: 30, borderRadius: 7,
              background: C.card2, border: `1px solid ${C.border2}`,
              color: C.sub, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={13} />
          </button>
        </div>

        {/* form */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Type / Nom de la blessure *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Entorse cheville gauche — degré 2"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Date de l'incident *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Retour prévu</label>
              <input
                type="date"
                value={recovery}
                onChange={e => setRecovery(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Remarques médicales</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Diagnostic, protocole de traitement, restrictions..."
              style={{
                ...inputStyle,
                resize: 'vertical',
                lineHeight: 1.5,
                minHeight: 80,
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 9,
                background: C.card2, border: `1px solid ${C.border2}`,
                color: C.sub, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              onClick={onSave}
              style={{
                flex: 2, padding: '10px 0', borderRadius: 9,
                background: C.err, border: 'none',
                color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Plus size={14} />Enregistrer la blessure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INJURY CARD (clickable)
═══════════════════════════════════════════════════════════════════════════ */
const injuryStatusCfg: Record<Injury['status'], { label: string; color: BadgeColor; dot: string }> = {
  active:         { label: 'En cours',    color: 'err',  dot: C.err  },
  recovered:      { label: 'Guéri',       color: 'ok',   dot: C.ok   },
  rehabilitating: { label: 'Rééducation', color: 'warn', dot: C.warn },
};

function InjuryCard({ inj, onClick }: { inj: Injury; onClick?: () => void }) {
  const cfg = injuryStatusCfg[inj.status];
  const isActive = inj.status === 'active';

  return (
    <div
      onClick={isActive ? onClick : undefined}
      style={{
        padding: '12px 14px', background: C.card2,
        borderRadius: 10,
        border: `1px solid ${isActive ? C.errBorder : C.border}`,
        cursor: isActive ? 'pointer' : 'default',
        transition: 'all .15s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (isActive) {
          (e.currentTarget as HTMLDivElement).style.background = 'rgb(48,22,24)';
          (e.currentTarget as HTMLDivElement).style.borderColor = C.err;
        }
      }}
      onMouseLeave={e => {
        if (isActive) {
          (e.currentTarget as HTMLDivElement).style.background = C.card2;
          (e.currentTarget as HTMLDivElement).style.borderColor = C.errBorder;
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: 100, flexShrink: 0, marginTop: 5,
            background: cfg.dot,
            boxShadow: isActive ? `0 0 6px ${C.err}90` : 'none',
          }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>
            {inj.type}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <Badge color={cfg.color}>{cfg.label}</Badge>
          {isActive && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 11, color: C.sub,
            }}>
              <ChevronRight size={13} style={{ color: C.err }} />
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingLeft: 16, marginBottom: inj.notes ? 8 : 0 }}>
        <span style={{ fontSize: 11, color: C.sub }}>
          <span style={{ color: C.muted }}>Date : </span>{inj.date}
        </span>
        {inj.expectedRecoveryDate && (
          <span style={{ fontSize: 11, color: C.sub }}>
            <span style={{ color: C.muted }}>Retour : </span>
            <span style={{ color: isActive ? C.warn : C.sub }}>{inj.expectedRecoveryDate}</span>
          </span>
        )}
      </div>
      {inj.notes && (
        <div style={{
          fontSize: 11, color: C.sub, lineHeight: 1.5,
          padding: '7px 10px', background: 'rgba(0,0,0,.25)',
          borderRadius: 7, marginLeft: 16,
          borderLeft: `2px solid ${isActive ? C.err : C.border2}`,
        }}>
          {inj.notes}
        </div>
      )}
      {isActive && (
        <div style={{
          position: 'absolute', bottom: 10, right: 12,
          fontSize: 10, color: C.err, fontWeight: 600, letterSpacing: '.03em',
        }}>
          Cliquer pour clôturer
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CLEARED STATE (no active injury)
═══════════════════════════════════════════════════════════════════════════ */
function ClearedState({ onAddNew }: { onAddNew: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 16px', gap: 12,
      background: C.okBg, border: `1px solid ${C.okBorder}`,
      borderRadius: 12,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${C.ok}20`, border: `1px solid ${C.okBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.ok,
      }}>
        <CheckCircle2 size={22} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.okBright, marginBottom: 4 }}>
          Aucune blessure active
        </div>
        <div style={{ fontSize: 12, color: C.ok }}>
          Le joueur est apte à l'entraînement et aux compétitions
        </div>
      </div>
      <button
        onClick={onAddNew}
        style={{
          marginTop: 4,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 18px', borderRadius: 8,
          background: C.card2, border: `1px solid ${C.border2}`,
          color: C.sub, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          transition: 'all .15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = C.errBg;
          e.currentTarget.style.color = C.err;
          e.currentTarget.style.borderColor = C.errBorder;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = C.card2;
          e.currentTarget.style.color = C.sub;
          e.currentTarget.style.borderColor = C.border2;
        }}
      >
        <Plus size={13} />Déclarer une nouvelle blessure
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN MODAL
═══════════════════════════════════════════════════════════════════════════ */
interface Props {
  record: MedicalRecord;
  onClose: () => void;
}

type SubModal = 'closeInjury' | 'addInjury' | null;

export function MedicalRecordModal({ record, onClose }: Props) {
  const { metrics } = record;

  const [injuries, setInjuries] = useState<Injury[]>(record.injuryHistory);
  const [subModal, setSubModal] = useState<SubModal>(null);
  const [selectedInjury, setSelectedInjury] = useState<Injury | null>(null);

  const activeInjury = injuries.find(i => i.status === 'active');
  const hasActive    = !!activeInjury;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (subModal) setSubModal(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handler);
    };
  }, [onClose, subModal]);

  function handleCloseInjury() {
    setInjuries(prev =>
      prev.map(inj =>
        inj.status === 'active'
          ? { ...inj, status: 'recovered' as const }
          : inj
      )
    );
    setSubModal(null);
    setSelectedInjury(null);
  }

  function handleAddInjury() {
    const newInj: Injury = {
      id: `INJ-00${injuries.length + 1}`,
      type: 'Nouvelle blessure (saisie manuelle)',
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'active',
      notes: 'Blessure enregistrée manuellement.',
    };
    setInjuries(prev => [newInj, ...prev]);
    setSubModal(null);
  }

  const conditionBadge: Record<MedicalRecord['currentStatus']['condition'], { label: string; color: BadgeColor }> = {
    excellent:  { label: 'Excellent',       color: 'ok'   },
    good:       { label: 'Bon',             color: 'brand'},
    injured:    { label: 'Blessé',          color: 'err'  },
    recovering: { label: 'En rééducation',  color: 'warn' },
  };
  const derivedCondition = hasActive ? 'injured' : 'excellent';
  const cond = conditionBadge[derivedCondition];

  return (
    <>
      <div
        onClick={() => { if (!subModal) onClose(); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 860, maxHeight: '90vh',
            background: C.card, borderRadius: 16,
            border: `1px solid ${hasActive ? C.errBorder : C.border}`,
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 32px 80px rgba(0,0,0,.6)',
            overflow: 'hidden',
            fontFamily: "'Rubik', sans-serif",
            transition: 'border-color .3s',
          }}
        >
          {/* ── HEADER ── */}
          <div style={{
            padding: '18px 24px',
            background: hasActive
              ? `linear-gradient(90deg, ${C.errBg} 0%, ${C.card} 100%)`
              : `linear-gradient(90deg, ${C.okBg} 0%, ${C.card} 100%)`,
            borderBottom: `1px solid ${hasActive ? C.errBorder : C.okBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            transition: 'all .3s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: hasActive ? C.errBg : C.okBg,
                border: `1px solid ${hasActive ? C.errBorder : C.okBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: hasActive ? C.err : C.ok,
              }}>
                <Stethoscope size={18} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text, letterSpacing: '-.01em' }}>
                  Dossier Médical Complet
                </div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
                  {record.playerName} · {record.playerId}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Badge color={cond.color}>{cond.label}</Badge>
              {!hasActive
                ? <Badge color="ok"><CheckCircle2 size={11} />Apte</Badge>
                : <Badge color="err"><XCircle size={11} />Inapte</Badge>
              }
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border2}`,
                  background: C.card2, color: C.sub, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s', marginLeft: 4,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.errBg; e.currentTarget.style.color = C.err; e.currentTarget.style.borderColor = C.errBorder; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.card2; e.currentTarget.style.color = C.sub; e.currentTarget.style.borderColor = C.border2; }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── SCROLLABLE BODY ── */}
          <div style={{ overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Active injury alert */}
            {hasActive && activeInjury && (
              <div style={{
                display: 'flex', gap: 14, padding: '14px 18px',
                background: C.errBg, border: `1px solid ${C.errBorder}`, borderRadius: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: C.errBorder,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertTriangle size={16} style={{ color: C.errBright }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.errBright, marginBottom: 3 }}>
                    Blessure active — {activeInjury.type}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: C.err }}>Depuis le {activeInjury.date}</span>
                    {activeInjury.expectedRecoveryDate && (
                      <span style={{ fontSize: 11, color: C.sub }}>
                        Retour prévu : <span style={{ color: C.warn }}>{activeInjury.expectedRecoveryDate}</span>
                      </span>
                    )}
                  </div>
                  {activeInjury.notes && (
                    <div style={{
                      fontSize: 12, color: C.sub, lineHeight: 1.5,
                      padding: '8px 12px', background: 'rgba(0,0,0,.3)',
                      borderRadius: 7, borderLeft: `2px solid ${C.err}`,
                    }}>
                      {activeInjury.notes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Two-column grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* LEFT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Identité médicale */}
                <div style={{ background: C.card3, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
                  <SectionHeader icon={<User size={15} />} title="Identité médicale" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <MetricCard icon={<Droplets size={14} />} label="Groupe sanguin" value={record.bloodType} accent={C.err} />
                    <MetricCard icon={<Calendar size={14} />} label="Naissance"      value={record.dateOfBirth} />
                  </div>
                  {record.chronicConditions.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <GroupLabel>Conditions chroniques</GroupLabel>
                      {record.chronicConditions.map((c, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 12px', background: C.warnBg,
                          border: `1px solid ${C.warnBorder}`, borderRadius: 8, marginBottom: 4,
                        }}>
                          <AlertCircle size={13} style={{ color: C.warn, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: C.warn }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {record.allergies.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <GroupLabel>Allergies</GroupLabel>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {record.allergies.map((a, i) => (
                          <Badge key={i} color="err">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Métriques physiques */}
                <div style={{ background: C.card3, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
                  <SectionHeader icon={<Activity size={15} />} title="Métriques physiques" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <MetricCard icon={<TrendingUp size={14} />} label="Taille"          value={metrics.heightCm}           unit="cm"      />
                    <MetricCard icon={<Zap        size={14} />} label="Poids"           value={metrics.weightKg}            unit="kg"      />
                    <MetricCard icon={<Heart      size={14} />} label="Fréq. cardiaque" value={metrics.heartRateBpm}        unit="bpm" accent={C.err} />
                    <MetricCard icon={<Activity   size={14} />} label="Tension art."    value={metrics.bloodPressure}                    />
                    <MetricCard icon={<TrendingUp size={14} />} label="% graisse"       value={`${metrics.bodyFatPercentage}%`}           />
                    {metrics.vo2Max !== undefined && (
                      <MetricCard icon={<Zap size={14} />} label="VO₂ max" value={metrics.vo2Max} unit="ml/kg/min" accent={C.ok} />
                    )}
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: C.sub }}>Indice masse grasse</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: metrics.bodyFatPercentage < 12 ? C.ok : metrics.bodyFatPercentage < 18 ? C.warn : C.err,
                      }}>
                        {metrics.bodyFatPercentage}% — {metrics.bodyFatPercentage < 12 ? 'Athlétique' : metrics.bodyFatPercentage < 18 ? 'Normal' : 'Élevé'}
                      </span>
                    </div>
                    <div style={{ height: 6, background: C.border2, borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 100,
                        width: `${Math.min(metrics.bodyFatPercentage * 3.3, 100)}%`,
                        background: metrics.bodyFatPercentage < 12 ? C.ok : metrics.bodyFatPercentage < 18 ? C.warn : C.err,
                        transition: 'width .5s ease',
                      }} />
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Historique des blessures */}
                <div style={{ background: C.card3, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
                  <SectionHeader
                    icon={<AlertTriangle size={15} />}
                    title="Historique des blessures"
                    right={<Badge color="muted">{injuries.length} entrées</Badge>}
                  />

                  {/* Active injury card OR cleared state */}
                  {hasActive ? (
                    <div style={{ marginBottom: 12 }}>
                      <GroupLabel>Blessure en cours</GroupLabel>
                      {injuries
                        .filter(i => i.status === 'active')
                        .map(inj => (
                          <InjuryCard
                            key={inj.id}
                            inj={inj}
                            onClick={() => { setSelectedInjury(inj); setSubModal('closeInjury'); }}
                          />
                        ))
                      }
                    </div>
                  ) : (
                    <div style={{ marginBottom: 12 }}>
                      <ClearedState onAddNew={() => setSubModal('addInjury')} />
                    </div>
                  )}

                  {/* Past injuries */}
                  {injuries.filter(i => i.status !== 'active').length > 0 && (
                    <>
                      <GroupLabel>Antécédents</GroupLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {injuries
                          .filter(i => i.status !== 'active')
                          .map(inj => (
                            <InjuryCard key={inj.id} inj={inj} />
                          ))
                        }
                      </div>
                    </>
                  )}
                </div>

                {/* Vaccinations */}
                <div style={{ background: C.card3, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
                  <SectionHeader icon={<Syringe size={15} />} title="Vaccinations" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {record.vaccinations.map((v, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', background: C.card2,
                        borderRadius: 8, border: `1px solid ${C.border}`,
                      }}>
                        <CheckCircle2 size={13} style={{ color: C.ok, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: C.text }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Full-width footer row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12,
              padding: '16px 18px', background: C.card3,
              borderRadius: 12, border: `1px solid ${C.border}`,
            }}>
              {[
                { icon: <User     size={14} />, label: 'Médecin assigné',  value: record.assignedDoctor,   accent: C.brand },
                { icon: <Calendar size={14} />, label: 'Dernier bilan',    value: record.lastCheckupDate               },
                { icon: <Shield   size={14} />, label: 'Prochain bilan',   value: record.nextCheckupDate,  accent: C.ok  },
              ].map(({ icon, label, value, accent }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: accent ? `${accent}18` : C.brandDim,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: accent || C.brand,
                  }}>
                    {icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>
                      {label}
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 500, color: C.text,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Sub-modals rendered outside main modal so they sit on top */}
      {subModal === 'closeInjury' && selectedInjury && (
        <CloseInjuryModal
          injury={selectedInjury}
          onCancel={() => setSubModal(null)}
          onSave={handleCloseInjury}
        />
      )}
      {subModal === 'addInjury' && (
        <AddInjuryModal
          onCancel={() => setSubModal(null)}
          onSave={handleAddInjury}
        />
      )}
    </>
  );
}
