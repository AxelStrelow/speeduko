
import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.css';
import IntroModal from './IntroModal';

const getTodayKey = () => new Date().toISOString().slice(0, 10);
const hasPlayedToday = () => localStorage.getItem("lastPlayed") === getTodayKey();
const markAsPlayed = () => localStorage.setItem("lastPlayed", getTodayKey());

const mulberry32 = (a) => {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
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

const generateFullGrid = (gridSize, rng) => {
  const base = Array.from({ length: gridSize }, (_, i) => i + 1);
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
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

const removeCells = (grid, blanks, rng) => {
  const newGrid = grid.map(row => [...row]);
  const size = grid.length;
  while (blanks > 0) {
    const i = Math.floor(rng() * size);
    const j = Math.floor(rng() * size);
    if (newGrid[i][j] !== null) {
      newGrid[i][j] = null;
      blanks--;
    }
  }
  return newGrid;
};

const DailyGameEngine = () => {
  const [locked, setLocked] = useState(hasPlayedToday());
  const [score, setScore] = useState(0);
  const [scoreFlash, setScoreFlash] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [wrongCells, setWrongCells] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [gameOver, setGameOver] = useState(false);
  const [phase, setPhase] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const rng = useRef(mulberry32(parseInt(getTodayKey().replace(/-/g, ''))));
  const timerRef = useRef(null);

  const gridSize = getGridSize(phase);
  const [boxRows, boxCols] = getBoxSize(gridSize);
  const levelIndex = phase % 3;

  const getBlankCount = (size, level) => {
    const blanks = {
      3: [2, 4, 6],
      6: [8, 14, 20],
      9: [30, 45, 60],
    };
    return blanks[size][level];
  };

  useEffect(() => {
    if (locked) return;
    const full = generateFullGrid(gridSize, rng.current);
    const blanks = getBlankCount(gridSize, levelIndex);
    const removed = removeCells(full, blanks, rng.current);
    setSolution(full);
    setGrid(removed);
    setUserInput(Array.from({ length: gridSize }, () => Array(gridSize).fill("")));
    setWrongCells([]);
  }, [phase, locked]);

  useEffect(() => {
    if (locked) return;
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
  }, [locked]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleInput = (r, c, val) => {
    if (gameOver || locked) return;
    const clean = val.replace(/[^0-9]/, '').slice(0, 1);
    const newInput = [...userInput];
    newInput[r][c] = clean;
    setUserInput(newInput);

    const key = `${r}-${c}`;
    if (grid[r][c] === null) {
      const correct = parseInt(clean) === solution[r][c];
      const alreadyCorrect = parseInt(userInput[r][c]) === solution[r][c];

      if (!correct && clean !== "") {
        setWrongCells(prev => [...new Set([...prev, key])]);
        setTimeLeft(prev => Math.max(prev - 5, 0));
        setScore(prev => prev - 5);
        setScoreFlash({ value: -5, key: Date.now() });
      } else {
        setWrongCells(prev => prev.filter(k => k !== key));
        if (!alreadyCorrect && correct) {
          setScore(prev => prev + 10);
          setScoreFlash({ value: +10, key: Date.now() });
        }
      }
    }

    checkComplete(newInput);
  };

  const checkComplete = (inputs) => {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if ((grid[r][c] === null || grid[r][c] === 0) && parseInt(inputs[r][c]) !== solution[r][c]) {
          return;
        }
      }
    }
    setScore(prev => prev + 100 * gridSize);
    setTimeLeft(prev => prev + 30);
    setTimeout(() => setPhase(phase + 1), 300);
  };

  return (
    <>
      {showIntro && <IntroModal onStart={() => setShowIntro(false)} />}
      {!showIntro && (
        <div className="text-center">
          <h1 className="game-title">SPEEDUKO</h1>
          
          <div className="level-box">
            <div>Level {phase + 1}</div>
            <div>Score: {score}</div>
            {scoreFlash && (
              <div
                key={scoreFlash.key}
                className={`score-flash ${scoreFlash.value > 0 ? "positive" : "negative"}`}
              >
                {scoreFlash.value > 0 ? `+${scoreFlash.value}` : `${scoreFlash.value}`}
              </div>
            )}
          </div>

            )}
          </div>
          

          <div className={`sudoku-grid sudoku-grid-${gridSize}x${gridSize}`}>
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const key = `${r}-${c}`;
                const isWrong = wrongCells.includes(key);
                const isMatch = selectedValue !== null && (
                  (cell !== null && cell === selectedValue) ||
                  (grid[r][c] === null &&
                   userInput[r][c] !== "" &&
                   parseInt(userInput[r][c]) === selectedValue &&
                   solution[r][c] === selectedValue)
                );

                let isSoft = false;
                if (selectedCell && typeof selectedCell.row === 'number' && typeof selectedCell.col === 'number') {
                  const sameRow = r === selectedCell.row;
                  const sameCol = c === selectedCell.col;
                  const sameBox = (gridSize === 6 || gridSize === 9) &&
                    Math.floor(r / boxRows) === Math.floor(selectedCell.row / boxRows) &&
                    Math.floor(c / boxCols) === Math.floor(selectedCell.col / boxCols);
                  isSoft = sameRow || sameCol || sameBox;
                }

                const classes = [
                  "sudoku-cell",
                  isWrong ? "bg-red-200" : "",
                  isMatch ? "match-highlight" : "",
                  isSoft ? "soft-highlight" : "",
                  r % boxRows === 0 ? "border-top-bold" : "",
                  c % boxCols === 0 ? "border-left-bold" : "",
                  r === gridSize - 1 ? "border-bottom-bold" : "",
                  c === gridSize - 1 ? "border-right-bold" : ""
                ].join(" ");

                return (
                  <input
                    key={key}
                    className={classes}
                    type="text"
                    value={cell !== null ? cell : userInput[r][c]}
                    onChange={(e) => handleInput(r, c, e.target.value)}
                    readOnly={cell !== null}
                    onFocus={() => {
                      setSelectedCell({ row: r, col: c });
                      if (cell !== null) {
                        setSelectedValue(cell);
                      } else if (userInput[r][c]) {
                        setSelectedValue(parseInt(userInput[r][c]));
                      } else {
                        setSelectedValue(null);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        if (!document.activeElement.classList.contains("sudoku-cell")) {
                          setSelectedCell(null);
                        }
                      }, 0);
                    }}
                  />
                );
              })
            )}
          </div>
          <div className="timer-box">
            ⏳ {formatTime(timeLeft)}
         </div>
        </div>
      )}
    </>
  );
};

export default DailyGameEngine;
