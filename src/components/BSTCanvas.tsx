import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Search, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { Snapshot, TreeNodeState, TreeAlgo } from '../types';
import { 
  generateBSTInsertSnapshots, 
  generateBSTSearchSnapshots, 
  generateBSTInorderSnapshots,
  DEFAULT_BST_NODES
} from '../algorithms';

interface BSTCanvasProps {
  currentSnapshot?: Snapshot;
  onSnapshotsGenerated: (snapshots: Snapshot[]) => void;
  activeAlgo: TreeAlgo;
  onAlgoChange: (algo: TreeAlgo) => void;
}

export default function BSTCanvas({
  currentSnapshot,
  onSnapshotsGenerated,
  activeAlgo,
  onAlgoChange
}: BSTCanvasProps) {
  const [treeNodes, setTreeNodes] = useState<TreeNodeState[]>(DEFAULT_BST_NODES);
  const [inputValue, setInputValue] = useState('20');
  const [errorMsg, setErrorMsg] = useState('');
  const [zoomScale, setZoomScale] = useState(1);

  // Trigger algorithm snapshot generation
  const triggerAlgorithm = (
    currentTree: TreeNodeState[],
    algo: TreeAlgo,
    val: number
  ) => {
    let snaps: Snapshot[];
    if (algo === 'insertBST') {
      snaps = generateBSTInsertSnapshots(currentTree, val);
    } else if (algo === 'searchBST') {
      snaps = generateBSTSearchSnapshots(currentTree, val);
    } else {
      snaps = generateBSTInorderSnapshots(currentTree);
    }
    onSnapshotsGenerated(snaps);
  };

  // Re-run when algorithm triggers
  useEffect(() => {
    const val = parseInt(inputValue) || 20;
    triggerAlgorithm(treeNodes, activeAlgo, val);
  }, [activeAlgo]);

  // Initial setup
  useEffect(() => {
    triggerAlgorithm(treeNodes, activeAlgo, 20);
  }, []);

  // Sync state if snapshot alters or operation finishes
  useEffect(() => {
    if (currentSnapshot && currentSnapshot.actionType === 'done' && currentSnapshot.treeState) {
      setTreeNodes(currentSnapshot.treeState);
    }
  }, [currentSnapshot]);

  // Reset Tree
  const handleResetTree = () => {
    setTreeNodes(DEFAULT_BST_NODES);
    setErrorMsg('');
    triggerAlgorithm(DEFAULT_BST_NODES, activeAlgo, 20);
  };

  // Submit operations
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputValue);
    if (isNaN(val) || val < 1 || val > 150) {
      setErrorMsg('Please specify values between 1 and 150');
      return;
    }
    setErrorMsg('');
    triggerAlgorithm(treeNodes, activeAlgo, val);
  };

  // Draw details
  const activeTree = currentSnapshot?.treeState || treeNodes;
  const highlightedNodes = currentSnapshot?.highlightedNodes || [];
  const actionType = currentSnapshot?.actionType || 'init';

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Head Toolbar control panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#171f33]/80 backdrop-blur-xl border border-slate-800 p-4 rounded-xl z-20">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#94A3B8] uppercase">Operation:</span>
          <div className="flex bg-[#0f172a] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onAlgoChange('insertBST')}
              className={`px-3 py-1 text-xs font-display rounded-md transition-colors ${
                activeAlgo === 'insertBST'
                  ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] font-medium border border-[#c0c1ff]/20'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              BST Insert
            </button>
            <button
              onClick={() => onAlgoChange('searchBST')}
              className={`px-3 py-1 text-xs font-display rounded-md transition-colors ${
                activeAlgo === 'searchBST'
                  ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] font-medium border border-[#c0c1ff]/20'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              BST Search
            </button>
            <button
              onClick={() => onAlgoChange('inorderBST')}
              className={`px-3 py-1 text-xs font-display rounded-md transition-colors ${
                activeAlgo === 'inorderBST'
                  ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] font-medium border border-[#c0c1ff]/20'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              In-Order DFS
            </button>
          </div>
        </div>

        {/* Form panel inputs */}
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          {activeAlgo !== 'inorderBST' && (
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Key"
              className="bg-[#0f172a] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-[#dae2fd] focus:outline-none focus:border-[#5de6ff] w-20 font-mono text-center"
            />
          )}
          <button
            type="submit"
            className="flex items-center gap-1 bg-[#1000a9]/10 border border-[#8083ff]/30 hover:border-[#8083ff] px-3.5 py-1.5 rounded-lg text-xs text-[#c0c1ff] font-medium cursor-pointer active:scale-95 transition-all"
          >
            {activeAlgo === 'insertBST' ? (
              <>
                <Plus className="w-3" /> Insert
              </>
            ) : activeAlgo === 'searchBST' ? (
              <>
                <Search className="w-3" /> Search
              </>
            ) : (
              <>
                <Play className="w-3" /> Run DFS
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleResetTree}
            className="flex items-center gap-1 bg-slate-800/20 hover:bg-slate-800/60 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer transition-colors"
          >
            Reset Tree
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="text-xs text-[#EF4444] px-4 py-1 text-right font-mono font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Canvas workspace block */}
      <div className="flex-1 relative w-full h-full min-h-[380px] flex items-center justify-center overflow-auto grid-bg">
        {/* Floating Zoom utility toolbar */}
        <div className="absolute top-4 right-4 flex gap-1 bg-[#171f33]/70 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 z-20">
          <button
            onClick={() => setZoomScale(p => Math.min(1.4, p + 0.1))}
            className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer active:scale-90 transition-transform"
            title="Zoom In"
          >
            <ZoomIn className="w-4" />
          </button>
          <button
            onClick={() => setZoomScale(p => Math.max(0.6, p - 0.1))}
            className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer active:scale-90 transition-transform"
            title="Zoom Out"
          >
            <ZoomOut className="w-4" />
          </button>
          <button
            onClick={() => setZoomScale(1)}
            className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer active:scale-90 transition-transform"
            title="Reset Zoom"
          >
            <Compass className="w-4" />
          </button>
        </div>

        {/* Tree Render Group */}
        <div
          className="relative w-full h-full max-w-3xl aspect-[6/4] flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomScale})` }}
        >
          {/* SVG Connector Strokes layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <g stroke="#334155" strokeWidth="2">
              {activeTree.map((node) => {
                if (!node || !node.id) return null;
                const links: { childId: string | null; isLeft: boolean }[] = [
                  { childId: node.leftId, isLeft: true },
                  { childId: node.rightId, isLeft: false }
                ];

                return links.map(({ childId, isLeft }) => {
                  if (!childId) return null;
                  const childNode = activeTree.find(n => n && n.id === childId);
                  if (!childNode) return null;

                  // Evaluate if parent is currently part of traversed search line
                  const isNodeHighlighted = highlightedNodes.includes(childId) && (actionType === 'compare' || actionType === 'found' || actionType === 'traverse');

                  if (isNodeHighlighted) {
                    return (
                      <path
                        key={`edge-active-${node.id}-${childId}`}
                        d={`M ${node.x} ${node.y} L ${childNode.x} ${childNode.y}`}
                        stroke="#00cbe6"
                        strokeWidth="3.2"
                        className="pulse-cyan"
                        strokeDasharray="4,4"
                      />
                    );
                  }

                  return (
                    <line
                      key={`edge-${node.id}-${childId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={childNode.x}
                      y2={childNode.y}
                    />
                  );
                });
              })}
            </g>
          </svg>

          {/* HTML Overlay Nodes with Framer Motion triggers */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <AnimatePresence>
              {activeTree.map((node) => {
                if (!node || !node.id) return null;
                const isNodeActive = highlightedNodes.includes(node.id);
                // Highlight traversed during travel
                const isTraversed = node.traversed;

                // Color overrides
                let fontColor = 'text-[#dae2fd]';
                let borderColor = 'border-slate-700';
                let pulseRing = '';
                let glowStyle = '';

                if (isNodeActive) {
                  fontColor = 'text-[#00cbe6] font-bold';
                  borderColor = 'border-[#00cbe6] border-2';
                  pulseRing = 'pulse-cyan';
                  glowStyle = 'drop-shadow-[0_0_10px_rgba(93,230,255,0.45)]';
                } else if (isTraversed) {
                  fontColor = 'text-[#c0c1ff]';
                  borderColor = 'border-[#c0c1ff]';
                }

                return (
                  <motion.div
                    key={`tree-node-${node.id}-${node.value}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                    className="absolute pointer-events-auto flex flex-col items-center justify-center cursor-pointer"
                    style={{ left: node.x - 24, top: node.y - 24 }}
                  >
                    {/* Circle Node visualizer element */}
                    <div
                      title={`Value ${node.value}`}
                      className={`w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center border text-sm font-mono tracking-tighter ${borderColor} ${glowStyle}`}
                    >
                      <span className={fontColor}>{node.value}</span>
                    </div>

                    {/* Outer animated ring wrapper if highlighted */}
                    {isNodeActive && (
                      <div className={`absolute w-[60px] h-[60px] rounded-full border border-dashed border-[#00cbe6] ${pulseRing}`} />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
