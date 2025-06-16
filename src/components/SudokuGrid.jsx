return (
  <div className="game-container">
    <div className="game-header-wrapper">
      <div className="logo-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="logo-cell" />
        ))}
      </div>
      <h1 className="game-title">SPEEDUKO</h1>
      <div className="level-score">
        LEVEL {levelIndex + 1}<br />
        SCORE: 0
      </div>
    </div>
    <div className="sudoku-wrapper">
      <div
        className={`sudoku-grid${gridSize > 3 ? " show-boxes" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 60px)`,
          gap: "5px",
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const isSelected =
              selectedCell &&
              rowIdx === selectedCell.rowIdx &&
              colIdx === selectedCell.colIdx;
            const isHighlighted =
              selectedCell &&
              (rowIdx === selectedCell.rowIdx || colIdx === selectedCell.colIdx);
            const borderColor = isHighlighted ? "#87cefa" : "#ccc";
            const borderWidth = isSelected ? "2px" : "1px";

            const boxSize = gridSize === 9 ? 3 : gridSize === 6 ? 2 : 1;
            const classes = [];
            if (gridSize > 3) {
              if (rowIdx % boxSize === 0) classes.push("border-top-bold");
              if (colIdx % boxSize === 0) classes.push("border-left-bold");
              if ((rowIdx + 1) % boxSize === 0) classes.push("border-bottom-bold");
              if ((colIdx + 1) % boxSize === 0) classes.push("border-right-bold");
            }

            return (
              <input
                key={`${rowIdx}-${colIdx}`}
                className={classes.join(" ")}
                value={cell.value}
                readOnly={cell.readOnly}
                onChange={(e) => handleChange(e, rowIdx, colIdx)}
                onFocus={() => setSelectedCell({ rowIdx, colIdx })}
                onBlur={() => setSelectedCell(null)}
                style={{
                  width: "60px",
                  height: "60px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  backgroundColor: cell.readOnly ? "#e0e0e0" : "white",
                  border: `${borderWidth} solid ${borderColor}`,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  </div>
);
