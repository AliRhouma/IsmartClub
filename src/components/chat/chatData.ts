export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  messages: ChatMessage[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Analyse performance Mbappé',
    preview: 'Ses stats sur les 5 derniers matchs montrent une baisse de...',
    date: '10 avr. 2026',
    messages: [
      { id: 'm1', role: 'user', text: "Peux-tu me donner une analyse de la performance de Mbappé sur les 5 derniers matchs ?", time: '14:12' },
      { id: 'm2', role: 'ai', text: "Sur les 5 derniers matchs, Kylian Mbappé affiche des statistiques contrastées :\n\n- Distance parcourue moyenne : 9.8 km (en baisse de 0.6 km)\n- Sprints par match : 24 (stable)\n- Tirs cadrés : 2.4 par match\n- xG cumulé : 3.1 pour 2 buts marqués\n\nOn note une légère baisse d'intensité dans les courses à haute vitesse, probablement liée à la charge de matchs récente. Je recommande un programme de récupération adapté.", time: '14:13' },
      { id: 'm3', role: 'user', text: "Et par rapport à Bellingham sur la même période ?", time: '14:15' },
      { id: 'm4', role: 'ai', text: "En comparaison, Jude Bellingham sur la même période :\n\n- Distance parcourue : 11.2 km/match (+1.4 km vs Mbappé)\n- Passes décisives : 3 (contre 1 pour Mbappé)\n- Duels gagnés : 62% (très bon ratio)\n- Sprints : 18/match (moins explosif, mais plus constant)\n\nBellingham montre une forme ascendante avec un rôle de plus en plus influent dans la construction. Les deux profils sont complémentaires.", time: '14:16' },
    ],
  },
  {
    id: 'conv-2',
    title: 'Composition Clasico',
    preview: "Pour le prochain Clasico, je suggère un 4-3-3 avec...",
    date: '9 avr. 2026',
    messages: [
      { id: 'm5', role: 'user', text: "Quelle composition tu suggères pour le Clasico de samedi ?", time: '10:30' },
      { id: 'm6', role: 'ai', text: "Pour le Clasico de samedi, je recommande un 4-3-3 offensif :\n\nCourtois\nCarvajal - Rüdiger - Alaba - Mendy\nValverde - Tchouaméni - Bellingham\nVinicius - Mbappé - Rodrygo\n\nCette composition exploite la vitesse sur les ailes et la profondeur de Mbappé en pointe. Bellingham pourra se projeter en soutien.", time: '10:31' },
    ],
  },
  {
    id: 'conv-3',
    title: 'Rapport blessures semaine 12',
    preview: "Actuellement, 3 joueurs sont en phase de reprise...",
    date: '7 avr. 2026',
    messages: [
      { id: 'm7', role: 'user', text: "Fais-moi un point sur les blessures cette semaine.", time: '09:00' },
      { id: 'm8', role: 'ai', text: "Voici le bilan médical de la semaine 12 :\n\n1. Alaba - Ligament croisé : Reprise partielle, retour estimé dans 3 semaines\n2. Camavinga - Contracture mollet : Disponible pour le week-end\n3. Militão - Genou : Phase de réathlétisation, 6 semaines minimum\n\nL'effectif est globalement en bonne santé. Je recommande de ménager Valverde qui accumule les minutes.", time: '09:02' },
    ],
  },
  {
    id: 'conv-4',
    title: 'Comparaison milieux de terrain',
    preview: "En termes de volume de jeu, Tchouaméni domine avec...",
    date: '5 avr. 2026',
    messages: [
      { id: 'm9', role: 'user', text: "Compare-moi Tchouaméni, Bellingham et Valverde sur ce mois.", time: '16:45' },
      { id: 'm10', role: 'ai', text: "Comparaison du trio de milieu sur le mois écoulé :\n\nTchouaméni :\n- Volume de jeu : 92 passes/match (le plus haut)\n- Interceptions : 3.4/match\n- Note moyenne : 7.2\n\nBellingham :\n- Buts + passes dé : 6 contributions directes\n- Dribbles réussis : 2.8/match\n- Note moyenne : 7.8\n\nValverde :\n- Distance parcourue : 12.1 km/match (record)\n- Tirs : 2.6/match\n- Note moyenne : 7.1\n\nChacun excelle dans son registre. Bellingham est le plus décisif, Tchouaméni le plus régulateur, Valverde le plus polyvalent.", time: '16:47' },
    ],
  },
];

export const CANNED_RESPONSES: string[] = [
  "D'après l'analyse des données récentes, l'équipe montre une progression constante dans la possession de balle (+4.2% sur le dernier mois) et une amélioration notable dans les transitions offensives. Le pressing haut a été particulièrement efficace lors des 3 dernières rencontres.",
  "Bonne question. En regardant les métriques physiques de cette semaine, je constate que la charge d'entraînement est bien répartie. Cependant, je recommande d'alléger la session de jeudi pour optimiser la fraîcheur avant le match du week-end.",
  "Voici ce que je peux vous dire : les statistiques montrent que le côté gauche est le plus productif en termes de centres (8.3 par match) et de passes dans le dernier tiers. C'est un axe à exploiter davantage dans les prochaines rencontres.",
  "L'analyse vidéo des derniers matchs révèle un schéma récurrent : l'adversaire a tendance à laisser des espaces dans le couloir droit entre la 60e et 75e minute. C'est une fenêtre d'opportunité pour des changements tactiques ciblés.",
];

export const SUGGESTIONS = [
  'Analyse de Mbappé',
  'Rapport pré-match',
  'Risque blessure',
];
