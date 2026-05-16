export type TeamKey = "A" | "B";

export type Team = {
  name: string;
  players: string[];
  score: number;
  setsWon: number;
};

export type MatchSettings = {
  bestOf: 1 | 3 | 5;
  pointLimit: 11 | 15 | 21;
  winByTwo: boolean;
};

export type MatchState = {
  teamA: Team;
  teamB: Team;
  servingTeam: TeamKey;
  serverIndex: number;
  serverNumber: 1 | 2;
  setNumber: number;
  rallyCount: number;
  longestStreak: number;
  currentStreak: number;
  currentStreakTeam: TeamKey | null;
  matchOver: boolean;
  winner: TeamKey | null;
  startedAt: number;
  settings: MatchSettings;
};

export type HistoryItem = MatchState & {
  id: number;
  message: string;
  rallyWinner: TeamKey;
  scoreAfter: string;
};