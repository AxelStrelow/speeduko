
import React, { useState, useEffect } from "react";
import DailyGameEngine from "./DailyGameEngine";
import "./Sudoku.css";

function App() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="app-container">
      <div className="timer-container">
        <span className="game-timer">{formatTime(time)}</span>
      </div>
      <DailyGameEngine />
    </div>
  );
}

export default App;
