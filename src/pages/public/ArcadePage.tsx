import React, { useState, useEffect, useRef } from 'react';
import { updateSEO } from '../../lib/seo';
import { NepaliDateConverter } from '../../components/public/NepaliDateConverter';
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
  Lock,
  Unlock,
  Eye,
  Download,
  Share2,
  Code,
  Flame,
  Cpu,
  Monitor,
  Zap,
} from 'lucide-react';

export const ArcadePage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Games & Creative Tools — Anil Shrestha',
      description:
        'Interactive designer arcade playground featuring Chrome Dino Runner with classic/minimal/retro/cyberpunk themes, Snake Game, Color Palette Generator with live UI preview, and Nepal BS Date Converter.',
      canonicalUrl: 'https://anilshrestha11.com.np/arcade',
    });
  }, []);

  const [activeTab, setActiveTab] = useState<'PALETTE' | 'DINO' | 'SNAKE' | 'DATE'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash.includes('date') ||
        hash.includes('converter') ||
        search.includes('date') ||
        search.includes('converter') ||
        window.location.pathname.includes('converter')
      ) {
        return 'DATE';
      }
    }
    return 'PALETTE';
  });

  const tabs = [
    { id: 'PALETTE' as const, label: 'Color Palette Studio', icon: Palette },
    { id: 'DINO' as const, label: 'Chrome Dino Runner', icon: Play },
    { id: 'SNAKE' as const, label: 'Snake Arcade', icon: Sparkles },
    { id: 'DATE' as const, label: 'Nepal BS Date', icon: Calendar },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 sm:space-y-12 text-slate-900 dark:text-slate-100 transition-colors text-left">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-semibold">
          <Gamepad2 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          <span>Interactive Designer Arcade & Tools</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Games & Creative Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Take a creative break. Explore responsive browser mini-games with authentic themes, color design utilities, and regional date converters.
        </p>
      </div>

      {/* Responsive Horizontal Tab Bar */}
      <div className="max-w-2xl mx-auto overflow-x-auto no-scrollbar py-1">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-slate-100 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs min-w-full sm:min-w-0 justify-start sm:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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

      {/* Active Tool/Game Container */}
      <div className="w-full">
        {activeTab === 'PALETTE' && <ColorPaletteStudio />}
        {activeTab === 'DINO' && <DinoRunnerGame />}
        {activeTab === 'SNAKE' && <SnakeGame />}
        {activeTab === 'DATE' && <DateConverterTool />}
      </div>
    </div>
  );
};

// =========================================================================
// 1. REFINED COLOR PALETTE STUDIO WITH UI PREVIEW & ACCESSIBILITY
// =========================================================================
interface PaletteColor {
  hex: string;
  locked: boolean;
}

