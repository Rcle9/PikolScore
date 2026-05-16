import { MatchState, TeamKey } from "../types/match";

export function createInitialMatchState(): MatchState {
  return {
    teamA: {
      name: "TEAM A",
      players: ["Player A1", "Player A2"],
      score: 0,
      setsWon: 0,
    },
    teamB: {
      name: "TEAM B",
      players: ["Player B1", "Player B2"],
      score: 0,
      setsWon: 0,
    },
    servingTeam: "A",
    serverIndex: 0,
    serverNumber: 2,
    setNumber: 1,
    rallyCount: 0,
    longestStreak: 0,
    currentStreak: 0,
    currentStreakTeam: null,
    matchOver: false,
    winner: null,
    startedAt: Date.now(),
    settings: {
      bestOf: 1,
      pointLimit: 11,
      winByTwo: true,
    },
  };
}

export function getServingTeam(state: MatchState) {
  return state.servingTeam === "A" ? state.teamA : state.teamB;
}

export function getServerName(state: MatchState) {
  return getServingTeam(state).players[state.serverIndex];
}

export function getServerDisplay(state: MatchState) {
  return state.serverNumber === 1 ? "1st Server" : "2nd Server";
}

export function getServingCourt(state: MatchState) {
  const score =
    state.servingTeam === "A" ? state.teamA.score : state.teamB.score;

  return score % 2 === 0 ? "Right Service Court" : "Left Service Court";
}

export function isGameWon(a: number, b: number, state: MatchState) {
  const high = Math.max(a, b);
  const diff = Math.abs(a - b);

  if (state.settings.winByTwo) {
    return high >= state.settings.pointLimit && diff >= 2;
  }

  return high >= state.settings.pointLimit;
}

export function scoreRallyEngine(state: MatchState, rallyWinner: TeamKey) {
  let newState: MatchState = JSON.parse(JSON.stringify(state));
  let message = "";

  if (newState.matchOver) {
    return { newState, message: "Match already finished" };
  }

  const servingTeamWon = rallyWinner === newState.servingTeam;

  if (servingTeamWon) {
    if (rallyWinner === "A") newState.teamA.score += 1;
    else newState.teamB.score += 1;

    message = `${
      rallyWinner === "A" ? newState.teamA.name : newState.teamB.name
    } scored`;

    // Serving player stays serving after scoring.
    // Server side changes based on score only.
  } else {
    if (newState.serverNumber === 1) {
      newState.serverNumber = 2;
      newState.serverIndex = newState.serverIndex === 0 ? 1 : 0;
      message = "2nd server";
    } else {
      newState.servingTeam = newState.servingTeam === "A" ? "B" : "A";
      newState.serverNumber = 1;
      newState.serverIndex = 0;
      message = "Side out";
    }
  }

  newState.rallyCount += 1;

  if (newState.currentStreakTeam === rallyWinner) {
    newState.currentStreak += 1;
  } else {
    newState.currentStreakTeam = rallyWinner;
    newState.currentStreak = 1;
  }

  newState.longestStreak = Math.max(
    newState.longestStreak,
    newState.currentStreak
  );

  if (isGameWon(newState.teamA.score, newState.teamB.score, newState)) {
    const setWinner: TeamKey =
      newState.teamA.score > newState.teamB.score ? "A" : "B";

    if (setWinner === "A") newState.teamA.setsWon += 1;
    else newState.teamB.setsWon += 1;

    const neededSets = Math.ceil(newState.settings.bestOf / 2);

    if (
      (setWinner === "A" && newState.teamA.setsWon >= neededSets) ||
      (setWinner === "B" && newState.teamB.setsWon >= neededSets)
    ) {
      newState.matchOver = true;
      newState.winner = setWinner;
      message = "MATCH WON";
    } else {
      newState.setNumber += 1;
      newState.teamA.score = 0;
      newState.teamB.score = 0;
      newState.servingTeam = setWinner;
      newState.serverNumber = 2;
      newState.serverIndex = 0;
      message = "SET WON";
    }
  }

  return { newState, message };
}