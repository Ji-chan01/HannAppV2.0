import React, { useState } from 'react';
import './Tetris.css';
import '../pages/HomePage.css';
import Header from '../components/Header';
import HomeLeftSidebar from '../components/HomeLeftSidebar';
import HomeRightSidebar from '../components/HomeRightSidebar';
import { useTetris } from './hooks/useTetris';
import GameGrid from './components/GameGrid';
import NextPiece from './components/NextPiece';
import HUD from './components/HUD';
import Leaderboard from './components/Leaderboard';
import Starfield from './components/Starfield';
import { StartOverlay, GameOverOverlay, PausedOverlay } from './components/Overlays';
import { COLS, ROWS } from './constants';

// Cell size in px — drives the board dimensions
const CELL = 30;
const BOARD_W = COLS * CELL + (COLS + 1) * 1; // cells + 1px gaps
const BOARD_H = ROWS * CELL + (ROWS + 1) * 1;

export default function TetrisPage() {
  const [isDayMode, setIsDayMode] = useState(false);

  const {
    grid, current, next, score, level, lines,
    gameState, leaderboard, flashRows,
    ghostY, levelPulse, scorePop, showSaveModal,
    startGame, pauseGame,
    moveLeft, moveRight, moveDown, rotate, hardDrop,
    submitScore,
  } = useTetris();

  return (
    <div
      className={`home-page-wrapper bg-[var(--smoky-black)] pt-12 min-h-screen w-full text-[var(--light-gray)] font-[var(--ff-poppins)] relative transition-colors duration-200 ${isDayMode ? 'day bg-white text-black' : ''}`}
    >
      {/* ── Animated starfield (Tetris flair) ── */}
      <Starfield />

      {/* ── Header ──────────────────────────── */}
      <Header isDayMode={isDayMode} setIsDayMode={setIsDayMode} />

      <main className="main-container flex p-8 px-6 w-full max-w-full gap-6">

        {/* ── Left Sidebar (shared with HomePage, Tetris card highlighted) ── */}
        <HomeLeftSidebar activeGame="tetris" />

        {/* ── Centre: Tetris game ─────────────────────────────────────────── */}
        <section
          className="middle w-full h-full flex-[3] min-w-0 flex items-start justify-center"
          style={{ padding: '1rem 0' }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: '1.25rem',
              width: '100%',
            }}
          >
            {/* ═══ LEFT COLUMN: HUD + Next Piece ═══ */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                width: 140,
                flexShrink: 0,
                paddingTop: '0.5rem',
              }}
            >
              <NextPiece piece={next} />
              <HUD
                score={score}
                level={level}
                lines={lines}
                scorePop={scorePop}
                levelPulse={levelPulse}
                onPause={pauseGame}
                gameState={gameState}
              />
            </div>

            {/* ═══ CENTER: Game Board ═══ */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>

              {/* Title banner */}
              <div style={{ textAlign: 'center' }}>
                <h1
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    background: 'linear-gradient(135deg, #a855f7 30%, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  TETRIS
                </h1>
                <p style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '0.45rem',
                  letterSpacing: '0.4em',
                  color: '#4f46e5',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}>
                  Level {level} · {lines} Lines
                </p>
              </div>

              {/* Game board container */}
              <div
                style={{
                  position: 'relative',
                  width: BOARD_W,
                  height: BOARD_H,
                  borderRadius: '8px',
                  border: '1px solid rgba(124,58,237,0.4)',

                  overflow: 'hidden',
                  background: 'rgba(5,5,15,0.95)',
                }}
              >
                <GameGrid
                  grid={grid}
                  current={current}
                  ghostY={ghostY}
                  flashRows={flashRows}
                />

                {/* Overlays */}
                {gameState === 'idle' && (
                  <StartOverlay onStart={startGame} />
                )}
                {gameState === 'over' && (
                  <GameOverOverlay
                    score={score}
                    level={level}
                    lines={lines}
                    onRestart={startGame}
                  />
                )}
                {gameState === 'paused' && (
                  <PausedOverlay onResume={pauseGame} />
                )}
              </div>

              {/* Mobile touch controls */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                {[
                  { label: '←', id: 'btn-left', action: moveLeft },
                  { label: '↓', id: 'btn-down', action: moveDown },
                  { label: '↑', id: 'btn-rotate', action: rotate },
                  { label: '→', id: 'btn-right', action: moveRight },
                  { label: '⬇', id: 'btn-hard', action: hardDrop },
                ].map(({ label, id, action }) => (
                  <button
                    key={id}
                    id={id}
                    onPointerDown={(e) => { e.preventDefault(); action(); }}
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      border: '1px solid rgba(124,58,237,0.4)',
                      background: 'rgba(15,15,30,0.85)',
                      color: '#a78bfa',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.1s',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      touchAction: 'none',
                    }}
                    onPointerEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.2)'}
                    onPointerLeave={e => e.currentTarget.style.background = 'rgba(15,15,30,0.85)'}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p style={{
                fontSize: '0.55rem',
                color: '#334155',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.08em',
              }}>
                © 2026 TETRIS · All rights reserved
              </p>
            </div>

            {/* ═══ RIGHT COLUMN: Leaderboard ═══ */}
            <div style={{ width: 190, flexShrink: 0, paddingTop: '0.5rem' }}>
              <Leaderboard
                entries={leaderboard}
                showSaveModal={showSaveModal}
                currentScore={score}
                onSubmit={submitScore}
              />
            </div>
          </div>
        </section>

        {/* ── Right Sidebar (shared with HomePage) ── */}
        <HomeRightSidebar />

      </main>
    </div>
  );
}
