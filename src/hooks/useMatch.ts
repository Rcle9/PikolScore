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
  announceScore,
  announceSecondServer,
  announceSideOut,
  announceWinner,
} from "./useVoiceAnnouncer";

export function useMatch(initialState?: MatchState | null) {
  const [state, setState] = useState<MatchState>(
    initialState || createInitialMatchState()
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

        setState(initialState);
        setHistory([]);
        setRedoStack([]);
        setCelebration("");

        return;
      }

      const saved = await loadMatchState();

      if (!saved) return;

      if (saved.state && saved.state.startedAt && saved.state.settings) {
        setState(saved.state);
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
    if (!state || state.matchOver) return;

    const before: MatchState = JSON.parse(JSON.stringify(state));

    const result = scoreRallyEngine(state, team);
    const newState = result.newState;

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
        console.log("Match saved to Supabase");
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
      announceSecondServer();

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
    if (history.length === 0) return;

    const [last, ...rest] = history;

    const currentState: HistoryItem = {
      ...state,
      id: Date.now(),
      message: "Redo",
      rallyWinner: last.rallyWinner,
      scoreAfter: `${state.teamA.score} - ${state.teamB.score}`,
    };

    setRedoStack((prev) => [currentState, ...prev]);
    setState(last);
    setHistory(rest);
    setCelebration("");

    announceScore(
      last.teamA.score,
      last.teamB.score,
      last.serverNumber,
      last.servingTeam
    );

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function redo() {
    if (redoStack.length === 0) return;

    const [next, ...rest] = redoStack;

    const currentState: HistoryItem = {
      ...state,
      id: Date.now(),
      message: "Undo",
      rallyWinner: next.rallyWinner,
      scoreAfter: `${state.teamA.score} - ${state.teamB.score}`,
    };

    setHistory((prev) => [currentState, ...prev]);
    setState(next);
    setRedoStack(rest);
    setCelebration("");

    announceScore(
      next.teamA.score,
      next.teamB.score,
      next.serverNumber,
      next.servingTeam
    );

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
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Reset",
        style: "destructive",
        onPress: forceReset,
      },
    ]);
  }

  function updateState(partial: Partial<MatchState>) {
    setState((prev) => ({
      ...prev,
      ...partial,
    }));
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

    resetMatch,
    forceReset,
    startNewGame,
  };
}