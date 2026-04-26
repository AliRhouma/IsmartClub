import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Shield } from 'lucide-react';
import { FoldersView } from '../components/statistiques/FoldersView';

const categoriesData: Record<string, {
  name: string;
  coach: string;
  season: string;
  playerCount: number;
  ageRange: string;
  level: string;
}> = {
  senior: {
    name: 'Senior',
    coach: 'Mohamed Ben Ali',
    season: '2025 / 2026',
    playerCount: 28,
    ageRange: '20 ans et plus',
    level: 'Élite',
  },
  junior: {
    name: 'Junior',
    coach: 'Karim Trabelsi',
    season: '2025 / 2026',
    playerCount: 22,
    ageRange: '17 – 19 ans',
    level: 'Développement',
  },
  u20: {
    name: 'U20',
    coach: 'Sami Mejri',
    season: '2025 / 2026',
    playerCount: 18,
    ageRange: 'Moins de 20 ans',
    level: 'Excellence',
  },
  u18: {
    name: 'U18',
    coach: 'Imed Chaker',
    season: '2025 / 2026',
    playerCount: 25,
    ageRange: 'Moins de 18 ans',
    level: 'Académie',
  },
  u16: {
    name: 'U16',
    coach: 'Nabil Hamdi',
    season: '2025 / 2026',
    playerCount: 30,
    ageRange: 'Moins de 16 ans',
    level: 'Formation',
  },
  u14: {
    name: 'U14',
    coach: 'Aymen Saad',
    season: '2025 / 2026',
    playerCount: 35,
    ageRange: 'Moins de 14 ans',
    level: 'Initiation',
  },
};

const TABS = [
  { id: 'joueurs',      label: 'Joueurs' },
  { id: 'seances',      label: 'Séances' },
  { id: 'matchs',       label: 'Matchs' },
  { id: 'evaluations',  label: 'Évaluations' },
  { id: 'statistiques', label: 'Analyse IA' },
];

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('joueurs');

  const category = categoriesData[slug?.toLowerCase() ?? ''];

  if (!category) {
    return (
      <div className="flex-1 overflow-y-auto bg-default-background">
        <div className="max-w-7xl mx-auto p-8">
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-body text-brand-600 hover:text-brand-700 mb-6 transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            <ArrowLeft className="w-4 h-4" />Retour aux catégories
          </button>
          <p className="text-body text-subtext-color">Catégorie introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-7xl mx-auto p-8">

        <button
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2 text-body text-brand-600 hover:text-brand-700 mb-6 transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <ArrowLeft className="w-4 h-4" />Retour aux catégories
        </button>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-brand-600 flex items-center justify-center text-white text-heading-2 font-bold flex-shrink-0">
                {category.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h1 className="text-heading-1 text-default-font">{category.name}</h1>
                  <span className="px-3 py-1 rounded-full text-caption-bold border bg-brand-50 text-brand-600 border-brand-200">
                    {category.level}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-brand-600" />
                  <span className="text-body text-subtext-color">{category.ageRange}</span>
                  <span className="text-subtext-color">·</span>
                  <span className="text-body text-subtext-color">Saison {category.season}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color">Effectif</div>
                <div className="text-body-bold text-default-font">{category.playerCount} joueurs</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-lg flex-shrink-0">
                <Shield className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color">Entraîneur</div>
                <div className="text-body-bold text-default-font">{category.coach}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-lg flex-shrink-0">
                <Calendar className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color">Saison</div>
                <div className="text-body-bold text-default-font">{category.season}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex border-b border-neutral-200 px-6 overflow-x-auto">
            {TABS.map(({ id, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative py-4 mr-6 text-body whitespace-nowrap border-none bg-transparent cursor-pointer transition-colors ${
                    active ? 'text-brand-600 font-semibold' : 'text-subtext-color hover:text-default-font'
                  }`}
                >
                  {label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-t" />}
                </button>
              );
            })}
          </div>

          {activeTab === 'statistiques' ? (
            <FoldersView />
          ) : (
            <div className="p-12 text-center">
              <p className="text-body text-subtext-color">
                {TABS.find(t => t.id === activeTab)?.label} — à venir
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
