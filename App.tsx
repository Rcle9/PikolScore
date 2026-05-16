import React, { useState } from "react";
import StartMatchScreen from "./src/screens/StartMatchScreen";
import TournamentScreen from "./src/screens/TournamentScreen";
import { MatchState } from "./src/types/match";

export default function App() {
  const [started, setStarted] = useState(false);
  const [initialState, setInitialState] = useState<MatchState | null>(null);

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