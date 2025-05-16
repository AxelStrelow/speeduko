import React from "react";
import SudokuGrid from "./components/SudokuGrid";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SudokuGrid />
    </div>
  );
};

export default App;
