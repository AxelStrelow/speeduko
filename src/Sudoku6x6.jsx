
import React, { useState, useEffect } from 'react';

// Helper to generate a full valid 6x6 Sudoku grid
const generateFullGrid = () => {
  const base = [1, 2, 3, 4, 5, 6];

  // Shuffle rows within each band (3 bands of 2 rows)
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  let grid = Array.from({ length: 6 }, () => Array(6).fill(0));

  const isValid = (grid, row, col, num) => {
    for (let i = 0; i < 6; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }

    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 2; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }

    return true;
  };

  const fillGrid = (grid, row = 0, col = 0) => {
    if (row === 6) return true;
    if (col === 6) return fillGrid(grid, row + 1, 0);

    const nums = shuffle([...base]);
    for (let num of nums) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillGrid(grid, row, col + 1)) return true;
        grid[row][col] = 0;
      }
    }

    return false;
  };

  fillGrid(grid);
  return grid;
};

// Remove cells based on difficulty
const removeCells = (grid, difficulty) => {
  const newGrid = grid.map(row => [...row]);
  let blanks;
  if (difficulty === 'easy') blanks = 10;
  else if (difficulty === 'medium') blanks = 18;
  else blanks = 26;

  while (blanks > 0) {
    const i = Math.floor(Math.random() * 6);
    const j = Math.floor(Math.random() * 6);
    if (newGrid[i][j] !== null) {
      newGrid[i][j] = null;
      blanks--;
    }
  }

  return newGrid;
};

const Sudoku6x6 = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);

  useEffect(() => {
    const fullGrid = generateFullGrid();
    setSolution(fullGrid);
    setGrid(removeCells(fullGrid, difficulty));
  }, [difficulty]);

  return (
    <div>
      <h2>Sudoku 6x6 - {difficulty} mode</h2>
      <div>
        <button onClick={() => setDifficulty('easy')}>Easy</button>
        <button onClick={() => setDifficulty('medium')}>Medium</button>
        <button onClick={() => setDifficulty('hard')}>Hard</button>
      </div>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                type="text"
                maxLength="1"
                value={cell || ''}
                className="sudoku-cell"
                onChange={() => {}}
                readOnly={cell !== null}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sudoku6x6;
