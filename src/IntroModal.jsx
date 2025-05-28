
import React from 'react';

const IntroModal = ({ onStart }) => {
  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal">
        <h2 className="text-2xl font-bold mb-4">🧠 Welcome to <span className="text-indigo-600">Speeduko</span>!</h2>
        <p className="mb-2">Your mission? <strong>Rack up as many points as possible</strong> before the clock hits zero!</p>
        <ul className="text-left list-disc list-inside mb-4 text-sm">
          <li>Fill in the grid with no repeats in rows, columns, or boxes.</li>
          <li><strong>+10 points</strong> for each correct entry</li>
          <li><strong>-5 points & 5 seconds</strong> lost for each mistake</li>
          <li>Finish a grid? <strong>Bonus points + time!</strong></li>
        </ul>
        <p className="mb-4 text-sm text-gray-600">⏳ This is a <strong>daily challenge</strong> — a new puzzle awaits every day. Come back tomorrow and keep your streak alive!</p>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-2xl shadow-md transition"
          onClick={onStart}
        >
          🚀 Start
        </button>
      </div>
    </div>
  );
};

export default IntroModal;
