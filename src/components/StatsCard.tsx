import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { MatchState } from "../types/match";
import { colors } from "../styles/theme";

type Props = {
  state: MatchState;
  duration: string;
};

export default function StatsCard({ state, duration }: Props) {
  return (
    <View style={styles.statsCard}>
      <Stat icon="🎾" label="RALLIES" value={state.rallyCount.toString()} />
      <Stat icon="🔥" label="STREAK" value={state.longestStreak.toString()} />
      <Stat icon="🕒" label="TIME" value={duration} />
      <Stat
        icon="🏆"
        label="SETS"
        value={`${state.teamA.setsWon} - ${state.teamB.setsWon}`}
      />
    </View>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    marginTop: 14,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 4,
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 5,
  },
});