import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LoadingScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const loadingWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

    Animated.timing(loadingWidth, {
      toValue: width * 0.72,
      duration: 2600,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(57,255,20,0.3)", "rgba(57,255,20,1)"],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Animated.View
        style={[
          styles.logoWrap,
          {
            transform: [{ scale: scaleAnim }],
            shadowColor: "#39FF14",
            shadowOpacity: glowAnim,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.logo,
            {
              color: glowColor,
            },
          ]}
        >
          PICKLESCORE
        </Animated.Text>

        <Text style={styles.subtitle}>
          OFFICIAL TOURNAMENT SCOREBOARD
        </Text>
      </Animated.View>

      <View style={styles.loaderBackground}>
        <Animated.View
          style={[
            styles.loaderFill,
            {
              width: loadingWidth,
            },
          ]}
        />
      </View>

      <Text style={styles.loadingText}>Loading Match System...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  logoWrap: {
    alignItems: "center",
    marginBottom: 80,
    shadowRadius: 30,
  },

  logo: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 4,
  },

  subtitle: {
    color: "#94A3B8",
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
  },

  loaderBackground: {
    width: width * 0.72,
    height: 8,
    backgroundColor: "#111827",
    borderRadius: 999,
    overflow: "hidden",
  },

  loaderFill: {
    height: "100%",
    backgroundColor: "#39FF14",
    borderRadius: 999,
  },

  loadingText: {
    color: "#CBD5E1",
    marginTop: 18,
    fontSize: 14,
    fontWeight: "700",
  },
});