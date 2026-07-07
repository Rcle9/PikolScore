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

export function getOfficialScoreCall(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
  return servingTeam === "A"
    ? `${teamAScore} ${teamBScore} ${serverNumber}`
    : `${teamBScore} ${teamAScore} ${serverNumber}`;
}

export function announceScore(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
  speak(getOfficialScoreCall(teamAScore, teamBScore, serverNumber, servingTeam));
}

export function announceStartScore(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
  speak(getOfficialScoreCall(teamAScore, teamBScore, serverNumber, servingTeam));
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
          getOfficialScoreCall(
            teamAScore,
            teamBScore,
            serverNumber,
            servingTeam
          ),
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

export function announceSecondServer(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
  stopSpeech();

  Speech.speak("Second server", {
    rate: 0.85,
    pitch: 1,
    language: "en-US",
    onDone: () => {
      setTimeout(() => {
        Speech.speak(
          getOfficialScoreCall(teamAScore, teamBScore, serverNumber, servingTeam),
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