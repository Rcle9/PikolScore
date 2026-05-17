import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

import StartMatchScreen from "./src/screens/StartMatchScreen";
import TournamentScreen from "./src/screens/TournamentScreen";
import { MatchState } from "./src/types/match";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [started, setStarted] = useState(false);
  const [initialState, setInitialState] = useState<MatchState | null>(null);
  const [splashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function showSplashLonger() {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 seconds
      await SplashScreen.hideAsync();
      setSplashReady(true);
    }

    showSplashLonger();
  }, []);

  if (!splashReady) {
    return null;
  }

  return started && initialState ? (
    <TournamentScreen
      initialState={initialState}
      onNewMatch={() => {
        setStarted(false);
        setInitialState(null);
      }}
    />
  ) : (
    <StartMatchScreen
      onStart={(state) => {
        setInitialState(state);
        setStarted(true);
      }}
    />
  );
}