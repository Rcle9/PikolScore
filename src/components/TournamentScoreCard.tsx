import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Team } from "../types/match";
import { colors } from "../styles/theme";

type Props = {
  team: Team;
  active: boolean;
  onPress: () => void;
  compact?: boolean;
};

export default function TournamentScoreCard({
  team,
  active,
  onPress,
  compact = false,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, compact && styles.cardCompact, active && styles.activeCard]}
      onPress={onPress}
    >
      <View style={styles.topArea}>
        {active && <Text style={styles.serving}>● SERVING</Text>}

        <Text style={[styles.teamName, compact && styles.teamNameCompact]} numberOfLines={1}>
          {team.name}
        </Text>
      </View>

      <Text style={[styles.score, compact && styles.scoreCompact]}>
        {team.score}
      </Text>

      <View style={styles.playersWrap}>
        <Text style={[styles.player, compact && styles.playerCompact]} numberOfLines={1}>
          {team.players[0]}
        </Text>
        <Text style={[styles.player, compact && styles.playerCompact]} numberOfLines={1}>
          {team.players[1]}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 190,
    backgroundColor: "#07111F",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#132238",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: "hidden",
  },
  cardCompact: {
    minHeight: 160,
    borderRadius: 24,
    paddingVertical: 10,
  },
  activeCard: {
    borderColor: colors.neon,
    backgroundColor: "#06210F",
  },
  topArea: {
    alignItems: "center",
    minHeight: 40,
    justifyContent: "center",
  },
  serving: {
    color: colors.neon,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 2,
  },
  teamName: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    maxWidth: "100%",
    textAlign: "center",
  },
  teamNameCompact: {
    fontSize: 23,
  },
  score: {
    color: colors.text,
    fontSize: 104,
    fontWeight: "900",
    lineHeight: 108,
  },
  scoreCompact: {
    fontSize: 82,
    lineHeight: 86,
  },
  playersWrap: {
    alignItems: "center",
    maxWidth: "100%",
    minHeight: 38,
  },
  player: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "800",
    maxWidth: "100%",
    textAlign: "center",
  },
  playerCompact: {
    fontSize: 13,
  },
});