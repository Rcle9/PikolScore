import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HistoryItem } from "../types/match";
import { colors } from "../styles/theme";

type Props = {
  history: HistoryItem[];
  onClose: () => void;
  restore: (item: HistoryItem) => void;
};

export default function HistoryScreen({ history, onClose, restore }: Props) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Text style={styles.title}>Match History</Text>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {history.length === 0 ? (
          <Text style={styles.empty}>No match history yet.</Text>
        ) : (
          <View style={styles.grid}>
            {history.map((item, index) => {
              const teamAScore = item.teamA.score;
              const teamBScore = item.teamB.score;

              const teamAWon = teamAScore > teamBScore;
              const teamBWon = teamBScore > teamAScore;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => restore(item)}
                >
                  <View style={styles.roundBadge}>
                    <Text style={styles.roundText}>Round {history.length - index}</Text>
                  </View>

                  <View style={styles.matchRow}>
                    <View style={styles.teamSide}>
                      <View style={styles.avatarRow}>
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>
                            {item.teamA.players[0]?.charAt(0) || "A"}
                          </Text>
                        </View>
                        <View style={[styles.avatar, styles.avatarOverlap]}>
                          <Text style={styles.avatarText}>
                            {item.teamA.players[1]?.charAt(0) || "A"}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.teamName,
                          teamAWon && styles.winnerName,
                        ]}
                        numberOfLines={1}
                      >
                        {item.teamA.players[0]}
                      </Text>

                      <Text
                        style={[
                          styles.teamName,
                          teamAWon && styles.winnerName,
                        ]}
                        numberOfLines={1}
                      >
                        {item.teamA.players[1]}
                      </Text>
                    </View>

                    <View style={styles.scoreBox}>
                      <Text style={styles.score}>
                        {teamAScore} - {teamBScore}
                      </Text>

                      <Text style={styles.status}>
                        {item.message === "MATCH WON"
                          ? "Final"
                          : item.message === "SET WON"
                          ? "Set Won"
                          : item.message}
                      </Text>
                    </View>

                    <View style={styles.teamSideRight}>
                      <View style={styles.avatarRowRight}>
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>
                            {item.teamB.players[0]?.charAt(0) || "B"}
                          </Text>
                        </View>
                        <View style={[styles.avatar, styles.avatarOverlap]}>
                          <Text style={styles.avatarText}>
                            {item.teamB.players[1]?.charAt(0) || "B"}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.teamNameRight,
                          teamBWon && styles.winnerName,
                        ]}
                        numberOfLines={1}
                      >
                        {item.teamB.players[0]}
                      </Text>

                      <Text
                        style={[
                          styles.teamNameRight,
                          teamBWon && styles.winnerName,
                        ]}
                        numberOfLines={1}
                      >
                        {item.teamB.players[1]}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.details}>
                    <Text style={styles.detailText}>
                      Sets: {item.teamA.setsWon} - {item.teamB.setsWon}
                    </Text>

                    <Text style={styles.detailText}>
                      Rallies: {item.rallyCount}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  close: {
    color: colors.neon,
    fontWeight: "900",
    fontSize: 16,
  },
  empty: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 50,
    fontWeight: "800",
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
    borderWidth: 2,
    borderColor: "#D8CCFF",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  roundBadge: {
    alignSelf: "center",
    backgroundColor: "#F4F1FF",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 8,
  },
  roundText: {
    color: "#6D5BD0",
    fontSize: 11,
    fontWeight: "900",
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamSide: {
    flex: 1,
    alignItems: "flex-start",
  },
  teamSideRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  avatarRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  avatarRowRight: {
    flexDirection: "row",
    marginBottom: 5,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#B9FBC0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarOverlap: {
    marginLeft: -8,
    backgroundColor: "#FFD6A5",
  },
  avatarText: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "900",
  },
  teamName: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "700",
    maxWidth: 90,
  },
  teamNameRight: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    maxWidth: 90,
    textAlign: "right",
  },
  winnerName: {
    color: "#111827",
    fontWeight: "900",
  },
  scoreBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  score: {
    color: "#2563EB",
    fontSize: 20,
    fontWeight: "900",
  },
  status: {
    color: "#9CA3AF",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },
  details: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailText: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800",
  },
});