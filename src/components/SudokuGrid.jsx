
import React, { useState, useEffect, useCallback, useRef } from "react";
import { getAllowedValues, getBoxDimensions } from "@/lib/sudokuUtils";

type SudokuCell = {
  value | null;
  readOnly: boolean;
};

interface SudokuGridProps {
  size: 3;
}

const generateFullGrid = ()[][] => {
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

const removeCells = (grid[][], blanks) => {
  const result = grid.map(row =>
    row.map(val => ({
      value: val,
      readOnly: true
    }))
  );

  while (blanks > 0) {
    const i = Math.floor(Math.random() * 3);
    const j = Math.floor(Math.random() * 3);
    if (result[i][j].readOnly) {
      result[i][j] = { value: null, readOnly: false };
      blanks--;
    }
  }

  return result;
};

const difficulties = ["easy", "medium", "hard"];
const blankCounts = { easy: 2, medium: 4, hard: 6 };

const SudokuGrid = () => {
  const [level, setLevel] = useState(0);
  const [grid, setGrid] = useState<SudokuCell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);

  const initializeGame = () => {
    const full = generateFullGrid();
    setSolution(full);
    const puzzle = removeCells(full, blankCounts[difficulties[level]]);
    setGrid(puzzle);
  };

  useEffect(() => {
    initializeGame();
  }, [level]);

  const handleInput = (row, col, val) => {
    const value = parseInt(val);
    if (isNaN(value) || value < 1 || value > 3) return;

    const newGrid = grid.map((r, i) =>
      r.map((c, j) => {
        if (i === row && j === col && !c.readOnly) {
          return { ...c, value };
        }
        return c;
      })
    );
    setGrid(newGrid);

    const isComplete = newGrid.every((r, i) =>
      r.every((c, j) => c.value === solution[i][j])
    );

    if (isComplete && level < 2) {
      setTimeout(() => setLevel(level + 1), 500);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-center my-4">
        Speeduko 3×3 - {difficulties[level].toUpperCase()}
      </h2>
      <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={\`\${i}-\${j}\`}
              className="w-16 h-16 text-center border text-lg bg-white rounded shadow"
              type="text"
              value={cell.value ?? ""}
              onChange={(e) => handleInput(i, j, e.target.value)}
              disabled={cell.readOnly}
              maxLength={1}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SudokuGrid;
