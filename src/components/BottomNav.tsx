import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

type Props = {
  onHistory: () => void;
  onStats: () => void;
  onSettings: () => void;
};

export default function BottomNav({ onHistory, onStats, onSettings }: Props) {
  return (
    <View style={styles.nav}>
      <TouchableOpacity style={styles.active}>
        <Text style={styles.activeIcon}>▣</Text>
        <Text style={styles.activeText}>SCORE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={onHistory}>
        <Text style={styles.icon}>☰</Text>
        <Text style={styles.text}>HISTORY</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={onStats}>
        <Text style={styles.icon}>▥</Text>
        <Text style={styles.text}>STATS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={onSettings}>
        <Text style={styles.icon}>•••</Text>
        <Text style={styles.text}>MORE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    marginTop: 18,
    marginBottom: 18,
    flexDirection: "row",
    backgroundColor: "#070D16",
    borderRadius: 22,
    padding: 8,
    justifyContent: "space-around",
  },
  active: {
    backgroundColor: "#0B2713",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  activeIcon: {
    color: colors.neon,
    fontSize: 22,
    fontWeight: "900",
  },
  icon: {
    color: "#D1D5DB",
    fontSize: 22,
    fontWeight: "900",
  },
  activeText: {
    color: colors.neon,
    fontSize: 10,
    fontWeight: "900",
  },
  text: {
    color: "#A1A1AA",
    fontSize: 10,
    fontWeight: "900",
  },
});