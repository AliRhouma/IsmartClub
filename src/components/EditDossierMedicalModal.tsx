import { useEffect } from 'react';
import {
  X, Stethoscope, Droplets, AlertCircle, Heart,
  Activity, TrendingUp, Zap, Syringe, Calendar,
  User, Shield, Plus, Trash2,
} from 'lucide-react';

const C = {
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
  okBg:       'rgb(19,40,25)',
  okBorder:   'rgb(25,57,33)',
  ok:         'rgb(70,167,88)',
  warnBg:     'rgb(8,38,54)',
  warnBorder: 'rgb(8,53,76)',
  warn:       'rgb(104,221,253)',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: C.card2, border: `1px solid ${C.border2}`,
  color: C.text, fontSize: 13, outline: 'none',
  boxSizing: 'border-box', fontFamily: "'Rubik', sans-serif",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, appearance: 'none' as const, cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, color: C.sub,
  textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: 6,
};

function FieldIcon({ icon, color }: { icon: React.ReactNode; color?: string }) {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 6, flexShrink: 0,
      background: color ? `${color}18` : C.brandDim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color || C.brand,
    }}>
      {icon}
    </div>
  );
}

function Field({
  label, icon, iconColor, children, half,
}: {
  label: string; icon: React.ReactNode; iconColor?: string;
  children: React.ReactNode; half?: boolean;
}) {
  return (
    <div style={{ gridColumn: half ? undefined : 'span 1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <FieldIcon icon={icon} color={iconColor} />
        <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
      </div>
      {children}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: C.muted,
      textTransform: 'uppercase' as const, letterSpacing: '.07em',
      paddingBottom: 10, marginBottom: 16,
      borderBottom: `1px solid ${C.border}`,
    }}>
      {children}
    </div>
  );
}

function TagRow({ items, color }: { items: string[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 100,
          background: `${color}15`, border: `1px solid ${color}40`,
          fontSize: 12, color,
        }}>
          {item}
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color, display: 'flex', alignItems: 'center', padding: 0, opacity: 0.6,
          }}>
            <X size={10} />
          </button>
        </div>
      ))}
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderRadius: 100,
        background: C.card2, border: `1px solid ${C.border2}`,
        fontSize: 11, color: C.sub, cursor: 'pointer',
      }}>
        <Plus size={10} />Ajouter
      </button>
    </div>
  );
}

interface Props { onClose: () => void; }

