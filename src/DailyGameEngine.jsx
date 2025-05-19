import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.css';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const DailyGameEngine = () => {
  const [score, setScore] = useState(0);
  const [scoreFlash, setScoreFlash] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gridSize, setGridSize] = useState(3);
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [wrongCells, setWrongCells] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [selectedValue, setSelectedValue] = useState(null);
  const [scoreFlash, setScoreFlash] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    generateGrid();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
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

  const generateGrid = () => {
    const size = gridSize;
    const nums = Array.from({ length: size }, (_, i) => i + 1);
    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    const solution = nums.map((_, i) => nums.map((n, j) => nums[(j + i) % size]));
    setGrid(solution.map(row => row.map(() => null)));
    setSolution(solution);
    setUserInput(Array.from({ length: size }, () => Array(size).fill("")));
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleInput = (r, c, val) => {
    if (gameOver) return;
    const clean = val.replace(/[^0-9]/, '').slice(0, 1);
    const newInput = [...userInput];
    newInput[r][c] = clean;
    setUserInput(newInput);

    const key = `${r}-${c}`;
    if (grid[r][c] === null) {
      const correct = parseInt(clean) === solution[r][c];
      if (!correct && clean !== "") {
        setWrongCells(prev => [...prev, key]);
        setTimeLeft(prev => Math.max(prev - 5, 0));
        setScore(prev => prev - 5);
        setScoreFlash({ value: -5, key: Date.now() });
        setScoreFlash({ value: -5, key: Date.now() });
      } else if (parseInt(clean) === solution[r][c]) {
        setWrongCells(prev => prev.filter(k => k !== key));
        setScore(prev => prev + 10);
        setScoreFlash({ value: +10, key: Date.now() });
        setScoreFlash({ value: +10, key: Date.now() });
      }
    }

    checkCompletion(newInput);
  };

  const checkCompletion = (inputs) => {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if ((grid[r][c] === null || grid[r][c] === 0) && parseInt(inputs[r][c]) !== solution[r][c]) {
          return;
        }
      }
    }

    setScore(prev => prev + 100 * gridSize);
    setTimeLeft(prev => prev + 30);
    setGameOver(true);
    clearInterval(timerRef.current);
  };

  return (
    <div className="text-center">
      <h1 className="logo mb-2">🧠 Speeduko</h1>
      <div className="inline-block px-4 py-2 bg-black text-white rounded font-mono text-3xl tracking-wider">
        {formatTime(timeLeft)}
      </div>
      <div className="score-display relative">
        Score: {score}
        {scoreFlash && (
          <div key={scoreFlash.key} className={`score-flash ${scoreFlash.value > 0 ? 'positive' : 'negative'}`}>
            {scoreFlash.value > 0 ? `+${scoreFlash.value}` : scoreFlash.value}
          </div>
        )}
      </div>
      <div className="sudoku-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 60px)` }}>
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}`;
            const isWrong = wrongCells.includes(key);
            const isMatch = selectedValue && (solution[r][c] === selectedValue || userInput[r][c] === String(selectedValue));
            const isMatch = selectedValue && (solution[r][c] === selectedValue || userInput[r][c] === String(selectedValue));
            return (
              <input
                key={key}
                className={`sudoku-cell ${isWrong ? 'bg-red-200' : ''} ${isMatch ? 'match-highlight' : ''}`}
                type="text"
                value={cell !== null ? cell : userInput[r][c]}
                onChange={(e) => handleInput(r, c, e.target.value)}
                readOnly={cell !== null} onFocus={() => setSelectedValue(solution[r][c])}
                onFocus={() => setSelectedValue(solution[r][c])}
              />
            );
          })
        )}
      </div>
      {gameOver && (
        <div className="mt-4">
          <div className="text-red-600 font-bold mt-4 text-lg">⏱ Game Over</div>
          <div className="text-green-600 font-bold text-lg mb-2">✅ Game Complete</div>
          <button
            className="check-btn"
            onClick={() => {
              const summary = `🧠 Speeduko Daily #${getTodayKey()}\nScore: ${score} | Time Left: ${formatTime(timeLeft)}\nPlay at: speeduko.xyz`;
              navigator.clipboard.writeText(summary);
              alert("Results copied to clipboard!");
            }}
          >
            📋 Copy Results
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyGameEngine;
