import React, { useState } from 'react';
import SudokuGrid from './components/SudokuGrid';
import './Sudoku.css';

const App = () => {
  // State to manage level and score
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  // Example score update function (you should call this where appropriate in gameplay logic)
  const handleScoreUpdate = (points) => {
    if (typeof points !== 'number' || isNaN(points)) return; // Error handling
    setScore(prev => Math.max(0, prev + points)); // Avoid negative score
  };

  // Example level update function (call as player progresses)
  const handleLevelUp = () => {
    setLevel(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <div className="game-header">
        {/* Level and Score Display */}
        <div className="status-display">
          <div className="status-item">
            <span className="status-label">Level</span>
            <span className="status-value">{level}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Score</span>
            <span className="status-value">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Game Grid */}
      <SudokuGrid />
    </div>
  );
};

export default App;
