import React, { useState, useEffect } from 'react';

const initialGrid = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

export default function Sudoku3x3() {
  const [grid, setGrid] = useState(initialGrid);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleChange = (row, col, value) => {
    if (!/^[1-3]?$/.test(value)) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  const checkSolution = () => {
    for (let i = 0; i < 3; i++) {
      const row = new Set();
      const col = new Set();
      for (let j = 0; j < 3; j++) {
        row.add(grid[i][j]);
        col.add(grid[j][i]);
      }
      if (row.size !== 3 || col.size !== 3 || row.has('') || col.has('')) {
        setMessage('Not quite right. Try again!');
        return;
      }
    }
    setMessage(`✅ Solved in ${elapsed} seconds!`);
  };

  const startGame = () => {
    setGrid(initialGrid);
    setStartTime(Date.now());
    setElapsed(0);
    setMessage('');
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <button onClick={startGame} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Start New Game</button>
      <div className="grid grid-cols-3 gap-1 mb-4">
        {grid.map((row, i) => row.map((cell, j) => (
          <input
            key={`${i}-${j}`}
            className="w-16 h-16 text-center text-xl border rounded"
            value={grid[i][j]}
            onChange={e => handleChange(i, j, e.target.value)}
            maxLength={1}
          />
        )))}
      </div>
      <button onClick={checkSolution} className="mb-2 px-4 py-2 bg-green-600 text-white rounded">Check</button>
      <div className="text-gray-700 mt-2">⏱️ Elapsed: {elapsed}s</div>
      <div className="text-lg font-semibold mt-2">{message}</div>
    </div>
  );
}
