import React, { useState } from 'react';

const initialPuzzle = [
  ['1', '', '3'],
  ['', '3', ''],
  ['2', '', '']
];

export default function Sudoku3x3() {
  const [grid, setGrid] = useState(initialPuzzle);
  const [message, setMessage] = useState('');

  const handleChange = (row, col, value) => {
    if (!/^[1-3]?$/.test(value)) return;
    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? value : cell))
    );
    setGrid(newGrid);
  };

  const isValid = () => {
    for (let i = 0; i < 3; i++) {
      const row = new Set();
      const col = new Set();
      for (let j = 0; j < 3; j++) {
        const rowVal = grid[i][j];
        const colVal = grid[j][i];
        if (!rowVal || !colVal) return false;
        if (row.has(rowVal) || col.has(colVal)) return false;
        row.add(rowVal);
        col.add(colVal);
      }
    }
    return true;
  };

  const checkSolution = () => {
    if (isValid()) {
      setMessage('✅ Correct! You solved it!');
    } else {
      setMessage('❌ Not quite right. Try again!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-50 text-black font-sans">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Speeduko – 3x3 Puzzle</h1>
      <div className="grid grid-cols-3 gap-1 mb-4">
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const isPrefilled = initialPuzzle[i][j] !== '';
            return (
              <input
                key={`${i}-${j}`}
                value={cell}
                readOnly={isPrefilled}
                onChange={e => handleChange(i, j, e.target.value)}
                maxLength={1}
                className={`w-16 h-16 text-center text-2xl border rounded shadow focus:outline-none ${
                  isPrefilled ? 'bg-gray-200 font-bold' : 'bg-white'
                }`}
              />
            );
          })
        )}
      </div>
      <button
        onClick={checkSolution}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
      >
        Check
      </button>
      {message && <div className="mt-4 text-lg">{message}</div>}
    </div>
  );
}
