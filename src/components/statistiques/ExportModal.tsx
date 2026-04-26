import { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { C } from './data';
import { ModalShell, ModalHeader, PrimaryBtn, SecondaryBtn, SkeletonPulse } from './Primitives';

const FORMATS = [
  { id: 'pdf', label: 'PDF', desc: 'Document mis en page avec graphiques et analyses' },
  { id: 'png', label: 'PNG', desc: 'Image haute résolution de chaque graphique' },
  { id: 'csv', label: 'CSV', desc: 'Données brutes exportables dans Excel' },
];

export function ExportModal({ onClose, onShowToast }: { onClose: () => void; onShowToast: (msg: string) => void }) {
  const [format, setFormat] = useState('pdf');
  const [checks, setChecks] = useState({ kpis: true, charts: true, ai: false, alerts: false });
  const [emailOn, setEmailOn] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggle = (key: keyof typeof checks) =>
    setChecks(c => ({ ...c, [key]: !c[key] }));

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setSuccess(true);
      setTimeout(() => {
        onShowToast('Export réussi — Téléchargement lancé');
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <ModalShell onClose={onClose} width={420}>
      <ModalHeader title="Exporter & Partager" onClose={onClose} />

      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {success ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '24px 0',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: C.ok50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={22} style={{ color: C.ok }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Export réussi</span>
            <span style={{ fontSize: 12, color: C.sub }}>Téléchargement lancé</span>
          </div>
        ) : exporting ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 0' }}>
            <SkeletonPulse height={40} />
            <SkeletonPulse height={40} />
            <SkeletonPulse height={20} width="60%" />
          </div>
        ) : (
          <>
            <div>
              <SLabel>Format</SLabel>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {FORMATS.map(f => {
                  const on = format === f.id;
                  return (
                    <button key={f.id} onClick={() => setFormat(f.id)} style={{
                      flex: 1, padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                      background: on ? C.brand50 : C.card2,
                      border: `1px solid ${on ? `${C.brand}4d` : C.border2}`,
                      textAlign: 'center', fontFamily: "'Rubik', sans-serif",
                      transition: 'all 150ms',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: on ? C.brand : C.text }}>
                        {f.label}
                      </div>
                    </button>
                  );
                })}
              </div>
              {FORMATS.find(f => f.id === format) && (
                <div style={{ fontSize: 11, color: C.sub, marginTop: 6 }}>
                  {FORMATS.find(f => f.id === format)!.desc}
                </div>
              )}
            </div>

            <div>
              <SLabel>Contenu</SLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <CBox checked={checks.kpis} onChange={() => toggle('kpis')} label="Inclure les KPIs résumés" />
                <CBox checked={checks.charts} onChange={() => toggle('charts')} label="Inclure tous les graphiques" />
                <CBox checked={checks.ai} onChange={() => toggle('ai')} label="Inclure l'analyse IA" />
                <CBox checked={checks.alerts} onChange={() => toggle('alerts')} label="Inclure les alertes actives" />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <SLabel>Envoyer par email</SLabel>
                <button onClick={() => setEmailOn(o => !o)} aria-label="Basculer email" style={{
                  width: 36, height: 20, borderRadius: 99, cursor: 'pointer',
                  background: emailOn ? C.brand : C.card2, border: `1px solid ${emailOn ? C.brand : C.border2}`,
                  padding: 2, display: 'flex', alignItems: 'center',
                  transition: 'all 150ms',
                }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: '50%', background: C.white,
                    transition: 'transform 150ms',
                    transform: emailOn ? 'translateX(16px)' : 'translateX(0)',
                  }} />
                </button>
              </div>
              {emailOn && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="email"
                    defaultValue="staff@realmadrid.com"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '9px 12px', borderRadius: 8, background: C.card2,
                      border: `1px solid ${C.border2}`, color: C.text, fontSize: 12,
                      fontFamily: "'Rubik', sans-serif", outline: 'none',
                    }}
                  />
                  <textarea
                    placeholder="Message (optionnel)..."
                    rows={2}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '9px 12px', borderRadius: 8, background: C.card2,
                      border: `1px solid ${C.border2}`, color: C.text, fontSize: 12,
                      fontFamily: "'Rubik', sans-serif", outline: 'none', resize: 'vertical',
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {!success && !exporting && (
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          padding: '14px 22px', borderTop: `1px solid ${C.border}`,
        }}>
          <SecondaryBtn onClick={onClose}>Annuler</SecondaryBtn>
          <PrimaryBtn onClick={handleExport}>
            <Download size={13} />Exporter
          </PrimaryBtn>
        </div>
      )}
    </ModalShell>
  );
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: C.n400,
      textTransform: 'uppercase', letterSpacing: '.04em',
    }}>
      {children}
    </div>
  );
}

function CBox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
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
      <span style={{ fontSize: 12, color: C.sub }}>{label}</span>
    </label>
  );
}
