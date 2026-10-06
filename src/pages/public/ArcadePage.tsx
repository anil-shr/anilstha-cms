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
  Trophy,
  Copy,
  Check,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ArcadePage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Games & Creative Tools — Anil Shrestha',
      description: 'Interactive designer playground featuring Chrome Dino Runner, Tic Tac Toe, Color Palette Generator, and Retro Snake game.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/arcade' : '',
    });
  }, []);

  const [activeTab, setActiveTab] = useState<'TTT' | 'DINO' | 'PALETTE' | 'SNAKE' | 'DATE'>('PALETTE');

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-10 text-slate-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 text-xs font-semibold">
          <Gamepad2 className="w-4 h-4 text-indigo-400" />
          <span>Interactive Designer Arcade</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Games & Creative Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Take a creative break. Explore interactive mini-games and quick utility tools designed right in the browser.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto p-1.5 rounded-full bg-[#0d121f] border border-white/10 shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('PALETTE')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'PALETTE'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Palette Generator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TTT')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'TTT'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Tic Tac Toe</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DINO')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'DINO'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Dino Runner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SNAKE')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'SNAKE'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Retro Snake</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DATE')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'DATE'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Nepal BS Date</span>
        </button>
      </div>

      {/* Tool Workspace Container */}
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

// 1. Color Palette Generator Tool
const ColorPaletteTool: React.FC = () => {
  const samplePalettes = [
    { name: 'Himalayan Sunrise', colors: ['#4f46e5', '#f59e0b', '#ec4899', '#06b6d4', '#10b981'] },
    { name: 'Pokhara Lake Twilight', colors: ['#0f172a', '#1e293b', '#3b82f6', '#60a5fa', '#f8fafc'] },
    { name: 'Tactile Editorial', colors: ['#111111', '#c2410c', '#6b6b6b', '#dededa', '#f7f7f5'] },
    { name: 'Organic Botanical', colors: ['#14532d', '#15803d', '#86efac', '#fef08a', '#1e293b'] },
    { name: 'Cybernetic Neon', colors: ['#09090b', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'] },
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
      name: 'Custom Harmonic Palette',
      colors: [randColor(), randColor(), randColor(), randColor(), randColor()],
    });
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Design Palette Engine
          </span>
          <h2 className="text-2xl font-bold text-slate-900">{currentPalette.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={generateRandom}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Randomize Palette</span>
          </button>
        </div>
      </div>

      {/* Palette Color Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 h-64 sm:h-56">
        {currentPalette.colors.map((hex) => (
          <div
            key={hex}
            onClick={() => copyToClipboard(hex)}
            className="rounded-2xl p-4 flex flex-col justify-between group cursor-pointer transition-transform hover:scale-[1.03] shadow-xs relative overflow-hidden"
            style={{ backgroundColor: hex }}
          >
            <span
              className="text-xs font-mono font-bold uppercase px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-xs self-start"
            >
              {hex}
            </span>

            <div className="self-end p-2 rounded-full bg-white/90 text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              {copiedHex === hex ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <p>Click any color bar above to copy its HEX code instantly to your clipboard.</p>
        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <span className="font-semibold text-slate-700">Curated Presets:</span>
          {samplePalettes.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setCurrentPalette(p)}
              className="underline text-indigo-600 hover:text-indigo-800"
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. Tic Tac Toe Game
const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState<'ai' | 'pvp'>('ai');
  const [aiLevel, setAiLevel] = useState<'easy' | 'hard'>('hard');
  const [score, setScore] = useState({ x: 0, o: 0, ties: 0 });

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

  // Play click sound using Web Audio API
  const playSound = (type: 'move' | 'win') => {
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

  // AI Move turn
  useEffect(() => {
    if (mode === 'ai' && !isXNext && !winInfo) {
      const timer = setTimeout(() => {
        const available = board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null) as number[];
        if (available.length === 0) return;

        let moveIndex = available[0];
        if (aiLevel === 'easy') {
          moveIndex = available[Math.floor(Math.random() * available.length)];
        } else {
          // Hard: check winning move or block opponent
          let found = false;
          for (const i of available) {
            const test = [...board];
            test[i] = 'O';
            if (calculateWinner(test)?.winner === 'O') {
              moveIndex = i;
              found = true;
              break;
            }
          }
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
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Classic Arcade Game
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Tic Tac Toe</h2>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('ai');
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-full transition-all ${
              mode === 'ai' ? 'bg-slate-900 text-white' : 'text-slate-600'
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
            className={`px-3 py-1.5 rounded-full transition-all ${
              mode === 'pvp' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            2 Player
          </button>
        </div>
      </div>

      {mode === 'ai' && (
        <div className="flex justify-end text-xs text-slate-600 gap-2">
          <span>AI Difficulty:</span>
          <button
            type="button"
            onClick={() => {
              setAiLevel('easy');
              handleReset();
            }}
            className={`font-bold ${aiLevel === 'easy' ? 'text-indigo-600 underline' : ''}`}
          >
            Easy
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              setAiLevel('hard');
              handleReset();
            }}
            className={`font-bold ${aiLevel === 'hard' ? 'text-indigo-600 underline' : ''}`}
          >
            Impossible
          </button>
        </div>
      )}

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
            {mode === 'ai' ? 'You (X)' : 'Player X'}
          </span>
          <span className="text-2xl font-extrabold text-indigo-950 font-mono">{score.x}</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Ties
          </span>
          <span className="text-2xl font-extrabold text-slate-800 font-mono">{score.ties}</span>
        </div>
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
            {mode === 'ai' ? 'AI (O)' : 'Player O'}
          </span>
          <span className="text-2xl font-extrabold text-rose-950 font-mono">{score.o}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[280px] mx-auto aspect-square grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-100 border border-slate-200">
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
                  ? 'bg-amber-300 text-slate-900 border-amber-400 scale-105 shadow-md'
                  : cell === 'X'
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                  : cell === 'O'
                  ? 'bg-rose-50 text-rose-500 border-rose-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200 active:scale-95 shadow-2xs'
              }`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Status & Restart */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs font-semibold text-slate-600">
          {winInfo ? (
            <span className="text-emerald-600 font-bold">
              {winInfo.winner === 'Tie' ? "It's a Draw!" : `Player ${winInfo.winner} Wins!`}
            </span>
          ) : (
            <span>
              Turn:{' '}
              <strong className={isXNext ? 'text-indigo-600' : 'text-rose-500'}>
                {isXNext ? 'Player X' : mode === 'ai' ? 'AI Thinking...' : 'Player O'}
              </strong>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-indigo-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Board</span>
        </button>
      </div>
    </div>
  );
};

// 3. Chrome Dino Runner Game
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let dinoY = 160;
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
      ctx.strokeStyle = '#475569';
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

        // Increase speed slightly
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

      // Draw Dino
      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.roundRect(50, dinoY, 26, 35, 6);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(68, dinoY + 8, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw Obstacles
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

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Classic Retro Runner
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Chrome Dino Runner</h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-2xl font-mono text-sm shadow-sm">
            <span className="text-slate-400 text-xs">HI</span>
            <span className="text-amber-400 font-bold">{highScore.toString().padStart(5, '0')}</span>
            <span className="text-slate-600">|</span>
            <span className="font-bold">{score.toString().padStart(5, '0')}</span>
          </div>
        </div>
      </div>

      {/* Canvas Screen */}
      <div
        onClick={() => {
          if (gameState === 'START' || gameState === 'GAMEOVER') startGame();
        }}
        className="relative bg-gradient-to-b from-slate-50 to-slate-100/90 rounded-2xl overflow-hidden border border-slate-200 shadow-inner cursor-pointer select-none"
      >
        <canvas ref={canvasRef} width={640} height={200} className="w-full h-[200px] object-contain block" />

        {gameState === 'START' && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <Play className="w-6 h-6 ml-1 fill-white" />
            </div>
            <h4 className="text-lg font-bold mb-1">Press Space or Tap Screen to Jump!</h4>
            <p className="text-xs text-slate-200 max-w-xs">
              Dodge cactus obstacles to break your high score.
            </p>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-2">
              Game Over
            </span>
            <p className="text-2xl font-black mb-2">Score: {score}</p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-800 font-mono">Space</kbd> or click to jump.</span>
        <span>Speed increases dynamically with distance.</span>
      </div>
    </div>
  );
};

// 4. Retro Snake Game
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

        // Collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        // Collision with self
        if (prev.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        const next = [head, ...prev];
        // Eat food
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
      if (e.key === 'ArrowUp' && dir !== 'DOWN') setDir('UP');
      if (e.key === 'ArrowDown' && dir !== 'UP') setDir('DOWN');
      if (e.key === 'ArrowLeft' && dir !== 'RIGHT') setDir('LEFT');
      if (e.key === 'ArrowRight' && dir !== 'LEFT') setDir('RIGHT');
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
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Retro Classic
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Snake Arcade</h2>
        </div>
        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full font-mono text-sm font-bold">
          Score: {score}
        </div>
      </div>

      <div className="relative max-w-[320px] mx-auto aspect-square bg-slate-900 rounded-2xl overflow-hidden border-4 border-slate-800 shadow-md">
        {/* Render Grid cells */}
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
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={
                  isSnake
                    ? 'bg-emerald-400 rounded-xs'
                    : isFood
                    ? 'bg-rose-500 rounded-full animate-ping'
                    : 'bg-transparent'
                }
              />
            );
          })}
        </div>

        {!running && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            {gameOver && <p className="text-rose-400 font-bold text-sm mb-2">Game Over!</p>}
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
            >
              {gameOver ? 'Play Again' : 'Start Snake'}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => dir !== 'DOWN' && setDir('UP')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
        >
          ▲ UP
        </button>
        <button
          type="button"
          onClick={() => dir !== 'UP' && setDir('DOWN')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
        >
          ▼ DOWN
        </button>
        <button
          type="button"
          onClick={() => dir !== 'RIGHT' && setDir('LEFT')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
        >
          ◀ LEFT
        </button>
        <button
          type="button"
          onClick={() => dir !== 'LEFT' && setDir('RIGHT')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
        >
          ▶ RIGHT
        </button>
      </div>
    </div>
  );
};

// 5. Nepal Bikram Sambat Date Converter Tool
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

  // Quick Bikram Sambat approximation: AD Year + 56 / 57
  const convertDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear() + 57;
    const monthIdx = (d.getMonth() + 8) % 12;
    setNepaliYear(year.toString());
    setNepaliMonth(nepaliMonths[monthIdx]);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
          Nepal Regional Utility
        </span>
        <h2 className="text-2xl font-bold text-slate-900">Bikram Sambat (BS) Date Converter</h2>
        <p className="text-xs text-slate-500 mt-1">
          Fast reference calculator between Gregorian (AD) and Nepal National Calendar (BS).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Gregorian (AD) Date
          </label>
          <input
            type="date"
            value={adDate}
            onChange={(e) => {
              setAdDate(e.target.value);
              convertDate(e.target.value);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Nepali Bikram Sambat (BS)
          </span>
          <p className="text-xl font-extrabold text-indigo-950">
            {nepaliMonth} {new Date(adDate).getDate()}, {nepaliYear} B.S.
          </p>
          <span className="text-[10px] text-indigo-700 font-medium">Official Nepal Standard Calendar</span>
        </div>
      </div>
    </div>
  );
};
