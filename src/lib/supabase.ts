import { createClient } from "@supabase/supabase-js";

/*
  TEMP DIRECT VALUES
  Replace with your actual values
*/

const supabaseUrl = "https://nvzpzzhlkksrjhisdjee.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52enB6emhsa2tzcmpoaXNkamVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNzQ5ODUsImV4cCI6MjA5Mzk1MDk4NX0.M_suJjM1KDNyEHVD2b7aHyUbKAc6w2UvFqbDLEFgXh0";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);