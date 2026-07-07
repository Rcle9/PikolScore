import { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

import { HistoryItem, MatchState, TeamKey } from "../types/match";

import {
  createInitialMatchState,
  scoreRallyEngine,
} from "../logic/scoringEngine";

import {
  clearMatchState,
  loadMatchState,
  saveMatchState,
} from "../storage/storage";

import { saveMatchHistory } from "../services/matchHistoryService";

import {
  announceResumePlay,
  announceScore,
  announceSecondServer,
  announceSideOut,
  announceSwitchSides,
  announceTimeout,
  announceWinner,
} from "./useVoiceAnnouncer";

function normalizeState(input: MatchState): MatchState {
  return {
    ...input,
    teamA: {
      ...input.teamA,
      timeoutsLeft: input.teamA.timeoutsLeft ?? 2,
    },
    teamB: {
      ...input.teamB,
      timeoutsLeft: input.teamB.timeoutsLeft ?? 2,
    },
    timeoutActive: input.timeoutActive ?? false,
    timeoutTeam: input.timeoutTeam ?? null,
    timeoutStartedAt: input.timeoutStartedAt ?? null,
    courtSwapped: input.courtSwapped ?? false,
  };
}

export function useMatch(initialState?: MatchState | null) {
  const [state, setState] = useState<MatchState>(
    normalizeState(initialState || createInitialMatchState())
  );

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryItem[]>([]);
  const [celebration, setCelebration] = useState("");

  const appliedInitial = useRef(false);

  useEffect(() => {
    async function load() {
      if (initialState && !appliedInitial.current) {
        appliedInitial.current = true;

        await clearMatchState();

        setState(normalizeState(initialState));
        setHistory([]);
        setRedoStack([]);
        setCelebration("");

        return;
      }

      const saved = await loadMatchState();

      if (!saved) return;

      if (saved.state && saved.state.startedAt && saved.state.settings) {
        setState(normalizeState(saved.state));
        setHistory(saved.history || []);
        setRedoStack(saved.redoStack || []);
        return;
      }

      await clearMatchState();
    }

    load();
  }, [initialState]);

  useEffect(() => {
    if (!state?.startedAt) return;
    saveMatchState(state, history, redoStack);
  }, [state, history, redoStack]);

  async function scoreRally(team: TeamKey) {
    if (!state || state.matchOver || state.timeoutActive) return;

    const before: MatchState = JSON.parse(JSON.stringify(state));
    const result = scoreRallyEngine(state, team);
    const newState = normalizeState(result.newState);

    if (result.message === "Timeout active") return;

    const item: HistoryItem = {
      ...before,
      id: Date.now(),
      rallyWinner: team,
      message: result.message,
      scoreAfter: `${newState.teamA.score} - ${newState.teamB.score}`,
    };

    const updatedHistory = [item, ...history];

    setHistory(updatedHistory);
    setRedoStack([]);
    setState(newState);

    if (result.message === "MATCH WON") {
      const winnerName =
        newState.winner === "A" ? newState.teamA.name : newState.teamB.name;

      const finalScore =
        newState.winner === "A"
          ? `${newState.teamA.score} to ${newState.teamB.score}`
          : `${newState.teamB.score} to ${newState.teamA.score}`;

      setCelebration("MATCH WON");
      announceWinner(winnerName, finalScore);

      try {
        await saveMatchHistory(newState, updatedHistory);
      } catch (error) {
        console.log("Supabase save error:", error);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    if (result.message === "SET WON") {
      const setWinner =
        newState.teamA.setsWon > newState.teamB.setsWon
          ? newState.teamA.name
          : newState.teamB.name;

      const setScore =
        newState.teamA.setsWon > newState.teamB.setsWon
          ? `${before.teamA.score} to ${before.teamB.score}`
          : `${before.teamB.score} to ${before.teamA.score}`;

      setCelebration("SET WON");
      announceWinner(setWinner, setScore);
      announceSwitchSides();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    if (result.message === "Side out") {
      announceSideOut(
        newState.teamA.score,
        newState.teamB.score,
        newState.serverNumber,
        newState.servingTeam
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (result.message === "2nd server") {
  announceSecondServer(
    newState.teamA.score,
    newState.teamB.score,
    newState.serverNumber,
    newState.servingTeam
  );

  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  return;
}

    announceScore(
      newState.teamA.score,
      newState.teamB.score,
      newState.serverNumber,
      newState.servingTeam
    );

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function undo() {
    if (history.length === 0 || state.timeoutActive) return;

    const [last, ...rest] = history;

    const currentState: HistoryItem = {
      ...state,
      id: Date.now(),
      message: "Redo",
      rallyWinner: last.rallyWinner,
      scoreAfter: `${state.teamA.score} - ${state.teamB.score}`,
    };

    const fixedLast = normalizeState(last);

    setRedoStack((prev) => [currentState, ...prev]);
    setState(fixedLast);
    setHistory(rest);
    setCelebration("");

    announceScore(
      fixedLast.teamA.score,
      fixedLast.teamB.score,
      fixedLast.serverNumber,
      fixedLast.servingTeam
    );

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function redo() {
    if (redoStack.length === 0 || state.timeoutActive) return;

    const [next, ...rest] = redoStack;

    const currentState: HistoryItem = {
      ...state,
      id: Date.now(),
      message: "Undo",
      rallyWinner: next.rallyWinner,
      scoreAfter: `${state.teamA.score} - ${state.teamB.score}`,
    };

    const fixedNext = normalizeState(next);

    setHistory((prev) => [currentState, ...prev]);
    setState(fixedNext);
    setRedoStack(rest);
    setCelebration("");

    announceScore(
      fixedNext.teamA.score,
      fixedNext.teamB.score,
      fixedNext.serverNumber,
      fixedNext.servingTeam
    );

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function callTimeout(team: TeamKey) {
    if (state.timeoutActive || state.matchOver) return;

    const timeoutsLeft =
      team === "A"
        ? state.teamA.timeoutsLeft ?? 2
        : state.teamB.timeoutsLeft ?? 2;

    if (timeoutsLeft <= 0) return;

    const teamName = team === "A" ? state.teamA.name : state.teamB.name;

    setState((prev) => ({
      ...prev,
      timeoutActive: true,
      timeoutTeam: team,
      timeoutStartedAt: Date.now(),

      teamA:
        team === "A"
          ? {
              ...prev.teamA,
              timeoutsLeft: Math.max(0, (prev.teamA.timeoutsLeft ?? 2) - 1),
            }
          : {
              ...prev.teamA,
              timeoutsLeft: prev.teamA.timeoutsLeft ?? 2,
            },

      teamB:
        team === "B"
          ? {
              ...prev.teamB,
              timeoutsLeft: Math.max(0, (prev.teamB.timeoutsLeft ?? 2) - 1),
            }
          : {
              ...prev.teamB,
              timeoutsLeft: prev.teamB.timeoutsLeft ?? 2,
            },
    }));

    announceTimeout(teamName);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  function resumePlay() {
    if (!state.timeoutActive) return;

    setState((prev) => ({
      ...prev,
      timeoutActive: false,
      timeoutTeam: null,
      timeoutStartedAt: null,
    }));

    announceResumePlay();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function switchSides() {
    if (state.timeoutActive || state.matchOver) return;

    setState((prev) => ({
      ...prev,
      courtSwapped: !prev.courtSwapped,
    }));

    announceSwitchSides();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  async function forceReset() {
    const fresh = createInitialMatchState();

    await clearMatchState();

    setState(fresh);
    setHistory([]);
    setRedoStack([]);
    setCelebration("");

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async function startNewGame() {
    const fresh = createInitialMatchState();

    await clearMatchState();

    setState(fresh);
    setHistory([]);
    setRedoStack([]);
    setCelebration("");

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async function resetMatch() {
    Alert.alert("Reset Match", "Are you sure you want to reset?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: forceReset,
      },
    ]);
  }

  function updateState(partial: Partial<MatchState>) {
    setState((prev) =>
      normalizeState({
        ...prev,
        ...partial,
        teamA: {
          ...prev.teamA,
          ...(partial.teamA || {}),
        },
        teamB: {
          ...prev.teamB,
          ...(partial.teamB || {}),
        },
      })
    );
  }

  return {
    state,
    setState,
    updateState,

    history,
    redoStack,
    celebration,

    scoreRally,
    undo,
    redo,

    callTimeout,
    resumePlay,
    switchSides,

    resetMatch,
    forceReset,
    startNewGame,
  };
}