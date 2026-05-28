import { useState, useEffect, useCallback, useRef } from 'react';
import {
  COLS, ROWS, TETROMINOES, TETROMINO_KEYS,
  SCORE_TABLE, LINES_PER_LEVEL, getDropInterval, INITIAL_LEADERBOARD,
} from '../constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
  const key = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  return { type: key, rotation: 0, x: 3, y: 0 };
}

function getShape(piece) {
  return TETROMINOES[piece.type].shapes[piece.rotation];
}

function isValid(piece, grid, dx = 0, dy = 0, rotation = piece.rotation) {
  const shape = TETROMINOES[piece.type].shapes[rotation];
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const newX = piece.x + c + dx;
      const newY = piece.y + r + dy;
      if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
      if (newY < 0) continue;
      if (grid[newY][newX]) return false;
    }
  }
  return true;
}

function placePiece(piece, grid) {
  const newGrid = grid.map(row => [...row]);
  const shape = getShape(piece);
  shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) {
        const y = piece.y + r;
        const x = piece.x + c;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
          newGrid[y][x] = piece.type;
        }
      }
    });
  });
  return newGrid;
}

function clearLines(grid) {
  const cleared = [];
  const remaining = [];
  grid.forEach((row, i) => {
    if (row.every(cell => cell !== null)) {
      cleared.push(i);
    } else {
      remaining.push(row);
    }
  });
  const empty = Array.from({ length: cleared.length }, () => Array(COLS).fill(null));
  return { newGrid: [...empty, ...remaining], linesCleared: cleared.length };
}

function getGhostY(piece, grid) {
  let dy = 0;
  while (isValid(piece, grid, 0, dy + 1)) dy++;
  return piece.y + dy;
}

function wallKick(piece, grid, newRotation) {
  const kicks = [0, 1, -1, 2, -2];
  for (const dx of kicks) {
    if (isValid(piece, grid, dx, 0, newRotation)) return dx;
  }
  return null;
}

// Ensure initial leaderboard has sensible values
const defaultLeaderboard = [
  { name: "Alpha", score: 10000 },
  { name: "Beta", score: 8000 },
  { name: "Gamma", score: 6000 },
  { name: "Delta", score: 4000 },
  { name: "Epsilon", score: 2000 }
];

const resolvedLeaderboard = INITIAL_LEADERBOARD || defaultLeaderboard;

function loadLeaderboard() {
  try {
    const stored = localStorage.getItem('tetris-leaderboard');
    return stored ? JSON.parse(stored) : [...resolvedLeaderboard];
  } catch {
    return [...resolvedLeaderboard];
  }
}

function saveLeaderboard(entries) {
  try {
    localStorage.setItem('tetris-leaderboard', JSON.stringify(entries));
  } catch { /* ignore */ }
}

// ─── Main Hook ────────────────────────────────────────────────────────────────

