import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MatchState } from "../types/match";
import {
  getServerDisplay,
  getServerName,
  getServingCourt,
} from "../logic/scoringEngine";
import { colors } from "../styles/theme";

type Props = {
  state: MatchState;
  duration: string;
  onClose: () => void;
};

export default function StatsScreen({ state, duration, onClose }: Props) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Text style={styles.title}>Match Stats</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>Close</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.stat}>Rallies: {state.rallyCount}</Text>
        <Text style={styles.stat}>Longest Streak: {state.longestStreak}</Text>
        <Text style={styles.stat}>Duration: {duration}</Text>
        <Text style={styles.stat}>
          Sets: {state.teamA.setsWon} - {state.teamB.setsWon}
        </Text>
        <Text style={styles.stat}>Current Server: {getServerName(state)}</Text>
        <Text style={styles.stat}>Server State: {getServerDisplay(state)}</Text>
        <Text style={styles.stat}>Court: {getServingCourt(state)}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 18,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },
  close: {
    color: colors.neon,
    fontWeight: "900",
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  stat: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 18,
    marginBottom: 14,
  },
});