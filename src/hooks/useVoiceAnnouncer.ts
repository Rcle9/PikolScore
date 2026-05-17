import * as Speech from "expo-speech";
import { TeamKey } from "../types/match";

function stopSpeech() {
  Speech.stop();
}

function speak(text: string) {
  stopSpeech();

  Speech.speak(text, {
    rate: 0.85,
    pitch: 1,
    language: "en-US",
  });
}

function officialScoreCall(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
  if (servingTeam === "A") {
    return `${teamAScore} ${teamBScore} ${serverNumber}`;
  }

  return `${teamBScore} ${teamAScore} ${serverNumber}`;
}

export function announceScore(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
  speak(officialScoreCall(teamAScore, teamBScore, serverNumber, servingTeam));
}

export function announceSideOut(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
  stopSpeech();

  Speech.speak("Side out", {
    rate: 0.85,
    pitch: 1,
    language: "en-US",
    onDone: () => {
      setTimeout(() => {
        Speech.speak(
          officialScoreCall(teamAScore, teamBScore, serverNumber, servingTeam),
          {
            rate: 0.85,
            pitch: 1,
            language: "en-US",
          }
        );
      }, 600);
    },
  });
}

export function announceSecondServer() {
  speak("Second server");
}

export function announceWinner(teamName: string, score: string) {
  speak(`The winner is ${teamName} with the score of ${score}`);
}

export function announceTimeout(teamName: string) {
  speak(`Timeout ${teamName}`);
}

export function announceResumePlay() {
  speak("Resume play");
}

export function announceSwitchSides() {
  speak("Switch sides");
}
export function announceMatchPoint(teamName: string) {
  speak(`Match point ${teamName}`);
}