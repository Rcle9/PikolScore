import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../styles/theme";

type Props = {
  match: any;
  onBack: () => void;
};

export default function MatchDetailsScreen({ match, onBack }: Props) {
  function formatDuration(seconds: number) {
    const mins = Math.floor((seconds || 0) / 60);
    const secs = (seconds || 0) % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const rallies = Array.isArray(match.history) ? match.history : [];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Text style={styles.title}>Match Details</Text>

        <TouchableOpacity onPress={onBack}>
          <Text style={styles.close}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.teamTitle}>
            {match.team_a_name} vs {match.team_b_name}
          </Text>

          <Text style={styles.score}>
            {match.team_a_score} - {match.team_b_score}
          </Text>

          <Text style={styles.winner}>Winner: {match.winner || "None"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Players</Text>

          <Text style={styles.text}>
            {match.team_a_name}: {match.team_a_players?.join(" / ")}
          </Text>

          <Text style={styles.text}>
            {match.team_b_name}: {match.team_b_players?.join(" / ")}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Game Summary</Text>

          <Text style={styles.text}>
            Sets: {match.team_a_sets} - {match.team_b_sets}
          </Text>

          <Text style={styles.text}>Best of: {match.best_of}</Text>

          <Text style={styles.text}>Point Limit: {match.point_limit}</Text>

          <Text style={styles.text}>
            Win by 2: {match.win_by_two ? "Yes" : "No"}
          </Text>

          <Text style={styles.text}>Rallies: {match.rally_count}</Text>

          <Text style={styles.text}>
            Longest Streak: {match.longest_streak}
          </Text>

          <Text style={styles.text}>
            Duration: {formatDuration(match.duration_seconds)}
          </Text>

          <Text style={styles.text}>
            Date: {new Date(match.created_at).toLocaleString()}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Rally Log</Text>

          {rallies.length === 0 ? (
            <Text style={styles.muted}>No rally log saved.</Text>
          ) : (
            rallies.map((rally: any, index: number) => (
              <View key={index} style={styles.rallyItem}>
                <Text style={styles.rallyTitle}>
                  Rally {rallies.length - index} • Team {rally.rallyWinner}
                </Text>

                <Text style={styles.rallyText}>{rally.message}</Text>

                <Text style={styles.rallyScore}>
                  Score after: {rally.scoreAfter}
                </Text>
              </View>
            ))
          )}
        </View>
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
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
  },
  close: {
    color: colors.neon,
    fontWeight: "900",
    fontSize: 16,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderColor: colors.neon,
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    marginBottom: 14,
  },
  teamTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  score: {
    color: colors.neon,
    fontSize: 54,
    fontWeight: "900",
    marginTop: 8,
  },
  winner: {
    color: colors.text,
    fontWeight: "900",
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  section: {
    color: colors.neon,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },
  text: {
    color: colors.text,
    fontWeight: "800",
    marginBottom: 8,
  },
  muted: {
    color: colors.muted,
    fontWeight: "800",
  },
  rallyItem: {
    backgroundColor: colors.card2,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rallyTitle: {
    color: colors.text,
    fontWeight: "900",
  },
  rallyText: {
    color: colors.muted,
    fontWeight: "800",
    marginTop: 4,
  },
  rallyScore: {
    color: colors.neon,
    fontWeight: "900",
    marginTop: 4,
  },
});