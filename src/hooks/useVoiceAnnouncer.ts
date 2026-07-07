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

<<<<<<< HEAD
export function getOfficialScoreCall(
=======
function officialScoreCall(
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
<<<<<<< HEAD
  return servingTeam === "A"
    ? `${teamAScore} ${teamBScore} ${serverNumber}`
    : `${teamBScore} ${teamAScore} ${serverNumber}`;
=======
  if (servingTeam === "A") {
    return `${teamAScore} ${teamBScore} ${serverNumber}`;
  }

  return `${teamBScore} ${teamAScore} ${serverNumber}`;
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
}

export function announceScore(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
<<<<<<< HEAD
  speak(getOfficialScoreCall(teamAScore, teamBScore, serverNumber, servingTeam));
}

export function announceStartScore(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: TeamKey
) {
  speak(getOfficialScoreCall(teamAScore, teamBScore, serverNumber, servingTeam));
=======
  speak(officialScoreCall(teamAScore, teamBScore, serverNumber, servingTeam));
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
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
<<<<<<< HEAD
          getOfficialScoreCall(
            teamAScore,
            teamBScore,
            serverNumber,
            servingTeam
          ),
=======
          officialScoreCall(teamAScore, teamBScore, serverNumber, servingTeam),
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
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

<<<<<<< HEAD
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
=======
export function announceSecondServer() {
  speak("Second server");
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
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
<<<<<<< HEAD

=======
>>>>>>> 94e3cae3c44360180896855606db2479985c62fa
export function announceMatchPoint(teamName: string) {
  speak(`Match point ${teamName}`);
}