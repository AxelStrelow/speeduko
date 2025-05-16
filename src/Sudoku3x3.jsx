import React, { useState } from 'react';

const initialPuzzle = [
  ['1', '2', ''],
  ['2', '', '1'],
  ['3', '1', '2']
];

export default function Sudoku3x3() {
  const [grid, setGrid] = useState(initialPuzzle);
  const [message, setMessage] = useState('');

  const handleChange = (row, col, value) => {
    if (!/^[1-3]?$/.test(value)) return;
    const newGrid = grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? value : c))
    );
    setGrid(newGrid);
  };

  const checkSolution = () => {
    const isValid = () => {
      for (let i = 0; i < 3; i++) {
        const row = new Set();
        const col = new Set();
        for (let j = 0; j < 3; j++) {
          const rowVal = grid[i][j];
          const colVal = grid[j][i];
          if (!rowVal || !colVal || row.has(rowVal) || col.has(colVal)) {
            return false;
          }
          row.add(rowVal);
          col.add(colVal);
        }
      }
      return true;
    };

    setMessage(isValid() ? '✅ Correct!' : '❌ Try again.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Speeduko: 3×3 Sudoku</h1>
      <div className="grid grid-cols-3 border border-black">
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const isPrefilled = initialPuzzle[i][j] !== '';
            return (
              <div
                key={`${i}-${j}`}
                className="w-20 h-20 border border-black flex items-center justify-center"
              >
                <input
                  value={cell}
                  readOnly={isPrefilled}
                  onChange={(e) => handleChange(i, j, e.target.value)}
                  maxLength={1}
                  className={`w-full h-full text-center text-2xl outline-none ${
                    isPrefilled ? 'bg-gray-200 font-bold' : 'bg-white'
                  }`}
                />
              </div>
            );
          })
        )}
      </div>
      <button
        onClick={checkSolution}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Check
      </button>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
