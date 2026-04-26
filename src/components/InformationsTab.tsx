import { useState } from 'react';
import {
  Star, FileText, Clock,
  User, MapPin, AlertTriangle, Calendar, Droplets,
  Stethoscope, School, Expand, Pencil, CheckCheck,
  Plus, Upload, ChevronDown, X,
  Users, GraduationCap, BookOpen, Award,
  CheckCircle2, XCircle, AlertCircle,
  Zap, Weight, Ruler, Heart, Dna,
} from 'lucide-react';
import { MedicalRecordModal, MEDICAL_RECORD } from './MedicalRecordModal';
import { EditProfilSportifModal } from './EditProfilSportifModal';
import { EditDossierMedicalModal } from './EditDossierMedicalModal';

/* ═══ MOCK DATA ══════════════════════════════════════════════════════════ */
const INJURIES = [
  { label: 'Entorse cheville gauche', date: '23/02/2026', active: true  },
  { label: 'Contusion genou droit',   date: '10/11/2025', active: false },
  { label: 'Déchirure musculaire',    date: '05/07/2025', active: false },
];

const DOCUMENTS: { label: string; status: 'valid' | 'expired' | 'missing'; expiry: string | null }[] = [
  { label: 'Licence fédérale',       status: 'valid',   expiry: '31/08/2025' },
  { label: 'Certificat médical',     status: 'valid',   expiry: '15/01/2026' },
  { label: 'Autorisation parentale', status: 'expired', expiry: '01/09/2024' },
  { label: 'Assurance sportive',     status: 'valid',   expiry: '30/06/2025' },
  { label: 'Contrat joueur',         status: 'valid',   expiry: '30/06/2026' },
  { label: 'Photo identité',         status: 'valid',   expiry: '30/06/2026' },
];

const PARENTS = [
  { role: 'Père', name: 'Mohamed Smaili', phone: '+216 22 456 789', email: 'mohamed.smaili@gmail.com' },
  { role: 'Mère', name: 'Fatma Ben Ali',  phone: '+216 55 987 654', email: 'fatma.benali@gmail.com'   },
];

const CERTIFICATIONS = [
  { label: 'Préparation mentale & gestion du stress', date: '17/12/2024', issuer: 'FTF'  },
  { label: 'Règles du jeu & fair-play',               date: '22/09/2024', issuer: 'UEFA' },
];

/* ═══ TYPES ══════════════════════════════════════════════════════════════ */
interface Player {
  height: string; weight: string; foot: string;
  nationality: string; licence: string; joinedAt: string;
  name: string; dob: string; location: string;
  email: string; phone: string; category: string;
  poste: string; status: string;
}
type TabKey = 'medical' | 'famille' | 'scolarite' | 'palmares';

