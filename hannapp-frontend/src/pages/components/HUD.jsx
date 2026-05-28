import React, { memo } from 'react';

const HUD = memo(({ score, level, lines, scorePop, levelPulse, onPause, gameState }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Score */}
      <div className="glass-panel p-4">
        <p className="hud-label">Score</p>
        <p className={`hud-value glow-text-violet ${scorePop ? 'score-pop' : ''}`}>
          {score.toLocaleString()}
        </p>
      </div>

      {/* Level */}
      <div className="glass-panel p-4">
        <p className="hud-label">Level</p>
        <p className={`hud-value ${levelPulse ? 'level-pulse' : ''}`}
          style={{ color: levelPulse ? '#f59e0b' : '#e2e8f0' }}>
          {level}
        </p>
      </div>

      {/* Lines */}
      <div className="glass-panel p-4">
        <p className="hud-label">Lines</p>
        <p className="hud-value">{lines}</p>
      </div>

      {/* Controls */}
      <div className="glass-panel p-3 mt-1">
        <p className="hud-label mb-2">Controls</p>
        <div className="flex flex-col gap-1" style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
          <span><span style={{ color: '#a78bfa' }}>← →</span> Move</span>
          <span><span style={{ color: '#a78bfa' }}>↑ / W</span> Rotate</span>
          <span><span style={{ color: '#a78bfa' }}>↓ / S</span> Soft Drop</span>
          <span><span style={{ color: '#a78bfa' }}>Space</span> Hard Drop</span>
          <span><span style={{ color: '#a78bfa' }}>P / Esc</span> Pause</span>
        </div>
      </div>

      {/* Pause button */}
      {(gameState === 'running' || gameState === 'paused') && (
        <button
          className="btn-secondary mt-1"
          onClick={onPause}
          id="btn-pause"
        >
          {gameState === 'paused' ? '▶ Resume' : '⏸ Pause'}
        </button>
      )}
    </div>
  );
});
HUD.displayName = 'HUD';

export default HUD;
