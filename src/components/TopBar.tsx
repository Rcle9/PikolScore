import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { MatchState } from "../types/match";
import { colors } from "../styles/theme";

type Props = {
  state: MatchState;
  onUndo: () => void;
  onHistory: () => void;
  onSettings: () => void;
};

export default function TopBar({
  state,
  onUndo,
  onHistory,
  onSettings,
}: Props) {
  return (
    <View style={styles.topBar}>
      <View>
        <Text style={styles.live}>● LIVE MATCH</Text>
        <Text style={styles.info}>
          Best of {state.settings.bestOf} • {state.settings.pointLimit} pts •{" "}
          {state.settings.winByTwo ? "Win by 2" : "No win by 2"}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={onUndo}>
          <Text style={styles.btnText}>↶</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={onHistory}>
          <Text style={styles.btnText}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={onSettings}>
          <Text style={styles.btnText}>⚙</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  live: {
    color: colors.neon,
    fontSize: 18,
    fontWeight: "900",
  },
  info: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
});