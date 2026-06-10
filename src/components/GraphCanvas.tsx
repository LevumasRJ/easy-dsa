import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Sliders, RefreshCw, Grid, Play, AlertCircle } from 'lucide-react';
import { Snapshot } from '../types';

interface GraphCanvasProps {
  currentSnapshot: Snapshot;
  onSnapshotsGenerated: (snapshots: Snapshot[]) => void;
}

interface GridCell {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  gCost?: number;
  hCost?: number;
  fCost?: number;
  parent?: string | null;
}

export default function GraphCanvas({ currentSnapshot, onSnapshotsGenerated }: GraphCanvasProps) {
  const NUM_ROWS = 8;
  const NUM_COLS = 10;

  // Active build mode: 'wall' | 'start' | 'end'
  const [paintMode, setPaintMode] = useState<'wall' | 'start' | 'end'>('wall');
  
  // Start and Target node coordinate vectors
  const [startPos, setStartPos] = useState<{ r: number; c: number }>({ r: 2, c: 1 });
  const [endPos, setEndPos] = useState<{ r: number; c: number }>({ r: 5, c: 8 });

  // Grid wall layout state
  const [walls, setWalls] = useState<Set<string>>(() => {
    const initialWalls = new Set<string>();
    // Set up default visually organic maze obstacles
    initialWalls.add('1-4');
    initialWalls.add('2-4');
    initialWalls.add('3-4');
    initialWalls.add('4-4');
    initialWalls.add('4-5');
    initialWalls.add('4-6');
    initialWalls.add('5-6');
    return initialWalls;
  });

  // Re-generate step snapshots whenever grid, start boundary or target moves
  useEffect(() => {
    generateAStarSnapshots();
  }, [startPos, endPos, walls]);

  const generateAStarSnapshots = () => {
    const snapshots: Snapshot[] = [];
    const openSet: string[] = []; // Array of cell keys 'r-c'
    const closedSet = new Set<string>();
    
    // Cost trackers
    const gCosts: Record<string, number> = {};
    const hCosts: Record<string, number> = {};
    const fCosts: Record<string, number> = {};
    const parents: Record<string, string | null> = {};

    const key = (r: number, c: number) => `${r}-${c}`;
    const startKey = key(startPos.r, startPos.c);
    const endKey = key(endPos.r, endPos.c);

    // Initial setup
    const startH = Math.abs(startPos.r - endPos.r) + Math.abs(startPos.c - endPos.c);
    gCosts[startKey] = 0;
    hCosts[startKey] = startH;
    fCosts[startKey] = startH;
    parents[startKey] = null;
    openSet.push(startKey);

    // Snapshot helper
    const pushSnapshot = (
      line: number,
      action: 'init' | 'compare' | 'swap' | 'traverse' | 'found' | 'not_found' | 'done',
      expl: string,
      currentCellKey?: string
    ) => {
      // Create grid state visualization arrays
      const gridNodes: any[] = [];
      for (let r = 0; r < NUM_ROWS; r++) {
        for (let c = 0; c < NUM_COLS; c++) {
          const cellKey = key(r, c);
          const inOpen = openSet.includes(cellKey);
          const inClosed = closedSet.has(cellKey);
          
          let role: 'normal' | 'start' | 'end' | 'wall' | 'open' | 'closed' = 'normal';
          if (cellKey === startKey) role = 'start';
          else if (cellKey === endKey) role = 'end';
          else if (walls.has(cellKey)) role = 'wall';
          else if (inOpen) role = 'open';
          else if (inClosed) role = 'closed';

          gridNodes.push({
            id: cellKey,
            row: r,
            col: c,
            role,
            g: gCosts[cellKey],
            h: hCosts[cellKey],
            f: fCosts[cellKey],
            highlighted: cellKey === currentCellKey
          });
        }
      }

      // Format current variable watchlist
      const currentCellLabel = currentCellKey ? `(${currentCellKey.replace('-', ', ')})` : 'null';
      const variables: Record<string, any> = {
        active_cell: currentCellLabel,
        open_list_size: openSet.length,
        closed_list_size: closedSet.size,
      };

      if (currentCellKey) {
        variables['g_cost_from_start'] = gCosts[currentCellKey] ?? 'N/A';
        variables['h_heuristic_cost'] = hCosts[currentCellKey] ?? 'N/A';
        variables['f_total_priority'] = fCosts[currentCellKey] ?? 'N/A';
      }

      snapshots.push({
        lineHighlighted: line,
        actionType: action,
        explanation: expl,
        consoleOutput: `[A* Search] ${expl}`,
        variables,
        // Using arrayState as serial node count placeholder or metadata tracking
        arrayState: Array.from({ length: openSet.length }, (_, i) => i + 1),
        treeState: gridNodes // Inject full grid node positions as custom treeState to render grid directly!
      });
    };

    // 1. Initial Snapshot
    pushSnapshot(
      1,
      'init',
      `Starting A* Pathfinding scan from ${startKey.replace('-', ',')} of target ${endKey.replace('-', ',')}. Setting initial heuristic cost to H = ${startH} Manhattan units.`
    );

    let pathFound = false;

    // 2. Loop
    while (openSet.length > 0) {
      // Find node with lowest F score in Open list
      openSet.sort((a, b) => {
        const fA = fCosts[a] ?? Infinity;
        const fB = fCosts[b] ?? Infinity;
        if (fA === fB) {
          return (hCosts[a] ?? Infinity) - (hCosts[b] ?? Infinity); // Tie-breaker: choose closer heuristic
        }
        return fA - fB;
      });

      const current = openSet.shift()!;
      const [currR, currC] = current.split('-').map(Number);

      pushSnapshot(
        2,
        'traverse',
        `Dequeued node with lowest priority F-Cost = ${fCosts[current]} from frontier queue: Cell (${currR}, ${currC}).`,
        current
      );

      // Path found!
      if (current === endKey) {
        pathFound = true;
        closedSet.add(current);
        break;
      }

      closedSet.add(current);

      // Explore neighbors code
      const neighbors = [
        { r: currR - 1, c: currC }, // top
        { r: currR + 1, c: currC }, // bottom
        { r: currR, c: currC - 1 }, // left
        { r: currR, c: currC + 1 }  // right
      ];

      for (const neighbor of neighbors) {
        const { r, c } = neighbor;
        // Check grid boundary limits
        if (r < 0 || r >= NUM_ROWS || c < 0 || c >= NUM_COLS) continue;
        
        const neighKey = key(r, c);
        
        // Skip walls and fully searched closed sets
        if (walls.has(neighKey)) continue;
        if (closedSet.has(neighKey)) continue;

        // G distance is 1 step increment
        const tentativeG = (gCosts[current] ?? 0) + 1;
        const alreadyInOpen = openSet.includes(neighKey);

        if (!alreadyInOpen || tentativeG < (gCosts[neighKey] ?? Infinity)) {
          parents[neighKey] = current;
          gCosts[neighKey] = tentativeG;
          hCosts[neighKey] = Math.abs(r - endPos.r) + Math.abs(c - endPos.c);
          fCosts[neighKey] = tentativeG + hCosts[neighKey];

          if (!alreadyInOpen) {
            openSet.push(neighKey);
            pushSnapshot(
              3,
              'compare',
              `Discovered unvisited neighbor cell (${r}, ${c}). Calculated Manhattan heuristics: G = ${tentativeG} steps, H = ${hCosts[neighKey]} distance units. F-Cost priority = ${fCosts[neighKey]}. Added to Open list.`,
              neighKey
            );
          } else {
            pushSnapshot(
              3,
              'compare',
              `Discovered shorter path to already-open cell (${r}, ${c}) via this route! Relaxed G-Cost to ${tentativeG}. Updated parent link pointer.`,
              neighKey
            );
          }
        }
      }
    }

    if (pathFound) {
      // Trace path back to compile final route highlights
      const pathCells: string[] = [];
      let step: string | null = endKey;
      while (step !== null) {
        pathCells.push(step);
        step = parents[step] ?? null;
      }
      pathCells.reverse();

      // Final success snapshot
      const finalExplanation = `A* Pathfinding search succeeded! Solved optimal route connecting Start to Target in exactly ${gCosts[endKey]} moves. Total nodes expanded: ${closedSet.size + openSet.length}.`;
      
      // Inject path nodes into finalized snapshot payload
      const gridNodes: any[] = [];
      for (let r = 0; r < NUM_ROWS; r++) {
        for (let c = 0; c < NUM_COLS; c++) {
          const cellKey = key(r, c);
          const inPath = pathCells.includes(cellKey);
          
          let role: 'normal' | 'start' | 'end' | 'wall' | 'open' | 'closed' | 'path' = 'normal';
          if (cellKey === startKey) role = 'start';
          else if (cellKey === endKey) role = 'end';
          else if (inPath) role = 'path';
          else if (walls.has(cellKey)) role = 'wall';
          else if (openSet.includes(cellKey)) role = 'open';
          else if (closedSet.has(cellKey)) role = 'closed';

          gridNodes.push({
            id: cellKey,
            row: r,
            col: c,
            role,
            g: gCosts[cellKey],
            h: hCosts[cellKey],
            f: fCosts[cellKey]
          });
        }
      }

      snapshots.push({
        lineHighlighted: 4,
        actionType: 'done',
        explanation: finalExplanation,
        consoleOutput: `[A* Done] ${finalExplanation} Path coordinates: ${pathCells.join(' ➔ ')}`,
        variables: {
          path_length: pathCells.length - 1,
          cost_g: gCosts[endKey],
          total_scanned: closedSet.size
        },
        arrayState: Array.from({ length: pathCells.length }),
        treeState: gridNodes
      });
    } else {
      // 3. Failed search snapshot
      const failureExplanation = `A* Search terminated without reaching target. Open set queue exhausted. Confirm walls are not completely partitioning or sealing off the target cell!`;
      pushSnapshot(4, 'not_found', failureExplanation);
    }

    onSnapshotsGenerated(snapshots);
  };

  const handleCellClick = (r: number, c: number) => {
    // Avoid resetting start or end boundary onto each other
    if (r === startPos.r && c === startPos.c) {
      if (paintMode !== 'wall') return;
    }
    if (r === endPos.r && c === endPos.c) {
      if (paintMode !== 'wall') return;
    }

    const cellKey = `${r}-${c}`;
    if (paintMode === 'start') {
      if (r === endPos.r && c === endPos.c) return;
      setStartPos({ r, c });
      setPaintMode('wall');
    } else if (paintMode === 'end') {
      if (r === startPos.r && c === startPos.c) return;
      setEndPos({ r, c });
      setPaintMode('wall');
    } else {
      // Wall placement toggle
      if (cellKey === `${startPos.r}-${startPos.c}` || cellKey === `${endPos.r}-${endPos.c}`) return;
      setWalls(prev => {
        const next = new Set<string>(prev);
        if (next.has(cellKey)) {
          next.delete(cellKey);
        } else {
          next.add(cellKey);
        }
        return next;
      });
    }
  };

  const clearWalls = () => {
    setWalls(new Set<string>());
  };

  // Extract visual grid layout nodes or use default fallback if snapshots aren't loaded yet
  const cellsRepresentation = currentSnapshot?.treeState || [];

  return (
    <div id="astar-grid-canvas" className="w-full h-full flex flex-col justify-between items-center text-white">
      
      {/* 2D Grid Section */}
      <div className="flex-1 w-full max-w-lg flex flex-col justify-center items-center py-2 sm:py-4">
        
        {/* Dynamic Action Paint Selector Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center font-mono text-[10px] w-full">
          <button
            onClick={() => setPaintMode('wall')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              paintMode === 'wall'
                ? 'bg-zinc-700/80 text-white border-[#5de6ff] scale-105 font-bold'
                : 'bg-bg-card text-text-muted border-border-custom hover:text-white'
            }`}
          >
            🧱 Paint Walls
          </button>
          
          <button
            onClick={() => setPaintMode('start')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              paintMode === 'start'
                ? 'bg-emerald-600/80 text-white border-emerald-400 scale-105 font-bold'
                : 'bg-bg-card text-text-muted border-border-custom hover:text-white'
            }`}
          >
            🟢 Set Start
          </button>
          
          <button
            onClick={() => setPaintMode('end')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              paintMode === 'end'
                ? 'bg-rose-600/80 text-white border-rose-400 scale-105 font-bold'
                : 'bg-bg-card text-text-muted border-border-custom hover:text-white'
            }`}
          >
            🎯 Set Target
          </button>

          <button
            onClick={clearWalls}
            className="px-3 py-1.5 rounded-lg bg-bg-card/45 hover:bg-zinc-800 text-text-muted hover:text-rose-400 border border-border-custom/40 transition-all font-bold"
          >
            🧹 Clear Walls
          </button>
        </div>

        {/* 2D Grid Cells Container wrapper aligned in columns/rows */}
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 bg-bg-card p-3 rounded-2xl border border-border-custom/80 shadow-2xl w-full">
          {cellsRepresentation.map((cell: any) => {
            const isHighlight = cell.highlighted;
            
            // Choose cell colors according to calculated A* states
            let cellBg = 'bg-[#1b253b] hover:bg-slate-700/30 border-slate-800/40';
            let cellTextLabel = '';

            if (cell.role === 'wall') {
              cellBg = 'bg-zinc-800 border-zinc-700 shadow-inner scale-95';
            } else if (cell.role === 'start') {
              cellBg = 'bg-emerald-500 hover:bg-emerald-400 text-bg-app font-black ring-2 ring-emerald-300 ring-offset-2 ring-offset-bg-app scale-102';
              cellTextLabel = 'S';
            } else if (cell.role === 'end') {
              cellBg = 'bg-rose-500 hover:bg-rose-400 text-white font-black ring-2 ring-rose-400 ring-offset-2 ring-offset-bg-app scale-102';
              cellTextLabel = 'E';
            } else if (cell.role === 'path') {
              cellBg = 'bg-[#3b82f6]/80 text-[#ffffff] border-blue-400/60 shadow-[0_0_12px_rgba(59,130,246,0.5)] animate-pulse scale-98';
            } else if (cell.role === 'open') {
              cellBg = 'bg-[#5de6ff]/20 text-[#5de6ff] border-[#5de6ff]/40 scale-95';
            } else if (cell.role === 'closed') {
              cellBg = 'bg-indigo-950/40 text-indigo-400/80 border-indigo-900/30 scale-95';
            }

            return (
              <div
                key={cell.id}
                onClick={() => handleCellClick(cell.row, cell.col)}
                className={`aspect-square rounded-md sm:rounded-lg border text-[10px] sm:text-xs font-mono font-black flex flex-col items-center justify-center cursor-pointer transition-all ${cellBg} relative ${
                  isHighlight ? 'ring-2 ring-cyan-450 scale-105 border-cyan-400 z-10 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : ''
                }`}
                title={`Row: ${cell.row}, Col: ${cell.col} ${cell.g !== undefined ? `| G:${cell.g} H:${cell.h} F:${cell.f}` : ''}`}
              >
                {cellTextLabel}
                
                {/* Micro F-cost label in small text */}
                {!cellTextLabel && cell.f !== undefined && cell.role !== 'wall' && (
                  <span className="text-[8px] opacity-80 scale-90 select-none block font-mono font-normal">
                    {cell.f}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid footer legend key list */}
      <div className="w-full flex justify-center flex-wrap gap-4 mt-1 font-mono text-[8px] sm:text-[9px] text-[#94a3b8] border-t border-border-custom/30 pt-3">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500 block" /> Start Point
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-rose-500 block" /> Target Cell
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-zinc-800 block" /> Walls (Obstacles)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-[#3b82f6] block" /> Solved Path
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-[#5de6ff]/20 block" /> Frontier (Open)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-indigo-950/40 block" /> Visited (Closed)
        </span>
      </div>

    </div>
  );
}
