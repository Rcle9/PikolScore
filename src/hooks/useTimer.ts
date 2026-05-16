import { useEffect, useState } from "react";

export function useTimer(startedAt: number) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const total = Math.max(0, Math.floor((now - startedAt) / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}