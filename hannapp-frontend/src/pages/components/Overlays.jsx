import React, { memo } from 'react';

// Idle / Start screen overlay
export const StartOverlay = memo(({ onStart }) => (
  <div className="overlay">
    <div style={{ textAlign: 'center' }}>
      {/* Title */}
      <h1
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '3rem',
          fontWeight: 900,
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.25rem',
          lineHeight: 1.1,
        }}
      >
        TETRIS
      </h1>
      <p style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '0.6rem',
        letterSpacing: '0.35em',
        color: '#6366f1',
        textTransform: 'uppercase',
        marginBottom: '2.5rem',
      }}>
        Classic Block Puzzle
      </p>

      {/* Decorative mini-tetrominoes */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '2.5rem' }}>
        {[
          ['#06b6d4', 'I'], ['#a855f7', 'T'], ['#22c55e', 'S'],
          ['#ef4444', 'Z'], ['#f97316', 'L'], ['#eab308', 'O'], ['#3b82f6', 'J'],
        ].map(([color, letter]) => (
          <div key={letter} style={{
            width: 22, height: 22,
            background: color,
            borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.55rem',
            fontWeight: 700,
            color: 'rgba(0,0,0,0.6)',
            boxShadow: `0 0 8px ${color}88`,
          }}>
            {letter}
          </div>
        ))}
      </div>

      <button
        id="btn-start"
        className="btn-primary"
        onClick={onStart}
        style={{ fontSize: '0.9rem', padding: '0.75rem 2.5rem', letterSpacing: '0.15em' }}
      >
        ▶ Start Game
      </button>

      <div style={{
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        fontSize: '0.65rem',
        color: '#475569',
        fontFamily: 'Inter, sans-serif',
      }}>
        <span>Arrow Keys / WASD to move &amp; rotate</span>
        <span>Space for hard drop · P to pause</span>
      </div>
    </div>
  </div>
));
StartOverlay.displayName = 'StartOverlay';

// Game Over overlay
export const GameOverOverlay = memo(({ score, level, lines, onRestart }) => (
  <div className="overlay">
    <div style={{ textAlign: 'center' }}>
      <p style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '0.65rem',
        letterSpacing: '0.3em',
        color: '#ef4444',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
      }}>
        ✕ Game Over
      </p>
      <h2 style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '2rem',
        fontWeight: 900,
        color: '#e2e8f0',
        marginBottom: '0.25rem',
        lineHeight: 1,
      }}>
        {score.toLocaleString()}
      </h2>
      <p style={{
        fontSize: '0.7rem',
        color: '#64748b',
        fontFamily: 'Orbitron, sans-serif',
        letterSpacing: '0.05em',
        marginBottom: '1.5rem',
      }}>
        pts
      </p>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        marginBottom: '2rem',
      }}>
        {[
          { label: 'Level', value: level },
          { label: 'Lines', value: lines },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              color: '#6366f1',
              textTransform: 'uppercase',
            }}>{label}</p>
            <p style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#e2e8f0',
            }}>{value}</p>
          </div>
        ))}
      </div>

      <button
        id="btn-restart"
        className="btn-primary"
        onClick={onRestart}
        style={{ fontSize: '0.8rem', padding: '0.65rem 2rem' }}
      >
        ↺ Play Again
      </button>
    </div>
  </div>
));
GameOverOverlay.displayName = 'GameOverOverlay';

// Paused overlay
export const PausedOverlay = memo(({ onResume }) => (
  <div className="overlay">
    <div style={{ textAlign: 'center' }}>
      <p style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '0.65rem',
        letterSpacing: '0.3em',
        color: '#a78bfa',
        textTransform: 'uppercase',
        marginBottom: '0.75rem',
      }}>
        ⏸ Paused
      </p>
      <h2 style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '2rem',
        fontWeight: 700,
        color: '#e2e8f0',
        marginBottom: '2rem',
      }}>
        Game Paused
      </h2>
      <button
        id="btn-resume"
        className="btn-primary"
        onClick={onResume}
        style={{ fontSize: '0.85rem', padding: '0.65rem 2rem' }}
      >
        ▶ Resume
      </button>
    </div>
  </div>
));
PausedOverlay.displayName = 'PausedOverlay';
