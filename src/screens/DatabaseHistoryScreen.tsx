import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<any | null>(null);

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

  function openDeleteModal(match: any) {
    setMatchToDelete(match);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setMatchToDelete(null);
  }

  async function confirmDelete() {
    if (!matchToDelete?.id) return;

    try {
      setDeletingId(matchToDelete.id);

      await deleteMatchHistory(matchToDelete.id);

      setMatches((prev) =>
        prev.filter((match) => match.id !== matchToDelete.id)
      );

      closeDeleteModal();
    } catch (error) {
      console.log("Delete match error:", error);
    } finally {
      setDeletingId(null);
    }
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
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.neon} size="large" />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.empty}>No saved matches yet.</Text>

          <TouchableOpacity style={styles.refreshBtn} onPress={loadMatches}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {matches.map((match, index) => {
            const teamAWon = match.winner === match.team_a_name;
            const teamBWon = match.winner === match.team_b_name;
            const isDeleting = deletingId === match.id;

            return (
              <View key={match.id} style={styles.card}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedMatch(match)}
                  disabled={isDeleting}
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

                      <Text style={styles.player} numberOfLines={1}>
                        {match.team_a_players?.[0] || "Player A1"}
                      </Text>

                      {match.team_a_players?.[1] ? (
                        <Text style={styles.player} numberOfLines={1}>
                          {match.team_a_players[1]}
                        </Text>
                      ) : null}
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

                      <Text style={styles.playerRight} numberOfLines={1}>
                        {match.team_b_players?.[0] || "Player B1"}
                      </Text>

                      {match.team_b_players?.[1] ? (
                        <Text style={styles.playerRight} numberOfLines={1}>
                          {match.team_b_players[1]}
                        </Text>
                      ) : null}
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
                  style={[
                    styles.deleteBtn,
                    isDeleting && styles.deleteBtnDisabled,
                  ]}
                  onPress={() => openDeleteModal(match)}
                  disabled={isDeleting}
                >
                  <Text style={styles.deleteText}>
                    {isDeleting ? "Deleting..." : "Delete Match"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity style={styles.refreshBtn} onPress={loadMatches}>
            <Text style={styles.refreshText}>Refresh History</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal visible={deleteModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Delete Match?</Text>

            <Text style={styles.confirmMessage}>
              Are you sure you want to delete this match history?
            </Text>

            {matchToDelete && (
              <Text style={styles.confirmMatch}>
                {matchToDelete.team_a_name} {matchToDelete.team_a_score} -{" "}
                {matchToDelete.team_b_score} {matchToDelete.team_b_name}
              </Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeDeleteModal}
                disabled={!!deletingId}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                onPress={confirmDelete}
                disabled={!!deletingId}
              >
                <Text style={styles.confirmDeleteText}>
                  {deletingId ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  loadingWrap: {
    marginTop: 60,
    alignItems: "center",
  },
  loadingText: {
    color: colors.muted,
    marginTop: 12,
    fontWeight: "800",
  },
  emptyWrap: {
    marginTop: 60,
    alignItems: "center",
  },
  empty: {
    color: colors.muted,
    textAlign: "center",
    fontWeight: "800",
    marginBottom: 16,
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
    maxWidth: "100%",
  },
  teamNameRight: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
    maxWidth: "100%",
  },
  player: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
    maxWidth: "100%",
  },
  playerRight: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "right",
    maxWidth: "100%",
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
  deleteBtnDisabled: {
    opacity: 0.5,
  },
  deleteText: {
    color: colors.orange,
    fontWeight: "900",
  },
  refreshBtn: {
    backgroundColor: "#0B2713",
    borderWidth: 1,
    borderColor: colors.neon,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  refreshText: {
    color: colors.neon,
    fontWeight: "900",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  confirmBox: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#0B1220",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  confirmMessage: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  confirmMatch: {
    color: colors.neon,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 14,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: colors.text,
    fontWeight: "900",
  },
  confirmDeleteBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDeleteText: {
    color: "#020617",
    fontWeight: "900",
  },
});