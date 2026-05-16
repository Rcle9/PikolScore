import React, { useState } from "react";
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

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isSmallHeight = height < 760;
  const isVerySmallHeight = height < 690;

  const currentServerTeam =
    state.servingTeam === "A" ? state.teamA : state.teamB;

  const currentServerName = currentServerTeam.players[state.serverIndex];
  const servingCourt = getServingCourt(state);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar hidden />

      <View style={styles.content}>
        <View style={[styles.topBar, isVerySmallHeight && styles.topBarCompact]}>
          <Text style={[styles.live, isVerySmallHeight && styles.liveCompact]}>
            ● LIVE MATCH
          </Text>

          <Text style={[styles.matchInfo, isVerySmallHeight && styles.matchInfoCompact]}>
            GAME {state.setNumber} • BEST OF {state.settings.bestOf}
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
            team={state.teamA}
            active={state.servingTeam === "A"}
            compact={isSmallHeight}
            onPress={() => match.scoreRally("A")}
          />

          <TournamentScoreCard
            team={state.teamB}
            active={state.servingTeam === "B"}
            compact={isSmallHeight}
            onPress={() => match.scoreRally("B")}
          />
        </View>

        <View style={[styles.serverBox, isVerySmallHeight && styles.serverBoxCompact]}>
          <Text style={[styles.officialScore, isSmallHeight && styles.officialScoreCompact]}>
            {state.teamA.score} - {state.teamB.score} - {state.serverNumber}
          </Text>

          <Text
            style={[styles.serverText, isSmallHeight && styles.serverTextCompact]}
            numberOfLines={1}
          >
            SERVER: {currentServerName}
          </Text>

          <Text style={[styles.serverSub, isSmallHeight && styles.serverSubCompact]}>
            {state.serverNumber === 1 ? "1ST SERVER" : "2ND SERVER"}
          </Text>

          <View style={[styles.courtBadge, isSmallHeight && styles.courtBadgeCompact]}>
            <Text style={[styles.courtText, isSmallHeight && styles.courtTextCompact]}>
              {servingCourt}
            </Text>
          </View>
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
  controls: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 10,
  },
  controlsCompact: {
    paddingTop: 6,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: "#08101C",
    borderWidth: 1,
    borderColor: "#1E293B",
    height: 50,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  controlText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 11,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: "#2A0E0E",
    borderWidth: 1,
    borderColor: colors.orange,
    height: 50,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    color: colors.orange,
    fontWeight: "900",
    fontSize: 11,
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