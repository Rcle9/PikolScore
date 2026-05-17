import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { useMatch } from "../hooks/useMatch";
import { MatchState } from "../types/match";
import { getServingCourt } from "../logic/scoringEngine";
import TournamentScoreCard from "../components/TournamentScoreCard";
import DatabaseHistoryScreen from "./DatabaseHistoryScreen";
import SettingsModal from "./SettingsModal";
import CelebrationModal from "../components/CelebrationModal";
import { colors } from "../styles/theme";

type Props = {
  initialState?: MatchState | null;
  onNewMatch?: () => void;
};

export default function TournamentScreen({ initialState, onNewMatch }: Props) {
  const match = useMatch(initialState);
  const { state } = match;

  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [timeoutSecondsLeft, setTimeoutSecondsLeft] = useState(60);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isSmallHeight = height < 760;
  const isVerySmallHeight = height < 690;

  const currentServerTeam =
    state.servingTeam === "A" ? state.teamA : state.teamB;

  const currentServerName = currentServerTeam.players[state.serverIndex];
  const servingCourt = getServingCourt(state);

  const teamATimeouts = state.teamA.timeoutsLeft ?? 2;
  const teamBTimeouts = state.teamB.timeoutsLeft ?? 2;

  const leftTeam = state.courtSwapped ? state.teamB : state.teamA;
  const rightTeam = state.courtSwapped ? state.teamA : state.teamB;
  const leftKey = state.courtSwapped ? "B" : "A";
  const rightKey = state.courtSwapped ? "A" : "B";

  const teamAMatchPoint =
    !state.matchOver &&
    state.teamA.score >= state.settings.pointLimit - 1 &&
    state.teamA.score > state.teamB.score;

  const teamBMatchPoint =
    !state.matchOver &&
    state.teamB.score >= state.settings.pointLimit - 1 &&
    state.teamB.score > state.teamA.score;

  useEffect(() => {
    if (!state.timeoutActive || !state.timeoutStartedAt) {
      setTimeoutSecondsLeft(60);
      return;
    }

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.timeoutStartedAt!) / 1000);
      const remaining = Math.max(0, 60 - elapsed);

      setTimeoutSecondsLeft(remaining);

      if (remaining <= 0) {
        match.resumePlay();
      }
    }, 500);

    return () => clearInterval(timer);
  }, [state.timeoutActive, state.timeoutStartedAt]);

  function formatTimeout(seconds: number) {
    return `0:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar hidden />

      <View style={styles.content}>
        <View style={[styles.topBar, isVerySmallHeight && styles.topBarCompact]}>
          <Text style={[styles.live, isVerySmallHeight && styles.liveCompact]}>
            ● LIVE MATCH
          </Text>

          <Text
            style={[
              styles.matchInfo,
              isVerySmallHeight && styles.matchInfoCompact,
            ]}
          >
            GAME {state.setNumber} • BEST OF {state.settings.bestOf} •{" "}
            {state.settings.mode.toUpperCase()}
          </Text>

          <Text style={styles.sideInfo}>
            LEFT: {leftTeam.name} • RIGHT: {rightTeam.name}
          </Text>
        </View>

        <View
          style={[
            styles.scoreboard,
            isLandscape ? styles.landscape : styles.portrait,
            isVerySmallHeight && styles.scoreboardCompact,
          ]}
        >
          <TournamentScoreCard
            team={leftTeam}
            active={state.servingTeam === leftKey}
            compact={isSmallHeight}
            matchPoint={leftKey === "A" ? teamAMatchPoint : teamBMatchPoint}
            onPress={() => match.scoreRally(leftKey)}
          />

          <TournamentScoreCard
            team={rightTeam}
            active={state.servingTeam === rightKey}
            compact={isSmallHeight}
            matchPoint={rightKey === "A" ? teamAMatchPoint : teamBMatchPoint}
            onPress={() => match.scoreRally(rightKey)}
          />
        </View>

        <View
          style={[styles.serverBox, isVerySmallHeight && styles.serverBoxCompact]}
        >
          <Text
            style={[
              styles.officialScore,
              isSmallHeight && styles.officialScoreCompact,
            ]}
          >
            {state.teamA.score} - {state.teamB.score} - {state.serverNumber}
          </Text>

          <Text
            style={[styles.serverText, isSmallHeight && styles.serverTextCompact]}
            numberOfLines={1}
          >
            SERVER: {currentServerName}
          </Text>

          <Text
            style={[styles.serverSub, isSmallHeight && styles.serverSubCompact]}
          >
            {state.settings.mode === "singles"
              ? "SERVER"
              : state.serverNumber === 1
              ? "1ST SERVER"
              : "2ND SERVER"}
          </Text>

          <View
            style={[styles.courtBadge, isSmallHeight && styles.courtBadgeCompact]}
          >
            <Text
              style={[styles.courtText, isSmallHeight && styles.courtTextCompact]}
            >
              {servingCourt}
            </Text>
          </View>
        </View>

        <View
          style={[styles.timeoutRow, isVerySmallHeight && styles.controlsCompact]}
        >
          <TouchableOpacity
            style={[
              styles.timeoutBtn,
              (state.timeoutActive || teamATimeouts <= 0) && styles.disabledBtn,
            ]}
            onPress={() => match.callTimeout("A")}
            disabled={state.timeoutActive || teamATimeouts <= 0}
          >
            <Text style={styles.timeoutText}>TO A ({teamATimeouts})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.timeoutBtn,
              (state.timeoutActive || teamBTimeouts <= 0) && styles.disabledBtn,
            ]}
            onPress={() => match.callTimeout("B")}
            disabled={state.timeoutActive || teamBTimeouts <= 0}
          >
            <Text style={styles.timeoutText}>TO B ({teamBTimeouts})</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.controls, isVerySmallHeight && styles.controlsCompact]}>
          <TouchableOpacity style={styles.controlBtn} onPress={match.undo}>
            <Text style={styles.controlText}>UNDO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => setHistoryOpen(true)}
          >
            <Text style={styles.controlText}>HISTORY</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={match.switchSides}>
            <Text style={styles.controlText}>SWITCH</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => setSettingsOpen(true)}
          >
            <Text style={styles.controlText}>SETTINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              match.startNewGame();
              onNewMatch?.();
            }}
          >
            <Text style={styles.resetText}>NEW</Text>
          </TouchableOpacity>
        </View>
      </View>

      {state.timeoutActive && (
        <View style={styles.timeoutOverlay}>
          <Text style={styles.timeoutTitle}>TIMEOUT</Text>

          <Text style={styles.timeoutTeam}>
            {state.timeoutTeam === "A" ? state.teamA.name : state.teamB.name}
          </Text>

          <Text style={styles.timeoutTimer}>
            {formatTimeout(timeoutSecondsLeft)}
          </Text>

          <Text style={styles.timeoutSub}>Scoring is paused</Text>

          <TouchableOpacity style={styles.resumeBtn} onPress={match.resumePlay}>
            <Text style={styles.resumeText}>Resume Play</Text>
          </TouchableOpacity>
        </View>
      )}

      <CelebrationModal
        message={match.celebration}
        onNewGame={() => {
          match.startNewGame();
          onNewMatch?.();
        }}
      />

      {state.matchOver && (
        <View style={styles.winnerBanner}>
          <Text style={styles.winnerText} numberOfLines={1}>
            {state.winner === "A" ? state.teamA.name : state.teamB.name} WINS
          </Text>

          <TouchableOpacity
            style={styles.newGameBtn}
            onPress={() => {
              match.startNewGame();
              onNewMatch?.();
            }}
          >
            <Text style={styles.newGameText}>Start New Match</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={historyOpen} animationType="slide">
        <DatabaseHistoryScreen onClose={() => setHistoryOpen(false)} />
      </Modal>

      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        state={state}
        setState={match.setState}
        resetMatch={match.forceReset}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  topBar: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
  },
  topBarCompact: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  live: {
    color: colors.neon,
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
  },
  liveCompact: {
    fontSize: 18,
  },
  matchInfo: {
    color: colors.muted,
    marginTop: 2,
    fontWeight: "900",
    fontSize: 14,
    textAlign: "center",
  },
  matchInfoCompact: {
    fontSize: 12,
  },
  sideInfo: {
    color: colors.neon,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
  },
  scoreboard: {
    flex: 1,
    gap: 10,
  },
  scoreboardCompact: {
    gap: 8,
  },
  portrait: {
    flexDirection: "column",
  },
  landscape: {
    flexDirection: "row",
  },
  serverBox: {
    alignItems: "center",
    paddingVertical: 8,
  },
  serverBoxCompact: {
    paddingVertical: 4,
  },
  officialScore: {
    color: colors.orange,
    fontSize: 48,
    fontWeight: "900",
    lineHeight: 54,
  },
  officialScoreCompact: {
    fontSize: 38,
    lineHeight: 42,
  },
  serverText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 2,
    maxWidth: "95%",
  },
  serverTextCompact: {
    fontSize: 17,
  },
  serverSub: {
    color: colors.neon,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2,
  },
  serverSubCompact: {
    fontSize: 13,
  },
  courtBadge: {
    marginTop: 8,
    backgroundColor: "#102215",
    borderColor: colors.neon,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  courtBadgeCompact: {
    marginTop: 5,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  courtText: {
    color: colors.neon,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  courtTextCompact: {
    fontSize: 12,
  },
  timeoutRow: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 6,
  },
  timeoutBtn: {
    flex: 1,
    backgroundColor: "#101827",
    borderWidth: 1,
    borderColor: colors.neon,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  timeoutText: {
    color: colors.neon,
    fontWeight: "900",
    fontSize: 11,
  },
  disabledBtn: {
    opacity: 0.35,
  },
  controls: {
    flexDirection: "row",
    gap: 6,
    paddingTop: 8,
  },
  controlsCompact: {
    paddingTop: 5,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: "#08101C",
    borderWidth: 1,
    borderColor: "#1E293B",
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  controlText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 10,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: "#2A0E0E",
    borderWidth: 1,
    borderColor: colors.orange,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    color: colors.orange,
    fontWeight: "900",
    fontSize: 10,
  },
  timeoutOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.88)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 24,
  },
  timeoutTitle: {
    color: colors.orange,
    fontSize: 52,
    fontWeight: "900",
  },
  timeoutTeam: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 10,
    textAlign: "center",
  },
  timeoutTimer: {
    color: colors.neon,
    fontSize: 76,
    fontWeight: "900",
    marginTop: 14,
  },
  timeoutSub: {
    color: colors.muted,
    fontWeight: "800",
    marginTop: 8,
  },
  resumeBtn: {
    marginTop: 24,
    backgroundColor: colors.neon,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
  },
  resumeText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 16,
  },
  winnerBanner: {
    position: "absolute",
    bottom: 78,
    left: 20,
    right: 20,
    backgroundColor: colors.neon,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    zIndex: 50,
  },
  winnerText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "900",
  },
  newGameBtn: {
    backgroundColor: "#020617",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 10,
  },
  newGameText: {
    color: colors.neon,
    fontWeight: "900",
  },
});