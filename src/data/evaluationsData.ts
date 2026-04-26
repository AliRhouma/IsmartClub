// ============================================================
// EVALUATIONS DATA — Types, Constants & Sample Data (Neymar Jr.)
// ============================================================

// ── Types ────────────────────────────────────────────────────

export type GroupName =
  | 'Technique'
  | 'Intelligence Tactique'
  | 'Physique & Défensif'
  | 'Attaque & Collectif';

export type SessionType = 'Entraînement' | 'Tactique' | 'Préparation physique';

export type CriterionType = 'rating' | 'stat';

export interface Criterion {
  name: string;
  type: CriterionType;
  value: number;
  maxValue?: number; // For ratings, typically 100
}

export interface EvaluationGroup {
  group: GroupName;
  criteria: Criterion[];
}

export interface Evaluation {
  id: number;
  date: string;
  sessionName: string;
  sessionType: SessionType;
  coach: string;
  duration: number; // minutes
  groups: EvaluationGroup[];
  notes?: string;
}

// ── Constants ────────────────────────────────────────────────

export const GROUP_NAMES: GroupName[] = [
  'Technique',
  'Intelligence Tactique',
  'Physique & Défensif',
  'Attaque & Collectif',
];

export const GROUP_COLORS: Record<GroupName, string> = {
  'Technique': 'rgb(0, 145, 255)',
  'Intelligence Tactique': 'rgb(168, 85, 247)',
  'Physique & Défensif': 'rgb(239, 68, 68)',
  'Attaque & Collectif': 'rgb(245, 158, 11)',
};

export const GROUP_BG: Record<GroupName, string> = {
  'Technique': 'bg-brand-50',
  'Intelligence Tactique': 'bg-purple-950',
  'Physique & Défensif': 'bg-error-50',
  'Attaque & Collectif': 'bg-amber-950',
};

export const GROUP_TEXT: Record<GroupName, string> = {
  'Technique': 'text-brand-600',
  'Intelligence Tactique': 'text-purple-400',
  'Physique & Défensif': 'text-error-600',
  'Attaque & Collectif': 'text-amber-400',
};

// Criteria definitions per group
export const CRITERIA_BY_GROUP: Record<GroupName, { name: string; type: CriterionType }[]> = {
  'Technique': [
    { name: 'Contrôle du ballon', type: 'rating' },
    { name: 'Qualité des passes', type: 'rating' },
    { name: 'Finition', type: 'rating' },
    { name: 'Tirs', type: 'stat' },
    { name: 'Passes réussies', type: 'stat' },
  ],
  'Intelligence Tactique': [
    { name: 'Positionnement', type: 'rating' },
    { name: 'Prise de décision', type: 'rating' },
    { name: 'Vision du jeu', type: 'rating' },
    { name: 'Passes clés', type: 'stat' },
    { name: 'Courses sans ballon', type: 'stat' },
  ],
  'Physique & Défensif': [
    { name: 'Vitesse', type: 'rating' },
    { name: 'Endurance', type: 'rating' },
    { name: 'Positionnement défensif', type: 'rating' },
    { name: 'Tacles', type: 'stat' },
    { name: 'Interceptions', type: 'stat' },
  ],
  'Attaque & Collectif': [
    { name: 'Créativité', type: 'rating' },
    { name: 'Travail d\'équipe', type: 'rating' },
    { name: 'Communication', type: 'rating' },
    { name: 'Buts', type: 'stat' },
    { name: 'Passes décisives', type: 'stat' },
  ],
};

// ── Helper Functions ─────────────────────────────────────────

export function getGroupRatingAvg(group: EvaluationGroup): number {
  const ratings = group.criteria.filter(c => c.type === 'rating');
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, c) => acc + c.value, 0);
  return Math.round(sum / ratings.length);
}

export function getGroupStatTotal(group: EvaluationGroup): Record<string, number> {
  const stats = group.criteria.filter(c => c.type === 'stat');
  return stats.reduce((acc, c) => {
    acc[c.name] = c.value;
    return acc;
  }, {} as Record<string, number>);
}

export function getOverallScore(evaluation: Evaluation): number {
  const groupAvgs = evaluation.groups.map(g => getGroupRatingAvg(g));
  return Math.round(groupAvgs.reduce((a, b) => a + b, 0) / groupAvgs.length);
}

