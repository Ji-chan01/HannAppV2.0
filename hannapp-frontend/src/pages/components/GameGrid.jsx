import React, { memo } from 'react';
import { COLS, ROWS, TETROMINOES } from '../constants';

function getShape(piece) {
  return TETROMINOES[piece.type].shapes[piece.rotation];
}

function buildRenderGrid(grid, current, ghostY) {
  // Clone grid into a display grid: null | { type, ghost }
  const display = grid.map(row => row.map(cell => (cell ? { type: cell, ghost: false } : null)));

  // Paint ghost piece
  if (current && ghostY !== null) {
    const shape = getShape(current);
    shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const x = current.x + c;
        const y = ghostY + r;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS && !display[y][x]) {
          display[y][x] = { type: current.type, ghost: true };
        }
      });
    });
  }

  // Paint active piece (on top of ghost)
  if (current) {
    const shape = getShape(current);
    shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const x = current.x + c;
        const y = current.y + r;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
          display[y][x] = { type: current.type, ghost: false };
        }
      });
    });
  }

  return display;
}

const Cell = memo(({ cell, isFlash }) => {
  if (!cell) {
    return (
      <div
        className="cell"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      />
    );
  }
  if (cell.ghost) {
    return (
      <div
        className="cell piece-ghost"
        style={{ opacity: isFlash ? 0 : 1 }}
      />
    );
  }
  return (
    <div
      className={`cell ${cell.type ? `piece-${cell.type}` : ''} ${isFlash ? 'row-clear-flash' : ''}`}
    />
  );
});
Cell.displayName = 'Cell';

const GameGrid = memo(({ grid, current, ghostY, flashRows }) => {
  const display = buildRenderGrid(grid, current, ghostY);

  return (
    <div
      className="relative"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        width: '100%',
        height: '100%',
        gap: '1px',
        padding: '2px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '6px',
      }}
    >
      {display.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            isFlash={flashRows.includes(r)}
          />
        ))
      )}
      {/* Scanline overlay */}
      <div className="scanlines" />
    </div>
  );
});
GameGrid.displayName = 'GameGrid';

export default GameGrid;