export function useTetris() {
  const [grid, setGrid]               = useState(createEmptyGrid);
  const [current, setCurrent]         = useState(null);
  const [next, setNext]               = useState(null);
  const [score, setScore]             = useState(0);
  const [level, setLevel]             = useState(1);
  const [lines, setLines]             = useState(0);
  const [gameState, setGameState]     = useState('idle'); // idle | running | paused | over
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard);
  const [flashRows, setFlashRows]     = useState([]);
  const [levelPulse, setLevelPulse]   = useState(false);
  const [scorePop, setScorePop]       = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Refs to avoid stale closures in the game loop
  const gridRef     = useRef(grid);
  const currentRef  = useRef(current);
  const gameStateRef = useRef(gameState);
  const scoreRef    = useRef(score);
  const levelRef    = useRef(level);
  const linesRef    = useRef(lines);

  useEffect(() => { gridRef.current     = grid;      }, [grid]);
  useEffect(() => { currentRef.current  = current;   }, [current]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { scoreRef.current    = score;     }, [score]);
  useEffect(() => { levelRef.current    = level;     }, [level]);
  useEffect(() => { linesRef.current    = lines;     }, [lines]);

  // ── Spawn new piece ────────────────────────────────────────────────────────
  const spawnPiece = useCallback((nextPiece, currentGrid) => {
    const piece = nextPiece;
    const newNext = randomPiece();
    if (!isValid(piece, currentGrid)) {
      setGameState('over');
      return;
    }
    setCurrent(piece);
    setNext(newNext);
  }, []);

  // ── Lock piece, clear lines, spawn next ───────────────────────────────────
  const lockAndSpawn = useCallback((piece, currentGrid) => {
    const placed = placePiece(piece, currentGrid);
    const { newGrid, linesCleared } = clearLines(placed);

    if (linesCleared > 0) {
      // Flash cleared rows
      const clearedIndices = [];
      placed.forEach((row, i) => {
        if (row.every(c => c !== null)) clearedIndices.push(i);
      });
      setFlashRows(clearedIndices);
      setTimeout(() => setFlashRows([]), 200);

      const pts = SCORE_TABLE[linesCleared] * levelRef.current;
      const newLines = linesRef.current + linesCleared;
      const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;

      setScore(prev => {
        scoreRef.current = prev + pts;
        return prev + pts;
      });
      setScorePop(true);
      setTimeout(() => setScorePop(false), 400);

      if (newLevel > levelRef.current) {
        setLevelPulse(true);
        setTimeout(() => setLevelPulse(false), 500);
      }

      setLines(newLines);
      setLevel(newLevel);
      setGrid(newGrid);
      gridRef.current = newGrid;
    } else {
      setGrid(placed);
      gridRef.current = placed;
    }

    const nextPiece = randomPiece();
    if (!isValid(nextPiece, newGrid)) {
      setGameState('over');
    } else {
      setCurrent(nextPiece);
      setNext(randomPiece());
    }
  }, []);

  // ── Drop one step ──────────────────────────────────────────────────────────
  const dropStep = useCallback(() => {
    if (gameStateRef.current !== 'running') return;
    const piece = currentRef.current;
    const g = gridRef.current;
    if (!piece) return;

    if (isValid(piece, g, 0, 1)) {
      const moved = { ...piece, y: piece.y + 1 };
      setCurrent(moved);
      currentRef.current = moved;
    } else {
      lockAndSpawn(piece, g);
    }
  }, [lockAndSpawn]);

  // ── Game loop via setInterval ──────────────────────────────────────────────
  const intervalRef = useRef(null);

  const startLoop = useCallback((lvl) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(dropStep, getDropInterval(lvl));
  }, [dropStep]);

  // Re-start loop when level changes
  useEffect(() => {
    if (gameState === 'running') {
      startLoop(level);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [level, gameState, startLoop]);

  // ── Public actions ─────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const fresh = createEmptyGrid();
    const first = randomPiece();
    const second = randomPiece();
    setGrid(fresh);
    gridRef.current = fresh;
    setCurrent(first);
    currentRef.current = first;
    setNext(second);
    setScore(0);
    setLevel(1);
    setLines(0);
    setFlashRows([]);
    setShowSaveModal(false);
    setGameState('running');
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => {
      const next = prev === 'running' ? 'paused' : 'running';
      gameStateRef.current = next;
      return next;
    });
  }, []);

  const moveLeft = useCallback(() => {
    if (gameStateRef.current !== 'running') return;
    const p = currentRef.current;
    const g = gridRef.current;
    if (p && isValid(p, g, -1, 0)) {
      const moved = { ...p, x: p.x - 1 };
      setCurrent(moved);
      currentRef.current = moved;
    }
  }, []);

  const moveRight = useCallback(() => {
    if (gameStateRef.current !== 'running') return;
    const p = currentRef.current;
    const g = gridRef.current;
    if (p && isValid(p, g, 1, 0)) {
      const moved = { ...p, x: p.x + 1 };
      setCurrent(moved);
      currentRef.current = moved;
    }
  }, []);

  const moveDown = useCallback(() => {
    if (gameStateRef.current !== 'running') return;
    dropStep();
  }, [dropStep]);

  const rotate = useCallback(() => {
    if (gameStateRef.current !== 'running') return;
    const p = currentRef.current;
    const g = gridRef.current;
    if (!p) return;
    const newRot = (p.rotation + 1) % 4;
    const kick = wallKick(p, g, newRot);
    if (kick !== null) {
      const rotated = { ...p, rotation: newRot, x: p.x + kick };
      setCurrent(rotated);
      currentRef.current = rotated;
    }
  }, []);

  const hardDrop = useCallback(() => {
    if (gameStateRef.current !== 'running') return;
    const p = currentRef.current;
    const g = gridRef.current;
    if (!p) return;
    const ghostY = getGhostY(p, g);
    const dropped = { ...p, y: ghostY };
    // Award 2 points per cell dropped
    const dropDist = ghostY - p.y;
    setScore(prev => prev + dropDist * 2);
    lockAndSpawn(dropped, g);
  }, [lockAndSpawn]);

  // ── Keyboard controls ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Space',' ','a','A','d','D','s','S','w','W'].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowLeft':  case 'a': case 'A': moveLeft();  break;
        case 'ArrowRight': case 'd': case 'D': moveRight(); break;
        case 'ArrowDown':  case 's': case 'S': moveDown();  break;
        case 'ArrowUp':    case 'w': case 'W': rotate();    break;
        case ' ': case 'Space': hardDrop(); break;
        case 'p': case 'P': case 'Escape': pauseGame(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, pauseGame]);

  // ── Leaderboard helpers ────────────────────────────────────────────────────
  const isHighScore = useCallback((sc) => {
    if (leaderboard.length < 5) return true;
    return sc > leaderboard[leaderboard.length - 1].score;
  }, [leaderboard]);

  const submitScore = useCallback((name, sc) => {
    const entry = { name: name.trim() || 'Player', score: sc };
    const updated = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setLeaderboard(updated);
    saveLeaderboard(updated);
    setShowSaveModal(false);
  }, [leaderboard]);

  // Show save modal when game over and score qualifies
  useEffect(() => {
    if (gameState === 'over' && score > 0 && isHighScore(score)) {
      setTimeout(() => setShowSaveModal(true), 600);
    }
  }, [gameState, score, isHighScore]);

  // ── Compute ghost position ─────────────────────────────────────────────────
  const ghostY = current && gameState === 'running' ? getGhostY(current, grid) : null;

  return {
    grid, current, next, score, level, lines,
    gameState, leaderboard, flashRows,
    ghostY, levelPulse, scorePop, showSaveModal,
    startGame, pauseGame, moveLeft, moveRight, moveDown, rotate, hardDrop,
    submitScore, isHighScore,
  };
}
