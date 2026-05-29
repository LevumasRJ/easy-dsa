import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Play, Send } from 'lucide-react';
import { Snapshot, SortingAlgo } from '../types';
import { generateBubbleSortSnapshots, generateQuickSortSnapshots } from '../algorithms';

interface SortingCanvasProps {
  currentSnapshot?: Snapshot;
  onSnapshotsGenerated: (snapshots: Snapshot[]) => void;
  activeAlgo: SortingAlgo;
  onAlgoChange: (algo: SortingAlgo) => void;
}

export default function SortingCanvas({
  currentSnapshot,
  onSnapshotsGenerated,
  activeAlgo,
  onAlgoChange
}: SortingCanvasProps) {
  const [inputVal, setInputVal] = useState('35, 75, 20, 90, 45, 60, 15, 80, 40');
  const [array, setArray] = useState<number[]>([35, 75, 20, 90, 45, 60, 15, 80, 40]);
  const [errorMsg, setErrorMsg] = useState('');

  // Generate randomized array
  const handleRandomize = () => {
    const size = 9;
    const items = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
    setArray(items);
    setInputVal(items.join(', '));
    setErrorMsg('');
    triggerAlgorithm(items, activeAlgo);
  };

  // Submit custom array
  const handleSubmitCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputVal
      .split(',')
      .map(v => parseInt(v.trim()))
      .filter(v => !isNaN(v) && v > 0);

    if (clean.length < 3 || clean.length > 15) {
      setErrorMsg('Array size must be between 3 and 15 items');
      return;
    }
    setErrorMsg('');
    setArray(clean);
    triggerAlgorithm(clean, activeAlgo);
  };

  // Trigger snapshot generation
  const triggerAlgorithm = (targetArr: number[], algo: SortingAlgo) => {
    let snaps: Snapshot[];
    if (algo === 'bubblesort') {
      snaps = generateBubbleSortSnapshots(targetArr);
    } else {
      snaps = generateQuickSortSnapshots(targetArr);
    }
    onSnapshotsGenerated(snaps);
  };

  // Re-run if algorithm changes
  useEffect(() => {
    triggerAlgorithm(array, activeAlgo);
  }, [activeAlgo]);

  // Initial trigger
  useEffect(() => {
    triggerAlgorithm(array, activeAlgo);
  }, []);

  // Determine bar heights and styling colors based on currentSnapshot
  const bars = currentSnapshot?.arrayState || array;
  const activeIndices = currentSnapshot?.activeIndices || [];
  const actionType = currentSnapshot?.actionType || 'init';
  const variables = currentSnapshot?.variables || {};

  // Find i, j, or pivot pointers to draw annotations above the bars
  const iIndex = typeof variables.i === 'number' ? variables.i : -1;
  const jIndex = typeof variables.j === 'number' ? variables.j : -1;
  const pivotVal = typeof variables.pivot === 'number' ? variables.pivot : -1;

  // Render bars with dynamic styles
  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Top operational controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#171f33]/80 backdrop-blur-xl border border-slate-800 p-4 rounded-xl z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#94A3B8] uppercase">Algorithm:</span>
          <div className="flex bg-[#0f172a] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onAlgoChange('quicksort')}
              className={`px-3 py-1 text-xs font-display rounded-md transition-colors ${
                activeAlgo === 'quicksort'
                  ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] font-medium border border-[#c0c1ff]/20'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              Quick Sort
            </button>
            <button
              onClick={() => onAlgoChange('bubblesort')}
              className={`px-3 py-1 text-xs font-display rounded-md transition-colors ${
                activeAlgo === 'bubblesort'
                  ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] font-medium border border-[#c0c1ff]/20'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              Bubble Sort
            </button>
          </div>
        </div>

        {/* Dynamic Inputs form */}
        <form onSubmit={handleSubmitCustom} className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="e.g. 10, 20, 30"
            className="bg-[#0f172a] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-[#dae2fd] focus:outline-none focus:border-[#5de6ff] w-48 font-mono"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-[#171f33] border border-slate-700 hover:border-[#5de6ff] px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer active:scale-95 transition-all"
            title="Import custom array elements"
          >
            <Send className="w-3 h-3 text-[#5de6ff]" />
            Apply
          </button>
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-1 bg-[#171f33] border border-slate-700 hover:border-[#8083ff] px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer active:scale-95 transition-all"
            title="Generate random dataset"
          >
            <RefreshCw className="w-3" />
            Random
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="text-xs text-[#EF4444] px-4 py-1 text-right font-mono">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Main Bar Canvas Container */}
      <div className="flex-1 min-h-[300px] flex items-end justify-center px-4 py-12 relative w-full">
        <div className="absolute top-4 left-4 flex flex-col gap-1 select-none">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded bg-[#c0c1ff] inline-block" />
            <span className="text-[#94A3B8] font-mono">Default</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded bg-[#EAB308] inline-block" />
            <span className="text-[#94A3B8] font-mono">Comparing / Pivot Select</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded bg-[#EF4444] inline-block" />
            <span className="text-[#94A3B8] font-mono">Swapping / Mutating</span>
          </div>
        </div>

        {/* Render actual sorting bars stack */}
        <div className="flex items-end gap-3 h-64 justify-center w-full max-w-2xl px-8 relative border-b border-dashed border-slate-800">
          <AnimatePresence mode="popLayout">
            {bars.map((val, idx) => {
              // Decide coloring
              const isActive = activeIndices.includes(idx);
              let barColorClass = 'bg-[#171f33] border-slate-700'; // default unselected
              let glowStyle = '';

              if (isActive) {
                if (actionType === 'swap') {
                  barColorClass = 'bg-slate-900 border-2 border-[#EF4444] text-[#EF4444]';
                  glowStyle = 'neon-glow-red';
                } else if (actionType === 'compare') {
                  barColorClass = 'bg-slate-900 border-2 border-[#EAB308] text-[#EAB308]';
                  glowStyle = 'neon-glow-yellow';
                }
              } else if (actionType === 'done') {
                barColorClass = 'bg-slate-900 border-2 border-[#22C55E] text-[#22C55E]';
              } else if (val === pivotVal) {
                barColorClass = 'bg-slate-900 border-2 border-[#8083ff] text-[#8083ff] opacity-80';
              }

              // Annotations
              const isIPointer = idx === iIndex;
              const isJPointer = idx === jIndex;

              return (
                <motion.div
                  key={`bar-${idx}-${val}`}
                  layout
                  transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                  className={`w-10 rounded-t-lg relative transition-all duration-300 flex flex-col justify-end items-center pb-2 ${barColorClass} ${glowStyle}`}
                  style={{ height: `${Math.max(15, Math.min(100, (val / 100) * 100))}%` }}
                >
                  {/* Val text inside the bar */}
                  <span className="text-[10px] font-mono font-bold select-none">{val}</span>

                  {/* Top pointer indicators */}
                  {(isIPointer || isJPointer) && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className={`text-xs font-mono font-bold ${isIPointer ? 'text-[#EF4444]' : 'text-[#EAB308]'}`}>
                        {isIPointer && isJPointer ? 'i, j' : isIPointer ? 'i' : 'j'}
                      </span>
                      <span className={`w-1.5 h-1.5 rotate-45 mt-1 block ${isIPointer ? 'bg-[#EF4444]' : 'bg-[#EAB308]'}`} />
                    </div>
                  )}

                  {/* Bottom pivot badge */}
                  {val === pivotVal && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                      <span className="text-[9px] font-mono tracking-widest text-[#8083ff] font-bold bg-[#8083ff]/10 px-1 py-0.5 rounded border border-[#8083ff]/20">P</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
