
import React, { useState } from 'react';
import './Sudoku.css'; // You can define styles for grid, cells etc.

const initialGrid = [
  [1, 2, null],
  [2, null, 1],
  [3, 1, 2],
];

const Sudoku3x3 = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [message, setMessage] = useState('');

  const handleChange = (row, col, value) => {
    const val = parseInt(value);
    if (isNaN(val) || val < 1 || val > 3) return;

    const newGrid = grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? val : c))
    );
    setGrid(newGrid);
  };

  const checkSolution = () => {
    const isValid = () => {
      for (let i = 0; i < 3; i++) {
        const rowSet = new Set();
        const colSet = new Set();
        for (let j = 0; j < 3; j++) {
          const rowVal = grid[i][j];
          const colVal = grid[j][i];
          if (!rowVal || !colVal || rowSet.has(rowVal) || colSet.has(colVal)) {
            return false;
          }
          rowSet.add(rowVal);
          colSet.add(colVal);
        }
      }
      return true;
    };
    setMessage(isValid() ? '✅ Correct!' : '❌ Try again.');
  };

  return (
    <div className="sudoku-container">
      <h2>Speeduko 3x3</h2>
      <div className="sudoku-grid">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              className="sudoku-cell"
              type="text"
              value={cell === null ? '' : cell}
              onChange={(e) => handleChange(i, j, e.target.value)}
              disabled={initialGrid[i][j] !== null}
              maxLength={1}
            />
          ))
        )}
      </div>
      <button onClick={checkSolution} className="check-btn">Check</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Sudoku3x3;
