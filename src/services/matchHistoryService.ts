import { supabase } from "../lib/supabase";
import { HistoryItem, MatchState } from "../types/match";

<<<<<<< HEAD
async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log("Get user error:", error);
    throw error;
  }

  if (!data.user) {
    throw new Error("User is not logged in.");
  }

  return data.user.id;
}

=======
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
export async function saveMatchHistory(
  state: MatchState,
  history: HistoryItem[]
) {
<<<<<<< HEAD
  const userId = await getCurrentUserId();

  const durationSeconds = Math.floor((Date.now() - state.startedAt) / 1000);

  const { data, error } = await supabase.from("match_history").insert({
    user_id: userId,

    team_a_name: state.teamA.name,
    team_b_name: state.teamB.name,

    team_a_players: state.teamA.players,
    team_b_players: state.teamB.players,

    team_a_score: state.teamA.score,
    team_b_score: state.teamB.score,

    team_a_sets: state.teamA.setsWon,
    team_b_sets: state.teamB.setsWon,

=======
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
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
    winner:
      state.winner === "A"
        ? state.teamA.name
        : state.winner === "B"
        ? state.teamB.name
        : null,
<<<<<<< HEAD

    point_limit: state.settings.pointLimit,
    best_of: state.settings.bestOf,
    win_by_two: state.settings.winByTwo,

    rally_count: state.rallyCount,
    longest_streak: state.longestStreak,
    duration_seconds: durationSeconds,

=======
    point_limit: state.settings.pointLimit,
    best_of: state.settings.bestOf,
    win_by_two: state.settings.winByTwo,
    rally_count: state.rallyCount,
    longest_streak: state.longestStreak,
    duration_seconds: durationSeconds,
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
    history,
  });

  if (error) {
    console.log("Save match history error:", error);
    throw error;
  }

  return data;
}

export async function getMatchHistory() {
<<<<<<< HEAD
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("match_history")
    .select("*")
    .eq("user_id", userId)
=======
  const { data, error } = await supabase
    .from("match_history")
    .select("*")
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Fetch match history error:", error);
    throw error;
  }

  return data || [];
}

export async function deleteMatchHistory(id: string) {
<<<<<<< HEAD
  const userId = await getCurrentUserId();
=======
  console.log("Supabase deleting id:", id);
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa

  if (!id) {
    throw new Error("Missing match id");
  }

  const { data, error } = await supabase
    .from("match_history")
    .delete()
    .eq("id", id)
<<<<<<< HEAD
    .eq("user_id", userId)
=======
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
    .select();

  if (error) {
    console.log("Delete match history error:", error);
    throw error;
  }

<<<<<<< HEAD
=======
  console.log("Deleted rows:", data);

>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
  return data;
}