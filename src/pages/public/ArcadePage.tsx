import React, { useState, useEffect, useRef } from 'react';
import { updateSEO } from '../../lib/seo';
import {
  Gamepad2,
  Palette,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Calendar,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from 'lucide-react';

export const ArcadePage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Games & Creative Tools — Anil Shrestha',
      description:
        'Interactive designer arcade playground featuring Chrome Dino Runner, Tic Tac Toe with AI, Color Palette Generator, Retro Snake, and Nepal Bikram Sambat Date Converter.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/arcade' : '',
    });
  }, []);

  const [activeTab, setActiveTab] = useState<'PALETTE' | 'TTT' | 'DINO' | 'SNAKE' | 'DATE'>('PALETTE');

  const tabs = [
    { id: 'PALETTE' as const, label: 'Palette Generator', icon: Palette },
    { id: 'TTT' as const, label: 'Tic Tac Toe', icon: Gamepad2 },
    { id: 'DINO' as const, label: 'Dino Runner', icon: Play },
    { id: 'SNAKE' as const, label: 'Retro Snake', icon: Sparkles },
    { id: 'DATE' as const, label: 'Nepal BS Date', icon: Calendar },
  ];

  return (
    <div className="min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 sm:space-y-12 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-semibold">
          <Gamepad2 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          <span>Interactive Designer Arcade</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Games & Creative Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Take a creative break. Explore responsive mini-games and quick utility tools designed right in the browser.
        </p>
      </div>

      {/* Responsive Horizontal Scroll Tab Bar */}
      <div className="max-w-3xl mx-auto overflow-x-auto no-scrollbar py-1">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-slate-100 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs min-w-full sm:min-w-0 justify-start sm:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool / Game Workspace Container */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'PALETTE' && <ColorPaletteTool />}
        {activeTab === 'TTT' && <TicTacToeGame />}
        {activeTab === 'DINO' && <DinoRunnerGame />}
        {activeTab === 'SNAKE' && <SnakeGame />}
        {activeTab === 'DATE' && <DateConverterTool />}
      </div>
    </div>
  );
};

