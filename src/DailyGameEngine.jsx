
import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.css';

// Utility: seeded RNG (Mulberry32)
const mulberry32 = (a) => {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return (
      <div className="text-center">
        <h1 className="logo mb-2">🧠 Speeduko</h1>
        <div className="inline-block px-4 py-2 bg-black text-white rounded font-mono text-3xl tracking-wider">
          {formatTime(timeLeft)}
        </div>
        <div className="score-display relative">
          Score: {score}
          {scoreFlash && (
            <div key={scoreFlash.key} className={`score-flash ${scoreFlash.value > 0 ? 'positive' : 'negative'}`}>
              {scoreFlash.value > 0 ? `+${scoreFlash.value}` : scoreFlash.value}
            </div>
          )}
        </div>
        <div className="sudoku-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 60px)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r}-${c}`;
              const isWrong = wrongCells.includes(key);
              const isMatch = selectedValue && (cell === selectedValue || userInput[r][c] === String(selectedValue));
              return (
                <input
                  key={key}
                  className={`sudoku-cell ${isWrong ? 'bg-red-200' : ''} ${isMatch ? 'match-highlight' : ''}`}
                  type="text"
                  value={cell !== null ? cell : userInput[r][c]}
                  onChange={(e) => handleInput(r, c, e.target.value)}
                  readOnly={cell !== null}
                  onFocus={() => setSelectedValue(cell || userInput[r][c])}
                />
              );
            })
          )}
        </div>
        {gameOver && (
          <div className="mt-4">
            <div className="text-red-600 font-bold mt-4 text-lg">⏱ Game Over</div>
            <div className="text-green-600 font-bold text-lg mb-2">✅ Game Complete</div>
            <button
              className="check-btn"
              onClick={() => {
                const summary = `🧠 Speeduko Daily #${new Date().toISOString().slice(0,10)}\nScore: ${score} | Time Left: ${formatTime(timeLeft)}\nPlay at: speeduko.xyz`;
                navigator.clipboard.writeText(summary);
                alert("Results copied to clipboard!");
              }}
            >
              📋 Copy Results
            </button>
          </div>
        )}
      </div>
    );
}

export default DailyGameEngine;
