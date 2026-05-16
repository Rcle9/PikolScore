import AsyncStorage from "@react-native-async-storage/async-storage";

const MATCH_KEY = "PICKLESCORE_MATCH";

export async function saveMatchState(
  state: any,
  history: any[],
  redoStack: any[]
) {
  try {
    const payload = JSON.stringify({
      state,
      history,
      redoStack,
    });

    await AsyncStorage.setItem(MATCH_KEY, payload);
  } catch (error) {
    console.log("Save error:", error);
  }
}

export async function loadMatchState() {
  try {
    const data = await AsyncStorage.getItem(MATCH_KEY);

    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.log("Load error:", error);
    return null;
  }
}

export async function clearMatchState() {
  try {
    await AsyncStorage.removeItem(MATCH_KEY);
  } catch (error) {
    console.log("Clear error:", error);
  }
}