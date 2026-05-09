import React, { useState, useEffect, useRef } from "react";

export default function PomodoroTimer() {
  // durations in seconds
  const WORK_DURATION      = 25 * 60;
  const SHORT_BREAK        = 5  * 60;
  const LONG_BREAK         = 15 * 60;
  const CYCLES_BEFORE_LONG = 4;

  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isActive, setIsActive]       = useState(false);
  const [mode, setMode]               = useState("Work"); // "Work" | "Short Break" | "Long Break"
  const [cycle, setCycle]             = useState(0);
  const intervalRef = useRef(null);

  // format mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // handle ticking
  useEffect(() => {
    if (!isActive) return clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isActive, mode]);

  // on session end, advance to next mode
  const handleSessionEnd = () => {
    if (mode === "Work") {
      const nextCycle = cycle + 1;
      setCycle(nextCycle);
      if (nextCycle % CYCLES_BEFORE_LONG === 0) {
        setMode("Long Break");
        setSecondsLeft(LONG_BREAK);
      } else {
        setMode("Short Break");
        setSecondsLeft(SHORT_BREAK);
      }
    } else {
      // break ended → back to work
      setMode("Work");
      setSecondsLeft(WORK_DURATION);
    }
    setIsActive(true);
  };

  const handleStartPause = () => setIsActive((v) => !v);
  const handleReset      = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setMode("Work");
    setSecondsLeft(WORK_DURATION);
    setCycle(0);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Pomodoro Timer</h1>

      <div className="bg-white shadow rounded-lg p-6 text-center space-y-4">
        <p className="text-lg font-medium">{mode}</p>
        <div className="text-6xl font-mono">{formatTime(secondsLeft)}</div>
        <p className="text-sm text-gray-500">Cycle: {cycle} / {CYCLES_BEFORE_LONG}</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartPause}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {isActive ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
