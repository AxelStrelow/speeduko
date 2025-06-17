
import React from 'react';

const IntroModal = ({ onStart }) => {
  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal">
        <div className="game-header-wrapper">
          <div className="logo-grid tight">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="logo-cell" />
            ))}
          </div>
          <h1 className="game-title">SPEEDUKO</h1>
        </div>

        <div className="modal-text-box">
          <p>Your mission? <strong>Rack up as many points as possible</strong> before the clock hits zero!</p>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <li>Fill in the grid with no repeats in rows, columns, or boxes</li>
            <li>+10 points for each correct entry</li>
            <li>-100 points & 5 seconds lost for each mistake</li>
            <li>Finish a grid? Bonus points + time!</li>
          </ul>
          <p>⏳ This is a daily challenge! ⏳</p>
          <p>A new puzzle awaits every day. Come back tomorrow and keep your streak alive!</p>
        </div>

        <button onClick={onStart} className="start-button fredoka-font">START</button>
      </div>
    </div>
  );
};

export default IntroModal;
