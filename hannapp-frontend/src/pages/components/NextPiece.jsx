import React, { memo } from 'react';
import { TETROMINOES } from '../constants';

const PREVIEW_SIZE = 4;

const NextPiece = memo(({ piece }) => {
  if (!piece) {
    return (
      <div className="glass-panel p-3">
        <p className="hud-label text-center mb-2">Next</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${PREVIEW_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${PREVIEW_SIZE}, 1fr)`,
            width: 80,
            height: 80,
            gap: '2px',
            margin: '0 auto',
          }}
        >
          {Array(PREVIEW_SIZE * PREVIEW_SIZE).fill(null).map((_, i) => (
            <div key={i} style={{ background: 'transparent' }} />
          ))}
        </div>
      </div>
    );
  }

  const { shapes, color } = TETROMINOES[piece.type];
  const shape = shapes[0];

  // Center the shape in a 4×4 grid
  const grid = Array.from({ length: PREVIEW_SIZE }, () => Array(PREVIEW_SIZE).fill(0));
  const rowOffset = Math.floor((PREVIEW_SIZE - shape.length) / 2);
  const colOffset = Math.floor((PREVIEW_SIZE - shape[0].length) / 2);
  shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      const gr = r + rowOffset;
      const gc = c + colOffset;
      if (gr >= 0 && gr < PREVIEW_SIZE && gc >= 0 && gc < PREVIEW_SIZE) {
        grid[gr][gc] = cell;
      }
    });
  });

  return (
    <div className="glass-panel p-3">
      <p className="hud-label text-center mb-2">Next</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${PREVIEW_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${PREVIEW_SIZE}, 1fr)`,
          width: 88,
          height: 88,
          gap: '2px',
          margin: '0 auto',
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`cell ${cell ? color : ''}`}
              style={{
                background: cell ? undefined : 'rgba(255,255,255,0.02)',
                border: cell ? undefined : '1px solid rgba(255,255,255,0.04)',
                borderRadius: '2px',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
});
NextPiece.displayName = 'NextPiece';

export default NextPiece;
