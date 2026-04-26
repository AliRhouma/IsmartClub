export interface GraphChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
  chartType?: 'radar' | 'bar' | 'line' | 'heatmap';
  chartLabel?: string;
}

export interface GraphConversation {
  id: string;
  messages: GraphChatMessage[];
}

export interface FolderGraph {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  chartType: 'radar' | 'bar' | 'line' | 'heatmap';
  conversationId: string;
}

export interface StatsFolder {
  id: string;
  name: string;
  graphCount: number;
  createdAt: string;
  graphs: FolderGraph[];
}

export const GRAPH_CONVERSATIONS: Record<string, GraphConversation> = {
  'conv-off-1': {
    id: 'conv-off-1',
    messages: [
      { id: 'm1', role: 'user', text: 'Compare les stats offensives de Mbappé et Bellingham cette saison en radar', time: '14:22' },
      { id: 'm2', role: 'ai', text: "Voici le radar comparatif. Mbappé domine sur les Buts (8) et Tirs (22), tandis que Bellingham excelle en Passes décisives (6) et Distance parcourue (58.3 km).", time: '14:22', chartType: 'radar', chartLabel: 'Mbappé vs Bellingham — Radar offensif' },
    ],
  },
  'conv-off-2': {
    id: 'conv-off-2',
    messages: [
      { id: 'm1', role: 'user', text: 'Montre-moi les buts par match de Mbappé sur les 10 derniers matchs', time: '15:05' },
      { id: 'm2', role: 'ai', text: "Voici l'évolution des buts de Mbappé. On observe un pic au match 7 avec un doublé, et une régularité impressionnante avec au moins 1 but dans 7 matchs sur 10.", time: '15:05', chartType: 'bar', chartLabel: 'Buts par match — Mbappé' },
    ],
  },
  'conv-off-3': {
    id: 'conv-off-3',
    messages: [
      { id: 'm1', role: 'user', text: "Évolution des buts et passes décisives de l'équipe sur les 8 derniers matchs", time: '16:30' },
      { id: 'm2', role: 'ai', text: "Voici l'évolution. La tendance est clairement positive avec une accélération offensive depuis le match 5. Le pic de passes décisives au match 6 coïncide avec le retour de Bellingham.", time: '16:30', chartType: 'line', chartLabel: 'Buts & PD — Évolution équipe' },
    ],
  },
  'conv-phys-1': {
    id: 'conv-phys-1',
    messages: [
      { id: 'm1', role: 'user', text: 'Évolution de la distance parcourue et des sprints pour les milieux de terrain', time: '10:15' },
      { id: 'm2', role: 'ai', text: "Voici les courbes d'évolution. Camavinga et Valverde montrent une progression constante de la distance parcourue, avec un léger fléchissement au match 6 qui pourrait indiquer de la fatigue.", time: '10:15', chartType: 'line', chartLabel: 'Distance & Sprints — Milieux' },
    ],
  },
  'conv-phys-2': {
    id: 'conv-phys-2',
    messages: [
      { id: 'm1', role: 'user', text: 'Heatmap de disponibilité des joueurs sur les 10 derniers matchs', time: '11:40' },
      { id: 'm2', role: 'ai', text: "Voici la carte de disponibilité. Courtois et Mbappé sont les plus réguliers avec 9 titularisations sur 10. Rüdiger a manqué 2 matchs pour suspension.", time: '11:40', chartType: 'heatmap', chartLabel: 'Disponibilité — Tous joueurs' },
    ],
  },
  'conv-disc-1': {
    id: 'conv-disc-1',
    messages: [
      { id: 'm1', role: 'user', text: 'Montre-moi les cartons jaunes et rouges par joueur cette saison', time: '09:00' },
      { id: 'm2', role: 'ai', text: "Voici le classement disciplinaire. Rüdiger est en tête avec 4 cartons jaunes sur 5 — attention au risque de suspension. Camavinga suit avec 3 cartons jaunes.", time: '09:00', chartType: 'bar', chartLabel: 'Cartons par joueur — Discipline' },
    ],
  },
  'conv-new': {
    id: 'conv-new',
    messages: [
      {
        id: 'n1',
        role: 'user',
        text: 'Je veux comparer les performances offensives de Mbappé et Bellingham sur les 5 derniers matchs',
        time: '17:01',
      },
      {
        id: 'n2',
        role: 'ai',
        text: "Parfait ! Pour cette comparaison, je vous propose d'inclure : Buts, Passes décisives, Tirs cadrés, xG, et Distance parcourue.\n\nQuel type de graphique préférez-vous ? Je recommande un Radar pour une vue multi-métriques, mais je peux aussi faire des Barres groupées ou des Lignes.",
        time: '17:01',
      },
      {
        id: 'n3',
        role: 'user',
        text: 'Radar avec buts, passes décisives, dribbles réussis, tirs et distance parcourue',
        time: '17:02',
      },
      {
        id: 'n4',
        role: 'ai',
        text: "Voici le radar comparatif sur les 5 derniers matchs.\n\nMbappé domine nettement sur les Buts (8) et les Tirs (22), tandis que Bellingham excelle en Passes décisives (6) et Distance parcourue (58.3 km). Les dribbles réussis sont équilibrés (12 vs 10).",
        time: '17:02',
        chartType: 'radar',
        chartLabel: 'Mbappé vs Bellingham — Radar offensif',
      },
      {
        id: 'n5',
        role: 'user',
        text: 'Parfait ! Ajoute aussi Vinícius au radar',
        time: '17:03',
      },
      {
        id: 'n6',
        role: 'ai',
        text: "Vinícius Jr complète le trio avec un profil axé sur les dribbles (23 réussis, meilleur des trois) et une vitesse de pointe impressionnante.\n\nSon rendement en buts (4) reste en retrait mais ses passes décisives (5) rivalisent avec Bellingham.",
        time: '17:03',
        chartType: 'radar',
        chartLabel: 'Mbappé vs Bellingham vs Vinícius — Radar offensif',
      },
    ],
  },
};

