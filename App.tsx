<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Session } from "@supabase/supabase-js";

import LoadingScreen from "./src/screens/LoadingScreen";
import AuthScreen from "./src/screens/AuthScreen";
=======
import React, { useState } from "react";

import LoadingScreen from "./src/screens/LoadingScreen";
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
import StartMatchScreen from "./src/screens/StartMatchScreen";
import TournamentScreen from "./src/screens/TournamentScreen";

import { MatchState } from "./src/types/match";
<<<<<<< HEAD
import { supabase } from "./src/lib/supabase";
import { colors } from "./src/styles/theme";

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  const [session, setSession] = useState<Session | null>(null);

  const [started, setStarted] = useState(false);
  const [initialState, setInitialState] = useState<MatchState | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);

        if (!currentSession) {
          setStarted(false);
          setInitialState(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setStarted(false);
    setInitialState(null);
  }

  if (appLoading) {
    return <LoadingScreen onFinish={() => setAppLoading(false)} />;
  }

  if (authLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={colors.neon} size="large" />
      </View>
    );
  }

  if (!session) {
    return <AuthScreen />;
=======

export default function App() {
  const [loading, setLoading] = useState(true);

  const [started, setStarted] = useState(false);

  const [initialState, setInitialState] =
    useState<MatchState | null>(null);

  if (loading) {
    return <LoadingScreen onFinish={() => setLoading(false)} />;
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
  }

  if (!started) {
    return (
<<<<<<< HEAD
      <View style={styles.appWrap}>
        <View style={styles.userBar}>
          <Text style={styles.email} numberOfLines={1}>
            {session.user.email}
          </Text>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <StartMatchScreen
          onStart={(state) => {
            setInitialState(state);
            setStarted(true);
          }}
        />
      </View>
=======
      <StartMatchScreen
        onStart={(state) => {
          setInitialState(state);
          setStarted(true);
        }}
      />
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
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
<<<<<<< HEAD
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
  },
  appWrap: {
    flex: 1,
    backgroundColor: "#020617",
  },
  userBar: {
    backgroundColor: "#020617",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  email: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    flex: 1,
    marginRight: 10,
  },
  logoutBtn: {
    backgroundColor: "#2A0E0E",
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "900",
  },
});
=======
}
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
