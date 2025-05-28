import React from 'react';
import './Sudoku.css';

const IntroModal = ({ onStart }) => {
  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal">
        <h2>Welcome to 🧠 Speeduko</h2>
        <ul>
          <li>Fill in the grid with no repeats in rows, columns, or boxes</li>
          <li>+10 points for each correct entry</li>
          <li>-5 points & 5 seconds lost for each mistake</li>
          <li>Finish a grid? Bonus points + time!</li>
        </ul>
        <p>This is a daily challenge — come back tomorrow for a new puzzle!</p>
        <button onClick={onStart}>Start Game</button>
      </div>
    </div>
  );
};

export default IntroModal;
