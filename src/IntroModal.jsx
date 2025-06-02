import React from 'react';

const IntroModal = ({ onStart }) => {
  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal">
        <img src="/icon.png" alt="Logo" className="logo-icon" />
        <h1 className="title">SPEEDUKO</h1>
        <p>Your mission? <strong>Rack up as many points as possible</strong> before the clock hits zero!</p>
        <ul>
          <li>Fill in the grid with no repeats in rows, columns, or boxes</li>
          <li>+10 points for each correct entry</li>
          <li>-5 points & 5 seconds lost for each mistake</li>
          <li>Finish a grid? Bonus points + time!</li>
        </ul>
        <p>⏳ This is a daily challenge! ⏳</p>
        <p>A new puzzle awaits every day. Come back tomorrow and keep your streak alive!</p>
        <button onClick={onStart} className="start-button">START</button>
      </div>
    </div>
  );
};

export default IntroModal;