export function getAllRatingCriteria(evaluation: Evaluation): { group: GroupName; name: string; value: number }[] {
  const result: { group: GroupName; name: string; value: number }[] = [];
  for (const g of evaluation.groups) {
    for (const c of g.criteria) {
      if (c.type === 'rating') {
        result.push({ group: g.group, name: c.name, value: c.value });
      }
    }
  }
  return result;
}

export function getAllStatCriteria(evaluation: Evaluation): { group: GroupName; name: string; value: number }[] {
  const result: { group: GroupName; name: string; value: number }[] = [];
  for (const g of evaluation.groups) {
    for (const c of g.criteria) {
      if (c.type === 'stat') {
        result.push({ group: g.group, name: c.name, value: c.value });
      }
    }
  }
  return result;
}

// ── Player Info ──────────────────────────────────────────────

export const PLAYER_INFO = {
  name: 'Neymar Jr.',
  position: 'Attaquant',
  number: 10,
  team: 'Al-Hilal SFC',
};

// ── Sample Data: Neymar's 15 Training Sessions ───────────────

export const evaluations: Evaluation[] = [
  {
    id: 1,
    date: '05/01/2025',
    sessionName: 'Reprise post-trêve',
    sessionType: 'Entraînement',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 92 },
          { name: 'Qualité des passes', type: 'rating', value: 88 },
          { name: 'Finition', type: 'rating', value: 85 },
          { name: 'Tirs', type: 'stat', value: 8 },
          { name: 'Passes réussies', type: 'stat', value: 42 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 78 },
          { name: 'Prise de décision', type: 'rating', value: 86 },
          { name: 'Vision du jeu', type: 'rating', value: 90 },
          { name: 'Passes clés', type: 'stat', value: 5 },
          { name: 'Courses sans ballon', type: 'stat', value: 12 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 75 },
          { name: 'Endurance', type: 'rating', value: 68 },
          { name: 'Positionnement défensif', type: 'rating', value: 62 },
          { name: 'Tacles', type: 'stat', value: 1 },
          { name: 'Interceptions', type: 'stat', value: 2 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 94 },
          { name: 'Travail d\'équipe', type: 'rating', value: 82 },
          { name: 'Communication', type: 'rating', value: 78 },
          { name: 'Buts', type: 'stat', value: 2 },
          { name: 'Passes décisives', type: 'stat', value: 3 },
        ],
      },
    ],
  },
  {
    id: 2,
    date: '08/01/2025',
    sessionName: 'Travail technique',
    sessionType: 'Entraînement',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 89 },
          { name: 'Qualité des passes', type: 'rating', value: 85 },
          { name: 'Finition', type: 'rating', value: 82 },
          { name: 'Tirs', type: 'stat', value: 6 },
          { name: 'Passes réussies', type: 'stat', value: 38 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 80 },
          { name: 'Prise de décision', type: 'rating', value: 83 },
          { name: 'Vision du jeu', type: 'rating', value: 88 },
          { name: 'Passes clés', type: 'stat', value: 4 },
          { name: 'Courses sans ballon', type: 'stat', value: 10 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 77 },
          { name: 'Endurance', type: 'rating', value: 70 },
          { name: 'Positionnement défensif', type: 'rating', value: 65 },
          { name: 'Tacles', type: 'stat', value: 2 },
          { name: 'Interceptions', type: 'stat', value: 1 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 92 },
          { name: 'Travail d\'équipe', type: 'rating', value: 80 },
          { name: 'Communication', type: 'rating', value: 76 },
          { name: 'Buts', type: 'stat', value: 1 },
          { name: 'Passes décisives', type: 'stat', value: 2 },
        ],
      },
    ],
  },
  {
    id: 3,
    date: '12/01/2025',
    sessionName: 'Schémas offensifs',
    sessionType: 'Tactique',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 94 },
          { name: 'Qualité des passes', type: 'rating', value: 87 },
          { name: 'Finition', type: 'rating', value: 88 },
          { name: 'Tirs', type: 'stat', value: 10 },
          { name: 'Passes réussies', type: 'stat', value: 45 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 82 },
          { name: 'Prise de décision', type: 'rating', value: 85 },
          { name: 'Vision du jeu', type: 'rating', value: 91 },
          { name: 'Passes clés', type: 'stat', value: 6 },
          { name: 'Courses sans ballon', type: 'stat', value: 14 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 76 },
          { name: 'Endurance', type: 'rating', value: 69 },
          { name: 'Positionnement défensif', type: 'rating', value: 64 },
          { name: 'Tacles', type: 'stat', value: 1 },
          { name: 'Interceptions', type: 'stat', value: 3 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 95 },
          { name: 'Travail d\'équipe', type: 'rating', value: 84 },
          { name: 'Communication', type: 'rating', value: 80 },
          { name: 'Buts', type: 'stat', value: 3 },
          { name: 'Passes décisives', type: 'stat', value: 4 },
        ],
      },
    ],
  },
  {
    id: 4,
    date: '15/01/2025',
    sessionName: 'Endurance & récupération',
    sessionType: 'Préparation physique',
    coach: 'Coach Miguel',
    duration: 75,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 91 },
          { name: 'Qualité des passes', type: 'rating', value: 90 },
          { name: 'Finition', type: 'rating', value: 86 },
          { name: 'Tirs', type: 'stat', value: 7 },
          { name: 'Passes réussies', type: 'stat', value: 51 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 79 },
          { name: 'Prise de décision', type: 'rating', value: 88 },
          { name: 'Vision du jeu', type: 'rating', value: 89 },
          { name: 'Passes clés', type: 'stat', value: 7 },
          { name: 'Courses sans ballon', type: 'stat', value: 11 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 78 },
          { name: 'Endurance', type: 'rating', value: 72 },
          { name: 'Positionnement défensif', type: 'rating', value: 67 },
          { name: 'Tacles', type: 'stat', value: 3 },
          { name: 'Interceptions', type: 'stat', value: 2 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 93 },
          { name: 'Travail d\'équipe', type: 'rating', value: 85 },
          { name: 'Communication', type: 'rating', value: 79 },
          { name: 'Buts', type: 'stat', value: 2 },
          { name: 'Passes décisives', type: 'stat', value: 3 },
        ],
      },
    ],
  },
  {
    id: 5,
    date: '19/01/2025',
    sessionName: 'Match amical interne',
    sessionType: 'Entraînement',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 93 },
          { name: 'Qualité des passes', type: 'rating', value: 86 },
          { name: 'Finition', type: 'rating', value: 79 },
          { name: 'Tirs', type: 'stat', value: 9 },
          { name: 'Passes réussies', type: 'stat', value: 39 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 83 },
          { name: 'Prise de décision', type: 'rating', value: 82 },
          { name: 'Vision du jeu', type: 'rating', value: 92 },
          { name: 'Passes clés', type: 'stat', value: 5 },
          { name: 'Courses sans ballon', type: 'stat', value: 13 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 80 },
          { name: 'Endurance', type: 'rating', value: 71 },
          { name: 'Positionnement défensif', type: 'rating', value: 66 },
          { name: 'Tacles', type: 'stat', value: 2 },
          { name: 'Interceptions', type: 'stat', value: 2 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 96 },
          { name: 'Travail d\'équipe', type: 'rating', value: 83 },
          { name: 'Communication', type: 'rating', value: 81 },
          { name: 'Buts', type: 'stat', value: 1 },
          { name: 'Passes décisives', type: 'stat', value: 5 },
        ],
      },
    ],
  },
  {
    id: 6,
    date: '22/01/2025',
    sessionName: 'Pressing & transitions',
    sessionType: 'Tactique',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 90 },
          { name: 'Qualité des passes', type: 'rating', value: 89 },
          { name: 'Finition', type: 'rating', value: 87 },
          { name: 'Tirs', type: 'stat', value: 5 },
          { name: 'Passes réussies', type: 'stat', value: 47 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 85 },
          { name: 'Prise de décision', type: 'rating', value: 87 },
          { name: 'Vision du jeu', type: 'rating', value: 90 },
          { name: 'Passes clés', type: 'stat', value: 8 },
          { name: 'Courses sans ballon', type: 'stat', value: 15 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 79 },
          { name: 'Endurance', type: 'rating', value: 74 },
          { name: 'Positionnement défensif', type: 'rating', value: 68 },
          { name: 'Tacles', type: 'stat', value: 2 },
          { name: 'Interceptions', type: 'stat', value: 3 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 94 },
          { name: 'Travail d\'équipe', type: 'rating', value: 86 },
          { name: 'Communication', type: 'rating', value: 83 },
          { name: 'Buts', type: 'stat', value: 2 },
          { name: 'Passes décisives', type: 'stat', value: 4 },
        ],
      },
    ],
  },
  {
    id: 7,
    date: '26/01/2025',
    sessionName: 'Jeu de position',
    sessionType: 'Tactique',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 95 },
          { name: 'Qualité des passes', type: 'rating', value: 91 },
          { name: 'Finition', type: 'rating', value: 90 },
          { name: 'Tirs', type: 'stat', value: 11 },
          { name: 'Passes réussies', type: 'stat', value: 53 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 81 },
          { name: 'Prise de décision', type: 'rating', value: 89 },
          { name: 'Vision du jeu', type: 'rating', value: 93 },
          { name: 'Passes clés', type: 'stat', value: 6 },
          { name: 'Courses sans ballon', type: 'stat', value: 12 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 81 },
          { name: 'Endurance', type: 'rating', value: 73 },
          { name: 'Positionnement défensif', type: 'rating', value: 70 },
          { name: 'Tacles', type: 'stat', value: 3 },
          { name: 'Interceptions', type: 'stat', value: 4 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 97 },
          { name: 'Travail d\'équipe', type: 'rating', value: 88 },
          { name: 'Communication', type: 'rating', value: 85 },
          { name: 'Buts', type: 'stat', value: 4 },
          { name: 'Passes décisives', type: 'stat', value: 6 },
        ],
      },
    ],
  },
  {
    id: 8,
    date: '29/01/2025',
    sessionName: 'Récupération active',
    sessionType: 'Préparation physique',
    coach: 'Coach Miguel',
    duration: 60,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 88 },
          { name: 'Qualité des passes', type: 'rating', value: 87 },
          { name: 'Finition', type: 'rating', value: 84 },
          { name: 'Tirs', type: 'stat', value: 8 },
          { name: 'Passes réussies', type: 'stat', value: 44 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 84 },
          { name: 'Prise de décision', type: 'rating', value: 85 },
          { name: 'Vision du jeu', type: 'rating', value: 91 },
          { name: 'Passes clés', type: 'stat', value: 7 },
          { name: 'Courses sans ballon', type: 'stat', value: 16 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 78 },
          { name: 'Endurance', type: 'rating', value: 75 },
          { name: 'Positionnement défensif', type: 'rating', value: 69 },
          { name: 'Tacles', type: 'stat', value: 2 },
          { name: 'Interceptions', type: 'stat', value: 3 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 95 },
          { name: 'Travail d\'équipe', type: 'rating', value: 85 },
          { name: 'Communication', type: 'rating', value: 82 },
          { name: 'Buts', type: 'stat', value: 2 },
          { name: 'Passes décisives', type: 'stat', value: 4 },
        ],
      },
    ],
  },
  {
    id: 9,
    date: '02/02/2025',
    sessionName: 'Intensité match',
    sessionType: 'Entraînement',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 92 },
          { name: 'Qualité des passes', type: 'rating', value: 88 },
          { name: 'Finition', type: 'rating', value: 86 },
          { name: 'Tirs', type: 'stat', value: 7 },
          { name: 'Passes réussies', type: 'stat', value: 48 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 86 },
          { name: 'Prise de décision', type: 'rating', value: 90 },
          { name: 'Vision du jeu', type: 'rating', value: 94 },
          { name: 'Passes clés', type: 'stat', value: 9 },
          { name: 'Courses sans ballon', type: 'stat', value: 14 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 82 },
          { name: 'Endurance', type: 'rating', value: 76 },
          { name: 'Positionnement défensif', type: 'rating', value: 71 },
          { name: 'Tacles', type: 'stat', value: 4 },
          { name: 'Interceptions', type: 'stat', value: 3 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 96 },
          { name: 'Travail d\'équipe', type: 'rating', value: 87 },
          { name: 'Communication', type: 'rating', value: 86 },
          { name: 'Buts', type: 'stat', value: 3 },
          { name: 'Passes décisives', type: 'stat', value: 5 },
        ],
      },
    ],
  },
  {
    id: 10,
    date: '05/02/2025',
    sessionName: 'Finition & frappes',
    sessionType: 'Entraînement',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 94 },
          { name: 'Qualité des passes', type: 'rating', value: 92 },
          { name: 'Finition', type: 'rating', value: 89 },
          { name: 'Tirs', type: 'stat', value: 12 },
          { name: 'Passes réussies', type: 'stat', value: 55 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 85 },
          { name: 'Prise de décision', type: 'rating', value: 88 },
          { name: 'Vision du jeu', type: 'rating', value: 92 },
          { name: 'Passes clés', type: 'stat', value: 8 },
          { name: 'Courses sans ballon', type: 'stat', value: 17 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 80 },
          { name: 'Endurance', type: 'rating', value: 78 },
          { name: 'Positionnement défensif', type: 'rating', value: 72 },
          { name: 'Tacles', type: 'stat', value: 3 },
          { name: 'Interceptions', type: 'stat', value: 4 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 98 },
          { name: 'Travail d\'équipe', type: 'rating', value: 89 },
          { name: 'Communication', type: 'rating', value: 85 },
          { name: 'Buts', type: 'stat', value: 3 },
          { name: 'Passes décisives', type: 'stat', value: 7 },
        ],
      },
    ],
  },
  {
    id: 11,
    date: '09/02/2025',
    sessionName: 'Circuit physique',
    sessionType: 'Préparation physique',
    coach: 'Coach Miguel',
    duration: 75,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 91 },
          { name: 'Qualité des passes', type: 'rating', value: 89 },
          { name: 'Finition', type: 'rating', value: 85 },
          { name: 'Tirs', type: 'stat', value: 9 },
          { name: 'Passes réussies', type: 'stat', value: 49 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 87 },
          { name: 'Prise de décision', type: 'rating', value: 91 },
          { name: 'Vision du jeu', type: 'rating', value: 95 },
          { name: 'Passes clés', type: 'stat', value: 7 },
          { name: 'Courses sans ballon', type: 'stat', value: 15 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 83 },
          { name: 'Endurance', type: 'rating', value: 77 },
          { name: 'Positionnement défensif', type: 'rating', value: 73 },
          { name: 'Tacles', type: 'stat', value: 3 },
          { name: 'Interceptions', type: 'stat', value: 5 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 95 },
          { name: 'Travail d\'équipe', type: 'rating', value: 88 },
          { name: 'Communication', type: 'rating', value: 87 },
          { name: 'Buts', type: 'stat', value: 2 },
          { name: 'Passes décisives', type: 'stat', value: 5 },
        ],
      },
    ],
  },
  {
    id: 12,
    date: '12/02/2025',
    sessionName: 'Combinaisons offensives',
    sessionType: 'Tactique',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 93 },
          { name: 'Qualité des passes', type: 'rating', value: 90 },
          { name: 'Finition', type: 'rating', value: 88 },
          { name: 'Tirs', type: 'stat', value: 10 },
          { name: 'Passes réussies', type: 'stat', value: 52 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 88 },
          { name: 'Prise de décision', type: 'rating', value: 87 },
          { name: 'Vision du jeu', type: 'rating', value: 93 },
          { name: 'Passes clés', type: 'stat', value: 10 },
          { name: 'Courses sans ballon', type: 'stat', value: 18 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 81 },
          { name: 'Endurance', type: 'rating', value: 79 },
          { name: 'Positionnement défensif', type: 'rating', value: 74 },
          { name: 'Tacles', type: 'stat', value: 4 },
          { name: 'Interceptions', type: 'stat', value: 4 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 97 },
          { name: 'Travail d\'équipe', type: 'rating', value: 90 },
          { name: 'Communication', type: 'rating', value: 88 },
          { name: 'Buts', type: 'stat', value: 4 },
          { name: 'Passes décisives', type: 'stat', value: 6 },
        ],
      },
    ],
  },
  {
    id: 13,
    date: '16/02/2025',
    sessionName: 'Préparation derby',
    sessionType: 'Tactique',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 96 },
          { name: 'Qualité des passes', type: 'rating', value: 93 },
          { name: 'Finition', type: 'rating', value: 91 },
          { name: 'Tirs', type: 'stat', value: 8 },
          { name: 'Passes réussies', type: 'stat', value: 58 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 86 },
          { name: 'Prise de décision', type: 'rating', value: 92 },
          { name: 'Vision du jeu', type: 'rating', value: 96 },
          { name: 'Passes clés', type: 'stat', value: 8 },
          { name: 'Courses sans ballon', type: 'stat', value: 16 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 84 },
          { name: 'Endurance', type: 'rating', value: 80 },
          { name: 'Positionnement défensif', type: 'rating', value: 75 },
          { name: 'Tacles', type: 'stat', value: 3 },
          { name: 'Interceptions', type: 'stat', value: 5 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 96 },
          { name: 'Travail d\'équipe', type: 'rating', value: 91 },
          { name: 'Communication', type: 'rating', value: 89 },
          { name: 'Buts', type: 'stat', value: 3 },
          { name: 'Passes décisives', type: 'stat', value: 8 },
        ],
      },
    ],
  },
  {
    id: 14,
    date: '19/02/2025',
    sessionName: 'Régénération',
    sessionType: 'Préparation physique',
    coach: 'Coach Miguel',
    duration: 60,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 94 },
          { name: 'Qualité des passes', type: 'rating', value: 91 },
          { name: 'Finition', type: 'rating', value: 87 },
          { name: 'Tirs', type: 'stat', value: 11 },
          { name: 'Passes réussies', type: 'stat', value: 54 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 89 },
          { name: 'Prise de décision', type: 'rating', value: 90 },
          { name: 'Vision du jeu', type: 'rating', value: 94 },
          { name: 'Passes clés', type: 'stat', value: 9 },
          { name: 'Courses sans ballon', type: 'stat', value: 19 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 85 },
          { name: 'Endurance', type: 'rating', value: 82 },
          { name: 'Positionnement défensif', type: 'rating', value: 76 },
          { name: 'Tacles', type: 'stat', value: 4 },
          { name: 'Interceptions', type: 'stat', value: 6 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 98 },
          { name: 'Travail d\'équipe', type: 'rating', value: 89 },
          { name: 'Communication', type: 'rating', value: 90 },
          { name: 'Buts', type: 'stat', value: 5 },
          { name: 'Passes décisives', type: 'stat', value: 7 },
        ],
      },
    ],
  },
  {
    id: 15,
    date: '23/02/2025',
    sessionName: 'Dernier entraînement',
    sessionType: 'Entraînement',
    coach: 'Coach Jorge',
    duration: 90,
    groups: [
      {
        group: 'Technique',
        criteria: [
          { name: 'Contrôle du ballon', type: 'rating', value: 95 },
          { name: 'Qualité des passes', type: 'rating', value: 94 },
          { name: 'Finition', type: 'rating', value: 92 },
          { name: 'Tirs', type: 'stat', value: 13 },
          { name: 'Passes réussies', type: 'stat', value: 61 },
        ],
      },
      {
        group: 'Intelligence Tactique',
        criteria: [
          { name: 'Positionnement', type: 'rating', value: 90 },
          { name: 'Prise de décision', type: 'rating', value: 93 },
          { name: 'Vision du jeu', type: 'rating', value: 97 },
          { name: 'Passes clés', type: 'stat', value: 11 },
          { name: 'Courses sans ballon', type: 'stat', value: 20 },
        ],
      },
      {
        group: 'Physique & Défensif',
        criteria: [
          { name: 'Vitesse', type: 'rating', value: 86 },
          { name: 'Endurance', type: 'rating', value: 84 },
          { name: 'Positionnement défensif', type: 'rating', value: 78 },
          { name: 'Tacles', type: 'stat', value: 5 },
          { name: 'Interceptions', type: 'stat', value: 5 },
        ],
      },
      {
        group: 'Attaque & Collectif',
        criteria: [
          { name: 'Créativité', type: 'rating', value: 99 },
          { name: 'Travail d\'équipe', type: 'rating', value: 92 },
          { name: 'Communication', type: 'rating', value: 91 },
          { name: 'Buts', type: 'stat', value: 4 },
          { name: 'Passes décisives', type: 'stat', value: 9 },
        ],
      },
    ],
  },
];

