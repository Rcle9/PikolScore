import { supabase } from "../lib/supabase";
import { HistoryItem, MatchState } from "../types/match";

export async function saveMatchHistory(
  state: MatchState,
  history: HistoryItem[]
) {
  const durationSeconds = Math.floor((Date.now() - state.startedAt) / 1000);

  const { data, error } = await supabase.from("match_history").insert({
    team_a_name: state.teamA.name,
    team_b_name: state.teamB.name,
    team_a_players: state.teamA.players,
    team_b_players: state.teamB.players,
    team_a_score: state.teamA.score,
    team_b_score: state.teamB.score,
    team_a_sets: state.teamA.setsWon,
    team_b_sets: state.teamB.setsWon,
    winner:
      state.winner === "A"
        ? state.teamA.name
        : state.winner === "B"
        ? state.teamB.name
        : null,
    point_limit: state.settings.pointLimit,
    best_of: state.settings.bestOf,
    win_by_two: state.settings.winByTwo,
    rally_count: state.rallyCount,
    longest_streak: state.longestStreak,
    duration_seconds: durationSeconds,
    history: history,
  });

  if (error) throw error;

  return data;
}

export async function getMatchHistory() {
  const { data, error } = await supabase
    .from("match_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function deleteMatchHistory(id: string) {
  const { error } = await supabase
    .from("match_history")
    .delete()
    .eq("id", id);

  if (error) throw error;
}