import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Play, Plus, Trash2 } from 'lucide-react';
import { Snapshot, LinkedListNodeState, ListAlgo } from '../types';
import { generateListInsertSnapshots, generateListDeleteSnapshots } from '../algorithms';

interface LinkedListCanvasProps {
  currentSnapshot?: Snapshot;
  onSnapshotsGenerated: (snapshots: Snapshot[]) => void;
  activeAlgo: ListAlgo;
  onAlgoChange: (algo: ListAlgo) => void;
}

// Initial linked list default state
const DEFAULT_LIST: LinkedListNodeState[] = [
  { id: '1', value: 12, nextId: '3' },
  { id: '3', value: 99, nextId: '4' },
  { id: '4', value: 37, nextId: null }
];

export default function LinkedListCanvas({
  currentSnapshot,
  onSnapshotsGenerated,
  activeAlgo,
  onAlgoChange
}: LinkedListCanvasProps) {
  const [nodes, setNodes] = useState<LinkedListNodeState[]>(DEFAULT_LIST);
  const [newValue, setNewValue] = useState('45');
  const [errorMsg, setErrorMsg] = useState('');

  // Generate random data
  const handleRandomize = () => {
    const fresh: LinkedListNodeState[] = [
      { id: '10', value: Math.floor(Math.random() * 80) + 10, nextId: '20' },
      { id: '20', value: Math.floor(Math.random() * 80) + 10, nextId: '30' },
      { id: '30', value: Math.floor(Math.random() * 80) + 10, nextId: null }
    ];
    setNodes(fresh);
    setErrorMsg('');
    triggerAlgorithm(fresh, activeAlgo, '20'); // Insert/delete after middle node
  };

  // Trigger snapshot engine
  const triggerAlgorithm = (
    currentNodes: LinkedListNodeState[],
    algo: ListAlgo,
    targetId: string = '3'
  ) => {
    const val = parseInt(newValue) || 45;
    let snaps: Snapshot[];
    
    if (algo === 'insertAfter') {
      snaps = generateListInsertSnapshots(currentNodes, targetId, val);
    } else {
      // Deletion algorithm uses value target
      snaps = generateListDeleteSnapshots(currentNodes, val);
    }
    onSnapshotsGenerated(snaps);
  };

  // Re-calculate if algorithm or values change
  useEffect(() => {
    const targetId = nodes[1]?.id || nodes[0]?.id || '3';
    triggerAlgorithm(nodes, activeAlgo, targetId);
  }, [activeAlgo]);

  // Initial trigger
  useEffect(() => {
    triggerAlgorithm(nodes, activeAlgo, '3');
  }, []);

  // Determine lists state or snapshots
  const activeNodes = currentSnapshot?.linkedListState || nodes;
  const actionType = currentSnapshot?.actionType || 'init';
  const highlightedNodes = currentSnapshot?.highlightedNodes || [];
  const variables = currentSnapshot?.variables || {};

  // Custom node positions resolver
  // Fits standard canvas size without overlap
  const getCoordinates = (nodeId: string) => {
    const regularNodes = activeNodes.filter(n => n && !n.isTemp);
    const node = activeNodes.find(n => n && n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    if (node.isTemp) {
      // Placing floats above insertion parent node
      // Parent target node is Nodes[1] typically (value 99)
      const afterNodeIdx = regularNodes.findIndex(n => n && (n.id === '3' || n.id === nodes[1]?.id));
      const targetLeft = 100 + (afterNodeIdx !== -1 ? afterNodeIdx : 1) * 240;
      return { x: targetLeft + 60, y: 176 + 24 }; // Center point
    }

    const idx = regularNodes.findIndex(n => n && n.id === nodeId);
    const posLeft = 100 + idx * 240;
    return { x: posLeft + 60, y: 276 + 24 }; // Center index
  };

  const handleApplyAction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newValue);
    if (isNaN(val) || val < 1 || val > 999) {
      setErrorMsg('Please specify values between 1 and 999');
      return;
    }
    setErrorMsg('');
    const targetId = nodes[1]?.id || nodes[0]?.id || '3';
    triggerAlgorithm(nodes, activeAlgo, targetId);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* List toolbar controller space */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#171f33]/80 backdrop-blur-xl border border-slate-800 p-4 rounded-xl z-20">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#94A3B8] uppercase">Operation:</span>
          <div className="flex bg-[#0f172a] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onAlgoChange('insertAfter')}
              className={`px-3 py-1 text-xs font-display rounded-md transition-colors ${
                activeAlgo === 'insertAfter'
                  ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] font-medium border border-[#c0c1ff]/20'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              insertAfter(current, new)
            </button>
            <button
              onClick={() => onAlgoChange('deleteNode')}
              className={`px-3 py-1 text-xs font-display rounded-md transition-colors ${
                activeAlgo === 'deleteNode'
                  ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] font-medium border border-[#c0c1ff]/20'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              deleteNode(head, val)
            </button>
          </div>
        </div>

        {/* Inputs */}
        <form onSubmit={handleApplyAction} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0f172a] border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-mono text-[#94A3B8] select-none">New Node Value:</span>
            <input
              type="text"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white font-mono w-12 text-center"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1 bg-[#1000a9]/10 border border-[#8083ff]/30 hover:border-[#8083ff] px-3.5 py-1.5 rounded-lg text-xs text-[#c0c1ff] font-medium cursor-pointer active:scale-95 transition-all"
          >
            {activeAlgo === 'insertAfter' ? <Plus className="w-3" /> : <Trash2 className="w-3" />}
            Trace Setup
          </button>
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-1 bg-[#171f33] border border-slate-700 hover:border-[#8083ff] px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer active:scale-95 transition-all"
          >
            <RefreshCw className="w-3" />
            Random List
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="text-xs text-[#EF4444] px-4 py-1 text-right font-mono font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Main Canvas Node Viewport */}
      <div className="flex-1 relative w-full h-full min-h-[360px] flex items-center justify-center grid-bg">
        
        {/* Absolute SVG overlay path links */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrow" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="8" refY="5" viewBox="0 0 10 10">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#c0c1ff" />
            </marker>
            <marker id="arrow-active" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="8" refY="5" viewBox="0 0 10 10">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#00cbe6" />
            </marker>
            <marker id="arrow-ghost" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="8" refY="5" viewBox="0 0 10 10">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#464554" />
            </marker>
          </defs>

          {/* Draw nodes connector paths based on current snapshot indexes */}
          {activeNodes.map((node) => {
            if (!node || !node.id) return null;
            if (!node.nextId) return null;

            const fromCoords = getCoordinates(node.id);
            const toCoords = getCoordinates(node.nextId);

            if (fromCoords.x === 0 || toCoords.x === 0) return null;

            // Simple line or curved layout
            const isFloating = node.isTemp;
            const isTargetFloating = activeNodes.find(n => n && n.id === node.nextId)?.isTemp;

            // Draw curving pointers if temp node layout is active
            if (isFloating || isTargetFloating) {
              const dx = toCoords.x - fromCoords.x;
              const dy = toCoords.y - fromCoords.y;
              // Curved arc pointer
              const controlX = fromCoords.x + dx / 2;
              const controlY = Math.min(fromCoords.y, toCoords.y) - 35;

              return (
                <path
                  key={`link-curve-${node.id}`}
                  d={`M ${fromCoords.x + 30} ${fromCoords.y} Q ${controlX} ${controlY} ${toCoords.x - 30} ${toCoords.y}`}
                  fill="none"
                  stroke="#00cbe6"
                  strokeWidth="2"
                  className="animate-dash"
                  markerEnd="url(#arrow-active)"
                />
              );
            }

            // If state in insertAfter is Snap 4 or 5: Broken target link
            const isOriginalBroken = 
              activeAlgo === 'insertAfter' && 
              node.id === '3' && 
              (actionType === 'pointer_rewire' || actionType === 'insert');

            if (isOriginalBroken) {
              // Draw ghost original connection
              const baseToCoords = getCoordinates('4'); // node 37 index
              return (
                <path
                  key={`link-ghost-${node.id}`}
                  d={`M ${fromCoords.x + 30} ${fromCoords.y} L ${baseToCoords.x - 30} ${baseToCoords.y}`}
                  fill="none"
                  stroke="#464554"
                  strokeWidth="2"
                  strokeDasharray="4"
                  className="opacity-30"
                  markerEnd="url(#arrow-ghost)"
                />
              );
            }

            // Standard pointer
            return (
              <line
                key={`link-standard-${node.id}`}
                x1={fromCoords.x + 30}
                y1={fromCoords.y}
                x2={toCoords.x - 30}
                y2={toCoords.y}
                stroke="#c0c1ff"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* Terminal null pointer indicators for the final non-linked node */}
          {activeNodes.filter(n => n && !n.nextId && !n.isTemp).map(node => {
            if (!node || !node.id) return null;
            const coords = getCoordinates(node.id);
            if (coords.x === 0) return null;
            const startX = coords.x + 30;
            const startY = coords.y;

            return (
              <g key={`null-indicator-${node.id}`}>
                <line x1={startX} y1={startY} x2={startX + 30} y2={startY} stroke="#94A3B8" strokeWidth="2" />
                <line x1={startX + 30} y1={startY - 10} x2={startX + 30} y2={startY + 10} stroke="#94A3B8" strokeWidth="2" />
                <line x1={startX + 35} y1={startY - 6} x2={startX + 35} y2={startY + 6} stroke="#94A3B8" strokeWidth="2" />
                <line x1={startX + 40} y1={startY - 3} x2={startX + 40} y2={startY + 3} stroke="#94A3B8" strokeWidth="2" />
              </g>
            );
          })}
        </svg>

        {/* Render HTML elements above background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <AnimatePresence>
            {activeNodes.map((node) => {
              if (!node || !node.id) return null;
              const coords = getCoordinates(node.id);
              if (coords.x === 0) return null;

              const isHighlighted = highlightedNodes.includes(node.id);
              const isFloating = node.isTemp;
              
              // Custom hex pointer offset maps
              const hexAddr = node.id === 'temp_node' ? '0x9F2' : node.id === '3' ? '0x2B8' : node.id === '1' ? '0x1A4' : `0x${node.id}C4`;

              return (
                <motion.div
                  key={`node-item-${node.id}`}
                  initial={{ opacity: 0, scale: 0.8, y: coords.y - 120 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: coords.x - 60, // Align card top left to center point offset
                    y: coords.y - 24 
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                  className="absolute flex flex-col items-center pointer-events-auto"
                >
                  {/* Category badge */}
                  <div className={`mb-2 font-mono text-[10px] px-2 py-0.5 rounded border ${
                    isFloating
                      ? 'text-[#00cbe6] bg-[#00cbe6]/10 border-[#00cbe6]/30'
                      : node.id === '1'
                        ? 'text-[#c0c1ff] bg-[#c0c1ff]/10 border-[#c0c1ff]/30'
                        : 'text-[#eec200] bg-[#eec200]/10 border-[#eec200]/30'
                  }`}>
                    {isFloating ? 'temp' : node.id === '1' ? 'head' : node.id === '3' ? 'current' : 'node'}
                  </div>

                  {/* Node block card [Value | Next] */}
                  <div className={`bg-[#171f33] border rounded-xl flex items-center w-[120px] h-[48px] overflow-hidden transition-all duration-300 ${
                    isHighlighted || isFloating
                      ? 'border-[#00cbe6] border-2 shadow-[0_0_15px_rgba(0,203,230,0.3)]'
                      : 'border-slate-800'
                  }`}>
                    <div className="flex-1 text-center font-mono text-sm text-[#dae2fd] font-bold">
                      {node.value}
                    </div>
                    <div className="w-10 h-full border-l border-slate-800 flex items-center justify-center bg-slate-900/40">
                      <div className={`w-2 h-2 rounded-full ${node.nextId ? 'bg-[#c0c1ff]' : 'bg-slate-700'}`} />
                    </div>
                  </div>

                  {/* Show ref address */}
                  <div className="mt-1 text-[9px] font-mono text-slate-500">
                    @{hexAddr}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
