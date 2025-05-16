
import React, { useState, useEffect } from 'react';

// Helper to generate a full valid 3x3 Sudoku (Latin square)
const generateFullGrid = () => {
  const base = [1, 2, 3];
  for (let i = base.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  return [
    [...base],
    [base[1], base[2], base[0]],
    [base[2], base[0], base[1]],
  ];
};

// Remove cells based on difficulty
const removeCells = (grid, difficulty) => {
  const newGrid = grid.map(row => [...row]);
  let blanks = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6;
  while (blanks > 0) {
    const i = Math.floor(Math.random() * 3);
    const j = Math.floor(Math.random() * 3);
    if (newGrid[i][j] !== null) {
      newGrid[i][j] = null;
      blanks--;
    }
  }
  return newGrid;
};

const Sudoku3x3 = () => {
  const [level, setLevel] = useState(0);
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const difficulties = ['easy', 'medium', 'hard'];

  const generatePuzzle = (level) => {
    const full = generateFullGrid();
    const puzzle = removeCells(full, difficulties[level]);
    setSolution(full);
    setGrid(puzzle);
  };

  useEffect(() => {
    generatePuzzle(level);
  }, [level]);

  const handleChange = (row, col, value) => {
    const val = parseInt(value);
    if (isNaN(val) || val < 1 || val > 3) return;

    const newGrid = grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? val : c))
    );
    setGrid(newGrid);

    // Check for match
    const isCorrect = newGrid.every((r, i) =>
      r.every((cell, j) => cell === solution[i][j])
    );
    if (isCorrect && level < 2) {
      setTimeout(() => setLevel(level + 1), 500); // next level
    }
  };

  return (
    <div className="sudoku-container">
      <h2>Speeduko 3×3 - {difficulties[level].toUpperCase()}</h2>
      <div className="sudoku-grid">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              className="sudoku-cell"
              type="text"
              value={cell === null ? '' : cell}
              onChange={(e) => handleChange(i, j, e.target.value)}
              disabled={solution[i][j] !== null && grid[i][j] === solution[i][j]}
              maxLength={1}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Sudoku3x3;
