
import React, { useEffect, useState } from "react";

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

  const newGrid = grid.map((row) => row.map((val) => ({ value: val, readOnly: true })));

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
  const [initialGrid, setInitialGrid] = useState([]);
  const levels = ["easy", "medium", "hard"];

  useEffect(() => {
    const fullGrid = generateCompleteGrid();
    const puzzle = removeCells(fullGrid, levels[levelIndex]);
    setInitialGrid(fullGrid);
    setGrid(puzzle);
  }, [levelIndex]);

  const handleChange = (e, rowIdx, colIdx) => {
    const value = parseInt(e.target.value);
    const newGrid = [...grid];
    newGrid[rowIdx][colIdx].value = isNaN(value) ? "" : value;
    setGrid(newGrid);

    checkCompletion(newGrid);
  };

  const checkCompletion = (currentGrid) => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (currentGrid[r][c].value !== initialGrid[r][c]) return;
      }
    }

    // If solved correctly, go to next level
    if (levelIndex < levels.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else {
      alert("🎉 All levels complete!");
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 60px)", gap: "5px" }}>
      {grid.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <input
            key={`${rowIdx}-${colIdx}`}
            value={cell.value}
            readOnly={cell.readOnly}
            onChange={(e) => handleChange(e, rowIdx, colIdx)}
            style={{
              width: "60px",
              height: "60px",
              textAlign: "center",
              fontSize: "1.5rem",
              backgroundColor: cell.readOnly ? "#e0e0e0" : "white",
              border: "1px solid #ccc",
            }}
          />
        ))
      )}
    </div>
  );
};

export default SudokuGrid;
