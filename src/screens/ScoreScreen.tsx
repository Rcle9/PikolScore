import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useMatch } from "../hooks/useMatch";
import { useTimer } from "../hooks/useTimer";
import TopBar from "../components/TopBar";
import TeamCard from "../components/TeamCard";
import StatsCard from "../components/StatsCard";
import BottomNav from "../components/BottomNav";
import CelebrationModal from "../components/CelebrationModal";
import SettingsModal from "./SettingsModal";
import DatabaseHistoryScreen from "./DatabaseHistoryScreen";
import StatsScreen from "./StatsScreen";
import { colors } from "../styles/theme";
import { MatchState } from "../types/match";

type Props = {
  initialState?: MatchState | null;
  onNewMatch?: () => void;
};

export default function ScoreScreen({ initialState, onNewMatch }: Props) {
  const match = useMatch(initialState);
  const { state } = match;
  const duration = useTimer(state.startedAt);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const gamePointTeam =
    !state.matchOver &&
    state.teamA.score >= state.settings.pointLimit - 1 &&
    state.teamA.score > state.teamB.score
      ? "A"
      : !state.matchOver &&
        state.teamB.score >= state.settings.pointLimit - 1 &&
        state.teamB.score > state.teamA.score
      ? "B"
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <TopBar
          state={state}
          onUndo={match.undo}
          onHistory={() => setHistoryOpen(true)}
          onSettings={() => setSettingsOpen(true)}
        />

        <View style={styles.mainScoreWrap}>
          <Text
            style={[
              styles.mainScore,
              state.servingTeam === "A" && styles.mainScoreActive,
            ]}
          >
            {state.teamA.score}
          </Text>

          <Text style={styles.divider}>|</Text>

          <Text
            style={[
              styles.mainScore,
              state.servingTeam === "B" && styles.mainScoreActive,
            ]}
          >
            {state.teamB.score}
          </Text>
        </View>

        <View style={styles.gameBadge}>
          <Text style={styles.gameText}>GAME {state.setNumber}</Text>
        </View>

        {gamePointTeam && (
          <Text style={styles.gamePoint}>GAME POINT • TEAM {gamePointTeam}</Text>
        )}

        <View style={styles.cardsRow}>
          <TeamCard
            team={state.teamA}
            teamKey="A"
            state={state}
            onScore={() => match.scoreRally("A")}
          />

          <TeamCard
            team={state.teamB}
            teamKey="B"
            state={state}
            onScore={() => match.scoreRally("B")}
          />
        </View>

        <StatsCard state={state} duration={duration} />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.undoBtn} onPress={match.undo}>
            <Text style={styles.undoText}>↶ UNDO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.redoBtn,
              match.redoStack.length === 0 && styles.disabled,
            ]}
            onPress={match.redo}
            disabled={match.redoStack.length === 0}
          >
            <Text style={styles.redoText}>↷ REDO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} onPress={match.forceReset}>
            <Text style={styles.resetText}>⟳ RESET</Text>
          </TouchableOpacity>
        </View>

        <BottomNav
          onHistory={() => setHistoryOpen(true)}
          onStats={() => setStatsOpen(true)}
          onSettings={() => setSettingsOpen(true)}
        />
      </ScrollView>

      <CelebrationModal
        message={match.celebration}
        onNewGame={() => {
          match.startNewGame();
          onNewMatch?.();
        }}
      />

      {state.matchOver && (
        <View style={styles.winnerBanner}>
          <Text style={styles.winnerText}>
            {state.winner === "A" ? state.teamA.name : state.teamB.name} WINS
          </Text>

          <TouchableOpacity
            style={styles.newGameSmallBtn}
            onPress={() => {
              match.startNewGame();
              onNewMatch?.();
            }}
          >
            <Text style={styles.newGameSmallText}>Start New Match</Text>
          </TouchableOpacity>
        </View>
      )}

      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        state={state}
        setState={match.setState}
        resetMatch={match.forceReset}
      />

      <Modal visible={historyOpen} animationType="slide">
        <DatabaseHistoryScreen onClose={() => setHistoryOpen(false)} />
      </Modal>

      <Modal visible={statsOpen} animationType="slide">
        <StatsScreen
          state={state}
          duration={duration}
          onClose={() => setStatsOpen(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 12,
  },
  mainScoreWrap: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  mainScore: {
    color: colors.text,
    fontSize: 72,
    fontWeight: "900",
  },
  mainScoreActive: {
    color: colors.neonSoft,
  },
  divider: {
    color: "#374151",
    fontSize: 58,
    fontWeight: "300",
  },
  gameBadge: {
    alignSelf: "center",
    borderColor: colors.neon,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 6,
    marginTop: -4,
  },
  gameText: {
    color: colors.neon,
    fontWeight: "900",
  },
  gamePoint: {
    color: colors.orange,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  undoBtn: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.neon,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#071A11",
  },
  undoText: {
    color: colors.neon,
    fontWeight: "900",
  },
  redoBtn: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card2,
  },
  redoText: {
    color: colors.muted,
    fontWeight: "900",
  },
  resetBtn: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerBg,
  },
  resetText: {
    color: colors.orange,
    fontWeight: "900",
  },
  disabled: {
    opacity: 0.4,
  },
  winnerBanner: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: colors.neon,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  winnerText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 18,
  },
  newGameSmallBtn: {
    backgroundColor: "#020617",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 10,
  },
  newGameSmallText: {
    color: colors.neon,
    fontWeight: "900",
  },
});