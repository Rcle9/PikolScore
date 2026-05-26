import React, { useState } from "react";

import LoadingScreen from "./src/screens/LoadingScreen";
import StartMatchScreen from "./src/screens/StartMatchScreen";
import TournamentScreen from "./src/screens/TournamentScreen";

import { MatchState } from "./src/types/match";

export default function App() {
  const [loading, setLoading] = useState(true);

  const [started, setStarted] = useState(false);

  const [initialState, setInitialState] =
    useState<MatchState | null>(null);

  if (loading) {
    return <LoadingScreen onFinish={() => setLoading(false)} />;
  }

  if (!started) {
    return (
      <StartMatchScreen
        onStart={(state) => {
          setInitialState(state);
          setStarted(true);
        }}
      />
    );
  }

  return (
    <TournamentScreen
      initialState={initialState}
      onNewMatch={() => {
        setStarted(false);
        setInitialState(null);
      }}
    />
  );
}