import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Plus,
  MoreHorizontal,
  SlidersHorizontal,
  Users,
} from "lucide-react";

/* ─── Types ─── */
interface Player {
  id: number;
  initials: string | null;
  color: string | null;
  name: string;
  email: string;
  category: string;
  poste: string;
  dob: string;
  number?: number;
}

/* ─── Data ─── */
const u14Players: Player[] = [
  { id: 1, initials: "AS", color: "#1a3a5c", name: "Abdelmalek Smaili", email: "abdelmalek.smaili@gmail.com", category: "U14", poste: "Latéral gauche", dob: "5 juil. 2012", number: 3 },
  { id: 2, initials: "AB", color: "#1a3d2e", name: "Adem Bougdiri", email: "adem.bougdiri@gmail.com", category: "U14", poste: "Latéral gauche", dob: "14 janv. 2012", number: 7 },
  { id: 3, initials: "AB", color: "#252545", name: "Ahmed Boutar", email: "ahmed.boutar@gmail.com", category: "U14", poste: "Milieu défensif central", dob: "9 août 2012", number: 14 },
  { id: 4, initials: "KM", color: "#4a1a1a", name: "Karim Mansour", email: "karim.mansour@gmail.com", category: "U14", poste: "Défenseur central", dob: "3 juin 2012", number: 5 },
  { id: 5, initials: "BT", color: "#3a1a1a", name: "Bilel Trabelsi", email: "bilel.trabelsi@gmail.com", category: "U14", poste: "Gardien de but", dob: "12 mars 2012", number: 1 },
  { id: 6, initials: null, color: null, name: "Amen Allah Gabssi", email: "amenallah.gabssi@gmail.com", category: "U14", poste: "Milieu défensif central", dob: "5 avr. 2012" },
  { id: 7, initials: null, color: null, name: "Ahmed Ben Jemaa", email: "ahmed.benjemaa@gmail.com", category: "U14", poste: "Milieu offensif central", dob: "26 oct. 2012" },
];

/* ─── Category badge config ─── */
const categoryStyle: Record<string, string> = {
  U14: "bg-brand-600/[0.10] text-brand-600",
};

/* ─── Checkbox ─── */
interface CheckboxProps { checked: boolean; onChange: () => void }
function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <div
      onClick={onChange}
      className={`w-4 h-4 rounded-sm shrink-0 flex items-center justify-center cursor-pointer
        border transition-all duration-150
        ${checked
          ? "border-brand-600 bg-brand-600"
          : "border-neutral-150 bg-transparent hover:border-neutral-400"
        }`}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1.5 3.5L3.5 5.5L7.5 1.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

/* ─── Column header ─── */
function ColHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-[5px] select-none cursor-pointer group">
      <span className="text-[11px] font-semibold tracking-[0.05em] uppercase text-neutral-400 group-hover:text-neutral-500 transition-colors duration-150">
        {label}
      </span>
      <ChevronDown size={10} className="text-neutral-300 group-hover:text-neutral-400 transition-colors duration-150" />
    </div>
  );
}

/* ─── Filter dropdown pill ─── */
function FilterPill({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-[6px] bg-neutral-50 border border-neutral-200 rounded-md px-3 py-[7px] transition-all duration-150 hover:border-neutral-150 hover:bg-neutral-100 cursor-pointer">
      <span className="text-[13px] text-neutral-500 whitespace-nowrap font-sans">{label}</span>
      <ChevronDown size={11} className="text-neutral-400 shrink-0" />
    </button>
  );
}

