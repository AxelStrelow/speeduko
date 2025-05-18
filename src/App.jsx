import React from "react";
import GameEngine from "./GameEngine";
import "./Sudoku.css";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <GameEngine />
    </div>
  );
};

export default App;
