import React from 'react';
import './Sudoku.css';

const IntroModal = ({ onStart }) => {
  return (
    <div className="intro-container">
      <img src="/icon.png" alt="Logo Icon" className="intro-icon" />
      <h1 className="intro-title">SPEEDUKO</h1>

      <div className="intro-box">
        <p>Your mission? <strong>Rack up as many points as possible</strong> before the clock hits zero!</p>
        <ul>
          <li>Fill in the grid with no repeats in rows, columns, or boxes</li>
          <li>+10 points for each correct entry</li>
          <li>-5 points & 5 seconds lost for each mistake</li>
          <li>Finish a grid? Bonus points + time!</li>
        </ul>
        <p>⏳ This is a daily challenge! ⏳</p>
        <p>A new puzzle awaits every day. Come back tomorrow and keep your streak alive!</p>
      </div>

      <button className="start-button" onClick={onStart}>START</button>
    </div>
  );
};

export default IntroModal;
