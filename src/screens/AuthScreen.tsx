import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "../lib/supabase";
import { colors } from "../styles/theme";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAuth() {
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    setMessage("");

    if (!cleanEmail || !cleanPassword) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (cleanPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          if (error.message.toLowerCase().includes("invalid login")) {
            setMessage("Invalid email or password.");
          } else if (error.message.toLowerCase().includes("email not confirmed")) {
            setMessage("Please confirm your email first, or turn off email confirmation in Supabase while testing.");
          } else {
            setMessage(error.message);
          }

          return;
        }
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          if (error.status === 429) {
            setMessage("Too many attempts. Please wait a few minutes and try again.");
          } else if (error.message.toLowerCase().includes("already")) {
            setMessage("This email already has an account. Please log in instead.");
            setMode("login");
          } else {
            setMessage(error.message);
          }

          return;
        }

        if (data.user && !data.session) {
          setMessage("Account created. Please check your email to confirm your account, or disable email confirmation in Supabase for testing.");
          setMode("login");
          return;
        }

        setMessage("Account created successfully.");
      }
    } catch (error: any) {
      setMessage(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>PickleScore</Text>
        <Text style={styles.subtitle}>Official Tournament Scoreboard</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, mode === "login" && styles.activeTab]}
            onPress={() => {
              setMode("login");
              setMessage("");
            }}
            disabled={loading}
          >
            <Text
              style={[
                styles.tabText,
                mode === "login" && styles.activeTabText,
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, mode === "signup" && styles.activeTab]}
            onPress={() => {
              setMode("signup");
              setMessage("");
            }}
            disabled={loading}
          >
            <Text
              style={[
                styles.tabText,
                mode === "signup" && styles.activeTabText,
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          secureTextEntry
          editable={!loading}
        />

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity
          style={[styles.mainBtn, loading && styles.disabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <Text style={styles.mainBtnText}>
              {mode === "login" ? "Login" : "Create Account"}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          Your match history will be saved privately to your account.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#07111F",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 28,
    padding: 22,
  },
  logo: {
    color: colors.neon,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    letterSpacing: 1,
  },
  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderColor: colors.neon,
    backgroundColor: "#0B2713",
  },
  tabText: {
    color: colors.muted,
    fontWeight: "900",
  },
  activeTabText: {
    color: colors.neon,
  },
  input: {
    height: 52,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 16,
    color: colors.text,
    paddingHorizontal: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  message: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 18,
  },
  mainBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.neon,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  mainBtnText: {
    color: "#020617",
    fontSize: 17,
    fontWeight: "900",
  },
  note: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 16,
    lineHeight: 18,
  },
});