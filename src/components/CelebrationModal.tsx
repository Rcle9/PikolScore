import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

type Props = {
  message: string;
  onNewGame: () => void;
  onClose?: () => void;
};

export default function CelebrationModal({
  message,
  onNewGame,
  onClose,
}: Props) {
  if (!message) return null;

  return (
    <View style={styles.box}>
      <Text style={styles.confetti}>🎉 ✨ 🎉</Text>
      <Text style={styles.text}>{message}</Text>

      {(message === "MATCH WON" || message === "SET WON") && (
        <TouchableOpacity style={styles.newGameBtn} onPress={onNewGame}>
          <Text style={styles.newGameText}>Start New Game</Text>
        </TouchableOpacity>
      )}

      {onClose && (
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    top: "30%",
    left: 20,
    right: 20,
    backgroundColor: "#0B1220F2",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neon,
    zIndex: 99,
  },
  confetti: {
    fontSize: 34,
  },
  text: {
    color: colors.neon,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
  newGameBtn: {
    marginTop: 18,
    backgroundColor: colors.neon,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    width: "100%",
    alignItems: "center",
  },
  newGameText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: "#111827",
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 18,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  closeText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
  },
});