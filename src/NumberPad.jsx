
import React from "react";

const NumberPad = ({ gridSize, onNumberClick }) => {
  const maxNumber = gridSize;
  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

  return (
    <div className="number-pad">
      {numbers.map((num) => (
        <button
          key={num}
          className="number-pad-button"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default NumberPad;