export const DEMO_FOLDERS: StatsFolder[] = [
  {
    id: 'folder-1',
    name: 'Analyse offensive',
    graphCount: 3,
    createdAt: '12 mars 2026',
    graphs: [
      { id: 'g1', title: 'Mbappé vs Bellingham — Radar offensif', subtitle: '5 derniers matchs', date: '12 mars', chartType: 'radar', conversationId: 'conv-off-1' },
      { id: 'g2', title: 'Buts par match — Mbappé', subtitle: '10 derniers matchs', date: '14 mars', chartType: 'bar', conversationId: 'conv-off-2' },
      { id: 'g3', title: 'Buts & PD — Évolution équipe', subtitle: '8 derniers matchs', date: '18 mars', chartType: 'line', conversationId: 'conv-off-3' },
    ],
  },
  {
    id: 'folder-2',
    name: 'Performance physique',
    graphCount: 2,
    createdAt: '28 fév 2026',
    graphs: [
      { id: 'g4', title: 'Distance & Sprints — Milieux', subtitle: 'Camavinga, Valverde, Bellingham', date: '28 fév', chartType: 'line', conversationId: 'conv-phys-1' },
      { id: 'g5', title: 'Disponibilité — Tous joueurs', subtitle: '10 derniers matchs', date: '3 mars', chartType: 'heatmap', conversationId: 'conv-phys-2' },
    ],
  },
  {
    id: 'folder-3',
    name: 'Discipline & cartons',
    graphCount: 1,
    createdAt: '5 avr 2026',
    graphs: [
      { id: 'g6', title: 'Cartons par joueur — Discipline', subtitle: 'Saison 2025/2026', date: '5 avr', chartType: 'bar', conversationId: 'conv-disc-1' },
    ],
  },
];

export const NEW_GRAPH_CONVERSATION_ID = 'conv-new';
