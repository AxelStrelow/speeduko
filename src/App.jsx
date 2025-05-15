import React from 'react';
import Sudoku3x3 from './Sudoku3x3'; // ✅ Correct import

function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Sudoku3x3 />
    </div>
  );
}

export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'blue' }}>Speeduko</h1>
      <p>Sudoku game coming soon...</p>
    </div>
  );
}
