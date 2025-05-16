import React, { useState } from 'react';

const initialBoard = [
  ['1', '', '3'],
  ['', '3', ''],
  ['2', '', '']
];

const solutionBoard = [
  ['1', '2', '3'],
  ['3', '3', '1'],  // For demo purposes; replace with valid unique values
  ['2', '1', '3']
];

export default function Sudoku3x3() {
  const [board, setBoard] = useState(initialBoard);
  const [message, setMessage] = useState('');

  const handleChange = (row, col, val) => {
    if (!/^[1-3]?$/.test(val)) return;

    const newBoard = board.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? val : c))
    );
    setBoard(newBoard);
  };

  const checkBoard = () => {
    for (let i = 0; i < 3; i++) {
      const rowSet = new Set();
      const colSet = new Set();
      for (let j = 0; j < 3; j++) {
        const rowVal = board[i][j];
        const colVal = board[j][i];
        if (!rowVal || !colVal || rowSet.has(rowVal) || colSet.has(colVal)) {
          setMessage('❌ Incorrect. Try again!');
          return;
        }
        rowSet.add(rowVal);
        colSet.add(colVal);
      }
    }
    setMessage('✅ Correct! You solved it.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Speeduko: 3×3 Sudoku</h1>
      <div className="grid grid-cols-3 gap-1 mb-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isInitial = initialBoard[rowIndex][colIndex] !== '';
            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                readOnly={isInitial}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                maxLength={1}
                className={`w-16 h-16 text-center text-2xl border border-gray-400 ${
                  isInitial ? 'bg-gray-200 font-bold' : 'bg-white'
                }`}
              />
            );
          })
        )}
      </div>
      <button
        onClick={checkBoard}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Check
      </button>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