const ColorPaletteStudio: React.FC = () => {
  const curatedPalettes = [
    {
      name: 'Himalayan Sunrise',
      colors: ['#1E3A8A', '#2563EB', '#F59E0B', '#10B981', '#06B6D4'],
    },
    {
      name: 'Pokhara Lake Twilight',
      colors: ['#0F172A', '#1E293B', '#3B82F6', '#60A5FA', '#F8FAFC'],
    },
    {
      name: 'Cyberpunk Neon',
      colors: ['#0A0A0F', '#7928CA', '#FF0080', '#00DFD8', '#F5A623'],
    },
    {
      name: 'Tactile Editorial',
      colors: ['#1C1917', '#C2410C', '#78716C', '#D6D3D1', '#F5F5F4'],
    },
    {
      name: 'Organic Botanical',
      colors: ['#14532D', '#16A34A', '#86EFAC', '#FEF08A', '#1E293B'],
    },
    {
      name: 'Tokyo Sunset',
      colors: ['#312E81', '#4F46E5', '#EC4899', '#F43F5E', '#FBBF24'],
    },
    {
      name: 'Modern Minimalist',
      colors: ['#09090B', '#27272A', '#52525B', '#A1A1AA', '#F4F4F5'],
    },
  ];

  const [palette, setPalette] = useState<PaletteColor[]>([
    { hex: '#1E3A8A', locked: false },
    { hex: '#2563EB', locked: false },
    { hex: '#F59E0B', locked: false },
    { hex: '#10B981', locked: false },
    { hex: '#06B6D4', locked: false },
  ]);

  const [paletteName, setPaletteName] = useState('Himalayan Sunrise');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'json'>('css');

  // Generate random vibrant hex
  const getRandomHex = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
  };

  const generateNewPalette = () => {
    setPalette((prev) =>
      prev.map((c) => (c.locked ? c : { hex: getRandomHex(), locked: false }))
    );
    setPaletteName('Custom Harmonic Palette');
  };

  // Keyboard shortcut: spacebar generates new colors
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        generateNewPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLock = (index: number) => {
    setPalette((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Color conversion helpers
  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const isLight = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.55;
  };

  const getContrastRatio = (hex: string) => {
    const light = isLight(hex);
    return light ? 'AAA' : 'AA';
  };

  const exportSnippets = {
    css: `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`,
    tailwind: `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        palette: {\n${palette.map((c, i) => `          ${(i + 1) * 100}: '${c.hex}',`).join('\n')}\n        }\n      }\n    }\n  }\n};`,
    json: JSON.stringify({ name: paletteName, colors: palette.map((c) => c.hex) }, null, 2),
  };

  return (
    <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
      {/* Studio Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block mb-1">
            Design Token Studio
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{paletteName}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded font-mono font-bold text-slate-800 dark:text-slate-200">Space</kbd> or click Generate to re-roll unlocked swatches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={generateNewPalette}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Export Code</span>
          </button>
        </div>
      </div>

      {/* Preset Curated Palettes Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Curated Palettes
        </span>
        <div className="flex flex-wrap gap-2">
          {curatedPalettes.map((cp) => (
            <button
              key={cp.name}
              type="button"
              onClick={() => {
                setPalette(cp.colors.map((hex) => ({ hex, locked: false })));
                setPaletteName(cp.name);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                paletteName === cp.name
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 font-bold'
                  : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex -space-x-1 overflow-hidden">
                {cp.colors.slice(0, 3).map((col, idx) => (
                  <span
                    key={idx}
                    className="inline-block w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
              <span>{cp.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 5-Column Swatch Palette Display */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 rounded-2xl overflow-hidden">
        {palette.map((col, idx) => {
          const lightText = isLight(col.hex);
          const contrast = getContrastRatio(col.hex);
          return (
            <div
              key={idx}
              className="group relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-44 sm:h-72 transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: col.hex }}
            >
              {/* Top Bar inside swatch: Lock & Accessibility Tag */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-xs ${
                    lightText ? 'bg-black/10 text-slate-900' : 'bg-white/20 text-white'
                  }`}
                  title={`WCAG Contrast Level: ${contrast}`}
                >
                  {contrast} WCAG
                </span>

                <button
                  type="button"
                  onClick={() => toggleLock(idx)}
                  className={`p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                    lightText
                      ? 'bg-black/10 text-slate-900 hover:bg-black/20'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  title={col.locked ? 'Unlock color' : 'Lock color'}
                >
                  {col.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />}
                </button>
              </div>

              {/* Bottom Details inside swatch */}
              <div
                className={`space-y-1.5 pt-4 ${
                  lightText ? 'text-slate-900' : 'text-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => copyText(col.hex, `hex-${idx}`)}
                  className="w-full flex items-center justify-between font-mono font-black text-sm sm:text-base tracking-wider hover:opacity-80 cursor-pointer"
                >
                  <span>{col.hex}</span>
                  {copiedCode === `hex-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => copyText(hexToRgb(col.hex), `rgb-${idx}`)}
                  className="w-full text-left font-mono text-[11px] opacity-75 hover:opacity-100 cursor-pointer flex items-center justify-between"
                >
                  <span>{hexToRgb(col.hex)}</span>
                </button>

                <div className="pt-1">
                  <span
                    className={`text-[9px] uppercase tracking-wider block font-bold opacity-60`}
                  >
                    Slot {idx + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Interactive UI Mockup Preview */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Live Real-World UI Preview
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Rendered with active palette colors
          </span>
        </div>

        {/* Real Mockup Card */}
        <div
          className="p-6 rounded-2xl shadow-sm space-y-4 text-left transition-colors border"
          style={{
            backgroundColor: palette[4].hex,
            borderColor: palette[1].hex + '40',
            color: isLight(palette[4].hex) ? '#0f172a' : '#f8fafc',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: palette[2].hex,
                color: isLight(palette[2].hex) ? '#0f172a' : '#ffffff',
              }}
            >
              Featured Brand Project
            </span>
            <span className="text-xs opacity-75 font-mono">2026 Edition</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-bold">
              Harmonic Brand Identity & Interface Experience
            </h4>
            <p className="text-xs sm:text-sm opacity-85 leading-relaxed max-w-xl">
              Previewing how primary tones, accents, and background neutrals work together across contrast boundaries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-transform cursor-pointer"
              style={{
                backgroundColor: palette[0].hex,
                color: isLight(palette[0].hex) ? '#0f172a' : '#ffffff',
              }}
            >
              Primary Action
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer"
              style={{
                borderColor: palette[1].hex,
                color: isLight(palette[4].hex) ? palette[1].hex : '#ffffff',
                backgroundColor: 'transparent',
              }}
            >
              Outline Button
            </button>
            <span
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium"
              style={{
                backgroundColor: palette[3].hex + '30',
                color: isLight(palette[4].hex) ? '#0f172a' : '#ffffff',
              }}
            >
              Tag: {palette[3].hex}
            </span>
          </div>
        </div>
      </div>

      {/* Code Export Modal */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <span>Export Design Tokens</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
              {(['css', 'tailwind', 'json'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setExportFormat(fmt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    exportFormat === fmt
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-60">
              {exportSnippets[exportFormat]}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">Ready to paste into your codebase</span>
              <button
                type="button"
                onClick={() => copyText(exportSnippets[exportFormat], 'export')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === 'export' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'export' ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. CHROME DINO RUNNER WITH CLASSIC, MINIMAL, RETRO & CYBERPUNK THEMES
// =========================================================================
type DinoTheme = 'CLASSIC' | 'MINIMAL' | 'RETRO' | 'CYBERPUNK';

const DinoRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<DinoTheme>('CLASSIC');
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
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'die') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
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
    let dinoY = 145;
    let dinoVy = 0;
    const gravity = 0.68;
    let isJumping = false;
    let obstacles: { x: number; width: number; height: number; type: 'single' | 'double' | 'tall' }[] = [];
    let clouds: { x: number; y: number; speed: number }[] = [
      { x: 100, y: 35, speed: 0.5 },
      { x: 300, y: 55, speed: 0.4 },
      { x: 520, y: 30, speed: 0.6 },
    ];
    let groundPoints: { x: number; y: number; w: number }[] = [];
    for (let i = 0; i < 20; i++) {
      groundPoints.push({ x: i * 35, y: 185 + Math.random() * 4, w: 2 + Math.random() * 4 });
    }

    let currentScore = 0;
    let speed = 5.8;
    let legFrame = 0;

    const handleJump = () => {
      if (!isJumping && gameState === 'RUNNING') {
        dinoVy = -12.8;
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

    // Theme color palettes
    const getColors = () => {
      if (theme === 'CLASSIC') {
        return {
          bg: '#f8fafc',
          bgDark: '#171717',
          dino: '#535353',
          dinoDark: '#acacac',
          cactus: '#535353',
          cactusDark: '#acacac',
          ground: '#737373',
          cloud: '#d4d4d4',
          cloudDark: '#404040',
        };
      }
      if (theme === 'MINIMAL') {
        return {
          bg: '#ffffff',
          bgDark: '#121212',
          dino: '#2563eb',
          dinoDark: '#38bdf8',
          cactus: '#0f172a',
          cactusDark: '#f8fafc',
          ground: '#94a3b8',
          cloud: '#e2e8f0',
          cloudDark: '#262626',
        };
      }
      if (theme === 'RETRO') {
        return {
          bg: '#051b0d',
          bgDark: '#051b0d',
          dino: '#22c55e',
          dinoDark: '#22c55e',
          cactus: '#16a34a',
          cactusDark: '#16a34a',
          ground: '#15803d',
          cloud: '#14532d',
          cloudDark: '#14532d',
        };
      }
      // CYBERPUNK
      return {
        bg: '#090915',
        bgDark: '#090915',
        dino: '#00f0ff',
        dinoDark: '#00f0ff',
        cactus: '#ff007f',
        cactusDark: '#ff007f',
        ground: '#7928ca',
        cloud: '#1e1b4b',
        cloudDark: '#1e1b4b',
      };
    };

    const isDarkMode = document.documentElement.classList.contains('dark');
    const cols = getColors();
    const dinoColor = isDarkMode ? cols.dinoDark : cols.dino;
    const cactusColor = isDarkMode ? cols.cactusDark : cols.cactus;
    const groundColor = cols.ground;
    const cloudColor = isDarkMode ? cols.cloudDark : cols.cloud;

    const drawPixelDino = (x: number, y: number, isAltLeg: boolean) => {
      ctx.fillStyle = dinoColor;

      // Authentic Pixelated T-Rex Chrome Sprite
      // Head & Snout
      ctx.fillRect(x + 12, y + 2, 16, 12);
      ctx.fillRect(x + 14, y, 12, 4);

      // Eye (cutout)
      ctx.fillStyle = theme === 'CYBERPUNK' ? '#ff007f' : theme === 'RETRO' ? '#051b0d' : isDarkMode ? '#171717' : '#ffffff';
      ctx.fillRect(x + 16, y + 4, 3, 3);
      ctx.fillStyle = dinoColor;

      // Snout nostrils & mouth line
      ctx.fillRect(x + 24, y + 8, 4, 2);

      // Neck & Body
      ctx.fillRect(x + 8, y + 12, 12, 16);
      ctx.fillRect(x + 4, y + 16, 16, 12);

      // Tail
      ctx.fillRect(x, y + 16, 4, 6);
      ctx.fillRect(x - 4, y + 14, 4, 4);

      // Tiny Arms
      ctx.fillRect(x + 20, y + 16, 4, 4);

      // Legs animation (alternating while running on ground)
      if (isJumping) {
        ctx.fillRect(x + 6, y + 28, 4, 7);
        ctx.fillRect(x + 14, y + 28, 4, 5);
      } else if (isAltLeg) {
        ctx.fillRect(x + 6, y + 28, 4, 8);
        ctx.fillRect(x + 14, y + 28, 4, 4);
      } else {
        ctx.fillRect(x + 6, y + 28, 4, 4);
        ctx.fillRect(x + 14, y + 28, 4, 8);
      }
    };

    const drawCactus = (obs: (typeof obstacles)[0]) => {
      ctx.fillStyle = cactusColor;
      const x = obs.x;
      const h = obs.height;
      const baseY = 185;

      // Central stem
      ctx.fillRect(x + 6, baseY - h, 8, h);

      // Left arm
      if (h > 24) {
        ctx.fillRect(x, baseY - h + 8, 6, 4);
        ctx.fillRect(x, baseY - h + 4, 4, 6);
      }

      // Right arm
      if (h > 30) {
        ctx.fillRect(x + 14, baseY - h + 12, 6, 4);
        ctx.fillRect(x + 16, baseY - h + 6, 4, 8);
      }
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Clouds in background
      ctx.fillStyle = cloudColor;
      clouds.forEach((cloud) => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 8, 0, Math.PI * 2);
        ctx.arc(cloud.x + 8, cloud.y - 3, 10, 0, Math.PI * 2);
        ctx.arc(cloud.x + 18, cloud.y, 7, 0, Math.PI * 2);
        ctx.fill();

        if (gameState === 'RUNNING') {
          cloud.x -= cloud.speed;
          if (cloud.x < -30) cloud.x = canvas.width + 20;
        }
      });

      // Ground horizon
      ctx.strokeStyle = groundColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 185);
      ctx.lineTo(canvas.width, 185);
      ctx.stroke();

      // Ground texture bumps
      ctx.fillStyle = groundColor;
      groundPoints.forEach((gp) => {
        ctx.fillRect(gp.x, gp.y, gp.w, 1.5);
        if (gameState === 'RUNNING') {
          gp.x -= speed;
          if (gp.x < 0) gp.x = canvas.width;
        }
      });

      if (gameState === 'RUNNING') {
        currentScore += 1;
        setScore(Math.floor(currentScore / 5));

        legFrame += 1;

        // Physics
        dinoY += dinoVy;
        dinoVy += gravity;
        if (dinoY >= 145) {
          dinoY = 145;
          dinoVy = 0;
          isJumping = false;
        }

        // Spawn obstacles
        if (Math.random() < 0.016 && obstacles.length < 3) {
          const lastObs = obstacles[obstacles.length - 1];
          if (!lastObs || canvas.width - lastObs.x > 220) {
            obstacles.push({
              x: canvas.width,
              width: 20,
              height: 28 + Math.random() * 18,
              type: Math.random() > 0.5 ? 'tall' : 'double',
            });
          }
        }

        // Move obstacles
        obstacles.forEach((obs) => {
          obs.x -= speed;
        });
        obstacles = obstacles.filter((o) => o.x > -40);

        speed += 0.0006;

        // Collision check
        for (const obs of obstacles) {
          const dinoBox = { x: 50, y: dinoY, w: 26, h: 36 };
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
      const isAltLeg = Math.floor(legFrame / 6) % 2 === 0;
      drawPixelDino(50, dinoY, isAltLeg);

      // Draw Obstacles
      obstacles.forEach(drawCactus);

      // Scanlines effect for Retro & Cyberpunk
      if (theme === 'RETRO' || theme === 'CYBERPUNK') {
        ctx.fillStyle = theme === 'RETRO' ? 'rgba(0, 255, 0, 0.03)' : 'rgba(0, 240, 255, 0.03)';
        for (let y = 0; y < canvas.height; y += 4) {
          ctx.fillRect(0, y, canvas.width, 1);
        }
      }

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
  }, [gameState, highScore, soundEnabled, theme]);

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

  const themesList: { id: DinoTheme; label: string; icon: any }[] = [
    { id: 'CLASSIC', label: 'Classic Chrome', icon: Monitor },
    { id: 'MINIMAL', label: 'Minimalist', icon: Sparkles },
    { id: 'RETRO', label: '8-Bit CRT', icon: Cpu },
    { id: 'CYBERPUNK', label: 'Cyberpunk Neon', icon: Zap },
  ];

  return (
    <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block mb-1">
            Endless Pixel Runner
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Chrome Dino Runner</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-3 bg-slate-900 dark:bg-[#121212] text-white px-4 py-2 rounded-2xl font-mono text-xs sm:text-sm shadow-xs border border-transparent dark:border-white/10">
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

      {/* Theme Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 border-b border-slate-100 dark:border-white/5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-2">
          Theme:
        </span>
        {themesList.map((t) => {
          const Icon = t.icon;
          const isCurrent = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas Area with Theme-Adaptive Background */}
      <div
        onClick={handleMobileTap}
        className={`relative rounded-2xl overflow-hidden border shadow-inner cursor-pointer select-none transition-colors ${
          theme === 'RETRO'
            ? 'bg-[#051b0d] border-emerald-900 shadow-emerald-950/50'
            : theme === 'CYBERPUNK'
            ? 'bg-[#090915] border-purple-900 shadow-purple-950/50'
            : 'bg-slate-100 dark:bg-[#141414] border-slate-200 dark:border-white/10'
        }`}
      >
        <canvas ref={canvasRef} width={640} height={200} className="w-full h-[200px] object-contain block" />

        {gameState === 'START' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <Play className="w-6 h-6 ml-1 fill-white" />
            </div>
            <h3 className="text-lg font-bold mb-1">Tap Screen or Press Space to Jump!</h3>
            <p className="text-xs text-slate-200 max-w-xs">
              Dodge cactus obstacles to set a new record.
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
          className="w-full py-3.5 rounded-2xl bg-blue-600 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
          <span>{gameState === 'RUNNING' ? 'TAP TO JUMP' : 'START / RESTART'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <span>Desktop: Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-white/10 rounded font-mono">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-white/10 rounded font-mono">↑</kbd> to jump.</span>
        <span>Mobile: Tap the canvas or the button above.</span>
      </div>
    </div>
  );
};

// =========================================================================
// 3. SNAKE GAME WITH CLASSIC (NOKIA), RETRO, MINIMAL & FUTURISTIC THEMES
// =========================================================================
type SnakeTheme = 'CLASSIC' | 'RETRO' | 'MINIMAL' | 'FUTURISTIC';

const SnakeGame: React.FC = () => {
  const [theme, setTheme] = useState<SnakeTheme>('CLASSIC');
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() =>
    parseInt(localStorage.getItem('as_snake_high_score') || '0', 10)
  );

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
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > bestScore) {
              setBestScore(newScore);
              localStorage.setItem('as_snake_high_score', newScore.toString());
            }
            return newScore;
          });
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          next.pop();
        }
        return next;
      });
    }, 115);

    return () => clearInterval(interval);
  }, [running, gameOver, dir, food, bestScore]);

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

  const themesList: { id: SnakeTheme; label: string; icon: any }[] = [
    { id: 'CLASSIC', label: 'Classic Nokia 3310', icon: Monitor },
    { id: 'RETRO', label: '8-Bit Arcade', icon: Gamepad2 },
    { id: 'MINIMAL', label: 'Modern Minimal', icon: Sparkles },
    { id: 'FUTURISTIC', label: 'Futuristic Cyber', icon: Zap },
  ];

  return (
    <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block mb-1">
            Iconic Grid Arcade
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Snake Arcade</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 dark:bg-[#121212] text-white px-4 py-1.5 rounded-full font-mono text-xs sm:text-sm font-bold border border-transparent dark:border-white/10 flex items-center gap-2">
            <span className="text-amber-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>BEST: {bestScore}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>SCORE: {score}</span>
          </div>
        </div>
      </div>

      {/* Theme Switcher Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 border-b border-slate-100 dark:border-white/5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-2">
          Theme:
        </span>
        {themesList.map((t) => {
          const Icon = t.icon;
          const isCurrent = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Snake Grid Board Container */}
      <div
        className={`relative max-w-[340px] mx-auto aspect-square rounded-2xl overflow-hidden border-4 shadow-md transition-colors ${
          theme === 'CLASSIC'
            ? 'bg-[#9bbc0f] border-[#8bac0f] text-[#0f380f]'
            : theme === 'RETRO'
            ? 'bg-[#1e1b4b] border-indigo-900 shadow-indigo-950/50'
            : theme === 'FUTURISTIC'
            ? 'bg-[#050510] border-cyan-500/40 shadow-cyan-950/50'
            : 'bg-[#1e293b] dark:bg-[#141414] border-slate-300 dark:border-white/10'
        }`}
      >
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

            let cellClass = 'bg-transparent';
            if (theme === 'CLASSIC') {
              if (isHead) cellClass = 'bg-[#0f380f] rounded-xs';
              else if (isBody) cellClass = 'bg-[#306230] rounded-xs';
              else if (isFood) cellClass = 'bg-[#0f380f] animate-pulse';
            } else if (theme === 'RETRO') {
              if (isHead) cellClass = 'bg-amber-400 rounded-sm shadow-xs shadow-amber-400';
              else if (isBody) cellClass = 'bg-emerald-400 rounded-xs';
              else if (isFood) cellClass = 'bg-rose-500 rounded-full animate-bounce';
            } else if (theme === 'FUTURISTIC') {
              if (isHead) cellClass = 'bg-cyan-400 rounded-sm shadow-md shadow-cyan-400';
              else if (isBody) cellClass = 'bg-pink-500 rounded-xs shadow-xs shadow-pink-500/50';
              else if (isFood) cellClass = 'bg-yellow-300 rounded-full animate-pulse shadow-md shadow-yellow-300';
            } else {
              // MINIMAL
              if (isHead) cellClass = 'bg-sky-400 rounded-sm';
              else if (isBody) cellClass = 'bg-blue-600 rounded-xs';
              else if (isFood) cellClass = 'bg-emerald-400 rounded-full animate-pulse shadow-xs shadow-emerald-400';
            }

            return (
              <div
                key={i}
                className={`${cellClass} ${
                  theme === 'CLASSIC' ? 'border-[0.5px] border-[#8bac0f]/30' : 'border-[0.5px] border-white/[0.03]'
                }`}
              />
            );
          })}
        </div>

        {!running && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            {gameOver && <p className="text-rose-400 font-bold text-sm mb-2">Game Over! Score: {score}</p>}
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95"
            >
              {gameOver ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Controls for Mobile & Touch */}
      <div className="flex flex-col items-center gap-1.5 pt-2">
        <button
          type="button"
          onClick={() => dir !== 'DOWN' && setDir('UP')}
          aria-label="Move Up"
          className="w-14 h-11 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 active:bg-blue-600 active:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer transition-colors"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dir !== 'RIGHT' && setDir('LEFT')}
            aria-label="Move Left"
            className="w-14 h-11 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 active:bg-blue-600 active:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => dir !== 'UP' && setDir('DOWN')}
            aria-label="Move Down"
            className="w-14 h-11 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 active:bg-blue-600 active:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => dir !== 'LEFT' && setDir('RIGHT')}
            aria-label="Move Right"
            className="w-14 h-11 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 active:bg-blue-600 active:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. NEPAL BIKRAM SAMBAT (B.S.) DATE CONVERTER TOOL
// =========================================================================
const DateConverterTool: React.FC = () => {
  return <NepaliDateConverter />;
};

