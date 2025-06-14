
import React, { useEffect, useState } from "react";
import '../Sudoku.css';

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
  const [selectedCell, setSelectedCell] = useState(null);
  const levels = ["easy", "medium", "hard"];

  useEffect(() => {
    const fullGrid = generateCompleteGrid();
    const puzzle = removeCells(fullGrid, levels[levelIndex]);
    setInitialGrid(fullGrid);
    setGrid(puzzle);
  }, [levelIndex]);

  const handleChange = (e, rowIdx, colIdx) => {
    const value = parseInt(e.target.value);
    const newGrid = grid.map((row, r) =>
      row.map((cell, c) => (r === rowIdx && c === colIdx ? { ...cell, value } : cell))
    );
    setGrid(newGrid);

    for (let c = 0; c < grid[0].length; c++) {
      if (newGrid[rowIdx][c].value !== initialGrid[rowIdx][c]) return;
    }
    for (let r = 0; r < grid.length; r++) {
      if (newGrid[r][colIdx].value !== initialGrid[r][colIdx]) return;
    }

    if (levelIndex < levels.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else {
      alert("🎉 All levels complete!");
    }
  };

  const gridSize = grid.length;

  return (
    <div className="game-header-wrapper">
      <div className="logo-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="logo-cell" />
        ))}
      </div>
      <h1 className="game-title">SPEEDUKO</h1>
      <div className="level-score">
        LEVEL 1<br />
        SCORE: 0
      </div>
      <div className="sudoku-wrapper">
        <div
          className={`sudoku-grid${gridSize > 3 ? " show-boxes" : ""}`}
          style={{
            gridTemplateColumns: \`repeat(\${gridSize}, 60px)\`,
            gap: "5px",
          }}
        >
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              const isSelected =
                selectedCell &&
                rowIdx === selectedCell.rowIdx &&
                colIdx === selectedCell.colIdx;
              const isHighlighted =
                selectedCell &&
                (rowIdx === selectedCell.rowIdx ||
                 colIdx === selectedCell.colIdx);
              const borderColor = isHighlighted ? "#87cefa" : "#ccc";
              const borderWidth = isSelected ? "2px" : "1px";

              const boxSize = gridSize === 9 ? 3 : gridSize === 6 ? 2 : 1;
              const classes = [];
              if (gridSize > 3) {
                if (rowIdx % boxSize === 0) classes.push("border-top-bold");
                if (colIdx % boxSize === 0) classes.push("border-left-bold");
                if ((rowIdx + 1) % boxSize === 0) classes.push("border-bottom-bold");
                if ((colIdx + 1) % boxSize === 0) classes.push("border-right-bold");
              }

              return (
                <input
                  key={\`\${rowIdx}-\${colIdx}\`}
                  className={classes.join(" ")}
                  value={cell.value}
                  readOnly={cell.readOnly}
                  onChange={(e) => handleChange(e, rowIdx, colIdx)}
                  onFocus={() => setSelectedCell({ rowIdx, colIdx })}
                  onBlur={() => setSelectedCell(null)}
                  style={{
                    width: "60px",
                    height: "60px",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    backgroundColor: cell.readOnly ? "#e0e0e0" : "white",
                    border: \`\${borderWidth} solid \${borderColor}\`,
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SudokuGrid;
