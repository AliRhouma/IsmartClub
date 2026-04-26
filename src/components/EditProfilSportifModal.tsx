import { useEffect } from 'react';
import { X, Zap, Ruler, Weight, Heart, Star, FileText, Calendar, MapPin, Hash } from 'lucide-react';

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
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: C.card2, border: `1px solid ${C.border2}`,
  color: C.text, fontSize: 13, outline: 'none',
  boxSizing: 'border-box', fontFamily: "'Rubik', sans-serif",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, color: C.sub,
  textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: 6,
};

function FieldIcon({ icon, color }: { icon: React.ReactNode; color?: string }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 6, flexShrink: 0,
      background: color ? `${color}18` : C.brandDim,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color || C.brand,
    }}>
      {icon}
    </div>
  );
}

function Field({
  label, icon, iconColor, children,
}: {
  label: string; icon: React.ReactNode; iconColor?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
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
      paddingBottom: 10, marginBottom: 14,
      borderBottom: `1px solid ${C.border}`,
    }}>
      {children}
    </div>
  );
}

interface Props {
  onClose: () => void;
}

export function EditProfilSportifModal({ onClose }: Props) {
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
          width: '100%', maxWidth: 620, maxHeight: '90vh',
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
          background: `linear-gradient(90deg, ${C.brandDim} 0%, ${C.card} 100%)`,
          borderBottom: `1px solid rgba(0,145,255,.15)`,
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
              <Zap size={17} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
                Modifier le Profil Sportif
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

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Poste & numéro */}
          <div>
            <SectionHeader>Poste & Identification</SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Poste principal" icon={<Zap size={13} />}>
                <select style={selectStyle} defaultValue="Milieu offensif">
                  {['Gardien', 'Défenseur central', 'Latéral droit', 'Latéral gauche',
                    'Milieu défensif', 'Milieu central', 'Milieu offensif',
                    'Ailier droit', 'Ailier gauche', 'Avant-centre'].map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Numéro de maillot" icon={<Hash size={13} />}>
                <input type="number" style={inputStyle} defaultValue={10} min={1} max={99} />
              </Field>
            </div>
          </div>

          {/* Attributs physiques */}
          <div>
            <SectionHeader>Attributs physiques</SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <Field label="Taille (cm)" icon={<Ruler size={13} />}>
                <input type="number" style={inputStyle} defaultValue={162} min={100} max={220} />
              </Field>
              <Field label="Poids (kg)" icon={<Weight size={13} />}>
                <input type="number" style={inputStyle} defaultValue={48} min={30} max={150} />
              </Field>
              <Field label="Pied fort" icon={<Heart size={13} />}>
                <select style={selectStyle} defaultValue="Droit">
                  {['Droit', 'Gauche', 'Les deux'].map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Identité sportive */}
          <div>
            <SectionHeader>Identité sportive</SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Catégorie" icon={<Star size={13} />} iconColor="rgb(70,167,88)">
                <select style={selectStyle} defaultValue="U15">
                  {['U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U19','Senior'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Numéro de licence" icon={<FileText size={13} />}>
                <input type="text" style={inputStyle} defaultValue="TN-2025-8472" placeholder="Ex : TN-2025-0001" />
              </Field>
              <Field label="Membre depuis" icon={<Calendar size={13} />}>
                <input type="date" style={{ ...inputStyle, colorScheme: 'dark' }} defaultValue="2022-09-01" />
              </Field>
              <Field label="Nationalité" icon={<MapPin size={13} />} iconColor="rgb(104,221,253)">
                <input type="text" style={inputStyle} defaultValue="Tunisienne" placeholder="Nationalité" />
              </Field>
            </div>
          </div>

          {/* Statut */}
          <div>
            <SectionHeader>Statut</SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Statut sportif" icon={<Star size={13} />} iconColor="rgb(0,145,255)">
                <select style={selectStyle} defaultValue="Actif">
                  {['Actif', 'Suspendu', 'Blessé', 'Prêté', 'Inactif'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Apte à jouer" icon={<Heart size={13} />} iconColor="rgb(70,167,88)">
                <select style={selectStyle} defaultValue="Oui">
                  {['Oui', 'Non', 'Sur décision médicale'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Notes */}
          <div>
            <SectionHeader>Notes du staff</SectionHeader>
            <textarea
              rows={3}
              placeholder="Observations techniques, comportement, progression..."
              style={{
                ...inputStyle, resize: 'vertical', lineHeight: 1.5,
                minHeight: 80,
              }}
            />
          </div>

        </div>

        {/* Footer actions */}
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