// =========================================================================
// 1. COLOR PALETTE GENERATOR TOOL
// =========================================================================
const ColorPaletteTool: React.FC = () => {
  const samplePalettes = [
    { name: 'Himalayan Sunrise', colors: ['#2563eb', '#f59e0b', '#06b6d4', '#10b981', '#64748b'] },
    { name: 'Pokhara Lake Twilight', colors: ['#0f172a', '#1e293b', '#3b82f6', '#60a5fa', '#f8fafc'] },
    { name: 'Tactile Editorial', colors: ['#1c1917', '#c2410c', '#78716c', '#d6d3d1', '#f5f5f4'] },
    { name: 'Organic Botanical', colors: ['#14532d', '#16a34a', '#86efac', '#fef08a', '#1e293b'] },
    { name: 'Modern Minimalist', colors: ['#09090b', '#27272a', '#52525b', '#a1a1aa', '#f4f4f5'] },
  ];

  const [currentPalette, setCurrentPalette] = useState(samplePalettes[0]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const generateRandom = () => {
    const letters = '0123456789ABCDEF';
    const randColor = () => {
      let color = '#';
      for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
      return color;
    };
    setCurrentPalette({
      name: 'Harmonic Creative Palette',
      colors: [randColor(), randColor(), randColor(), randColor(), randColor()],
    });
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  // Helper to determine text contrast based on color brightness
  const isLightColor = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  return (
    <div className="bg-card-theme border border-card-theme text-primary-theme rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block mb-1">
            Design Palette Engine
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{currentPalette.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={generateRandom}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Randomize Palette</span>
          </button>
        </div>
      </div>

      {/* Palette Color Bars (Responsive: comfortable on both mobile and desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 min-h-[360px] sm:h-60">
        {currentPalette.colors.map((hex) => {
          const isLight = isLightColor(hex);
          return (
            <div
              key={hex}
              onClick={() => copyToClipboard(hex)}
              className="rounded-2xl p-4 flex flex-col justify-between group cursor-pointer transition-all hover:scale-[1.02] shadow-xs relative overflow-hidden min-h-[70px] sm:min-h-0"
              style={{ backgroundColor: hex }}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-md shadow-xs backdrop-blur-md ${
                    isLight
                      ? 'bg-black/80 text-white'
                      : 'bg-white/90 text-slate-950'
                  }`}
                >
                  {hex}
                </span>

                <span
                  className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                    isLight ? 'bg-black/60 text-slate-200' : 'bg-white/80 text-slate-800'
                  }`}
                >
                  {isLight ? 'Dark Text' : 'Light Text'}
                </span>
              </div>

              <div className="self-end p-2 rounded-full bg-white text-slate-900 shadow-md flex items-center gap-1">
                {copiedHex === hex ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-bold text-emerald-600 pr-1">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-700" />
                    <span className="text-[10px] font-bold text-slate-700 pr-1">Copy HEX</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <p>Click any color bar above to copy its HEX code instantly to your clipboard.</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Curated Presets:</span>
          {samplePalettes.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setCurrentPalette(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. TIC TAC TOE GAME
// =========================================================================
const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState<'ai' | 'pvp'>('ai');
  const [aiLevel, setAiLevel] = useState<'easy' | 'hard'>('hard');
  const [score, setScore] = useState({ x: 0, o: 0, ties: 0 });
  const [soundEnabled, setSoundEnabled] = useState(true);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const calculateWinner = (squares: (string | null)[]) => {
    for (const [a, b, c] of winningCombinations) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (squares.every(Boolean)) return { winner: 'Tie', line: [] };
    return null;
  };

  const winInfo = calculateWinner(board);

  const playSound = (type: 'move' | 'win') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (type === 'move') {
        osc.frequency.setValueAtTime(350, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else {
        osc.frequency.setValueAtTime(550, audioCtx.currentTime);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      }
    } catch {}
  };

  const handleSquareClick = (idx: number) => {
    if (board[idx] || winInfo) return;
    playSound('move');

    const nextBoard = [...board];
    nextBoard[idx] = isXNext ? 'X' : 'O';
    setBoard(nextBoard);

    const nextWinner = calculateWinner(nextBoard);
    if (nextWinner) {
      playSound('win');
      if (nextWinner.winner === 'X') setScore((s) => ({ ...s, x: s.x + 1 }));
      else if (nextWinner.winner === 'O') setScore((s) => ({ ...s, o: s.o + 1 }));
      else setScore((s) => ({ ...s, ties: s.ties + 1 }));
    } else {
      setIsXNext(!isXNext);
    }
  };

  // AI Turn Logic
  useEffect(() => {
    if (mode === 'ai' && !isXNext && !winInfo) {
      const timer = setTimeout(() => {
        const available = board
          .map((v, i) => (v === null ? i : null))
          .filter((v) => v !== null) as number[];
        if (available.length === 0) return;

        let moveIndex = available[0];
        if (aiLevel === 'easy') {
          moveIndex = available[Math.floor(Math.random() * available.length)];
        } else {
          let found = false;
          // Check winning move
          for (const i of available) {
            const test = [...board];
            test[i] = 'O';
            if (calculateWinner(test)?.winner === 'O') {
              moveIndex = i;
              found = true;
              break;
            }
          }
          // Block opponent winning move
          if (!found) {
            for (const i of available) {
              const test = [...board];
              test[i] = 'X';
              if (calculateWinner(test)?.winner === 'X') {
                moveIndex = i;
                found = true;
                break;
              }
            }
          }
          // Choose center if open
          if (!found && board[4] === null) moveIndex = 4;
        }

        playSound('move');
        const nextBoard = [...board];
        nextBoard[moveIndex] = 'O';
        setBoard(nextBoard);

        const nextWinner = calculateWinner(nextBoard);
        if (nextWinner) {
          playSound('win');
          if (nextWinner.winner === 'O') setScore((s) => ({ ...s, o: s.o + 1 }));
          else setScore((s) => ({ ...s, ties: s.ties + 1 }));
        } else {
          setIsXNext(true);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isXNext, mode, board, winInfo, aiLevel]);

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="bg-card-theme border border-card-theme text-primary-theme rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block mb-1">
            Classic Arcade Game
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tic Tac Toe</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121212] p-1 rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('ai');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                mode === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              VS AI
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('pvp');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                mode === 'pvp' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              2 Player
            </button>
          </div>
        </div>
      </div>

      {mode === 'ai' && (
        <div className="flex justify-end text-xs text-slate-600 dark:text-slate-400 gap-2 items-center">
          <span>AI Difficulty:</span>
          <button
            type="button"
            onClick={() => {
              setAiLevel('easy');
              handleReset();
            }}
            className={`font-bold cursor-pointer ${
              aiLevel === 'easy' ? 'text-blue-600 dark:text-sky-400 underline' : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Casual
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              setAiLevel('hard');
              handleReset();
            }}
            className={`font-bold cursor-pointer ${
              aiLevel === 'hard' ? 'text-blue-600 dark:text-sky-400 underline' : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Master
          </button>
        </div>
      )}

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-[#121212] border border-blue-200 dark:border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block">
            {mode === 'ai' ? 'You (X)' : 'Player X'}
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{score.x}</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Ties
          </span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-200 font-mono">{score.ties}</span>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-[#121212] border border-emerald-200 dark:border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
            {mode === 'ai' ? 'AI (O)' : 'Player O'}
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{score.o}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[300px] mx-auto aspect-square grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-white/10">
        {board.map((cell, idx) => {
          const isWinningCell = winInfo?.line.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              disabled={Boolean(cell || winInfo || (mode === 'ai' && !isXNext))}
              onClick={() => handleSquareClick(idx)}
              className={`aspect-square rounded-xl text-3xl font-extrabold flex items-center justify-center transition-all cursor-pointer border ${
                isWinningCell
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-400 scale-105 shadow-md ring-2 ring-amber-400'
                  : cell === 'X'
                  ? 'bg-blue-50 dark:bg-sky-950/40 text-blue-600 dark:text-sky-400 border-blue-200 dark:border-sky-800/40'
                  : cell === 'O'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
                  : 'bg-white dark:bg-[#1e1e1e] hover:bg-slate-50 dark:hover:bg-white/5 border-slate-200 dark:border-white/10 active:scale-95 shadow-2xs'
              }`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Status & Restart */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {winInfo ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              {winInfo.winner === 'Tie' ? "It's a Draw!" : `Player ${winInfo.winner} Wins!`}
            </span>
          ) : (
            <span>
              Turn:{' '}
              <strong className={isXNext ? 'text-blue-600 dark:text-sky-400' : 'text-emerald-600 dark:text-emerald-400'}>
                {isXNext ? 'Player X' : mode === 'ai' ? 'AI Thinking...' : 'Player O'}
              </strong>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Board</span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 3. CHROME DINO RUNNER
// =========================================================================
const DinoRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'START' | 'RUNNING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('as_dino_high_score') || '0', 10)
  );
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound synthesis
  const playAudio = (type: 'jump' | 'score' | 'die') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'jump') {
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'die') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {}
  };

  const jumpRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let dinoY = 150;
    let dinoVy = 0;
    const gravity = 0.65;
    let isJumping = false;
    let obstacles: { x: number; width: number; height: number }[] = [];
    let currentScore = 0;
    let speed = 5.5;

    const handleJump = () => {
      if (!isJumping && gameState === 'RUNNING') {
        dinoVy = -12.5;
        isJumping = true;
        playAudio('jump');
      }
    };
    jumpRef.current = handleJump;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'START' || gameState === 'GAMEOVER') {
          startGame();
        } else {
          handleJump();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 185);
      ctx.lineTo(canvas.width, 185);
      ctx.stroke();

      if (gameState === 'RUNNING') {
        currentScore += 1;
        setScore(Math.floor(currentScore / 5));

        // Physics
        dinoY += dinoVy;
        dinoVy += gravity;
        if (dinoY >= 150) {
          dinoY = 150;
          dinoVy = 0;
          isJumping = false;
        }

        // Spawn obstacles
        if (Math.random() < 0.015 && obstacles.length < 3) {
          const lastObs = obstacles[obstacles.length - 1];
          if (!lastObs || canvas.width - lastObs.x > 200) {
            obstacles.push({
              x: canvas.width,
              width: 18 + Math.random() * 14,
              height: 25 + Math.random() * 20,
            });
          }
        }

        // Move obstacles
        obstacles.forEach((obs) => {
          obs.x -= speed;
        });
        obstacles = obstacles.filter((o) => o.x > -40);

        speed += 0.0005;

        // Collision check
        for (const obs of obstacles) {
          const dinoBox = { x: 50, y: dinoY, w: 26, h: 35 };
          const obsBox = { x: obs.x, y: 185 - obs.height, w: obs.width, h: obs.height };
          if (
            dinoBox.x < obsBox.x + obsBox.w &&
            dinoBox.x + dinoBox.w > obsBox.x &&
            dinoBox.y < obsBox.y + obsBox.h &&
            dinoBox.y + dinoBox.h > obsBox.y
          ) {
            setGameState('GAMEOVER');
            playAudio('die');
            const final = Math.floor(currentScore / 5);
            if (final > highScore) {
              setHighScore(final);
              localStorage.setItem('as_dino_high_score', final.toString());
            }
            return;
          }
        }
      }

      // Draw Dino (Electric Blue)
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.roundRect(50, dinoY, 26, 35, 6);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(68, dinoY + 8, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw Obstacles (Emerald Green)
      ctx.fillStyle = '#10b981';
      obstacles.forEach((obs) => {
        ctx.beginPath();
        ctx.roundRect(obs.x, 185 - obs.height, obs.width, obs.height, 4);
        ctx.fill();
      });

      if (gameState === 'RUNNING') {
        animId = requestAnimationFrame(update);
      }
    };

    if (gameState === 'RUNNING') {
      animId = requestAnimationFrame(update);
    } else {
      update();
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, highScore, soundEnabled]);

  const startGame = () => {
    setScore(0);
    setGameState('RUNNING');
  };

  const handleMobileTap = () => {
    if (gameState === 'START' || gameState === 'GAMEOVER') {
      startGame();
    } else if (jumpRef.current) {
      jumpRef.current();
    }
  };

  return (
    <div className="bg-card-theme border border-card-theme text-primary-theme rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block mb-1">
            Classic Retro Runner
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Chrome Dino Runner</h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-3 bg-slate-900 dark:bg-[#121212] text-white px-4 py-2 rounded-2xl font-mono text-sm shadow-xs border border-transparent dark:border-white/10">
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>HI</span>
            </span>
            <span className="text-amber-400 font-bold">{highScore.toString().padStart(5, '0')}</span>
            <span className="text-slate-600">|</span>
            <span className="font-bold">{score.toString().padStart(5, '0')}</span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        onClick={handleMobileTap}
        className="relative bg-slate-100 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner cursor-pointer select-none"
      >
        <canvas ref={canvasRef} width={640} height={200} className="w-full h-[200px] object-contain block" />

        {gameState === 'START' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <Play className="w-6 h-6 ml-1 fill-white" />
            </div>
            <h3 className="text-lg font-bold mb-1">Tap Screen or Press Space to Jump!</h3>
            <p className="text-xs text-slate-200 max-w-xs">
              Dodge cactus obstacles to beat the high score.
            </p>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-2">
              Game Over
            </span>
            <p className="text-2xl font-black mb-3">Score: {score}</p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Mobile Friendly Jump Button */}
      <div className="sm:hidden pt-2">
        <button
          type="button"
          onClick={handleMobileTap}
          className="w-full py-3 rounded-2xl bg-blue-600 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
          <span>{gameState === 'RUNNING' ? 'TAP TO JUMP' : 'START / RESTART'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Desktop: Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-white/10 rounded text-slate-800 dark:text-slate-200 font-mono">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-white/10 rounded text-slate-800 dark:text-slate-200 font-mono">↑</kbd> to jump.</span>
        <span>Mobile: Tap the canvas or button above.</span>
      </div>
    </div>
  );
};

// =========================================================================
// 4. RETRO SNAKE GAME
// =========================================================================
const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const GRID_SIZE = 20;

  useEffect(() => {
    if (!running || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (dir === 'UP') head.y -= 1;
        if (dir === 'DOWN') head.y += 1;
        if (dir === 'LEFT') head.x -= 1;
        if (dir === 'RIGHT') head.x += 1;

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        if (prev.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        const next = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          next.pop();
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [running, gameOver, dir, food]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && dir !== 'DOWN') setDir('UP');
      if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && dir !== 'UP') setDir('DOWN');
      if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && dir !== 'RIGHT') setDir('LEFT');
      if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && dir !== 'LEFT') setDir('RIGHT');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);

  const handleRestart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDir('RIGHT');
    setScore(0);
    setGameOver(false);
    setRunning(true);
  };

  return (
    <div className="bg-card-theme border border-card-theme text-primary-theme rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block mb-1">
            Retro Classic
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Snake Arcade</h2>
        </div>
        <div className="bg-slate-900 dark:bg-[#121212] text-white px-4 py-1.5 rounded-full font-mono text-sm font-bold border border-transparent dark:border-white/10">
          Score: {score}
        </div>
      </div>

      {/* Snake Board Container - Clean dark slate that looks great in both themes */}
      <div className="relative max-w-[320px] mx-auto aspect-square bg-[#1e293b] dark:bg-[#141414] rounded-2xl overflow-hidden border-4 border-slate-300 dark:border-white/10 shadow-md">
        <div
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={
                  isHead
                    ? 'bg-sky-400 rounded-sm'
                    : isBody
                    ? 'bg-blue-600 rounded-xs'
                    : isFood
                    ? 'bg-emerald-400 rounded-full animate-pulse shadow-xs shadow-emerald-400'
                    : 'bg-transparent border-[0.5px] border-white/[0.03]'
                }
              />
            );
          })}
        </div>

        {!running && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            {gameOver && <p className="text-rose-400 font-bold text-sm mb-2">Game Over!</p>}
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
            >
              {gameOver ? 'Play Again' : 'Start Snake'}
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Controls with accessible min-44px targets */}
      <div className="flex flex-col items-center gap-1.5 pt-2">
        <button
          type="button"
          onClick={() => dir !== 'DOWN' && setDir('UP')}
          aria-label="Move Up"
          className="w-14 h-11 rounded-xl bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-white/10 active:bg-blue-600 active:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer transition-colors"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dir !== 'RIGHT' && setDir('LEFT')}
            aria-label="Move Left"
            className="w-14 h-11 rounded-xl bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-white/10 active:bg-blue-600 active:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => dir !== 'UP' && setDir('DOWN')}
            aria-label="Move Down"
            className="w-14 h-11 rounded-xl bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-white/10 active:bg-blue-600 active:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => dir !== 'LEFT' && setDir('RIGHT')}
            aria-label="Move Right"
            className="w-14 h-11 rounded-xl bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-white/10 active:bg-blue-600 active:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 5. NEPAL BIKRAM SAMBAT DATE CONVERTER TOOL
