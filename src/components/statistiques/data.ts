export const C = {
  bg:         'rgb(19,19,19)',
  card:       'rgb(24,24,24)',
  card2:      'rgb(36,36,36)',
  border:     'rgb(37,37,37)',
  border2:    'rgb(48,48,48)',
  n300:       'rgb(82,82,82)',
  n400:       'rgb(115,115,115)',
  sub:        'rgb(163,163,163)',
  text:       'rgb(250,250,250)',
  white:      'rgb(255,255,255)',
  brand50:    'rgb(16,36,62)',
  brand:      'rgb(0,145,255)',
  brand700:   'rgb(54,158,255)',
  ok50:       'rgb(19,40,25)',
  ok100:      'rgb(22,48,29)',
  ok:         'rgb(70,167,88)',
  err50:      'rgb(60,24,26)',
  err:        'rgb(229,72,77)',
  warn50:     'rgb(8,38,54)',
  warn:       'rgb(104,221,253)',
  orange:     'rgb(255,106,0)',
  orange50:   'rgb(70,40,19)',
  purple:     'rgb(127,119,221)',
  purpleDark: 'rgb(83,74,183)',
};

export const PLAYERS = [
  { id: 'mbp', name: 'Kylian Mbappé',      initials: 'KM', pos: 'Attaquant',    color: 'rgb(0,145,255)'   },
  { id: 'bel', name: 'Jude Bellingham',     initials: 'JB', pos: 'Milieu',       color: 'rgb(70,167,88)'   },
  { id: 'rud', name: 'Antonio Rüdiger',     initials: 'AR', pos: 'Défenseur',    color: 'rgb(229,72,77)'   },
  { id: 'sma', name: 'Abdelmalek Smaili',   initials: 'AS', pos: 'Lat. gauche',  color: 'rgb(104,221,253)' },
  { id: 'cam', name: 'Eduardo Camavinga',   initials: 'EC', pos: 'Milieu',       color: 'rgb(255,106,0)'   },
  { id: 'val', name: 'Federico Valverde',   initials: 'FV', pos: 'Milieu',       color: 'rgb(127,119,221)' },
  { id: 'vin', name: 'Vinícius Júnior',     initials: 'VJ', pos: 'Ailier',       color: 'rgb(251,191,36)'  },
  { id: 'cou', name: 'Thibaut Courtois',    initials: 'TC', pos: 'Gardien',      color: 'rgb(85,180,103)'  },
];

export const METRICS = [
  { id: 'goals',      label: 'Buts',                  category: 'Offensif'   },
  { id: 'assists',    label: 'Passes décisives',      category: 'Offensif'   },
  { id: 'ga90',       label: 'B+PD / 90 min',         category: 'Offensif'   },
  { id: 'shots',      label: 'Tirs',                  category: 'Offensif'   },
  { id: 'xg',         label: 'xG (Buts attendus)',    category: 'Offensif'   },
  { id: 'minutes',    label: 'Minutes jouées',        category: 'Activité'   },
  { id: 'starts',     label: 'Titularisations',       category: 'Activité'   },
  { id: 'avail',      label: 'Disponibilité %',       category: 'Activité'   },
  { id: 'distance',   label: 'Distance parcourue',    category: 'Physique'   },
  { id: 'sprints',    label: 'Sprints',               category: 'Physique'   },
  { id: 'yc',         label: 'Cartons jaunes',        category: 'Discipline' },
  { id: 'rc',         label: 'Cartons rouges',        category: 'Discipline' },
  { id: 'fouls',      label: 'Fautes commises',       category: 'Discipline' },
  { id: 'rating',     label: 'Note moyenne',          category: 'Global'     },
  { id: 'aerials',    label: 'Duels aériens gagnés',  category: 'Défensif'   },
  { id: 'tackles',    label: 'Tacles réussis',        category: 'Défensif'   },
  { id: 'intercept',  label: 'Interceptions',         category: 'Défensif'   },
  { id: 'cleansheet', label: 'Clean sheets',          category: 'Défensif'   },
];

export const CHART_TYPES = [
  { id: 'radar',     label: 'Radar',           icon: '\u25C8',  bestFor: 'Comparaison multi-métriques'   },
  { id: 'bar',       label: 'Barres',          icon: '\u25AE\u25AE', bestFor: 'Classement / totaux'           },
  { id: 'line',      label: 'Lignes',          icon: '\u2571\u2572', bestFor: 'Évolution dans le temps'       },
  { id: 'scatter',   label: 'Dispersion',      icon: '\u2058',  bestFor: 'Corrélation entre 2 métriques' },
  { id: 'heatmap',   label: 'Heatmap',         icon: '\u25A6',  bestFor: 'Disponibilité / présence'      },
  { id: 'stacked',   label: 'Barres empilées', icon: '\u25A4',  bestFor: 'Répartition / composition'     },
  { id: 'donut',     label: 'Donut',           icon: '\u25CE',  bestFor: 'Proportions / pourcentages'    },
  { id: 'butterfly', label: 'Papillon',        icon: '\u27FA',  bestFor: 'Dom. vs Extérieur'             },
];

export const COMPETITIONS = [
  { id: 'all', label: 'Toutes' },
  { id: 'll',  label: 'La Liga' },
  { id: 'cl',  label: 'Champions League' },
  { id: 'cdl', label: 'Coupe du Roi' },
  { id: 'sup', label: 'Supercoupe' },
];

export const ANALYSIS_TYPES = [
  { id: 'compare',    label: 'Comparaison joueurs',  desc: 'Métriques côte à côte',       icon: 'bar',      preMetrics: ['goals','assists','minutes','rating'], preChart: 'radar'  },
  { id: 'evolution',  label: 'Évolution / Forme',    desc: 'Performance dans le temps',    icon: 'line',     preMetrics: ['goals','assists','ga90','rating'],    preChart: 'line'   },
  { id: 'charge',     label: 'Charge & Minutes',     desc: 'Gestion de la fatigue',        icon: 'clock',    preMetrics: ['minutes','starts','avail','distance','sprints'], preChart: 'line' },
  { id: 'discipline', label: 'Discipline & Cartons',  desc: 'Risque de suspension',         icon: 'warning',  preMetrics: ['yc','rc','fouls'],                   preChart: 'bar'    },
  { id: 'domext',     label: 'Dom. / Extérieur',     desc: 'Rendement par lieu',           icon: 'home',     preMetrics: ['goals','assists','rating'],           preChart: 'butterfly' },
  { id: 'per90',      label: 'Efficacité / 90 min',  desc: 'Rendement normalisé',          icon: 'zap',      preMetrics: ['ga90','xg','shots','rating'],         preChart: 'bar'    },
];

export const QUICK_TEMPLATES = [
  'Mbappé vs Bellingham — radar complet',
  'Forme des attaquants — 5 derniers matchs',
  'Risque suspension — tous joueurs',
  'Minutes cumulées — charge globale',
  'Rendement dom. vs ext. — Mbappé',
  'Top 3 buteurs — barres empilées',
  'Clean sheets — Courtois vs équipe',
  'Progression physique — sprints & distance',
];

export type ScreenId = 'dashboard' | 'newChart' | 'configure' | 'aiGenerated' | 'alerts' | 'editMode' | 'export';
