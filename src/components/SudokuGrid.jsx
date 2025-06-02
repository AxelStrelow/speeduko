import React, { useEffect, useState } from "react";
import "./Sudoku.css";

// Helper to generate a completed 3x3 Sudoku grid
function generateCompleteGrid() {
  const nums = [1, 2, 3];
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);
  const baseRow = shuffle(nums);
  return [
    [...baseRow],
    [...baseRow.slice(1), baseRow[0]],
    [...baseRow.slice(2), ...baseRow.slice(0, 2)],
  ];
}

// Helper to remove numbers based on difficulty
function removeCells(grid, difficulty) {
  const levels = { easy: 2, medium: 3, hard: 4 };
  const numToRemove = levels[difficulty] || 2;
  const newGrid = grid.map((row) =>
    row.map((val) => ({ value: val, readOnly: true }))
  );
  for (let i = 0; i < numToRemove; i++) {
    const row = Math.floor(Math.random() * 3);
    const col = Math.floor(Math.random() * 3);
    newGrid[row][col] = { value: "", readOnly: false };
  }
  return newGrid;
}

const SudokuGrid = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [grid, setGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const levels = ["easy", "medium", "hard"];

  useEffect(() => {
    const fullGrid = generateCompleteGrid();
    const puzzle = removeCells(fullGrid, levels[levelIndex]);
    setGrid(puzzle);
  }, [levelIndex]);

  const handleChange = (e, rowIdx, colIdx) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 3) {
      const newGrid = [...grid];
      newGrid[rowIdx][colIdx].value = value;
      setGrid(newGrid);
    }
  };

  return (
    <div className="game-container">
      <h1 className="title">SPEEDUKO</h1>
      <div className="level-score">
        LEVEL {levelIndex + 1}<br />
        SCORE: 0
      </div>
      <div className="sudoku-grid sudoku-grid-3x3">
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <input
              key={`${rowIdx}-${colIdx}`}
              type="text"
              className="sudoku-cell"
              value={cell.value}
              onChange={(e) => handleChange(e, rowIdx, colIdx)}
              readOnly={cell.readOnly}
              maxLength={1}
            />
          ))
        )}
      </div>
      <div className="timer-box">
        ⏳ 00:00
      </div>
    </div>
  );
};

export default SudokuGrid;