// ── Computed Helpers ─────────────────────────────────────────

export function getEvaluationsByDateRange(
  evals: Evaluation[],
  days: number | 'all'
): Evaluation[] {
  if (days === 'all') return evals;
  
  // Simple filter based on index for demo (in real app, use actual dates)
  const cutoff = Math.max(0, evals.length - Math.ceil(days / 3));
  return evals.slice(cutoff);
}

export function getCriteriaAvgAcrossSessions(
  evals: Evaluation[],
  criteriaName: string
): number {
  let sum = 0;
  let count = 0;
  for (const ev of evals) {
    for (const g of ev.groups) {
      const c = g.criteria.find(cr => cr.name === criteriaName);
      if (c) {
        sum += c.value;
        count++;
      }
    }
  }
  return count > 0 ? Math.round(sum / count) : 0;
}

export function getCriteriaTrend(
  evals: Evaluation[],
  criteriaName: string
): number {
  if (evals.length < 4) return 0;
  
  const first3: number[] = [];
  const last3: number[] = [];
  
  for (let i = 0; i < 3; i++) {
    for (const g of evals[i].groups) {
      const c = g.criteria.find(cr => cr.name === criteriaName);
      if (c) first3.push(c.value);
    }
  }
  
  for (let i = evals.length - 3; i < evals.length; i++) {
    for (const g of evals[i].groups) {
      const c = g.criteria.find(cr => cr.name === criteriaName);
      if (c) last3.push(c.value);
    }
  }
  
  const first3Avg = first3.reduce((a, b) => a + b, 0) / first3.length;
  const last3Avg = last3.reduce((a, b) => a + b, 0) / last3.length;
  
  return Math.round(last3Avg - first3Avg);
}

