
import React, { useState, useEffect } from 'react';
import './Sudoku.css';

const LEVELS = {
  '3x3': ['easy', 'medium', 'hard'],
  '6x6': ['easy', 'medium', 'hard'],
};

const getGridSize = (phase) => {
  if (phase < 3) return 3;
  if (phase < 6) return 6;
  return 9; // placeholder for future 9x9 support
};

const getBoxSize = (gridSize) => {
  if (gridSize === 3) return [1, 3];
  if (gridSize === 6) return [2, 3];
  return [3, 3]; // 9x9
};

const generateFullGrid = (gridSize) => {
  const base = Array.from({ length: gridSize }, (_, i) => i + 1);
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const isValid = (grid, row, col, num) => {
    for (let i = 0; i < gridSize; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }

    const [boxRows, boxCols] = getBoxSize(gridSize);
    const boxRow = Math.floor(row / boxRows) * boxRows;
    const boxCol = Math.floor(col / boxCols) * boxCols;
    for (let r = boxRow; r < boxRow + boxRows; r++) {
      for (let c = boxCol; c < boxCol + boxCols; c++) {
        if (grid[r][c] === num) return false;
      }
    }

    return true;
  };

  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  const fillGrid = (row = 0, col = 0) => {
    if (row === gridSize) return true;
    if (col === gridSize) return fillGrid(row + 1, 0);

    const nums = shuffle([...base]);
    for (let num of nums) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillGrid(row, col + 1)) return true;
        grid[row][col] = 0;
      }
    }

    return false;
  };

  fillGrid();
  return grid;
};

const removeCells = (grid, blanks) => {
  const newGrid = grid.map((row) => [...row]);
  const size = grid.length;
  while (blanks > 0) {
    const i = Math.floor(Math.random() * size);
    const j = Math.floor(Math.random() * size);
    if (newGrid[i][j] !== null) {
      newGrid[i][j] = null;
      blanks--;
    }
  }
  return newGrid;
};

const GameEngine = () => {
  const [phase, setPhase] = useState(0);
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userInput, setUserInput] = useState([]);

  const gridSize = getGridSize(phase);
  const [boxRows, boxCols] = getBoxSize(gridSize);
  const totalPhases = Object.values(LEVELS).flat().length;

  useEffect(() => {
    const fullGrid = generateFullGrid(gridSize);
    setSolution(fullGrid);
    setGrid(removeCells(fullGrid, Math.floor(gridSize * 1.5)));
    setUserInput(Array.from({ length: gridSize }, () => Array(gridSize).fill("")));
  }, [phase]);

  const handleInput = (row, col, value) => {
    const newInput = [...userInput];
    newInput[row][col] = value.replace(/[^0-9]/, '').slice(0, 1);
    setUserInput(newInput);
  };

  const checkSolution = () => {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if ((grid[r][c] === null || grid[r][c] === 0) &&
            parseInt(userInput[r][c]) !== solution[r][c]) {
          return alert("Oops! Something's wrong.");
        }
      }
    }
    if (phase + 1 < totalPhases) {
      setPhase(phase + 1);
    } else {
      alert("🎉 You've completed all levels!");
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Speeduko - Level {phase + 1}</h2>
      <div className="sudoku-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 60px)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={\`\${rowIndex}-\${colIndex}\`}
              className="sudoku-cell"
              type="text"
              value={cell !== null ? cell : userInput[rowIndex][colIndex]}
              onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)}
              readOnly={cell !== null}
            />
          ))
        )}
      </div>
      <button className="check-btn mt-4" onClick={checkSolution}>
        Check & Next
      </button>
    </div>
  );
};

export default GameEngine;
