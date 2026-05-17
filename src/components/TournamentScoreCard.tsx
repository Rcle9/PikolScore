import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Team } from "../types/match";
import { colors } from "../styles/theme";

type Props = {
  team: Team;
  active: boolean;
  onPress: () => void;
  compact?: boolean;
  matchPoint?: boolean;
};

export default function TournamentScoreCard({
  team,
  active,
  onPress,
  compact = false,
  matchPoint = false,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [team.score]);

  useEffect(() => {
    if (matchPoint) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glow.stopAnimation();
      glow.setValue(0);
    }
  }, [matchPoint]);

  const borderColor = matchPoint
    ? colors.orange
    : active
    ? colors.neon
    : "#132238";

  return (
    <Animated.View
      style={[
        styles.animatedWrap,
        {
          transform: [{ scale }],
          borderColor,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.card,
          compact && styles.cardCompact,
          active && styles.activeCard,
          matchPoint && styles.matchPointCard,
        ]}
        onPress={onPress}
      >
        <View style={styles.topArea}>
          {matchPoint && <Text style={styles.matchPoint}>MATCH POINT</Text>}
          {active && <Text style={styles.serving}>● SERVING</Text>}

          <Text
            style={[styles.teamName, compact && styles.teamNameCompact]}
            numberOfLines={1}
          >
            {team.name}
          </Text>
        </View>

        <Text
          style={[
            styles.score,
            compact && styles.scoreCompact,
            matchPoint && styles.matchPointScore,
          ]}
        >
          {team.score}
        </Text>

        <View style={styles.playersWrap}>
          <Text
            style={[styles.player, compact && styles.playerCompact]}
            numberOfLines={1}
          >
            {team.players[0]}
          </Text>

          {team.players[1] ? (
            <Text
              style={[styles.player, compact && styles.playerCompact]}
              numberOfLines={1}
            >
              {team.players[1]}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedWrap: {
    flex: 1,
    minHeight: 190,
    borderRadius: 28,
    borderWidth: 2,
    overflow: "hidden",
  },
  card: {
    flex: 1,
    backgroundColor: "#07111F",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardCompact: {
    minHeight: 160,
    paddingVertical: 10,
  },
  activeCard: {
    backgroundColor: "#06210F",
  },
  matchPointCard: {
    backgroundColor: "#241006",
  },
  topArea: {
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  matchPoint: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 2,
  },
  serving: {
    color: colors.neon,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 2,
  },
  teamName: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    maxWidth: "100%",
    textAlign: "center",
  },
  teamNameCompact: {
    fontSize: 23,
  },
  score: {
    color: colors.text,
    fontSize: 104,
    fontWeight: "900",
    lineHeight: 108,
  },
  scoreCompact: {
    fontSize: 82,
    lineHeight: 86,
  },
  matchPointScore: {
    color: colors.orange,
  },
  playersWrap: {
    alignItems: "center",
    maxWidth: "100%",
    minHeight: 38,
  },
  player: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "800",
    maxWidth: "100%",
    textAlign: "center",
  },
  playerCompact: {
    fontSize: 13,
  },
});