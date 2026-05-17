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
      mode: "doubles",
    },
  };
}

export function getServingTeam(state: MatchState) {
  return state.servingTeam === "A" ? state.teamA : state.teamB;
}

export function getServerName(state: MatchState) {
  return getServingTeam(state).players[state.serverIndex] || getServingTeam(state).players[0];
}

export function getServerDisplay(state: MatchState) {
  if (state.settings.mode === "singles") return "Server";
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
  const newState: MatchState = JSON.parse(JSON.stringify(state));
  let message = "";

  if (newState.matchOver) {
    return { newState, message: "Match already finished" };
  }

  const isSingles = newState.settings.mode === "singles";
  const servingTeamWon = rallyWinner === newState.servingTeam;

  if (servingTeamWon) {
    if (rallyWinner === "A") newState.teamA.score += 1;
    else newState.teamB.score += 1;

    message = `${
      rallyWinner === "A" ? newState.teamA.name : newState.teamB.name
    } scored`;

    if (isSingles) {
      newState.serverIndex = 0;
      newState.serverNumber = 1;
    }
  } else {
    if (isSingles) {
      newState.servingTeam = rallyWinner;
      newState.serverIndex = 0;
      newState.serverNumber = 1;
      message = "Side out";
    } else {
      if (newState.serverNumber === 1) {
        newState.serverNumber = 2;
        newState.serverIndex = newState.serverIndex === 0 ? 1 : 0;
        message = "2nd server";
      } else {
        newState.servingTeam = rallyWinner;
        newState.serverNumber = 1;
        newState.serverIndex = 0;
        message = "Side out";
      }
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
      newState.serverIndex = 0;
      newState.serverNumber = isSingles ? 1 : 2;
      message = "SET WON";
    }
  }

  return { newState, message };
}