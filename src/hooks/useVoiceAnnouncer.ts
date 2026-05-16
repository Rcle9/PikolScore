import * as Speech from "expo-speech";

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

function getOfficialScoreCall(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: "A" | "B"
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
  servingTeam: "A" | "B"
) {
  const scoreCall = getOfficialScoreCall(
    teamAScore,
    teamBScore,
    serverNumber,
    servingTeam
  );

  speak(scoreCall);
}

export function announceSideOut(
  teamAScore: number,
  teamBScore: number,
  serverNumber: number,
  servingTeam: "A" | "B"
) {
  stopSpeech();

  Speech.speak("Side out", {
    rate: 0.85,
    pitch: 1,
    language: "en-US",
    onDone: () => {
      setTimeout(() => {
        const scoreCall = getOfficialScoreCall(
          teamAScore,
          teamBScore,
          serverNumber,
          servingTeam
        );

        Speech.speak(scoreCall, {
          rate: 0.85,
          pitch: 1,
          language: "en-US",
        });
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