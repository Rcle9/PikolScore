import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { MatchState, Team, TeamKey } from "../types/match";
import {
  getServerDisplay,
  getServerName,
  getServingCourt,
} from "../logic/scoringEngine";
import { colors } from "../styles/theme";

type Props = {
  team: Team;
  teamKey: TeamKey;
  state: MatchState;
  onScore: () => void;
};

export default function TeamCard({ team, teamKey, state, onScore }: Props) {
  const active = state.servingTeam === teamKey;

  return (
    <View style={[styles.card, active && styles.activeCard]}>
      {active && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>● SERVING</Text>
        </View>
      )}

      <Text style={styles.teamName}>{team.name}</Text>
      <Text style={styles.players}>
        {team.players[0]} / {team.players[1]}
      </Text>

      <Text style={styles.score}>{team.score}</Text>

      <View style={styles.line} />

      <Text style={styles.label}>{active ? "SERVER" : "RECEIVING"}</Text>

      <Text style={styles.serverName}>
        {active ? getServerName(state) : "—"}
      </Text>

      <Text style={styles.serverState}>
        {active ? getServerDisplay(state) : "Waiting for serve"}
      </Text>

      {active && (
        <View style={styles.courtBadge}>
          <Text style={styles.courtText}>{getServingCourt(state)}</Text>
        </View>
      )}

      <View style={styles.playerDots}>
        <View
          style={[
            styles.dot,
            active && state.serverIndex === 0 && styles.dotActive,
          ]}
        >
          <Text style={styles.dotText}>{teamKey}1</Text>
        </View>

        <View
          style={[
            styles.dot,
            active && state.serverIndex === 1 && styles.dotActive,
          ]}
        >
          <Text style={styles.dotText}>{teamKey}2</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.plusBtn} onPress={onScore}>
        <Text style={styles.plusText}>+1</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 455,
    backgroundColor: colors.card,
    borderRadius: 26,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCard: {
    borderColor: colors.neon,
    backgroundColor: "#071A11",
  },
  badge: {
    backgroundColor: "#153D10",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  badgeText: {
    color: colors.neonSoft,
    fontWeight: "900",
    fontSize: 12,
  },
  teamName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  players: {
    color: "#B8BEC9",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  score: {
    color: colors.text,
    fontSize: 96,
    fontWeight: "900",
    marginTop: 10,
  },
  line: {
    height: 1,
    backgroundColor: "#3D4656",
    width: "100%",
    marginBottom: 10,
  },
  label: {
    color: colors.neonSoft,
    fontSize: 12,
    fontWeight: "900",
  },
  serverName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 4,
  },
  serverState: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },
  courtBadge: {
    marginTop: 8,
    backgroundColor: "#102215",
    borderColor: colors.neon,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  courtText: {
    color: colors.neon,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  playerDots: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 14,
  },
  dot: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card2,
  },
  dotActive: {
    backgroundColor: colors.neonSoft,
    borderColor: colors.neonSoft,
  },
  dotText: {
    color: colors.text,
    fontWeight: "900",
  },
  plusBtn: {
    width: "100%",
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.neon,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#020617",
    fontSize: 42,
    fontWeight: "900",
  },
});