
import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.css';

const LEVELS = {
  '3x3': ['easy', 'medium', 'hard'],
  '6x6': ['easy', 'medium', 'hard'],
};

const getGridSize = (phase) => {
  if (phase < 3) return 3;
  if (phase < 6) return 6;
  return 9;
};

const getBoxSize = (gridSize) => {
  if (gridSize === 3) return [1, 3];
  if (gridSize === 6) return [2, 3];
  return [3, 3];
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
      for (let c = boxCol; c < boxCols; c++) {
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
  const [wrongCells, setWrongCells] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef(null);
  const gridSize = getGridSize(phase);
  const totalPhases = Object.values(LEVELS).flat().length;

  useEffect(() => {
    const fullGrid = generateFullGrid(gridSize);
    setSolution(fullGrid);
    setGrid(removeCells(fullGrid, Math.floor(gridSize * 1.5)));
    setUserInput(Array.from({ length: gridSize }, () => Array(gridSize).fill("")));
    setWrongCells([]);
  }, [phase]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleInput = (row, col, value) => {
    if (gameOver) return;

    const newInput = [...userInput];
    const clean = value.replace(/[^0-9]/, '').slice(0, 1);
    newInput[row][col] = clean;
    setUserInput(newInput);

    if (grid[row][col] === null) {
      const correct = parseInt(clean) === solution[row][col];
      const updatedWrongs = [...wrongCells];
      const cellKey = `${row}-${col}`;

      if (!correct && clean !== "") {
        if (!updatedWrongs.includes(cellKey)) updatedWrongs.push(cellKey);
        setWrongCells(updatedWrongs);
        setTimeLeft((prev) => Math.max(prev - 5, 0)); // -5 seconds
      } else {
        setWrongCells(wrongs => wrongs.filter(cell => cell !== cellKey));
      }
    }

    checkCompletion(newInput);
  };

  const checkCompletion = (inputs) => {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if ((grid[r][c] === null || grid[r][c] === 0) &&
            parseInt(inputs[r][c]) !== solution[r][c]) {
          return;
        }
      }
    }

    setTimeLeft((prev) => prev + 60); // +1 minute
    if (phase + 1 < totalPhases) {
      setTimeout(() => setPhase(phase + 1), 500);
    } else {
      alert("🎉 You've completed all levels!");
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-2">Speeduko - Level {phase + 1}</h2>
      <h3 className="text-lg mb-4">Time Left: {formatTime(timeLeft)}</h3>
      <div className="sudoku-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 60px)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const isWrong = wrongCells.includes(key);
            return (
              <input
                key={key}
                className={`sudoku-cell ${isWrong ? 'bg-red-200' : ''}`}
                type="text"
                value={cell !== null ? cell : userInput[rowIndex][colIndex]}
                onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)}
                readOnly={cell !== null}
              />
            );
          })
        )}
      </div>
      {gameOver && <div className="text-red-600 font-bold mt-4">⏱ Game Over</div>}
    </div>
  );
};

export default GameEngine;