/* ═══ PRIMITIVES ═════════════════════════════════════════════════════════ */
type BadgeColor = 'brand' | 'ok' | 'warn' | 'err' | 'muted';
const BADGE_CLS: Record<BadgeColor, string> = {
  brand: 'bg-brand-50 text-brand-600 border-brand-600/[0.20]',
  ok:    'bg-success-50 text-success-600 border-success-200',
  warn:  'bg-warning-50 text-warning-600 border-warning-200',
  err:   'bg-error-50 text-error-600 border-error-200',
  muted: 'bg-neutral-100 text-neutral-500 border-neutral-150',
};
function Badge({ children, color = 'brand' }: { children: React.ReactNode; color?: BadgeColor }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.02em] px-[9px] py-[3px] rounded-full whitespace-nowrap shrink-0 border ${BADGE_CLS[color]}`}>
      {children}
    </span>
  );
}

/* ═══ INSERT DOCUMENT MODAL ══════════════════════════════════════════════ */
const DOC_TYPES = ['Licence fédérale','Certificat médical','Autorisation parentale','Assurance sportive','Contrat joueur','Photo identité','Autre'];

function InsertDocumentModal({ onClose }: { onClose: () => void }) {
  const [typeOpen, setTypeOpen]         = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [dragOver, setDragOver]         = useState(false);
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-[6px]"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] w-[480px] max-w-[92vw] max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,0.6)] font-sans">
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-600/[0.10] border border-brand-600/[0.15] flex items-center justify-center text-brand-600">
              <FileText size={16} />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-neutral-900">Insérer un document</div>
              <div className="text-[11px] text-neutral-500 mt-[1px]">Smaili Abdelmalek · PLR-8472</div>
            </div>
          </div>
          <button onClick={onClose} className="w-[30px] h-[30px] rounded-md bg-neutral-100 border border-neutral-150 flex items-center justify-center text-neutral-500 cursor-pointer transition-all duration-150 hover:text-neutral-900 hover:border-neutral-400">
            <X size={14} />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-5">
          <div onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false)}}
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200
              ${dragOver?'border-brand-600 bg-brand-50':'border-neutral-150 bg-neutral-0'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-200
              ${dragOver?'bg-brand-600/[0.20] border-brand-600/[0.35] text-brand-600':'bg-neutral-100 border-neutral-150 text-neutral-500'}`}>
              <Upload size={20} />
            </div>
            <div className="text-center">
              <div className={`text-[13px] font-semibold ${dragOver?'text-brand-600':'text-neutral-900'}`}>Glissez votre fichier ici</div>
              <div className="text-[11px] text-neutral-500 mt-1">PDF, JPG, PNG — max 10 Mo</div>
            </div>
            <button className="px-4 py-[7px] rounded-md bg-brand-50 text-brand-600 border border-brand-600/[0.25] text-[12px] font-semibold cursor-pointer transition-all duration-150 hover:bg-brand-600/[0.20]">Parcourir les fichiers</button>
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.04em]">Type de document</span>
            <div className="relative">
              <button onClick={()=>setTypeOpen(o=>!o)} className={`w-full flex items-center justify-between px-3 py-[9px] rounded-md bg-neutral-100 border text-[13px] font-sans cursor-pointer transition-colors duration-150 ${typeOpen?'border-brand-600':'border-neutral-150'}`}>
                <span className={selectedType?'text-neutral-900':'text-neutral-400'}>{selectedType||'Sélectionner un type…'}</span>
                <ChevronDown size={13} className={`text-neutral-500 shrink-0 transition-transform duration-150 ${typeOpen?'rotate-180':''}`} />
              </button>
              {typeOpen&&(
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-10 bg-neutral-50 border border-neutral-150 rounded-[10px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                  {DOC_TYPES.map(t=>(
                    <div key={t} onClick={()=>{setSelectedType(t);setTypeOpen(false)}}
                      className={`px-[14px] py-[9px] text-[13px] cursor-pointer transition-colors duration-[100ms] ${selectedType===t?'bg-brand-50 text-brand-600':'text-neutral-900 hover:bg-neutral-100'}`}>{t}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.04em]">Nom du document</span>
            <input type="text" placeholder="ex. Certificat médical 2026" className="bg-neutral-100 border border-neutral-150 rounded-md px-3 py-[9px] text-[13px] text-neutral-900 font-sans outline-none transition-colors duration-150 focus:border-brand-600 placeholder:text-neutral-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Date d'émission","Date d'expiration"].map(f=>(
              <div key={f} className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.04em]">{f}</span>
                <input type="date" className="bg-neutral-100 border border-neutral-150 rounded-md px-3 py-[9px] text-[13px] text-neutral-900 font-sans outline-none transition-colors duration-150 focus:border-brand-600" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.04em]">Notes (optionnel)</span>
            <textarea rows={3} placeholder="Remarques ou informations complémentaires…" className="bg-neutral-100 border border-neutral-150 rounded-md px-3 py-[9px] text-[13px] text-neutral-900 font-sans outline-none transition-colors duration-150 focus:border-brand-600 resize-y leading-relaxed placeholder:text-neutral-400" />
          </div>
        </div>
        <div className="flex gap-[10px] px-[22px] py-[14px] border-t border-neutral-200">
          <button onClick={onClose} className="flex-1 py-[9px] rounded-md bg-transparent border border-neutral-150 text-neutral-500 text-[13px] font-semibold cursor-pointer font-sans transition-all duration-150 hover:text-neutral-900 hover:border-neutral-400">Annuler</button>
          <button className="flex-[2] py-[9px] rounded-md bg-brand-600 border border-brand-600 text-neutral-950 text-[13px] font-semibold cursor-pointer font-sans flex items-center justify-center gap-2 transition-all duration-150 hover:opacity-90">
            <Upload size={13} />Insérer le document
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ CLOTURE MODAL ══════════════════════════════════════════════════════ */
function ClotureInjuryModal({ injury, done, onConfirm, onClose }: {
  injury: { label: string; date: string }; done: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-[6px]"
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] p-7 w-[420px] max-w-[90vw] shadow-[0_32px_80px_rgba(0,0,0,0.6)] font-sans flex flex-col">
        {!done?(
          <>
            <div className="w-[52px] h-[52px] rounded-[14px] mb-5 bg-success-50 border border-success-200 flex items-center justify-center text-success-600"><CheckCheck size={22}/></div>
            <div className="text-[17px] font-semibold text-neutral-900 mb-[6px]">Clôturer la blessure</div>
            <div className="text-[13px] text-neutral-500 leading-relaxed mb-6">Vous êtes sur le point de marquer cette blessure comme <span className="text-success-600 font-semibold">guérie</span>. Son statut sera mis à jour dans le dossier médical.</div>
            <div className="flex items-center gap-3 px-4 py-[12px] rounded-[10px] bg-error-50 border border-error-200 mb-5">
              <AlertTriangle size={15} className="text-error-600 shrink-0"/>
              <div>
                <div className="text-[13px] font-semibold text-error-600">{injury.label}</div>
                <div className="text-[11px] text-error-600/75 mt-[2px]">Depuis le {injury.date}</div>
              </div>
            </div>
            <div className="text-[11px] text-neutral-500 mb-2 uppercase tracking-[0.04em] font-semibold">Date de clôture</div>
            <div className="flex items-center gap-2 px-[14px] py-[10px] rounded-[10px] bg-neutral-100 border border-neutral-150 mb-6">
              <Calendar size={14} className="text-neutral-500 shrink-0"/>
              <span className="text-[13px] text-neutral-900 tabular-nums">03/04/2026</span>
              <span className="ml-auto text-[11px] text-success-600 font-semibold bg-success-50 px-2 py-[2px] rounded-md border border-success-200">Aujourd'hui</span>
            </div>
            <div className="flex gap-[10px]">
              <button onClick={onClose} className="flex-1 py-[9px] rounded-md bg-transparent border border-neutral-150 text-neutral-500 text-[13px] font-semibold cursor-pointer font-sans transition-all duration-150 hover:text-neutral-900">Annuler</button>
              <button onClick={onConfirm} className="flex-1 py-[9px] rounded-md bg-success-50 border border-success-200 text-success-600 text-[13px] font-semibold cursor-pointer font-sans flex items-center justify-center gap-2 transition-all duration-150 hover:bg-success-100">
                <CheckCheck size={13}/>Confirmer
              </button>
            </div>
          </>
        ):(
          <>
            <div className="w-[60px] h-[60px] rounded-[16px] mb-5 bg-success-50 border border-success-600 flex items-center justify-center text-success-600 shadow-[0_0_24px_rgba(70,167,88,0.25)]"><CheckCheck size={26}/></div>
            <div className="text-[17px] font-semibold text-neutral-900 mb-2">Blessure clôturée</div>
            <div className="text-[13px] text-neutral-500 leading-relaxed mb-6"><span className="text-neutral-900 font-semibold">"{injury.label}"</span> a été marquée comme <span className="text-success-600 font-semibold">guérie</span> le 03/04/2026 et archivée dans l'historique.</div>
            <div className="flex items-center gap-[10px] px-4 py-3 rounded-[10px] bg-success-50 border border-success-200 mb-5">
              <CheckCircle2 size={15} className="text-success-600 shrink-0"/>
              <div className="text-[13px] text-success-600 font-semibold">Dossier médical synchronisé</div>
            </div>
            <button onClick={onClose} className="w-full py-[10px] rounded-md bg-success-50 border border-success-200 text-success-600 text-[13px] font-semibold cursor-pointer font-sans transition-all duration-150 hover:bg-success-100">Fermer</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══ MAIN COMPONENT ═════════════════════════════════════════════════════ */
export function InformationsTab({ player }: { player: Player }) {
  const [activeTab, setActiveTab]             = useState<TabKey>('medical');
  const [medicalOpen, setMedicalOpen]         = useState(false);
  const [editProfilOpen, setEditProfilOpen]   = useState(false);
  const [editMedicalOpen, setEditMedicalOpen] = useState(false);
  const [closeInjuryOpen, setCloseInjuryOpen] = useState(false);
  const [closeInjuryDone, setCloseInjuryDone] = useState(false);
  const [insertDocOpen, setInsertDocOpen]     = useState(false);

  const activeInjury    = INJURIES.find(i => i.active);
  const hasActiveInjury = !!activeInjury;
  const docsValid       = DOCUMENTS.filter(d => d.status === 'valid').length;

  const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'medical',   label: 'Médical',        icon: <Stethoscope size={12}/> },
    { key: 'famille',   label: 'Parents',        icon: <Users       size={12}/> },
    { key: 'scolarite', label: 'Scolarité',      icon: <School      size={12}/> },
    { key: 'palmares',  label: 'Certifications', icon: <Award       size={12}/> },
  ];

  return (
    <div className="font-sans">
      {medicalOpen     && <MedicalRecordModal record={MEDICAL_RECORD} onClose={()=>setMedicalOpen(false)}/>}
      {editProfilOpen  && <EditProfilSportifModal onClose={()=>setEditProfilOpen(false)}/>}
      {editMedicalOpen && <EditDossierMedicalModal onClose={()=>setEditMedicalOpen(false)}/>}
      {closeInjuryOpen && activeInjury && (
        <ClotureInjuryModal injury={activeInjury} done={closeInjuryDone}
          onConfirm={()=>setCloseInjuryDone(true)}
          onClose={()=>{setCloseInjuryOpen(false);setCloseInjuryDone(false)}}/>
      )}
      {insertDocOpen && <InsertDocumentModal onClose={()=>setInsertDocOpen(false)}/>}

      {/* ── Injury banner ─────────────────────────────────────────── */}
      {hasActiveInjury && activeInjury && (
        <div className="mx-6 mt-5 flex items-center justify-between gap-4 px-4 py-[10px] bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-error-600/[0.15] flex items-center justify-center shrink-0">
              <AlertTriangle size={13} className="text-error-600"/>
            </div>
            <div>
              <span className="text-[13px] font-semibold text-error-600">{activeInjury.label}</span>
              <span className="text-[12px] text-error-600/70 ml-2">— en cours depuis le {activeInjury.date}</span>
            </div>
          </div>
          <button onClick={()=>setCloseInjuryOpen(true)}
            className="flex items-center gap-[5px] shrink-0 px-3 py-[5px] rounded-md bg-success-50 text-success-600 border border-success-200 text-[11px] font-semibold cursor-pointer transition-all duration-150 hover:bg-success-100">
            <CheckCheck size={11}/>Clôturer
          </button>
        </div>
      )}

      {/* ── Main layout ───────────────────────────────────────────── */}
      <div className="p-6 grid gap-5" style={{ gridTemplateColumns: '1fr 284px' }}>

        {/* ═══ LEFT ═══════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-5 min-w-0">

          {/* ── PROFIL SPORTIF ──────────────────────────────────────── */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">

            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-[13px] border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-[26px] h-[26px] rounded-md bg-brand-600/[0.10] border border-brand-600/[0.15] flex items-center justify-center">
                  <Zap size={13} className="text-brand-600"/>
                </div>
                <span className="text-[13px] font-semibold text-neutral-900">Profil Sportif</span>
              </div>
              <button onClick={()=>setEditProfilOpen(true)}
                className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md bg-transparent border border-neutral-150 text-neutral-500 text-[11px] font-semibold cursor-pointer transition-all duration-150 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-600/[0.30]">
                <Pencil size={10}/>Modifier
              </button>
            </div>

            {/* Hero row: 4 big stats separated by dividers */}
            <div className="grid border-b border-neutral-200" style={{ gridTemplateColumns: '1fr 1px 1fr 1px 1fr 1px 1fr' }}>
              {/* Poste */}
              <div className="px-5 py-5">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.07em] mb-[10px]">Poste principal</div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[14px] font-semibold text-neutral-900 leading-tight">{player.poste}</span>
                  <span className="text-[10px] font-bold px-[7px] py-[3px] rounded-full bg-brand-600 text-neutral-950 shrink-0 mt-[1px]">N°10</span>
                </div>
              </div>
              <div className="bg-neutral-200"/>
              {/* Taille */}
              <div className="px-5 py-5">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.07em] mb-[10px]">Taille</div>
                <div className="flex items-end gap-[3px]">
                  <span className="text-[22px] font-semibold text-neutral-900 leading-none">{player.height.replace(' cm','')}</span>
                  <span className="text-[11px] text-neutral-500 mb-[2px]">cm</span>
                </div>
              </div>
              <div className="bg-neutral-200"/>
              {/* Poids */}
              <div className="px-5 py-5">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.07em] mb-[10px]">Poids</div>
                <div className="flex items-end gap-[3px]">
                  <span className="text-[22px] font-semibold text-neutral-900 leading-none">{player.weight.replace(' kg','')}</span>
                  <span className="text-[11px] text-neutral-500 mb-[2px]">kg</span>
                </div>
              </div>
              <div className="bg-neutral-200"/>
              {/* Pied */}
              <div className="px-5 py-5">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.07em] mb-[10px]">Pied fort</div>
                <div className="text-[14px] font-semibold text-neutral-900">{player.foot}</div>
              </div>
            </div>

            {/* Secondary row: identity fields */}
            <div className="grid border-b border-neutral-200" style={{ gridTemplateColumns: '1fr 1px 1fr 1px 1fr 1px 1fr' }}>
              {[
                { label: 'Catégorie',     value: player.category, iconCls: 'bg-success-50 border-success-200 text-success-600', icon: <Star size={12}/> },
                { label: 'Licence',       value: player.licence,  iconCls: 'bg-neutral-100 border-neutral-200 text-neutral-500', icon: <FileText size={12}/> },
                { label: 'Membre depuis', value: player.joinedAt, iconCls: 'bg-neutral-100 border-neutral-200 text-neutral-500', icon: <Calendar size={12}/> },
                { label: 'Nationalité',   value: player.nationality, iconCls: 'bg-warning-50 border-warning-200 text-warning-600', icon: <MapPin size={12}/> },
              ].map((item, i, arr) => (
                <>
                  <div key={item.label} className="flex items-center gap-3 px-5 py-[13px]">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center border shrink-0 ${item.iconCls}`}>{item.icon}</div>
                    <div>
                      <div className="text-[10px] text-neutral-400 font-medium mb-[2px]">{item.label}</div>
                      <div className="text-[12px] font-semibold text-neutral-900">{item.value}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div key={`d${i}`} className="bg-neutral-200"/>}
                </>
              ))}
            </div>
          </div>

          {/* ── TAB PANEL ───────────────────────────────────────────── */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">

            {/* Tab bar — underline style */}
            <div className="flex border-b border-neutral-200 bg-neutral-100">
              {TABS.map(t => (
                <button key={t.key} onClick={()=>setActiveTab(t.key)}
                  className="flex-1 flex items-center justify-center gap-[6px] py-[11px] text-[12px] font-medium font-sans cursor-pointer border-none transition-all duration-150 relative"
                  style={{
                    color: activeTab === t.key ? 'rgb(0,145,255)' : 'rgb(115,115,115)',
                    background: activeTab === t.key ? 'rgb(24,24,24)' : 'transparent',
                    borderBottom: activeTab === t.key ? '2px solid rgb(0,145,255)' : '2px solid transparent',
                  }}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* ── Médical ─────────────────────────────────────────── */}
            {activeTab === 'medical' && (
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Stethoscope size={14} className="text-brand-600"/>
                    <span className="text-[13px] font-semibold text-neutral-900">Dossier Médical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>setEditMedicalOpen(true)}
                      className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md bg-transparent border border-neutral-150 text-neutral-500 text-[11px] font-semibold cursor-pointer transition-all duration-150 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-600/[0.30]">
                      <Pencil size={10}/>Modifier
                    </button>
                    <button onClick={()=>setMedicalOpen(true)}
                      className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md bg-brand-50 text-brand-600 border border-brand-600/[0.20] text-[11px] font-semibold cursor-pointer transition-all duration-150 hover:bg-brand-600/[0.20]">
                      <Expand size={10}/>Dossier complet
                    </button>
                  </div>
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: <Dna size={13}/>, label: 'Groupe sanguin', value: 'A+', cls: 'bg-error-50 border-error-200 text-error-600' },
                    { icon: <AlertCircle size={13}/>, label: 'Allergies', value: 'Aucune', cls: 'bg-neutral-100 border-neutral-200 text-neutral-500' },
                    { icon: <Calendar size={13}/>, label: 'Dernier bilan', value: '15/01/2025', cls: 'bg-neutral-100 border-neutral-200 text-neutral-500' },
                  ].map(s=>(
                    <div key={s.label} className="flex items-center gap-3 px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-lg">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center border shrink-0 ${s.cls}`}>{s.icon}</div>
                      <div>
                        <div className="text-[10px] text-neutral-400 font-medium">{s.label}</div>
                        <div className="text-[13px] font-semibold text-neutral-900">{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Injury history */}
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.07em] mb-3">Historique des blessures</div>
                <div className="flex flex-col gap-2">
                  {INJURIES.map((inj,i)=>(
                    <div key={i} className={`flex items-center justify-between px-4 py-[10px] rounded-lg border
                      ${inj.active?'bg-error-50 border-error-200':'bg-neutral-100 border-neutral-200'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${inj.active?'bg-error-600 shadow-[0_0_6px_rgba(229,72,77,0.6)]':'bg-success-600'}`}/>
                        <span className={`text-[13px] font-medium ${inj.active?'text-error-600':'text-neutral-900'}`}>{inj.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] tabular-nums ${inj.active?'text-error-600/70':'text-neutral-500'}`}>{inj.date}</span>
                        <Badge color={inj.active?'err':'ok'}>{inj.active?'En cours':'Guéri'}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Famille ─────────────────────────────────────────── */}
            {activeTab==='famille'&&(
              <div className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Users size={14} className="text-brand-600"/>
                  <span className="text-[13px] font-semibold text-neutral-900">Parents & Contact d'urgence</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {PARENTS.map(par=>(
                    <div key={par.role} className="bg-neutral-100 border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-600/[0.15] flex items-center justify-center text-brand-600 shrink-0"><User size={15}/></div>
                        <div>
                          <div className="text-[10px] text-neutral-500 font-medium">{par.role}</div>
                          <div className="text-[13px] font-semibold text-neutral-900">{par.name}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-[7px]">
                        <div className="flex items-center gap-2 text-[12px] text-neutral-500"><span className="text-brand-600 flex shrink-0"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11.94 19.79 19.79 0 0 1 1.07 3.31 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z"/></svg></span>{par.phone}</div>
                        <div className="flex items-center gap-2 text-[12px] text-neutral-500"><span className="text-brand-600 flex shrink-0"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>{par.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Scolarité ───────────────────────────────────────── */}
            {activeTab==='scolarite'&&(
              <div className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <GraduationCap size={14} className="text-brand-600"/>
                  <span className="text-[13px] font-semibold text-neutral-900">Scolarité</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <BookOpen size={13}/>, label: 'Établissement', value: 'Lycée Sadiki' },
                    { icon: <GraduationCap size={13}/>, label: 'Niveau', value: '2ème Secondaire' },
                  ].map(s=>(
                    <div key={s.label} className="flex items-center gap-3 px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-lg">
                      <div className="w-7 h-7 rounded-md bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500 shrink-0">{s.icon}</div>
                      <div>
                        <div className="text-[10px] text-neutral-400 font-medium">{s.label}</div>
                        <div className="text-[13px] font-semibold text-neutral-900">{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Certifications ──────────────────────────────────── */}
            {activeTab==='palmares'&&(
              <div className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Award size={14} className="text-brand-600"/>
                  <span className="text-[13px] font-semibold text-neutral-900">Certifications obtenues</span>
                </div>
                <div className="flex flex-col gap-2">
                  {CERTIFICATIONS.map((c,i)=>(
                    <div key={i} className="flex items-center justify-between px-4 py-[10px] bg-neutral-100 border border-neutral-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-md bg-success-50 border border-success-200 flex items-center justify-center text-success-600 shrink-0"><CheckCircle2 size={13}/></div>
                        <div>
                          <div className="text-[13px] font-medium text-neutral-900">{c.label}</div>
                          <div className="text-[10px] text-neutral-500 mt-[2px]">Émis par {c.issuer}</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-neutral-500 tabular-nums shrink-0 ml-4">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ RIGHT SIDEBAR ══════════════════════════════════════════ */}
        <div className="flex flex-col gap-4">

          {/* Documents */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-[13px] border-b border-neutral-200 bg-neutral-100">
              <div className="flex items-center gap-2">
                <FileText size={13} className="text-brand-600"/>
                <span className="text-[13px] font-semibold text-neutral-900">Documents</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-[5px] px-[9px] py-[3px] rounded-full bg-neutral-50 border border-neutral-150">
                  <span className="w-[6px] h-[6px] rounded-full bg-success-600 inline-block"/>
                  <span className="text-[11px] font-semibold text-neutral-500">{docsValid}/{DOCUMENTS.length}</span>
                </div>
                <button onClick={()=>setInsertDocOpen(true)}
                  className="w-[26px] h-[26px] rounded-md bg-brand-50 border border-brand-600/[0.20] text-brand-600 flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-brand-600/[0.20]">
                  <Plus size={12}/>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pt-3 pb-1">
              <div className="h-[3px] w-full bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-success-600 rounded-full transition-all duration-500"
                  style={{ width: `${(docsValid/DOCUMENTS.length)*100}%` }}/>
              </div>
            </div>

            <div className="px-3 pb-3 pt-2 flex flex-col gap-[3px]">
              {DOCUMENTS.map((doc,i)=>{
                const colorCls = doc.status==='valid'?'text-success-600':doc.status==='expired'?'text-warning-600':'text-error-600';
                const Icon = doc.status==='valid'?CheckCircle2:doc.status==='expired'?AlertCircle:XCircle;
                return (
                  <div key={i} className={`flex items-center justify-between px-3 py-[8px] rounded-md border transition-all duration-150
                    ${doc.status==='expired'?'bg-warning-50 border-warning-200':'bg-neutral-100 border-neutral-200 hover:border-neutral-150'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon size={12} className={`shrink-0 ${colorCls}`}/>
                      <span className="text-[12px] text-neutral-900 truncate">{doc.label}</span>
                    </div>
                    {doc.expiry&&(
                      <span className={`text-[10px] shrink-0 ml-2 tabular-nums ${doc.status==='expired'?'text-warning-600 font-semibold':'text-neutral-500'}`}>
                        {doc.expiry}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Last updated */}
          <div className="flex items-center gap-2 px-4 py-[10px] bg-neutral-50 border border-neutral-200 rounded-lg">
            <Clock size={11} className="text-neutral-400 shrink-0"/>
            <span className="text-[11px] text-neutral-500">
              Mis à jour le <span className="text-neutral-900 font-medium">01/04/2026</span> par Coach Hatem
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}