/* ─── Avatar ─── */
function Avatar({ player, hovered }: { player: Player; hovered: boolean }) {
  if (player.initials && player.color) {
    return (
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold tracking-[0.05em] text-neutral-950 transition-all duration-150 shrink-0
          ${hovered
            ? "shadow-[0_0_0_2px_rgb(24,24,24),0_0_0_3.5px_rgba(0,145,255,0.30)]"
            : "shadow-[0_0_0_1.5px_rgb(24,24,24)]"
          }`}
        style={{ background: `radial-gradient(circle at 35% 35%, ${player.color}ee, ${player.color}66)` }}
      >
        {player.initials}
      </div>
    );
  }
  return (
    <div
      className={`w-9 h-9 rounded-full bg-neutral-100 border flex items-center justify-center transition-all duration-150 shrink-0
        ${hovered ? "border-neutral-150 shadow-[0_0_0_2px_rgb(24,24,24),0_0_0_3.5px_rgba(255,255,255,0.06)]" : "border-neutral-200"}`}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7.5" r="3.5" fill="rgb(82,82,82)" opacity=".5" />
        <ellipse cx="10" cy="17" rx="6" ry="4" fill="rgb(82,82,82)" opacity=".35" />
      </svg>
    </div>
  );
}

/* ─────────────────── Main Page ─────────────────── */
export default function U14JoueursPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const allSelected = u14Players.length > 0 && selected.length === u14Players.length;
  const someSelected = selected.length > 0 && selected.length < u14Players.length;
  const toggleAll = () => setSelected(allSelected ? [] : u14Players.map((p) => p.id));
  const toggleOne = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const filtered = u14Players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-neutral-0 min-h-screen w-full font-sans flex flex-col">
      {/* ── Top bar ── */}
      <div className="px-9 pt-8 pb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-brand-600/[0.10] border border-brand-600/[0.15] flex items-center justify-center">
              <Users size={16} className="text-brand-600" />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold text-neutral-900 tracking-[-0.02em] leading-none">
                Joueurs U14
              </h1>
              <p className="text-caption text-neutral-400 mt-0.5">
                <span className="text-brand-600 font-semibold">{filtered.length}</span>
                {" "}joueur{filtered.length !== 1 ? "s" : ""} U14 au total
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-brand-600 border border-brand-600 text-neutral-950 px-4 py-[9px] rounded-md text-[13px] font-semibold cursor-pointer font-sans transition-all duration-150 hover:bg-brand-700 hover:border-brand-700 disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus size={13} strokeWidth={2.2} />
            Ajouter un joueur
          </button>
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un joueur…"
              className="bg-neutral-50 border border-neutral-200 rounded-[10px] pl-9 pr-4 py-[9px] w-[220px] text-[13px] text-neutral-900 font-sans outline-none focus:border-brand-600 transition-colors duration-150 placeholder:text-neutral-400"
            />
          </div>

          <div className="w-px h-5 bg-neutral-200" />

          <FilterPill label="2026 / 2027" />
          <FilterPill label="Toutes les positions" />

          <div className="flex-1" />

          {/* Bulk action bar — appears when rows selected */}
          {selected.length > 0 && (
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-md px-3 py-[7px] animate-pulse-once">
              <span className="text-[12px] text-neutral-500 font-sans">
                <span className="text-brand-600 font-semibold">{selected.length}</span> sélectionné{selected.length > 1 ? "s" : ""}
              </span>
              <div className="w-px h-4 bg-neutral-200" />
              <button className="text-[12px] text-error-600 font-semibold font-sans transition-colors duration-150 hover:text-error-600 cursor-pointer">
                Supprimer
              </button>
            </div>
          )}

          {/* Filter icon button */}
          <button className="w-[34px] h-[34px] rounded-md bg-transparent border border-neutral-150 text-neutral-500 flex items-center justify-center cursor-pointer transition-all duration-150 hover:text-brand-600 hover:border-brand-600 hover:bg-brand-600/[0.10]">
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 px-9 pb-10">
        <div className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">

          {/* Table header */}
          <div
            className="grid items-center px-4 py-[10px] bg-neutral-100 border-b border-neutral-200"
            style={{ gridTemplateColumns: "44px 48px minmax(0,1fr) 140px 220px 160px 44px" }}
          >
            {/* Select all checkbox — with indeterminate visual */}
            <div className="flex justify-center">
              {someSelected ? (
                <div
                  onClick={toggleAll}
                  className="w-4 h-4 rounded-sm border border-brand-600 bg-brand-600 flex items-center justify-center cursor-pointer"
                >
                  <div className="w-[7px] h-[1.5px] bg-white rounded-full" />
                </div>
              ) : (
                <Checkbox checked={allSelected} onChange={toggleAll} />
              )}
            </div>
            <div />
            <ColHeader label="Joueur" />
            <ColHeader label="Catégorie" />
            <ColHeader label="Position" />
            <ColHeader label="Naissance" />
            <div />
          </div>

          {/* Table body */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-5">
              <div className="w-20 h-20 rounded-[20px] bg-neutral-100 border-2 border-dashed border-neutral-150 flex items-center justify-center mb-5">
                <Users size={28} className="text-neutral-300" />
              </div>
              <p className="text-body text-neutral-500">Aucun joueur U14 trouvé</p>
              <p className="text-caption text-neutral-400 mt-1">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            filtered.map((player, idx) => {
              const isSelected = selected.includes(player.id);
              const isHovered = hoveredRow === player.id;
              const isLast = idx === filtered.length - 1;
              const catClass = categoryStyle[player.category] ?? "";
              const hasCat = player.category !== "—";

              let rowBg = "transparent";
              if (isSelected && isHovered)
                rowBg = "linear-gradient(90deg, rgba(0,145,255,0.11) 0%, rgba(0,145,255,0.04) 60%, transparent 100%)";
              else if (isSelected)
                rowBg = "linear-gradient(90deg, rgba(0,145,255,0.08) 0%, rgba(0,145,255,0.02) 60%, transparent 100%)";
              else if (isHovered)
                rowBg = "linear-gradient(90deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.008) 60%, transparent 100%)";

              return (
                <div
                  key={player.id}
                  onMouseEnter={() => setHoveredRow(player.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`grid items-center px-4 py-[11px] relative transition-[background] duration-[130ms]
                    ${!isLast ? "border-b border-neutral-200" : ""}`}
                  style={{
                    gridTemplateColumns: "44px 48px minmax(0,1fr) 140px 220px 160px 44px",
                    background: rowBg,
                  }}
                >
                  {/* Selection stripe */}
                  <div
                    className={`absolute left-0 top-[12%] bottom-[12%] w-0.5 rounded-[1px] bg-gradient-to-b from-transparent via-brand-600 to-transparent transition-opacity duration-[130ms]
                      ${isSelected ? "opacity-100" : "opacity-0"}`}
                  />

                  {/* Checkbox */}
                  <div className="flex justify-center">
                    <Checkbox checked={isSelected} onChange={() => toggleOne(player.id)} />
                  </div>

                  {/* Avatar */}
                  <div className="flex justify-center">
                    <Avatar player={player} hovered={isHovered} />
                  </div>

                  {/* Name + email */}
                  <div className="pr-4 min-w-0">
                    <div
                      onClick={(e) => { e.stopPropagation(); navigate(`/joueurs/${player.id}`); }}
                      className={`text-[13px] font-semibold tracking-[-0.005em] cursor-pointer truncate transition-colors duration-[120ms]
                        ${isHovered ? "text-brand-600" : "text-neutral-900"}`}
                    >
                      {player.name}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-[2px] truncate">
                      {player.email}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    {hasCat ? (
                      <span className={`inline-flex items-center text-[11px] font-semibold tracking-[0.02em] px-[9px] py-[3.5px] rounded-full ${catClass}`}>
                        {player.category}
                      </span>
                    ) : (
                      <span className="text-[13px] text-neutral-300">—</span>
                    )}
                  </div>

                  {/* Position */}
                  <div
                    className={`text-[13px] pr-4 truncate transition-colors duration-[120ms]
                      ${isHovered ? "text-neutral-500" : "text-neutral-400"}`}
                  >
                    {player.poste}
                  </div>

                  {/* DOB */}
                  <div
                    className={`text-[13px] tabular-nums transition-colors duration-[120ms]
                      ${isHovered ? "text-neutral-500" : "text-neutral-400"}`}
                  >
                    {player.dob}
                  </div>

                  {/* Actions menu */}
                  <div className="flex justify-center">
                    <button
                      className={`w-[28px] h-[28px] rounded-md flex items-center justify-center transition-all duration-[130ms] cursor-pointer border
                        ${isHovered
                          ? "bg-neutral-100 border-neutral-150 text-neutral-500"
                          : "bg-transparent border-transparent text-neutral-300"
                        }`}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Table footer / pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-[10px] border-t border-neutral-200 bg-neutral-100">
              <span className="text-caption text-neutral-400">
                {selected.length > 0 ? (
                  <>
                    <span className="text-brand-600 font-semibold">{selected.length}</span>
                    {" "}sélectionné{selected.length > 1 ? "s" : ""}
                  </>
                ) : (
                  `${filtered.length} joueurs U14 au total`
                )}
              </span>

              <div className="flex items-center gap-[5px]">
                {[1].map((n, i) => (
                  <button
                    key={i}
                    className={`h-7 min-w-[28px] px-2 rounded-md text-caption font-semibold cursor-pointer font-sans transition-all duration-[120ms]
                      ${n === 1
                        ? "bg-brand-50 border border-brand-600/[0.30] text-brand-600"
                        : "bg-transparent border border-neutral-200 text-neutral-400 hover:border-neutral-150 hover:text-neutral-500"
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
