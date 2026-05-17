import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createInitialMatchState } from "../logic/scoringEngine";
import { MatchMode, MatchState, TeamKey } from "../types/match";
import { colors } from "../styles/theme";
import { loadMatchState } from "../storage/storage";

type Props = {
  onStart: (state: MatchState) => void;
};

export default function StartMatchScreen({ onStart }: Props) {
  const [savedMatch, setSavedMatch] = useState<MatchState | null>(null);

  const [mode, setMode] = useState<MatchMode>("doubles");

  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");

  const [playerA1, setPlayerA1] = useState("");
  const [playerA2, setPlayerA2] = useState("");
  const [playerB1, setPlayerB1] = useState("");
  const [playerB2, setPlayerB2] = useState("");

  const [bestOf, setBestOf] = useState<1 | 3 | 5>(1);
  const [pointLimit, setPointLimit] = useState<11 | 15 | 21>(11);
  const [winByTwo, setWinByTwo] = useState(true);
  const [firstServeTeam, setFirstServeTeam] = useState<TeamKey>("A");

  useEffect(() => {
    checkSavedMatch();
  }, []);

  async function checkSavedMatch() {
    const data = await loadMatchState();

    if (data?.state && !data.state.matchOver) {
      setSavedMatch(data.state);
    }
  }

  function resumeMatch() {
    if (!savedMatch) return;
    onStart(savedMatch);
  }

  function startMatch() {
    const fresh = createInitialMatchState();

    const newState: MatchState = {
      ...fresh,
      teamA: {
        ...fresh.teamA,
        name: teamAName.trim() || "TEAM A",
        players:
          mode === "singles"
            ? [playerA1.trim() || "Player A"]
            : [
                playerA1.trim() || "Player A1",
                playerA2.trim() || "Player A2",
              ],
      },
      teamB: {
        ...fresh.teamB,
        name: teamBName.trim() || "TEAM B",
        players:
          mode === "singles"
            ? [playerB1.trim() || "Player B"]
            : [
                playerB1.trim() || "Player B1",
                playerB2.trim() || "Player B2",
              ],
      },
      servingTeam: firstServeTeam,
      serverIndex: 0,
      serverNumber: mode === "singles" ? 1 : 2,
      startedAt: Date.now(),
      settings: {
        bestOf,
        pointLimit,
        winByTwo,
        mode,
      },
    };

    onStart(newState);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>PickleScore</Text>
        <Text style={styles.subtitle}>Start Match Setup</Text>

        {savedMatch && (
          <TouchableOpacity style={styles.resumeBtn} onPress={resumeMatch}>
            <Text style={styles.resumeText}>Resume Last Match</Text>
            <Text style={styles.resumeSub}>
              {savedMatch.teamA.name} {savedMatch.teamA.score} -{" "}
              {savedMatch.teamB.score} {savedMatch.teamB.name}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Match Mode</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.choice, mode === "singles" && styles.activeChoice]}
              onPress={() => setMode("singles")}
            >
              <Text style={styles.choiceText}>Singles</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.choice, mode === "doubles" && styles.activeChoice]}
              onPress={() => setMode("doubles")}
            >
              <Text style={styles.choiceText}>Doubles</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Team A</Text>

          <TextInput
            style={styles.input}
            value={teamAName}
            onChangeText={setTeamAName}
            placeholder="Enter Team A Name"
            placeholderTextColor={colors.muted}
          />

          <TextInput
            style={styles.input}
            value={playerA1}
            onChangeText={setPlayerA1}
            placeholder={mode === "singles" ? "Enter Player A Name" : "Enter Player A1 Name"}
            placeholderTextColor={colors.muted}
          />

          {mode === "doubles" && (
            <TextInput
              style={styles.input}
              value={playerA2}
              onChangeText={setPlayerA2}
              placeholder="Enter Player A2 Name"
              placeholderTextColor={colors.muted}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Team B</Text>

          <TextInput
            style={styles.input}
            value={teamBName}
            onChangeText={setTeamBName}
            placeholder="Enter Team B Name"
            placeholderTextColor={colors.muted}
          />

          <TextInput
            style={styles.input}
            value={playerB1}
            onChangeText={setPlayerB1}
            placeholder={mode === "singles" ? "Enter Player B Name" : "Enter Player B1 Name"}
            placeholderTextColor={colors.muted}
          />

          {mode === "doubles" && (
            <TextInput
              style={styles.input}
              value={playerB2}
              onChangeText={setPlayerB2}
              placeholder="Enter Player B2 Name"
              placeholderTextColor={colors.muted}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Match Rules</Text>

          <Text style={styles.label}>Best of</Text>
          <View style={styles.row}>
            {[1, 3, 5].map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.choice, bestOf === v && styles.activeChoice]}
                onPress={() => setBestOf(v as 1 | 3 | 5)}
              >
                <Text style={styles.choiceText}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Point Limit</Text>
          <View style={styles.row}>
            {[11, 15, 21].map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.choice, pointLimit === v && styles.activeChoice]}
                onPress={() => setPointLimit(v as 11 | 15 | 21)}
              >
                <Text style={styles.choiceText}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Win by 2</Text>
            <Switch value={winByTwo} onValueChange={setWinByTwo} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>First Serve</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.choice,
                firstServeTeam === "A" && styles.activeChoice,
              ]}
              onPress={() => setFirstServeTeam("A")}
            >
              <Text style={styles.choiceText}>Team A</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choice,
                firstServeTeam === "B" && styles.activeChoice,
              ]}
              onPress={() => setFirstServeTeam("B")}
            >
              <Text style={styles.choiceText}>Team B</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.note}>
            {mode === "doubles"
              ? "Official doubles starts at 0-0-2."
              : "Singles starts at 0-0-1."}
          </Text>
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={startMatch}>
          <Text style={styles.startText}>Start New Match</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 18,
  },
  logo: {
    color: colors.neon,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 10,
  },
  subtitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 18,
  },
  resumeBtn: {
    backgroundColor: "#0B2713",
    borderWidth: 1,
    borderColor: colors.neon,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    alignItems: "center",
  },
  resumeText: {
    color: colors.neon,
    fontWeight: "900",
    fontSize: 18,
  },
  resumeSub: {
    color: colors.text,
    marginTop: 6,
    fontWeight: "700",
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: "#1F2937",
    color: colors.text,
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  label: {
    color: colors.text,
    fontWeight: "900",
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  choice: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  activeChoice: {
    borderColor: colors.neon,
    backgroundColor: "#0B2713",
  },
  choiceText: {
    color: colors.text,
    fontWeight: "900",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  note: {
    color: colors.muted,
    fontWeight: "800",
    marginTop: 12,
  },
  startBtn: {
    backgroundColor: colors.neon,
    height: 62,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  startText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 20,
  },
});