import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MatchState } from "../types/match";
import { colors } from "../styles/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  state: MatchState;
  setState: React.Dispatch<React.SetStateAction<MatchState>>;
  resetMatch: () => void;
};

export default function SettingsModal({
  visible,
  onClose,
  state,
  setState,
  resetMatch,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Match Settings</Text>

            <Text style={styles.label}>Best of</Text>
            <View style={styles.row}>
              {[1, 3, 5].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[
                    styles.choice,
                    state.settings.bestOf === v && styles.activeChoice,
                  ]}
                  onPress={() =>
                    setState((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, bestOf: v as 1 | 3 | 5 },
                    }))
                  }
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
                  style={[
                    styles.choice,
                    state.settings.pointLimit === v && styles.activeChoice,
                  ]}
                  onPress={() =>
                    setState((prev) => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        pointLimit: v as 11 | 15 | 21,
                      },
                    }))
                  }
                >
                  <Text style={styles.choiceText}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Win by 2</Text>
              <Switch
                value={state.settings.winByTwo}
                onValueChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, winByTwo: value },
                  }))
                }
              />
            </View>

            <TextInput
              style={styles.input}
              value={state.teamA.name}
              onChangeText={(text) =>
                setState((prev) => ({
                  ...prev,
                  teamA: { ...prev.teamA, name: text },
                }))
              }
            />

            <TextInput
              style={styles.input}
              value={state.teamB.name}
              onChangeText={(text) =>
                setState((prev) => ({
                  ...prev,
                  teamB: { ...prev.teamB, name: text },
                }))
              }
            />

            <TextInput
              style={styles.input}
              value={state.teamA.players[0]}
              onChangeText={(text) =>
                setState((prev) => ({
                  ...prev,
                  teamA: {
                    ...prev.teamA,
                    players: [text, prev.teamA.players[1]],
                  },
                }))
              }
            />

            <TextInput
              style={styles.input}
              value={state.teamA.players[1]}
              onChangeText={(text) =>
                setState((prev) => ({
                  ...prev,
                  teamA: {
                    ...prev.teamA,
                    players: [prev.teamA.players[0], text],
                  },
                }))
              }
            />

            <TextInput
              style={styles.input}
              value={state.teamB.players[0]}
              onChangeText={(text) =>
                setState((prev) => ({
                  ...prev,
                  teamB: {
                    ...prev.teamB,
                    players: [text, prev.teamB.players[1]],
                  },
                }))
              }
            />

            <TextInput
              style={styles.input}
              value={state.teamB.players[1]}
              onChangeText={(text) =>
                setState((prev) => ({
                  ...prev,
                  teamB: {
                    ...prev.teamB,
                    players: [prev.teamB.players[0], text],
                  },
                }))
              }
            />

            <TouchableOpacity style={styles.resetBtn} onPress={resetMatch}>
              <Text style={styles.resetText}>Reset Match</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#080D16",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 18,
    maxHeight: "86%",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },
  label: {
    color: colors.text,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  choice: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.card2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  activeChoice: {
    backgroundColor: "#0B2713",
    borderColor: colors.neon,
  },
  choiceText: {
    color: colors.text,
    fontWeight: "900",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card2,
    borderColor: "#1F2937",
    borderWidth: 1,
    color: colors.text,
    fontWeight: "800",
    paddingHorizontal: 14,
    marginTop: 10,
  },
  resetBtn: {
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  resetText: {
    color: "#020617",
    fontWeight: "900",
  },
  doneBtn: {
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.neon,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  doneText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 16,
  },
});