export function getWeekComparison(evals: Evaluation[]): {
  thisWeek: Record<GroupName, number>;
  lastWeek: Record<GroupName, number>;
  diff: Record<GroupName, number>;
} {
  // Assume last 3 sessions = this week, previous 3 = last week
  const thisWeekEvals = evals.slice(-3);
  const lastWeekEvals = evals.slice(-6, -3);
  
  const result = {
    thisWeek: {} as Record<GroupName, number>,
    lastWeek: {} as Record<GroupName, number>,
    diff: {} as Record<GroupName, number>,
  };
  
  for (const gn of GROUP_NAMES) {
    // This week avg
    const twVals = thisWeekEvals.map(e => {
      const g = e.groups.find(gr => gr.group === gn);
      return g ? getGroupRatingAvg(g) : 0;
    });
    result.thisWeek[gn] = Math.round(twVals.reduce((a, b) => a + b, 0) / twVals.length);
    
    // Last week avg
    const lwVals = lastWeekEvals.map(e => {
      const g = e.groups.find(gr => gr.group === gn);
      return g ? getGroupRatingAvg(g) : 0;
    });
    result.lastWeek[gn] = Math.round(lwVals.reduce((a, b) => a + b, 0) / lwVals.length);
    
    result.diff[gn] = result.thisWeek[gn] - result.lastWeek[gn];
  }
  
  return result;
}

