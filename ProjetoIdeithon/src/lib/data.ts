export interface EcoAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  co2Saved: number;
  points: number;
  category: "transport" | "energy" | "food" | "waste" | "water";
}

export interface UserStats {
  totalCO2Saved: number;
  totalPoints: number;
  streak: number;
  level: number;
  actionsToday: number;
  treesEquivalent: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  co2Saved: number;
  level: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
}

export interface WeeklyData {
  day: string;
  co2: number;
  points: number;
}

export const ecoActions: EcoAction[] = [
  {
    id: "1",
    title: "Ir de bicicleta",
    description: "Use bicicleta ao invés de carro para ir ao trabalho",
    icon: "bike",
    co2Saved: 2.4,
    points: 50,
    category: "transport",
  },
  {
    id: "2",
    title: "Transporte público",
    description: "Use ônibus ou metrô ao invés de carro particular",
    icon: "bus",
    co2Saved: 1.8,
    points: 35,
    category: "transport",
  },
  {
    id: "3",
    title: "Refeição vegana",
    description: "Substitua uma refeição com carne por uma vegana",
    icon: "salad",
    co2Saved: 2.5,
    points: 40,
    category: "food",
  },
  {
    id: "4",
    title: "Sem desperdício",
    description: "Aproveite 100% dos alimentos sem jogar nada fora",
    icon: "recycle",
    co2Saved: 1.2,
    points: 30,
    category: "waste",
  },
  {
    id: "5",
    title: "Banho curto",
    description: "Tome banho em menos de 5 minutos",
    icon: "droplets",
    co2Saved: 0.5,
    points: 20,
    category: "water",
  },
  {
    id: "6",
    title: "Luzes desligadas",
    description: "Desligue luzes ao sair de um cômodo",
    icon: "lightbulb-off",
    co2Saved: 0.3,
    points: 15,
    category: "energy",
  },
  {
    id: "7",
    title: "Sacola reutilizável",
    description: "Use sacola própria ao fazer compras",
    icon: "shopping-bag",
    co2Saved: 0.8,
    points: 25,
    category: "waste",
  },
  {
    id: "8",
    title: "Home office",
    description: "Trabalhe de casa e evite deslocamento",
    icon: "home",
    co2Saved: 3.2,
    points: 45,
    category: "transport",
  },
  {
    id: "9",
    title: "Energia solar",
    description: "Use energia renovável em casa",
    icon: "sun",
    co2Saved: 4.0,
    points: 60,
    category: "energy",
  },
  {
    id: "10",
    title: "Compostar",
    description: "Composte resíduos orgânicos",
    icon: "sprout",
    co2Saved: 1.0,
    points: 35,
    category: "waste",
  },
  {
    id: "11",
    title: "Garrafa reutilizável",
    description: "Use garrafa própria ao invés de descartável",
    icon: "cup-soda",
    co2Saved: 0.4,
    points: 15,
    category: "waste",
  },
  {
    id: "12",
    title: "Plantar árvore",
    description: "Plante uma árvore ou muda",
    icon: "tree-pine",
    co2Saved: 5.0,
    points: 100,
    category: "waste",
  },
];

export const mockUserStats: UserStats = {
  totalCO2Saved: 127.5,
  totalPoints: 2840,
  streak: 12,
  level: 7,
  actionsToday: 3,
  treesEquivalent: 6,
};

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Ana Silva", avatar: "AS", points: 4520, co2Saved: 215.3, level: 12 },
  { rank: 2, name: "Carlos Lima", avatar: "CL", points: 3890, co2Saved: 187.6, level: 10 },
  { rank: 3, name: "Marina Costa", avatar: "MC", points: 3210, co2Saved: 156.2, level: 9 },
  { rank: 4, name: "Você", avatar: "VC", points: 2840, co2Saved: 127.5, level: 7 },
  { rank: 5, name: "Pedro Santos", avatar: "PS", points: 2650, co2Saved: 118.9, level: 7 },
  { rank: 6, name: "Julia Ferreira", avatar: "JF", points: 2340, co2Saved: 102.4, level: 6 },
  { rank: 7, name: "Rafael Oliveira", avatar: "RO", points: 2100, co2Saved: 95.1, level: 6 },
  { rank: 8, name: "Beatriz Souza", avatar: "BS", points: 1890, co2Saved: 82.7, level: 5 },
  { rank: 9, name: "Lucas Mendes", avatar: "LM", points: 1650, co2Saved: 71.3, level: 5 },
  { rank: 10, name: "Camila Rocha", avatar: "CR", points: 1420, co2Saved: 63.8, level: 4 },
];

export const mockBadges: Badge[] = [
  { id: "1", name: "Primeiro Passo", description: "Complete sua primeira ação", icon: "footprints", earned: true, progress: 100 },
  { id: "2", name: "Semana Verde", description: "7 dias seguidos de ações", icon: "calendar-check", earned: true, progress: 100 },
  { id: "3", name: "Ciclista Urbano", description: "Use bicicleta 10 vezes", icon: "bike", earned: true, progress: 100 },
  { id: "4", name: "Guardião das Águas", description: "50 banhos curtos", icon: "droplets", earned: false, progress: 72 },
  { id: "5", name: "Mestre Vegano", description: "30 refeições veganas", icon: "salad", earned: false, progress: 53 },
  { id: "6", name: "Lixo Zero", description: "Sem desperdício por 30 dias", icon: "recycle", earned: false, progress: 40 },
  { id: "7", name: "Plantador", description: "Plante 5 árvores", icon: "tree-pine", earned: false, progress: 20 },
  { id: "8", name: "Influenciador Eco", description: "Convide 10 amigos", icon: "users", earned: false, progress: 10 },
];

export const mockWeeklyData: WeeklyData[] = [
  { day: "Seg", co2: 4.2, points: 85 },
  { day: "Ter", co2: 3.8, points: 70 },
  { day: "Qua", co2: 5.1, points: 105 },
  { day: "Qui", co2: 2.9, points: 55 },
  { day: "Sex", co2: 6.3, points: 130 },
  { day: "Sáb", co2: 4.7, points: 95 },
  { day: "Dom", co2: 3.5, points: 65 },
];

export const categoryColors: Record<string, string> = {
  transport: "bg-blue-500",
  energy: "bg-yellow-500",
  food: "bg-green-500",
  waste: "bg-orange-500",
  water: "bg-cyan-500",
};

export const categoryLabels: Record<string, string> = {
  transport: "Transporte",
  energy: "Energia",
  food: "Alimentação",
  waste: "Resíduos",
  water: "Água",
};
