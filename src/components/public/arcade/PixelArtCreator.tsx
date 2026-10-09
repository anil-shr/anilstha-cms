import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Paintbrush,
  Eraser,
  PaintBucket,
  Pipette,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Grid,
  Sparkles,
  Check,
  ChevronDown,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

type ToolType = 'PEN' | 'ERASER' | 'FILL' | 'EYEDROPPER';
type GridSize = 8 | 16 | 24 | 32;

// Curated designer color swatches
const PALETTES = [
  {
    name: 'Retro Arcade',
    colors: [
      '#000000', '#ffffff', '#e11d48', '#f97316', '#eab308',
      '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
      '#78716c', '#334155',
    ],
  },
  {
    name: 'GameBoy Green',
    colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f', '#ffffff', '#000000'],
  },
  {
    name: 'Cyberpunk Neon',
    colors: ['#0d0221', '#0f084b', '#26408b', '#a6cfd5', '#c2e7d9', '#ff007f', '#00f0ff', '#ffe600'],
  },
  {
    name: 'Pastel Dream',
    colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e8dff5', '#fce1e4', '#daeaf6'],
  },
];

// Presets to load
const TEMPLATES: Record<string, { size: GridSize; pixels: Record<string, string> }> = {
  heart: {
    size: 16,
    pixels: {
      '3,4': '#e11d48', '3,5': '#e11d48', '3,9': '#e11d48', '3,10': '#e11d48',
      '4,3': '#e11d48', '4,4': '#e11d48', '4,5': '#e11d48', '4,6': '#e11d48', '4,8': '#e11d48', '4,9': '#e11d48', '4,10': '#e11d48', '4,11': '#e11d48',
      '5,2': '#e11d48', '5,3': '#e11d48', '5,4': '#fb7185', '5,5': '#e11d48', '5,6': '#e11d48', '5,7': '#e11d48', '5,8': '#e11d48', '5,9': '#e11d48', '5,10': '#e11d48', '5,11': '#e11d48', '5,12': '#e11d48',
      '6,2': '#e11d48', '6,3': '#fb7185', '6,4': '#ffffff', '6,5': '#fb7185', '6,6': '#e11d48', '6,7': '#e11d48', '6,8': '#e11d48', '6,9': '#e11d48', '6,10': '#e11d48', '6,11': '#e11d48', '6,12': '#e11d48',
      '7,2': '#e11d48', '7,3': '#e11d48', '7,4': '#fb7185', '7,5': '#e11d48', '7,6': '#e11d48', '7,7': '#e11d48', '7,8': '#e11d48', '7,9': '#e11d48', '7,10': '#e11d48', '7,11': '#e11d48', '7,12': '#e11d48',
      '8,3': '#e11d48', '8,4': '#e11d48', '8,5': '#e11d48', '8,6': '#e11d48', '8,7': '#e11d48', '8,8': '#e11d48', '8,9': '#e11d48', '8,10': '#e11d48', '8,11': '#e11d48',
      '9,4': '#e11d48', '9,5': '#e11d48', '9,6': '#e11d48', '9,7': '#e11d48', '9,8': '#e11d48', '9,9': '#e11d48', '9,10': '#e11d48',
      '10,5': '#e11d48', '10,6': '#e11d48', '10,7': '#e11d48', '10,8': '#e11d48', '10,9': '#e11d48',
      '11,6': '#e11d48', '11,7': '#e11d48', '11,8': '#e11d48',
      '12,7': '#e11d48',
    },
  },
  sword: {
    size: 16,
    pixels: {
      '2,12': '#38bdf8', '2,13': '#bae6fd',
      '3,11': '#38bdf8', '3,12': '#38bdf8',
      '4,10': '#38bdf8', '4,11': '#38bdf8',
      '5,9': '#38bdf8', '5,10': '#38bdf8',
      '6,8': '#38bdf8', '6,9': '#38bdf8',
      '7,7': '#38bdf8', '7,8': '#38bdf8',
      '8,6': '#38bdf8', '8,7': '#38bdf8',
      '9,5': '#f59e0b', '9,7': '#f59e0b',
      '10,4': '#f59e0b', '10,5': '#f59e0b', '10,6': '#f59e0b',
      '11,3': '#78350f', '11,5': '#f59e0b',
      '12,2': '#78350f',
      '13,1': '#f59e0b',
    },
  },
};