// =========================================================================
const DateConverterTool: React.FC = () => {
  const [adDate, setAdDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [nepaliYear, setNepaliYear] = useState('2083');
  const [nepaliMonth, setNepaliMonth] = useState('Ashwin');

  const nepaliMonths = [
    'Baishakh',
    'Jestha',
    'Ashadh',
    'Shrawan',
    'Bhadra',
    'Ashwin',
    'Kartik',
    'Mangsir',
    'Poush',
    'Magh',
    'Falgun',
    'Chaitra',
  ];

  const convertDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return;
    const year = d.getFullYear() + 57;
    const monthIdx = (d.getMonth() + 8) % 12;
    setNepaliYear(year.toString());
    setNepaliMonth(nepaliMonths[monthIdx]);
  };

  return (
    <div className="bg-card-theme border border-card-theme text-primary-theme rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block mb-1">
          Nepal Regional Utility
        </span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bikram Sambat (BS) Date Converter</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Fast reference calculator between Gregorian (AD) and Nepal National Calendar (B.S.).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Gregorian (A.D.) Date
          </label>
          <input
            type="date"
            value={adDate}
            onChange={(e) => {
              setAdDate(e.target.value);
              convertDate(e.target.value);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-[#121212] border border-blue-100 dark:border-white/10 flex flex-col justify-center space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
            Nepali Bikram Sambat (B.S.)
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {nepaliMonth} {new Date(adDate).getDate()}, {nepaliYear} B.S.
          </p>
          <span className="text-[10px] text-blue-700 dark:text-slate-400 font-medium">
            Official Nepal Standard Calendar
          </span>
        </div>
      </div>
    </div>
  );
};