export function getTopAndBottomCriteria(
  evals: Evaluation[],
  groups: GroupName[],
  count: number = 3
): { top: { name: string; value: number; trend: number }[]; bottom: { name: string; value: number; trend: number }[] } {
  const criteriaList: { name: string; value: number; trend: number }[] = [];
  
  for (const gn of groups) {
    const criteriaNames = CRITERIA_BY_GROUP[gn]
      .filter(c => c.type === 'rating')
      .map(c => c.name);
    
    for (const name of criteriaNames) {
      criteriaList.push({
        name,
        value: getCriteriaAvgAcrossSessions(evals, name),
        trend: getCriteriaTrend(evals, name),
      });
    }
  }
  
  const sorted = [...criteriaList].sort((a, b) => b.value - a.value);
  
  return {
    top: sorted.slice(0, count),
    bottom: sorted.slice(-count).reverse(),
  };
}

export function getAllStatsTotal(
  evals: Evaluation[],
  groups: GroupName[]
): Record<string, { total: number; perSession: number }> {
  const result: Record<string, { total: number; perSession: number }> = {};
  
  for (const gn of groups) {
    const statNames = CRITERIA_BY_GROUP[gn]
      .filter(c => c.type === 'stat')
      .map(c => c.name);
    
    for (const statName of statNames) {
      let total = 0;
      for (const ev of evals) {
        for (const g of ev.groups) {
          const c = g.criteria.find(cr => cr.name === statName);
          if (c) total += c.value;
        }
      }
      result[statName] = {
        total,
        perSession: Math.round((total / evals.length) * 10) / 10,
      };
    }
  }
  
  return result;
}