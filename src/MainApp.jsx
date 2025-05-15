import React from 'react';
import Sudoku3x3 from './Sudoku3x3';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Speeduko</h1>
      <Sudoku3x3 />
    </div>
  );
}