export function EditDossierMedicalModal({ onClose }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
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
          width: '100%', maxWidth: 700, maxHeight: '90vh',
          background: C.card, borderRadius: 16,
          border: `1px solid ${C.border}`,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0,0,0,.6)',
          overflow: 'hidden',
          fontFamily: "'Rubik', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          background: `linear-gradient(90deg, rgb(16,28,48) 0%, ${C.card} 100%)`,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: C.brandDim, border: '1px solid rgba(0,145,255,.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.brand,
            }}>
              <Stethoscope size={17} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
                Modifier le Dossier Médical
              </div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                Abdelmalek Smaili · PLR-8472
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border2}`,
              background: C.card2, color: C.sub, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.errBg; e.currentTarget.style.color = C.err; e.currentTarget.style.borderColor = C.errBorder; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.card2; e.currentTarget.style.color = C.sub; e.currentTarget.style.borderColor = C.border2; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Identité médicale */}
          <div>
            <SectionHeader>Identité médicale</SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <Field label="Groupe sanguin" icon={<Droplets size={13} />} iconColor={C.err}>
                <select style={selectStyle} defaultValue="O+">
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </Field>
              <Field label="Date de naissance" icon={<Calendar size={13} />}>
                <input type="date" style={{ ...inputStyle, colorScheme: 'dark' }} defaultValue="2010-07-05" />
              </Field>
              <Field label="Médecin assigné" icon={<User size={13} />} iconColor={C.brand}>
                <input type="text" style={inputStyle} defaultValue="Dr. Tariq Mahmoud" />
              </Field>
            </div>
          </div>

          {/* Métriques physiques */}
          <div>
            <SectionHeader>Métriques physiques</SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <Field label="Taille (cm)" icon={<TrendingUp size={13} />}>
                <input type="number" style={inputStyle} defaultValue={162} min={100} max={220} />
              </Field>
              <Field label="Poids (kg)" icon={<Zap size={13} />}>
                <input type="number" style={inputStyle} defaultValue={48} min={20} max={200} />
              </Field>
              <Field label="Fréq. cardiaque (bpm)" icon={<Heart size={13} />} iconColor={C.err}>
                <input type="number" style={inputStyle} defaultValue={60} min={30} max={220} />
              </Field>
              <Field label="Tension artérielle" icon={<Activity size={13} />}>
                <input type="text" style={inputStyle} defaultValue="110/70" placeholder="Ex : 120/80" />
              </Field>
              <Field label="% Masse grasse" icon={<TrendingUp size={13} />}>
                <input type="number" style={inputStyle} defaultValue={9.8} step={0.1} min={0} max={60} />
              </Field>
              <Field label="VO₂ max (ml/kg/min)" icon={<Zap size={13} />} iconColor={C.ok}>
                <input type="number" style={inputStyle} defaultValue={52.4} step={0.1} min={0} max={100} />
              </Field>
            </div>
          </div>

          {/* Conditions & Allergies */}
          <div>
            <SectionHeader>Conditions & Allergies</SectionHeader>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                <FieldIcon icon={<AlertCircle size={13} />} color={C.warn} />
                <label style={{ ...labelStyle, marginBottom: 0 }}>Conditions chroniques</label>
              </div>
              <TagRow
                items={['Asthme léger (sous contrôle)']}
                color={C.warn}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                <FieldIcon icon={<AlertCircle size={13} />} color={C.err} />
                <label style={{ ...labelStyle, marginBottom: 0 }}>Allergies</label>
              </div>
              <TagRow
                items={['Pénicilline', 'Poussière']}
                color={C.err}
              />
            </div>
          </div>

          {/* Bilans */}
          <div>
            <SectionHeader>Bilans médicaux</SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Dernier bilan" icon={<Calendar size={13} />}>
                <input type="date" style={{ ...inputStyle, colorScheme: 'dark' }} defaultValue="2026-01-15" />
              </Field>
              <Field label="Prochain bilan" icon={<Shield size={13} />} iconColor={C.ok}>
                <input type="date" style={{ ...inputStyle, colorScheme: 'dark' }} defaultValue="2026-07-15" />
              </Field>
            </div>
          </div>

          {/* Vaccinations */}
          <div>
            <SectionHeader>Vaccinations</SectionHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Covid-19 (rappel 2024)',      date: '2024-03-10' },
                { label: 'Grippe saisonnière 2025',     date: '2025-11-01' },
                { label: 'Hépatite B (série complète)', date: '2023-06-15' },
                { label: 'Tétanos (rappel 2022)',       date: '2022-04-20' },
              ].map((v, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 160px 36px',
                  gap: 10, alignItems: 'center',
                  padding: '10px 14px',
                  background: C.card2, border: `1px solid ${C.border}`,
                  borderRadius: 9,
                }}>
                  <input
                    type="text"
                    defaultValue={v.label}
                    style={{ ...inputStyle, padding: '6px 10px' }}
                    placeholder="Vaccin"
                  />
                  <input
                    type="date"
                    defaultValue={v.date}
                    style={{ ...inputStyle, padding: '6px 10px', colorScheme: 'dark' }}
                  />
                  <button style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: C.errBg, border: `1px solid ${C.errBorder}`,
                    color: C.err, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 0', borderRadius: 9,
                background: C.card2, border: `1px dashed ${C.border2}`,
                color: C.sub, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
                <Plus size={13} />Ajouter un vaccin
              </button>
            </div>
          </div>

          {/* Remarques */}
          <div>
            <SectionHeader>Remarques générales</SectionHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <FieldIcon icon={<Stethoscope size={13} />} />
              <label style={{ ...labelStyle, marginBottom: 0 }}>Observations médicales</label>
            </div>
            <textarea
              rows={4}
              placeholder="Notes du médecin, prescriptions, recommandations particulières..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5, minHeight: 90 }}
            />
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${C.border}`,
          display: 'flex', gap: 10, flexShrink: 0,
          background: C.card3,
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 9,
              background: C.card2, border: `1px solid ${C.border2}`,
              color: C.sub, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Rubik', sans-serif",
            }}
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 2, padding: '10px 0', borderRadius: 9,
              background: C.brand, border: 'none',
              color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Rubik', sans-serif",
            }}
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}