export const PixelArtCreator: React.FC = () => {
  const [gridSize, setGridSize] = useState<GridSize>(16);
  // Grid representation: Map key "r,c" => color
  const [grid, setGrid] = useState<Record<string, string>>(() => TEMPLATES.heart.pixels);
  const [currentColor, setCurrentColor] = useState<string>('#e11d48');
  const [activeTool, setActiveTool] = useState<ToolType>('PEN');
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Undo / Redo history
  const [history, setHistory] = useState<Array<Record<string, string>>>([TEMPLATES.heart.pixels]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const canvasExportRef = useRef<HTMLCanvasElement | null>(null);

  // Push new state to history
  const pushState = useCallback(
    (newGrid: Record<string, string>) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, newGrid];
      });
      setHistoryIndex((prev) => prev + 1);
      setGrid(newGrid);
    },
    [historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGrid(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGrid(history[newIndex]);
    }
  };

  const handleClear = () => {
    if (Object.keys(grid).length === 0) return;
    if (confirm('Clear the entire pixel canvas?')) {
      pushState({});
    }
  };

  const loadTemplate = (name: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[name];
    if (t) {
      setGridSize(t.size);
      pushState({ ...t.pixels });
    }
  };

  // Flood fill algorithm
  const floodFill = (startR: number, startC: number, targetColor: string, replaceColor: string) => {
    if (targetColor === replaceColor) return;
    const newGrid = { ...grid };
    const queue: Array<[number, number]> = [[startR, startC]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [r, c] = queue.pop()!;
      const key = `${r},${c}`;
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) continue;
      if (visited.has(key)) continue;
      visited.add(key);

      const cellColor = newGrid[key] || '';
      if (cellColor === targetColor) {
        if (replaceColor) {
          newGrid[key] = replaceColor;
        } else {
          delete newGrid[key];
        }

        queue.push([r + 1, c]);
        queue.push([r - 1, c]);
        queue.push([r, c + 1]);
        queue.push([r, c - 1]);
      }
    }

    pushState(newGrid);
  };

  const handlePixelAction = (r: number, c: number) => {
    const key = `${r},${c}`;
    const currentColorAtCell = grid[key] || '';

    if (activeTool === 'EYEDROPPER') {
      if (currentColorAtCell) {
        setCurrentColor(currentColorAtCell);
        setActiveTool('PEN');
      }
      return;
    }

    if (activeTool === 'FILL') {
      floodFill(r, c, currentColorAtCell, currentColor);
      return;
    }

    if (activeTool === 'ERASER') {
      if (grid[key]) {
        const next = { ...grid };
        delete next[key];
        setGrid(next);
      }
      return;
    }

    if (activeTool === 'PEN') {
      if (grid[key] !== currentColor) {
        const next = { ...grid, [key]: currentColor };
        setGrid(next);
      }
    }
  };

  const handleMouseDown = (r: number, c: number) => {
    setIsDrawing(true);
    handlePixelAction(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDrawing && (activeTool === 'PEN' || activeTool === 'ERASER')) {
      handlePixelAction(r, c);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // Record state into history on stroke end
      pushState(grid);
    }
  };

  // Touch drawing support
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem && elem.hasAttribute('data-row')) {
      const r = parseInt(elem.getAttribute('data-row') || '0', 10);
      const c = parseInt(elem.getAttribute('data-col') || '0', 10);
      handlePixelAction(r, c);
    }
  };

  // Export high-res crisp PNG
  const handleExportPNG = () => {
    const scale = 32; // Each pixel scaled to 32x32 for 512x512 export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = gridSize * scale;
    exportCanvas.height = gridSize * scale;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Render pixels
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const color = grid[`${r},${c}`];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(c * scale, r * scale, scale, scale);
        }
      }
    }

    // Trigger download
    const url = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pixel-art-${gridSize}x${gridSize}-${Date.now()}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle grid size change
  const handleSizeChange = (newSize: GridSize) => {
    if (newSize === gridSize) return;
    if (
      Object.keys(grid).length === 0 ||
      confirm(`Switching to ${newSize}x${newSize} will adjust the canvas. Continue?`)
    ) {
      setGridSize(newSize);
      // Keep pixels within bounds
      const next: Record<string, string> = {};
      Object.entries(grid).forEach(([key, color]) => {
        const [r, c] = key.split(',').map(Number);
        if (r < newSize && c < newSize) {
          next[`${r},${c}`] = color;
        }
      });
      pushState(next);
    }
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="space-y-6 select-none"
    >
      {/* Top Controls Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Tools & Grid Size */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tool selector buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => setActiveTool('PEN')}
              className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTool === 'PEN'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Pencil / Brush (Draw)"
            >
              <Paintbrush className="w-4 h-4" />
              <span className="hidden sm:inline">Pen</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('ERASER')}
              className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTool === 'ERASER'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Eraser</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('FILL')}
              className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTool === 'FILL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Paint Bucket (Flood Fill Area)"
            >
              <PaintBucket className="w-4 h-4" />
              <span className="hidden sm:inline">Fill</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('EYEDROPPER')}
              className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTool === 'EYEDROPPER'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Color Picker (Eyedropper)"
            >
              <Pipette className="w-4 h-4" />
              <span className="hidden sm:inline">Pick</span>
            </button>
          </div>

          {/* Grid size segmented control */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-mono font-bold">
            {([8, 16, 24, 32] as GridSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => handleSizeChange(sz)}
                className={`px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  gridSize === sz
                    ? 'bg-white dark:bg-[#121212] text-blue-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sz}&times;{sz}
              </button>
            ))}
          </div>

          {/* Toggle Grid Lines */}
          <button
            type="button"
            onClick={() => setShowGridLines(!showGridLines)}
            className={`p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
              showGridLines
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400'
                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
            }`}
            title="Toggle Grid Lines"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>

        {/* Right: History & Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportPNG}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center gap-1.5"
            title="Download high-resolution PNG image"
          >
            <Download className="w-4 h-4" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Canvas + Color Palette) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: Pixel Canvas (3 Cols on Desktop) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          {/* Canvas Board */}
          <div
            onTouchStart={(e) => {
              setIsDrawing(true);
              const touch = e.touches[0];
              const elem = document.elementFromPoint(touch.clientX, touch.clientY);
              if (elem && elem.hasAttribute('data-row')) {
                const r = parseInt(elem.getAttribute('data-row') || '0', 10);
                const c = parseInt(elem.getAttribute('data-col') || '0', 10);
                handlePixelAction(r, c);
              }
            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => {
              setIsDrawing(false);
              pushState(grid);
            }}
            style={{
              touchAction: 'none',
              maxWidth: 'min(90vw, 480px)',
              maxHeight: 'min(90vw, 480px)',
              width: '100%',
              aspectRatio: '1 / 1',
            }}
            className="relative bg-slate-100 dark:bg-[#121212] rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-white/20 shadow-inner flex flex-col"
          >
            {/* Checkerboard transparency pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #888 25%, transparent 25%), linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%), linear-gradient(-45deg, transparent 75%, #888 75%)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              }}
            />

            {/* Grid Cells */}
            <div
              className="w-full h-full grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {Array.from({ length: gridSize }).map((_, r) =>
                Array.from({ length: gridSize }).map((_, c) => {
                  const key = `${r},${c}`;
                  const color = grid[key];
                  return (
                    <div
                      key={key}
                      data-row={r}
                      data-col={c}
                      onMouseDown={() => handleMouseDown(r, c)}
                      onMouseEnter={() => handleMouseEnter(r, c)}
                      style={{
                        backgroundColor: color || 'transparent',
                      }}
                      className={`relative cursor-crosshair transition-colors ${
                        showGridLines
                          ? 'border-[0.5px] border-slate-300/40 dark:border-white/10'
                          : ''
                      }`}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Quick status line */}
          <div className="mt-4 flex items-center justify-between w-full max-w-[480px] text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>
              Canvas: {gridSize}&times;{gridSize} ({gridSize * gridSize} px)
            </span>
            <span>
              Active: <strong style={{ color: currentColor }}>{currentColor}</strong>
            </span>
          </div>
        </div>

        {/* Right: Color Palette, Custom Picker & Templates (1 Col) */}
        <div className="space-y-5">
          {/* Active Color & Custom Color Picker */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 block">
              Active Color
            </span>

            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: currentColor }}
                className="w-12 h-12 rounded-xl border-2 border-white dark:border-[#121212] shadow-md ring-2 ring-slate-200 dark:ring-white/10 shrink-0"
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                    title="Choose custom color"
                  />
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-24 px-2 py-1 text-xs font-mono font-bold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white uppercase"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Click swatch to pick</span>
              </div>
            </div>
          </div>

          {/* Palettes */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 block">
              Curated Swatches
            </span>

            <div className="space-y-3">
              {PALETTES.map((pal) => (
                <div key={pal.name} className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 block">{pal.name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pal.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCurrentColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-md border border-black/10 dark:border-white/15 cursor-pointer transition-transform hover:scale-110 ${
                          currentColor.toLowerCase() === c.toLowerCase()
                            ? 'ring-2 ring-blue-500 scale-105'
                            : ''
                        }`}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preset Templates */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-2.5">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 block">
              Inspiration Templates
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loadTemplate('heart')}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors cursor-pointer"
              >
                Pixel Heart
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('sword')}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors cursor-pointer"
              >
                Hero Sword
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
