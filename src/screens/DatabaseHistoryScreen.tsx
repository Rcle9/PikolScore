import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  deleteMatchHistory,
  getMatchHistory,
} from "../services/matchHistoryService";
import { colors } from "../styles/theme";
import MatchDetailsScreen from "./MatchDetailsScreen";

export default function DatabaseHistoryScreen({
  onClose,
}: {
  onClose: () => void;
}) {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      setLoading(true);
      const data = await getMatchHistory();
      setMatches(data || []);
    } catch (error) {
      console.log("Load match history error:", error);
    } finally {
      setLoading(false);
    }
  }

  function confirmDelete(id: string) {
    Alert.alert("Delete Match", "Are you sure you want to delete this match?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMatchHistory(id);
            await loadMatches();
          } catch (error) {
            console.log("Delete match error:", error);
          }
        },
      },
    ]);
  }

  function formatDuration(seconds: number) {
    const mins = Math.floor((seconds || 0) / 60);
    const secs = (seconds || 0) % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  if (selectedMatch) {
    return (
      <MatchDetailsScreen
        match={selectedMatch}
        onBack={() => setSelectedMatch(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Text style={styles.title}>Match History</Text>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>Close</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.neon} size="large" />
      ) : matches.length === 0 ? (
        <Text style={styles.empty}>No saved matches yet.</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {matches.map((match, index) => {
            const teamAWon = match.winner === match.team_a_name;
            const teamBWon = match.winner === match.team_b_name;

            return (
              <View key={match.id} style={styles.card}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedMatch(match)}
                >
                  <View style={styles.roundBadge}>
                    <Text style={styles.roundText}>
                      Match {matches.length - index}
                    </Text>
                  </View>

                  <View style={styles.matchRow}>
                    <View style={styles.teamSide}>
                      <Text
                        style={[styles.teamName, teamAWon && styles.winnerName]}
                        numberOfLines={1}
                      >
                        {match.team_a_name}
                      </Text>

                      <Text style={styles.player}>
                        {match.team_a_players?.[0]}
                      </Text>

                      <Text style={styles.player}>
                        {match.team_a_players?.[1]}
                      </Text>
                    </View>

                    <View style={styles.scoreBox}>
                      <Text style={styles.score}>
                        {match.team_a_score} - {match.team_b_score}
                      </Text>

                      <Text style={styles.finalText}>Final</Text>
                    </View>

                    <View style={styles.teamSideRight}>
                      <Text
                        style={[
                          styles.teamNameRight,
                          teamBWon && styles.winnerName,
                        ]}
                        numberOfLines={1}
                      >
                        {match.team_b_name}
                      </Text>

                      <Text style={styles.playerRight}>
                        {match.team_b_players?.[0]}
                      </Text>

                      <Text style={styles.playerRight}>
                        {match.team_b_players?.[1]}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <Text style={styles.detail}>
                      Sets {match.team_a_sets} - {match.team_b_sets}
                    </Text>

                    <Text style={styles.detail}>
                      Rallies {match.rally_count}
                    </Text>

                    <Text style={styles.detail}>
                      {formatDuration(match.duration_seconds)}
                    </Text>
                  </View>

                  <Text style={styles.tapText}>Tap to view details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => confirmDelete(match.id)}
                >
                  <Text style={styles.deleteText}>Delete Match</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
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
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 26,
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: "#D8CCFF",
    marginBottom: 14,
  },
  roundBadge: {
    alignSelf: "center",
    backgroundColor: "#F4F1FF",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  roundText: {
    color: "#6D5BD0",
    fontSize: 12,
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
  teamName: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  teamNameRight: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
  },
  player: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  playerRight: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "right",
  },
  winnerName: {
    color: "#111827",
    fontWeight: "900",
  },
  scoreBox: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  score: {
    color: "#2563EB",
    fontSize: 22,
    fontWeight: "900",
  },
  finalText: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  detailsRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detail: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800",
  },
  tapText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
  deleteBtn: {
    marginTop: 10,
    backgroundColor: "#2A0E0E",
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: 12,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: colors.orange,
    fontWeight: "900",
  },
});