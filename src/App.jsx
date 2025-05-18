
import React, { useState } from "react";
import Sudoku3x3 from "./Sudoku3x3";
import Sudoku6x6 from "./Sudoku6x6";

const App = () => {
  const [gridSize, setGridSize] = useState("3x3");

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 py-10">
      <h1 className="text-3xl font-bold mb-6">Speeduko</h1>
      <div className="mb-4">
        <label className="mr-2 font-medium">Select Grid Size:</label>
        <select
          value={gridSize}
          onChange={(e) => setGridSize(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="3x3">3x3</option>
          <option value="6x6">6x6</option>
        </select>
      </div>
      {gridSize === "3x3" ? <Sudoku3x3 /> : <Sudoku6x6 />}
    </div>
  );
};

export default App;
