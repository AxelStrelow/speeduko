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

  const checkSolution = () => {
    for (let i = 0; i < 3; i++) {
      const row = new Set();
      const col = new Set();
      for (let j = 0; j < 3; j++) {
        row.add(grid[i][j]);
        col.add(grid[j][i]);
      }
      if (row.size !== 3 || col.size !== 3 || row.has('') || col.has('')) {
        setMessage('❌ Not correct yet. Keep trying!');
        return;
      }
    }
    setMessage('✅ Correct! You solved it!');
  };

  return (
    <div className="p-4">
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
                className={`w-16 h-16 text-center text-xl border rounded ${
                  isPrefilled ? 'bg-gray-200' : 'bg-white'
                }`}
              />
            );
          })
        )}
      </div>
      <button
        onClick={checkSolution}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Check
      </button>
      <div className="mt-2 text-lg">{message}</div>
    </div>
  );
}
