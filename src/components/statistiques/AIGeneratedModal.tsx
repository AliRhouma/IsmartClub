import { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { C } from './data';
import type { ScreenId } from './data';
import { ModalShell, PrimaryBtn, SecondaryBtn, SkeletonPulse } from './Primitives';
import { RadarChart } from './SvgCharts';

const FOLLOW_UPS = [
  'Ajouter Vinícius à la comparaison',
  'Voir la même analyse en La Liga uniquement',
  'Générer un rapport PDF',
];

const COMMENTARIES = [
  `En Champions League, Mbappé domine sur les buts (3 en 3 matchs, soit 1.0/90 min) tandis que Bellingham excelle en passes décisives (2 PD, 0.67/90). Le radar révèle des profils complémentaires : Mbappé pèse davantage en finition directe, Bellingham en création.`,
  `Après ajout de Vinícius, on observe un trio offensif très complet. Vinícius apporte la dimension dribble et vitesse (12.4 km/match), complétant le profil buteur de Mbappé et le profil créateur de Bellingham.`,
  `En filtrant sur La Liga uniquement (7 matchs), Mbappé conserve son avance avec 5 buts. Bellingham monte à 4 passes décisives, confirmant son rôle de meneur créatif en championnat.`,
];

export function AIGeneratedModal({
  onClose, onNavigate, onDone,
}: {
  onClose: () => void;
  onNavigate: (s: ScreenId) => void;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [commentaryIdx, setCommentaryIdx] = useState(0);
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleFollowUp = useCallback((idx: number) => {
    setLoadingFollowUp(true);
    setTimeout(() => {
      setCommentaryIdx((idx + 1) % COMMENTARIES.length);
      setLoadingFollowUp(false);
    }, 800);
  }, []);

  return (
    <ModalShell onClose={onClose} width={620}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Graphique généré par l'IA</span>
          <span style={{
            width: 22, height: 22, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={10} color="#fff" />
          </span>
        </div>
        <button onClick={onClose} aria-label="Fermer" style={{
          width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
          background: C.card2, border: `1px solid ${C.border2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub,
        }}>
          ✕
        </button>
      </div>

      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{
          background: `${C.purple}12`, border: `1px solid ${C.purple}22`,
          borderRadius: 10, padding: '12px 16px',
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.purple, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Votre demande
          </div>
          <div style={{ fontSize: 13, color: C.text }}>
            Compare Mbappé et Bellingham sur toutes les métriques offensives
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SkeletonPulse height={180} />
            <SkeletonPulse height={60} />
          </div>
        ) : (
          <>
            <div style={{
              background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 10,
              padding: 18, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 12, right: 12,
                fontSize: 9, fontWeight: 700, color: C.purple,
                background: `${C.purple}1a`, borderRadius: 4, padding: '2px 6px',
                textTransform: 'uppercase', letterSpacing: '.04em',
              }}>
                IA
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                Mbappé vs Bellingham — Radar offensif
              </div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                Toutes compétitions · 22 fév — 5 avr 2026
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px 0',
              }}>
                {loadingFollowUp ? <SkeletonPulse height={160} borderRadius={10} /> : <RadarChart width={180} height={180} />}
              </div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <LegendDot color={C.brand} label="Mbappé" />
                <LegendDot color={C.ok} label="Bellingham" />
              </div>
            </div>

            <div style={{
              background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 10, padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Sparkles size={12} style={{ color: C.purple }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: C.purple }}>Analyse de l'IA</span>
              </div>
              {loadingFollowUp ? (
                <SkeletonPulse height={40} />
              ) : (
                <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.65 }}>
                  {COMMENTARIES[commentaryIdx]}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FOLLOW_UPS.map((f, i) => (
                <button key={f} onClick={() => handleFollowUp(i)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: C.card2, border: `1px solid ${C.border2}`,
                  borderRadius: 99, padding: '6px 12px', cursor: 'pointer',
                  fontSize: 11, color: C.sub, fontFamily: "'Rubik', sans-serif",
                  transition: 'all 150ms',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.color = C.purple; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.sub; }}
                >
                  {f}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 10,
        padding: '14px 22px', borderTop: `1px solid ${C.border}`,
      }}>
        <SecondaryBtn onClick={() => onNavigate('configure')}>Personnaliser</SecondaryBtn>
        <PrimaryBtn onClick={onDone}>Ajouter au tableau de bord</PrimaryBtn>
      </div>
    </ModalShell>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span style={{ fontSize: 11, color: C.sub }}>{label}</span>
    </div>
  );
}
