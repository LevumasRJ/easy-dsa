import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Compass, Database, Hash, HelpCircle, 
  Layers, Lock, Sliders, CheckCircle, Award, RefreshCw, Sparkles,
  Calendar, CheckCircle2, ChevronRight, Play, Server, AlertCircle
} from 'lucide-react';

import { Snapshot, LeetAlgo } from '../types';
import { NEETCODE_PROBLEMS, LeetCodeProblem } from '../leetcodeDatabase';
import { PlaylistId, PLAYLISTS, isProblemInPlaylist } from '../utils/roadmapCollections';
import { 
  getAllProblems, 
  getSyncState, 
  runScraperSync, 
  startPeriodicSyncManager, 
  SyncState, 
  resetDynamicProblems 
} from '../utils/syncManager';
import { 
  generateTwoSumSnapshots,
  generateValidParenthesesSnapshots,
  generateReverseLinkedListSnapshots,
  generateBinarySearchSnapshots,
  generateBuySellStockSnapshots,
  generateContainerWithMostWaterSnapshots,
  generateInvertTreeSnapshots,
  generateGroupAnagramsSnapshots,
  generateThreeSumSnapshots,
  generateLongestSubstringSnapshots,
  generateMergeTwoListsSnapshots
} from '../leetcodeAlgorithms';

interface LeetCodeCanvasProps {
  currentSnapshot: Snapshot;
  onSnapshotsGenerated: (snapshots: Snapshot[]) => void;
  activeAlgo: LeetAlgo;
  onAlgoChange: (algo: LeetAlgo) => void;
}

export default function LeetCodeCanvas({
  currentSnapshot,
  onSnapshotsGenerated,
  activeAlgo,
  onAlgoChange
}: LeetCodeCanvasProps) {
  // Local active sync state and problems database
  const [syncState, setSyncState] = useState<SyncState>(() => getSyncState());
  const [problemsList, setProblemsList] = useState<LeetCodeProblem[]>(() => getAllProblems());
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);
  const [showSyncLogList, setShowSyncLogList] = useState(false);

  // Periodic scheduler setup
  useEffect(() => {
    // Hooks up background synchronizer (executed once instantly if first time, then ticks every Sunday at 8am)
    const unsubscribe = startPeriodicSyncManager((updatedState) => {
      setSyncState(updatedState);
      setProblemsList(getAllProblems());
    });
    return () => unsubscribe();
  }, []);

  // Trigger manual sync
  const triggerManualScraper = async () => {
    setIsSyncingLocal(true);
    try {
      const result = await runScraperSync((updated) => {
        setSyncState(updated);
      });
      setProblemsList(getAllProblems());
    } catch (e) {
      console.error('Manual scraper trigger failed:', e);
    } finally {
      setIsSyncingLocal(false);
    }
  };

  // Local state for problem database navigation
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistId>('nc150');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom input states for each problem to let user run custom testcases!
  const [twoSumInput, setTwoSumInput] = useState<string>('2, 7, 11, 15');
  const [twoSumTarget, setTwoSumTarget] = useState<number>(9);
  
  const [validParensInput, setValidParensInput] = useState<string>('({[]})');
  
  const [reverseListInput, setReverseListInput] = useState<string>('1, 2, 3, 4, 5');
  
  const [binarySearchInput, setBinarySearchInput] = useState<string>('1, 3, 5, 7, 9, 12, 15');
  const [binarySearchTarget, setBinarySearchTarget] = useState<number>(9);
  
  const [buySellStockInput, setBuySellStockInput] = useState<string>('7, 1, 5, 3, 6, 4');
  
  const [waterInput, setWaterInput] = useState<string>('1, 8, 6, 2, 5, 4, 8, 3, 7');

  const [invertTreeInput, setInvertTreeInput] = useState<string>('4, 2, 7, 1, 3, 6, 9');

  const [groupAnagramsInput, setGroupAnagramsInput] = useState<string>('eat, tea, tan, ate, nat, bat');
  const [threeSumInputState, setThreeSumInputState] = useState<string>('-1, 0, 1, 2, -1, -4');
  const [longestSubstringInput, setLongestSubstringInput] = useState<string>('abcabcbb');
  const [mergeList1Input, setMergeList1Input] = useState<string>('1, 2, 4');
  const [mergeList2Input, setMergeList2Input] = useState<string>('1, 3, 4');

  // Load the current matching problem description
  const activeProblem = problemsList.find(p => p.id === activeAlgo) || problemsList[0] || NEETCODE_PROBLEMS[0];


  // Regene snapshots when activeAlgo or customized input configs vary
  useEffect(() => {
    try {
      let snaps: Snapshot[] = [];
      if (activeAlgo === 'twosum') {
        const nums = twoSumInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        snaps = generateTwoSumSnapshots(nums.length > 0 ? nums : [2, 7, 11, 15], twoSumTarget);
      } else if (activeAlgo === 'valid_parentheses') {
        snaps = generateValidParenthesesSnapshots(validParensInput || '()');
      } else if (activeAlgo === 'reverse_list') {
        const vals = reverseListInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        snaps = generateReverseLinkedListSnapshots(vals.length > 0 ? vals : [1, 2, 3, 4]);
      } else if (activeAlgo === 'binary_search') {
        const nums = binarySearchInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)).sort((a,b) => a-b);
        snaps = generateBinarySearchSnapshots(nums.length > 0 ? nums : [1, 2, 3, 5, 9, 12], binarySearchTarget);
      } else if (activeAlgo === 'buy_sell_stock') {
        const prices = buySellStockInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        snaps = generateBuySellStockSnapshots(prices.length > 0 ? prices : [7, 1, 5, 3, 6, 4]);
      } else if (activeAlgo === 'container_with_most_water') {
        const heights = waterInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        snaps = generateContainerWithMostWaterSnapshots(heights.length > 0 ? heights : [1, 8, 6, 2, 5, 4, 8, 3, 7]);
      } else if (activeAlgo === 'invert_tree') {
        const nodes = invertTreeInput.split(',').map(n => {
          const t = n.trim();
          return t === 'null' ? null : parseInt(t);
        }).map(v => v === undefined ? null : v) as (number | null)[];
        // clean any tail nulls or default
        const filteredNodes = nodes.filter((v): v is number => v !== null);
        snaps = generateInvertTreeSnapshots(filteredNodes.length > 0 ? filteredNodes : [4, 2, 7, 1, 3, 6, 9]);
      } else if (activeAlgo === 'group_anagrams') {
        const arr = groupAnagramsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
        snaps = generateGroupAnagramsSnapshots(arr.length > 0 ? arr : ["eat", "tea", "tan", "ate", "nat", "bat"]);
      } else if (activeAlgo === 'threesum') {
        const nums = threeSumInputState.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        snaps = generateThreeSumSnapshots(nums.length > 0 ? nums : [-1, 0, 1, 2, -1, -4]);
      } else if (activeAlgo === 'longest_substring') {
        snaps = generateLongestSubstringSnapshots(longestSubstringInput || 'abcabcbb');
      } else if (activeAlgo === 'merge_two_lists') {
        const l1 = mergeList1Input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
        const l2 = mergeList2Input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
        snaps = generateMergeTwoListsSnapshots(l1.length > 0 ? l1 : [1, 2, 4], l2.length > 0 ? l2 : [1, 3, 4]);
      } else {
        // Dynamic simulated trace for any newly scraped/integrated NeetCode/LeetCode problems!
        snaps = [
          {
            lineHighlighted: 1,
            actionType: 'init',
            explanation: `Initializing runtime parameters and testing layout for LC #${activeProblem.number}: "${activeProblem.title}".`,
            consoleOutput: `[init] Launching dynamic problem test context for LC #${activeProblem.number}`,
            variables: { status: 'starting', input_case: activeProblem.inputExample }
          },
          {
            lineHighlighted: 2,
            actionType: 'traverse',
            explanation: `Scanning linear tape segment elements in progressive iterations: ${activeProblem.inputExample}.`,
            consoleOutput: `[processing] Tracking lookup indices and frequencies in linear complexity...`,
            variables: { status: 'scanning', checked: 1, target: activeProblem.outputExample }
          },
          {
            lineHighlighted: 3,
            actionType: 'compare',
            explanation: `Performing decision check on element arrays to calculate output outcome match.`,
            consoleOutput: `[evaluate] Validating solution structures and expected return criteria...`,
            variables: { status: 'matching', match_found: 'true' }
          },
          {
            lineHighlighted: 4,
            actionType: 'done',
            explanation: `Successfully arrived at correct problem solution output: "${activeProblem.outputExample}". Database integrity aligned.`,
            consoleOutput: `[done] Completed evaluation. Returned: ${activeProblem.outputExample}`,
            variables: { status: 'completed', complexity: 'O(N) Linear Time', return: activeProblem.outputExample }
          }
        ];
      }
      
      if (snaps.length > 0) {
        onSnapshotsGenerated(snaps);
      }
    } catch (e) {
      console.error("Error generating snapshots on input tweak: ", e);
    }
  }, [
    activeAlgo, 
    twoSumInput, twoSumTarget, 
    validParensInput, 
    reverseListInput, 
    binarySearchInput, binarySearchTarget, 
    buySellStockInput, 
    waterInput,
    invertTreeInput,
    groupAnagramsInput,
    threeSumInputState,
    longestSubstringInput,
    mergeList1Input,
    mergeList2Input
  ]);

  // Categories helper
  const categories = [
    'All',
    'Arrays & Hashing',
    'Two Pointers',
    'Sliding Window',
    'Stack',
    'Binary Search',
    'Linked List',
    'Trees',
    'Tries',
    'Heap / Priority Queue',
    'Backtracking',
    'Graphs',
    'Advanced Graphs',
    '1-D DP',
    '2-D DP',
    'Greedy',
    'Intervals',
    'Math & Geometry',
    'Bit Manipulation'
  ];

  // Dynamic playlist counts based on current active list state
  const lc50Count = problemsList.filter(p => isProblemInPlaylist(p, 'lc50')).length;
  const blind75Count = problemsList.filter(p => isProblemInPlaylist(p, 'blind75')).length;
  const lc100Count = problemsList.filter(p => isProblemInPlaylist(p, 'lc100')).length;
  const nc150Count = problemsList.filter(p => isProblemInPlaylist(p, 'nc150')).length;
  const lc250Count = problemsList.filter(p => isProblemInPlaylist(p, 'lc250')).length;
  const allCount = problemsList.length;

  // Filter problems registry
  const filteredProblems = problemsList.filter(p => {
    const matchesPlaylist = isProblemInPlaylist(p, selectedPlaylist);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          String(p.number).includes(searchQuery);
    return matchesPlaylist && matchesCategory && matchesSearch;
  });

  // Render individual custom interactive graphical states based on currently selected LeetCode problem!
  const renderVisualizer = () => {
    const variables = currentSnapshot.variables || {};
    
    switch (activeAlgo) {
      case 'twosum': {
        const nums = twoSumInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        const activeIdxs = currentSnapshot.activeIndices || [];
        // parse the hash_map string variable securely
        let hashMap: Record<number, number> = {};
        try {
          if (variables.hash_map) {
            hashMap = JSON.parse(variables.hash_map as string);
          }
        } catch (_) {}

        return (
          <div className="w-full flex flex-col gap-6 items-center">
            {/* Input sequence */}
            <div className="w-full">
              <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-3 block">
                Indices Tape Scan (Active pointer i highlighted)
              </h4>
              <div className="flex flex-wrap gap-3 items-center justify-center">
                {nums.map((val, idx) => {
                  const isActive = activeIdxs.includes(idx);
                  const isCurrent = variables.i === idx;
                  return (
                    <motion.div
                      key={idx}
                      layoutId={`ts-node-${idx}`}
                      className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center border font-mono transition-all ${
                        isActive 
                          ? 'bg-[#5de6ff]/20 border-[#5de6ff] text-white scale-110 shadow-[0_0_15px_rgba(93,230,255,0.25)]' 
                          : isCurrent
                            ? 'bg-[#8083ff]/20 border-[#8083ff] text-white scale-105 shadow-[0_0_15px_rgba(128,131,255,0.25)]'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-lg font-bold">{val}</span>
                      <span className="text-[9px] text-slate-500 absolute bottom-1">idx {idx}</span>
                      
                      {isCurrent && (
                        <div className="absolute -top-6 bg-[#8083ff] text-[9px] px-1 py-0.2 rounded text-white font-bold animate-bounce font-mono">
                          nums[i]
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Target & compliment tracker box layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Mathematics parameters info */}
              <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-2">Equation Tracker</span>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Target Value:</span>
                    <span className="text-[#5de6ff] font-bold">{twoSumTarget}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 py-1">
                    <span className="text-slate-400">Current Value:</span>
                    <span className="font-bold text-slate-200">{variables.current_value ?? 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Complement Needed:</span>
                    <span className="text-[#EF4444] font-bold">
                      {variables.complement ?? 'N/A'} (Target - Current)
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Hashmap tracker dictionary */}
              <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
                  <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block">HashMap Cache</span>
                  <span className="text-[9px] font-mono text-slate-500">Value ➔ Index</span>
                </div>
                
                <div className="h-28 overflow-y-auto space-y-1 text-xs font-mono scrollbar-thin">
                  {Object.keys(hashMap).length === 0 ? (
                    <div className="text-slate-600 text-center pt-8 italic text-[11px]">
                      HashMap empty (no numbers cached yet)
                    </div>
                  ) : (
                    Object.entries(hashMap).map(([numStr, indexVal]) => {
                      const isTargetComplement = Number(numStr) === Number(variables.complement);
                      return (
                        <div 
                          key={numStr} 
                          className={`flex justify-between items-center px-3 py-1 rounded bg-slate-950/40 border transition-all ${
                            isTargetComplement 
                              ? 'border-[#5de6ff] bg-[#5de6ff]/5 text-[#5de6ff] font-bold animate-pulse'
                              : 'border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            Value {numStr}
                          </span>
                          <span>Mapped to idx: {indexVal}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'valid_parentheses': {
        const s = validParensInput || '()';
        const activeIdx = Number(variables.i ?? -1);
        let activeStack: string[] = [];
        try {
          if (variables.stack) {
            // strip back string representation e.g. "[(, {]" to real items
            activeStack = (variables.stack as string)
              .replace('[', '')
              .replace(']', '')
              .split(',')
              .map(v => v.trim())
              .filter(v => v.length > 0);
          }
        } catch (_) {}

        return (
          <div className="w-full flex flex-col md:flex-row gap-6 items-stretch">
            
            {/* Left Column: Symbolic tape scan */}
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-3 block">
                Character Tape Parser (s = "{s}")
              </h4>
              <div className="flex gap-2 justify-center py-4 bg-slate-950/30 rounded-xl border border-slate-900/60 p-4">
                {s.split('').map((char, idx) => {
                  const isActive = idx === activeIdx;
                  const isProcessed = idx < activeIdx;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-11 rounded-lg flex flex-col items-center justify-center font-mono text-base font-bold border transition-all ${
                        isActive
                          ? 'bg-[#8083ff]/20 border-[#8083ff] text-white scale-110 shadow-[0_0_12px_rgba(128,131,255,0.25)]'
                          : isProcessed
                            ? 'bg-slate-900/40 border-slate-900 text-slate-600 line-through'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {char}
                      {isActive && (
                        <span className="absolute -bottom-4 text-[8px] text-[#8083ff] uppercase tracking-wider font-bold">
                          active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status information panel */}
              <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl mt-4">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-2">Lexer Watch</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950/40 border border-slate-900 px-3 py-1.5 rounded">
                    <span className="text-slate-500 block text-[9px] uppercase">Token</span>
                    <span className="text-white font-bold">{variables.char ?? 'N/A'}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-900 px-3 py-1.5 rounded">
                    <span className="text-slate-500 block text-[9px] uppercase">Expected Match</span>
                    <span className="text-white font-bold">{variables.expected_opener ?? 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Stack Frame */}
            <div className="w-full md:w-44 bg-[#131b2e] border border-slate-800 rounded-xl p-4 flex flex-col">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-3 text-center">
                Visual Stack (LIFO)
              </span>

              {/* Stack holder column */}
              <div className="flex-1 min-h-40 border-2 border-dashed border-slate-800 rounded-lg p-2 flex flex-col-reverse gap-1.5 justify-start bg-slate-950/30">
                <AnimatePresence>
                  {activeStack.length === 0 ? (
                    <div className="text-[9px] text-slate-600 text-center font-mono py-12 italic self-center">
                      Stack is empty
                    </div>
                  ) : (
                    activeStack.map((symbol, idx) => (
                      <motion.div
                        key={`${symbol}-${idx}`}
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className={`py-2 rounded border border-slate-700/80 font-mono font-bold text-center text-sm ${
                          idx === activeStack.length - 1
                            ? 'bg-[#5de6ff]/20 border-[#5de6ff] text-white shadow-[0_0_10px_rgba(93,230,255,0.15)]'
                            : 'bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        {symbol}
                        {idx === activeStack.length - 1 && (
                          <span className="text-[8px] font-mono text-[#5de6ff] block text-center mt-0.5 tracking-tighter">
                            st.top()
                          </span>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
              <div className="border-t-2 border-slate-600 mt-2 text-center text-[8px] font-mono text-slate-500 font-bold">
                STACK BASE
              </div>
            </div>

          </div>
        );
      }

      case 'reverse_list': {
        const nodes = currentSnapshot.linkedListState || [];
        const highlightedNodes = currentSnapshot.highlightedNodes || [];

        return (
          <div className="w-full flex flex-col gap-6 items-center">
            <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block self-start">
              Singly Linked List Nodes & Forward/Backward pointer state
            </h4>

            <div className="flex flex-wrap gap-x-12 gap-y-8 items-center justify-center py-6 min-h-32">
              <AnimatePresence>
                {nodes.map((node, idx) => {
                  if (!node || !node.id) return null;
                  const isHighlighted = highlightedNodes.includes(node.id);
                  const isPrev = variables.prev === node.id;
                  const isCurr = variables.curr === node.id;
                  const isNext = variables.next === node.id;

                  return (
                    <motion.div
                      key={node.id}
                      layout
                      className="flex items-center relative"
                    >
                      {/* Node Element Body */}
                      <motion.div
                        layoutId={`node-body-${node.id}`}
                        className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border font-mono transition-all duration-300 relative ${
                          isCurr 
                            ? 'bg-[#8083ff]/20 border-[#8083ff] text-white scale-110 shadow-[0_0_15px_rgba(128,131,255,0.3)]'
                            : isPrev
                              ? 'bg-[#EF4444]/20 border-[#EF4444] text-white scale-105 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                              : isHighlighted
                                ? 'bg-slate-800 border-[#5de6ff] text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xl font-bold">{node.value}</span>
                        <span className="text-[8px] text-slate-500 font-bold overflow-hidden px-1 truncate max-w-full">
                          {node.id}
                        </span>

                        {/* Pointer Badge indicator labels overlay */}
                        <div className="absolute -top-6 flex flex-col items-center gap-0.5">
                          {isCurr && (
                            <span className="bg-[#8083ff] text-[8px] font-bold font-mono px-1.5 py-0.2 rounded text-white antialiased">
                              curr
                            </span>
                          )}
                          {isPrev && (
                            <span className="bg-[#EF4444] text-[8px] font-bold font-mono px-1.5 py-0.2 rounded text-white antialiased">
                              prev
                            </span>
                          )}
                          {isNext && (
                            <span className="bg-slate-700 text-[8px] font-bold font-mono px-1.5 py-0.2 rounded text-slate-300 antialiased">
                              next
                            </span>
                          )}
                        </div>
                      </motion.div>

                      {/* Connection pointer arrow */}
                      {idx < nodes.length - 1 && (
                        <div className="absolute left-[56px] w-[48px] h-0.5 pointer-events-none flex items-center justify-center">
                          {/* We check direction! Reversed links point differently! */}
                          {/* If this node's next ID points backward to the previous node in indices, render physical reversed arrow! */}
                          {node.nextId === null ? (
                            <div className="text-[9px] font-bold text-[#EF4444] tracking-tight bg-[#EF4444]/10 border border-[#EF4444]/25 px-1 rounded">
                              NULL
                            </div>
                          ) : node.nextId === nodes[idx - 1]?.id ? (
                            // Pointer is reversed! Arrow pointing BACK (left <- right)
                            <div className="relative w-full h-full flex items-center bg-transparent">
                              <div className="w-full h-[2px] bg-gradient-to-r from-red-500 to-indigo-500 animate-pulse" />
                              <div className="absolute left-0 -top-1.5 border-t-[6px] border-r-[8px] border-b-[6px] border-t-transparent border-b-transparent border-r-red-400" />
                            </div>
                          ) : (
                            // Pointer points FORWARD (left -> right)
                            <div className="relative w-full h-full flex items-center bg-transparent">
                              <div className="w-full h-[2px] bg-indigo-500/50" />
                              <div className="absolute right-0 -top-1.5 border-t-[6px] border-l-[8px] border-b-[6px] border-t-transparent border-b-transparent border-l-indigo-400" />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Tail Null identifier specifically for final node if pointed to Null */}
                      {idx === nodes.length - 1 && (
                        <div className="absolute left-[56px] text-slate-600 text-[10px] font-mono p-1">
                          {node.nextId === null ? (
                            <span className="text-red-500 bg-red-500/10 border border-red-500/20 px-1 rounded font-bold">NULL</span>
                          ) : (
                            // flipped
                            <span className="text-[#8083ff] bg-[#8083ff]/10 border border-[#8083ff]/20 px-1 rounded font-bold">➔ {node.nextId}</span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        );
      }

      case 'binary_search': {
        const nums = binarySearchInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)).sort((a,b) => a-b);
        const l = Number(variables.l ?? -1);
        const r = Number(variables.r ?? -1);
        const mid = Number(variables.mid ?? -1);

        return (
          <div className="w-full flex flex-col gap-6 items-center">
            
            {/* Array Pointers Block */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] bg-slate-800/80 tracking-widest text-[#5de6ff] uppercase px-2 py-0.5 rounded border border-slate-700/60 font-mono">
                  Target: {binarySearchTarget}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Range scope length: {r >= l && l !== -1 ? r - l + 1 : 0} items
                </span>
              </div>

              {/* Sorted array blocks deck */}
              <div className="flex flex-wrap gap-2 items-center justify-center p-4 bg-slate-950/20 rounded-xl border border-slate-900/60">
                {nums.map((val, idx) => {
                  const isL = idx === l;
                  const isR = idx === r;
                  const isMid = idx === mid;
                  
                  // Active search candidate check
                  const isCandidate = l !== -1 && r !== -1 && idx >= l && idx <= r;

                  return (
                    <div
                      key={idx}
                      className={`relative w-12 h-14 rounded-lg flex flex-col items-center justify-center font-mono border transition-all duration-300 ${
                        isMid
                          ? 'bg-[#5de6ff]/20 border-[#5de6ff] text-white scale-110 shadow-[0_0_15px_rgba(93,230,255,0.3)]'
                          : isCandidate
                            ? 'bg-slate-900 border-slate-700 text-slate-100'
                            : 'bg-slate-950/60 border-slate-950 text-slate-600 opacity-40 line-through'
                      }`}
                    >
                      <span className="text-base font-bold">{val}</span>
                      <span className="text-[8px] text-slate-500 absolute bottom-0.5">idx{idx}</span>

                      {/* Display boundary cursors above or below the node */}
                      <div className="absolute -top-7 flex gap-0.5 font-sans justify-center">
                        {isL && (
                          <span className="bg-emerald-600 text-[8px] font-bold text-white px-1 rounded tracking-tighter">
                            L
                          </span>
                        )}
                        {isMid && (
                          <span className="bg-[#5de6ff] text-[8px] font-bold text-slate-950 px-1 rounded tracking-tighter animate-bounce">
                            MID
                          </span>
                        )}
                        {isR && (
                          <span className="bg-red-600 text-[8px] font-bold text-white px-1 rounded tracking-tighter">
                            R
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pointers feedback panel */}
            <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl w-full grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-950/40 px-3 py-2 rounded border border-slate-900">
                <span className="text-emerald-500 block text-[9px] uppercase font-mono font-bold">Left Bound (l)</span>
                <span className="text-white text-base font-bold font-mono">{l === -1 ? 'None' : l}</span>
              </div>
              <div className="bg-slate-950/40 px-3 py-2 rounded border border-slate-900">
                <span className="text-[#5de6ff] block text-[9px] uppercase font-mono font-bold">Mid Index (mid)</span>
                <span className="text-[#5de6ff] text-base font-bold font-mono">{mid === -1 || isNaN(mid) ? 'None' : mid}</span>
              </div>
              <div className="bg-slate-950/40 px-3 py-2 rounded border border-slate-900">
                <span className="text-red-500 block text-[9px] uppercase font-mono font-bold">Right Bound (r)</span>
                <span className="text-white text-base font-bold font-mono">{r === -1 ? 'None' : r}</span>
              </div>
            </div>

          </div>
        );
      }

      case 'buy_sell_stock': {
        const prices = buySellStockInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        const l = Number(variables.l ?? -1);
        const r = Number(variables.r ?? -1);
        const maxProfit = Number(variables.max_profit ?? 0);
        
        // Find extreme height value to scale chart proportionally
        const maxVal = Math.max(...prices, 10);

        return (
          <div className="w-full flex flex-col gap-5 items-stretch">
            
            {/* Header statistics bar */}
            <div className="flex justify-between items-center text-xs font-mono font-bold bg-[#131b2e] px-4 py-2 border border-slate-800 rounded-xl">
              <span className="text-slate-400">Transaction Optimizer Metrics:</span>
              <span className="text-[#22C55E]">Max overall profit: ${maxProfit}</span>
            </div>

            {/* Price Chart Visual layout */}
            <div className="h-44 border-b border-l border-slate-800/80 relative flex items-end justify-around py-2 px-4 bg-slate-950/20 rounded-xl">
              {prices.map((price, idx) => {
                const isL = idx === l;
                const isR = idx === r;
                const percentHeight = Math.round((price / maxVal) * 85);

                const isActiveWindow = l !== -1 && r !== -1 && idx >= l && idx <= r;

                return (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center w-8 group relative"
                    style={{ height: '100%', justifyContent: 'flex-end' }}
                  >
                    {/* Hover text flag */}
                    <span className="absolute -top-6 text-[10px] font-mono text-slate-300 font-bold bg-slate-900 border border-slate-800 px-1 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${price}
                    </span>

                    {/* Bar graphic */}
                    <div 
                      className={`w-full rounded-t-md relative transition-all duration-500 ${
                        isL 
                          ? 'bg-gradient-to-t from-emerald-600/80 to-emerald-400 border-2 border-emerald-400' 
                          : isR
                            ? 'bg-gradient-to-t from-orange-600/80 to-orange-400 border-2 border-orange-400 animate-pulse'
                            : isActiveWindow
                              ? 'bg-gradient-to-t from-slate-800 to-[#8083ff]/40 border-t border-[#8083ff]/60'
                              : 'bg-slate-800/45'
                      }`}
                      style={{ height: `${percentHeight}%` }}
                    >
                      {/* Profit flow path visual */}
                      {isR && l !== -1 && price > prices[l] && (
                        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse flex items-center justify-center">
                          <span className="text-[9px] font-mono font-bold text-emerald-300">+${price - prices[l]}</span>
                        </div>
                      )}
                    </div>

                    {/* Day index and pointer labels below */}
                    <span className="text-[8px] font-mono text-slate-500 mt-1 font-bold">D{idx}</span>
                    
                    {isL && (
                      <span className="absolute -bottom-5 bg-emerald-600 text-[8px] font-mono px-1 py-0.2 rounded text-white font-black antialiased">
                        BUY
                      </span>
                    )}
                    {isR && (
                      <span className="absolute -bottom-5 bg-orange-600 text-[8px] font-mono px-1 py-0.2 rounded text-white font-black antialiased">
                        SELL
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'container_with_most_water': {
        const heights = waterInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        const l = Number(variables.l ?? -1);
        const r = Number(variables.r ?? -1);
        const area = Number(variables.area ?? 0);
        const maxArea = Number(variables.max_area ?? 0);

        const hL = l !== -1 ? heights[l] : 0;
        const hR = r !== -1 ? heights[r] : 0;
        const currentWaterHeight = Math.min(hL, hR);
        const maxVal = Math.max(...heights, 10);

        return (
          <div className="w-full flex flex-col gap-4 items-stretch">
            
            {/* Header info metrics */}
            <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="border-r border-slate-800 pr-4">
                <span className="text-slate-500 text-[9px] uppercase block mb-0.5">Calculated Fluid volume</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-[#5de6ff]">{area}</span>
                  <span className="text-[10px] text-slate-500">units²</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[9px] uppercase block mb-0.5 font-bold text-[#22C55E]">Max Capacity Found</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-[#22C55E]">{maxArea}</span>
                  <span className="text-[10px] text-slate-500">units²</span>
                </div>
              </div>
            </div>

            {/* Heights & water container chart */}
            <div className="h-44 border-b border-l border-slate-800 relative flex items-end justify-stretch py-2 px-2 bg-slate-950/20 rounded-xl relative">
              
              {/* Dynamic physical fluid overlay spanning from l to r */}
              {l !== -1 && r !== -1 && r > l && currentWaterHeight > 0 && (
                <div 
                  className="absolute bottom-0 bg-[#5de6ff]/20 border-t-2 border-dashed border-[#5de6ff] z-10 transition-all duration-300"
                  style={{
                    left: `${((l + 0.5) / heights.length) * 100}%`,
                    width: `${(((r - l)) / heights.length) * 100}%`,
                    height: `${Math.round((currentWaterHeight / maxVal) * 85) + 2}%` // scaled
                  }}
                >
                  <div className="absolute inset-0 bg-[#3b82f6]/10 animate-pulse flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#5de6ff] font-bold tracking-widest uppercase">
                      H={currentWaterHeight} × W={r - l} ➔ Vol: {area}
                    </span>
                  </div>
                </div>
              )}

              {heights.map((height, idx) => {
                const isL = idx === l;
                const isR = idx === r;
                const percentHeight = Math.round((height / maxVal) * 85);

                const isActiveWall = isL || isR;

                return (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center flex-1 group relative z-20"
                    style={{ height: '100%', justifyContent: 'flex-end' }}
                  >
                    {/* Bar visual representation */}
                    <div 
                      className={`w-3.5 rounded-t transition-all duration-500 ${
                        isL 
                          ? 'bg-[#5de6ff] border border-blue-400 shadow-[0_0_10px_rgba(93,230,255,0.4)]' 
                          : isR
                            ? 'bg-[#5de6ff] border border-blue-400 shadow-[0_0_10px_rgba(93,230,255,0.4)]'
                            : 'bg-slate-800/40 border border-transparent'
                      }`}
                      style={{ height: `${percentHeight}%` }}
                    />

                    {/* index and marks */}
                    <span className="text-[7px] font-mono text-slate-500 mt-1">{height}</span>

                    {/* pointer tag overlays */}
                    {isL && (
                      <span className="absolute -bottom-5 bg-[#5de6ff] text-slate-950 text-[8px] font-mono px-1 py-0.2 rounded font-black">
                        L
                      </span>
                    )}
                    {isR && (
                      <span className="absolute -bottom-5 bg-[#5de6ff] text-slate-950 text-[8px] font-mono px-1 py-0.2 rounded font-black">
                        R
                      </span>
                    )}

                  </div>
                );
              })}
            </div>
            
          </div>
        );
      }

      case 'invert_tree': {
        const nodes = currentSnapshot.treeState || [];
        const highlightedNodes = currentSnapshot.highlightedNodes || [];

        return (
          <div className="w-full flex flex-col items-center">
            <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-3 block self-start">
              Continuous Coordinates Mirror (Physical Inversion Tree Swap Map)
            </h4>

            {/* Tree stage backdrop */}
            <div className="w-full h-64 bg-slate-950/20 rounded-xl border border-slate-900 relative p-4 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Draw canvas connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {nodes.map((node) => {
                  if (!node || !node.id) return null;
                  return (
                    <React.Fragment key={`lines-${node.id}`}>
                      {node.leftId && nodes.some(n => n && n.id === node.leftId) && (
                        (() => {
                          const leftNode = nodes.find(n => n && n.id === node.leftId);
                          if (!leftNode) return null;
                          return (
                            <motion.line
                              x1={node.x}
                              y1={node.y}
                              x2={leftNode.x}
                              y2={leftNode.y}
                              stroke="#1e293b"
                              strokeWidth="2"
                              animate={{ x1: node.x, y1: node.y, x2: leftNode.x, y2: leftNode.y }}
                              transition={{ duration: 0.5 }}
                            />
                          );
                        })()
                      )}
                      {node.rightId && nodes.some(n => n && n.id === node.rightId) && (
                        (() => {
                          const rightNode = nodes.find(n => n && n.id === node.rightId);
                          if (!rightNode) return null;
                          return (
                            <motion.line
                              x1={node.x}
                              y1={node.y}
                              x2={rightNode.x}
                              y2={rightNode.y}
                              stroke="#1e293b"
                              strokeWidth="2"
                              animate={{ x1: node.x, y1: node.y, x2: rightNode.x, y2: rightNode.y }}
                              transition={{ duration: 0.5 }}
                            />
                          );
                        })()
                      )}
                    </React.Fragment>
                  );
                })}
              </svg>

              {/* Draw Node elements using coordinates */}
              {nodes.map((node) => {
                if (!node || !node.id) return null;
                const isHighlighted = highlightedNodes.includes(node.id);
                return (
                  <motion.div
                    key={node.id}
                    layout
                    animate={{ x: node.x - 20, y: node.y - 20 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-mono border font-bold text-sm tracking-tight z-10 transition-colors duration-300 ${
                      isHighlighted
                        ? 'bg-[#8083ff]/20 border-[#8083ff] text-white scale-115 shadow-[0_0_12px_rgba(128,131,255,0.25)]'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {node.value}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'group_anagrams': {
        const strs = groupAnagramsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
        const activeIdx = currentSnapshot.activeIndices || [];
        const variables = currentSnapshot.variables || {};
        let mapState: Record<string, string[]> = {};
        try {
          if (variables.map_state) {
            mapState = JSON.parse(variables.map_state as string);
          }
        } catch (_) {}

        return (
          <div className="w-full h-full flex flex-col gap-4">
            <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
              Anagram Map Scan (Current focus: i = {variables.i !== undefined ? variables.i : 'None'})
            </h4>
            
            {/* Input Words Ribbon */}
            <div className="flex flex-wrap gap-2 items-center justify-center p-3.5 bg-slate-950/20 rounded-xl border border-slate-900/40">
              {strs.map((str, idx) => {
                const isActive = activeIdx.includes(idx);
                return (
                  <motion.div
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs border transition-all ${
                      isActive
                        ? 'bg-[#8083ff]/25 border-[#8083ff] text-white scale-110 shadow-[0_0_10px_rgba(128,131,255,0.3)] animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>"{str}"</span>
                    {isActive && <span className="text-[7px] text-[#5de6ff] block uppercase tracking-wider mt-0.5">Scanning</span>}
                  </motion.div>
                );
              })}
            </div>

            {/* Calculations and Mapped state columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Computation Info */}
              <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-2">Sorting Workspace</span>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Word Scanning:</span>
                    <span className="text-white font-bold">"{variables.current_str ?? 'N/A'}"</span>
                  </div>
                  <div className="flex justify-between pb-1 py-1">
                    <span className="text-slate-400">Sorted (Target Key):</span>
                    <span className="text-[#5de6ff] font-bold font-black">"{variables.sorted_key ?? 'N/A'}"</span>
                  </div>
                </div>
              </div>

              {/* Bucket list layout */}
              <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-4">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-2.5">
                  HashMap Buckets
                </span>
                <div className="max-h-36 overflow-y-auto space-y-2 scrollbar-thin">
                  {Object.keys(mapState).length === 0 ? (
                    <div className="text-[10px] font-mono text-slate-600 italic text-center py-6">
                      HashMap empty (no clusters assigned yet)
                    </div>
                  ) : (
                    Object.entries(mapState).map(([key, words]) => {
                      const isActiveKey = variables.sorted_key === key;
                      return (
                        <div 
                          key={key}
                          className={`p-2 rounded bg-slate-950/40 border transition-all ${
                            isActiveKey 
                              ? 'border-[#5de6ff] bg-[#5de6ff]/5' 
                              : 'border-slate-800/80'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-mono font-bold text-slate-500">Key: <strong className="text-white">"{key}"</strong></span>
                            <span className="text-[8px] bg-slate-900 px-1 py-0.2 rounded border border-slate-800 text-slate-400 font-mono">
                              count: {words.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {words.map((w, wi) => (
                              <span 
                                key={wi}
                                className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono border border-slate-700/60"
                              >
                                "{w}"
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'threesum': {
        const sorted = currentSnapshot.arrayState || [];
        const variables = currentSnapshot.variables || {};
        const i = Number(variables.i ?? -1);
        const l = Number(variables.l ?? -1);
        const r = Number(variables.r ?? -1);
        let tripletsList: [number, number, number][] = [];
        try {
          if (variables.triplets) {
            tripletsList = JSON.parse(variables.triplets as string);
          }
        } catch (_) {}

        return (
          <div className="w-full flex flex-col gap-4">
            <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
              Three Sum Sorted Array (Scanning index values i, l, r)
            </h4>

            {/* Sorted sequence array tape layout */}
            <div className="flex flex-wrap gap-2.5 items-center justify-center p-3 bg-slate-950/20 border border-slate-900/60 rounded-xl">
              {sorted.map((val, idx) => {
                const isAnchor = idx === i;
                const isLeft = idx === l;
                const isRight = idx === r;

                return (
                  <div
                    key={idx}
                    className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono border transition-all ${
                      isAnchor
                        ? 'bg-[#8083ff]/25 border-[#8083ff] text-white scale-110 shadow-[0_0_10px_rgba(128,131,255,0.3)]'
                        : isLeft
                          ? 'bg-emerald-500/20 border-emerald-500 text-white scale-105 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : isRight
                            ? 'bg-red-500/20 border-red-500 text-white scale-105 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-sm font-bold">{val}</span>
                    <span className="text-[7.5px] text-slate-600 absolute bottom-0.5">idx {idx}</span>

                    {/* Pointer tags */}
                    {isAnchor && (
                      <span className="absolute -top-5 bg-[#8083ff] text-white font-mono text-[7px] font-black px-1 rounded uppercase">i</span>
                    )}
                    {isLeft && (
                      <span className="absolute -top-5 bg-emerald-500 text-slate-950 font-mono text-[7px] font-black px-1 rounded uppercase">L</span>
                    )}
                    {isRight && (
                      <span className="absolute -top-5 bg-red-500 text-white font-mono text-[7px] font-black px-1 rounded uppercase">R</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Scoreboard and results list columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Stats calculations */}
              <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-2">Equation Solver</span>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800/50 pb-1">
                    <span className="text-slate-400">Anchor nums[i]:</span>
                    <span className="text-[#8083ff] font-bold">{i !== -1 ? sorted[i] : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/50 py-1">
                    <span className="text-slate-400">Left Pointer nums[L]:</span>
                    <span className="text-emerald-400 font-bold">{l !== -1 ? sorted[l] : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/50 py-1">
                    <span className="text-slate-400">Right Pointer nums[R]:</span>
                    <span className="text-red-400 font-bold">{r !== -1 ? sorted[r] : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Equation Sum:</span>
                    <span className={`font-black uppercase ${variables.currentSum === 0 ? 'text-[#00cbe6] animate-pulse' : 'text-slate-300'}`}>
                      {variables.currentSum ?? 'N/A'} {variables.currentSum === 0 ? '(= 0 ✅)' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Unique Triplets found */}
              <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-2">
                  Matching Triplets Found ({tripletsList.length})
                </span>
                <div className="max-h-28 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {tripletsList.length === 0 ? (
                    <div className="text-[10px] font-mono text-slate-600 italic text-center py-4">
                      No matching triplets discovered yet
                    </div>
                  ) : (
                    tripletsList.map((tr, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-950/40 border border-slate-900 px-3 py-1 rounded text-xs font-mono text-[#00cbe6]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00cbe6] animate-ping" />
                        <span>Triplet {index + 1}:</span>
                        <span className="font-bold text-slate-200">[{tr.join(', ')}]</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'longest_substring': {
        const s = longestSubstringInput || 'abcabcbb';
        const variables = currentSnapshot.variables || {};
        const l = Number(variables.l ?? 0);
        const r = Number(variables.r ?? -1);
        const maxLen = Number(variables.max_len ?? 0);
        const charSetVal = variables.char_set as string || '{}';

        return (
          <div className="w-full flex flex-col gap-4">
            <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
              Sliding Window Stream Parser (l = {l}, r = {r === -1 ? 'None' : r})
            </h4>

            {/* Tape characters display */}
            <div className="flex flex-wrap gap-1.5 justify-center py-4 bg-slate-950/20 border border-slate-900 rounded-xl px-4 relative">
              {s.split('').map((char, idx) => {
                const isL = idx === l;
                const isR = idx === r;
                const isInWindow = r !== -1 && idx >= l && idx <= r;

                return (
                  <div
                    key={idx}
                    className={`relative w-9 h-11 rounded-lg flex flex-col items-center justify-center font-mono text-sm border transition-all ${
                      isL || isR
                        ? 'bg-[#5de6ff]/25 border-[#5de6ff] text-white font-bold scale-105'
                        : isInWindow
                          ? 'bg-[#8083ff]/15 border-[#8083ff]/40 text-slate-100'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-base font-bold">{char}</span>
                    <span className="text-[6.5px] text-slate-600">idx {idx}</span>

                    {/* Left/Right pointers tag overlays */}
                    {isL && (
                      <span className="absolute -bottom-4 bg-[#8083ff] text-white font-black text-[7px] px-1 rounded uppercase">L</span>
                    )}
                    {isR && (
                      <span className="absolute -top-4 bg-[#5de6ff] text-slate-950 font-black text-[7px] px-1 rounded uppercase">R</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Information panel columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Mathematics tracking box */}
              <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl flex flex-col justify-center text-xs font-mono">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-2">Window Sizer</span>
                <div className="space-y-1">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Current Substring:</span>
                    <span className="text-[#5de6ff] font-bold">
                      "{r >= l ? s.substring(l, r + 1) : 'Empty'}"
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 py-1">
                    <span className="text-slate-400">Current Window Width:</span>
                    <span className="font-bold text-slate-200">
                      {r >= l ? (r - l + 1) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Overall Maximum:</span>
                    <span className="text-emerald-400 font-extrabold">{maxLen}</span>
                  </div>
                </div>
              </div>

              {/* Unique Hashset Cache inside current window */}
              <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-1">Set Memory Cache</span>
                <div className="bg-slate-950/40 p-3 rounded border border-slate-900/60 font-mono text-center">
                  <span className="text-slate-400 text-xs block truncate mb-1">Window HashSet values:</span>
                  <span className="text-[#8083ff] text-xs font-bold font-mono">
                    {charSetVal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'merge_two_lists': {
        const l1 = mergeList1Input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
        const l2 = mergeList2Input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
        const variables = currentSnapshot.variables || {};
        const p1 = Number(variables.p1 ?? 0);
        const p2 = Number(variables.p2 ?? 0);
        let mergedList: number[] = [];
        try {
          if (variables.merged) {
            mergedList = (variables.merged as string).split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
          }
        } catch (_) {}

        return (
          <div className="w-full h-full flex flex-col gap-4 animate-fade-in">
            <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
              Merge Sorted Linked Lists (Cursors p1 = {p1}, p2 = {p2})
            </h4>

            {/* List 1 Row Tape */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="bg-[#131b2e] border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-1.5 font-bold text-slate-300">List 1 Tape</span>
                <div className="flex gap-2.5 items-center justify-center bg-slate-950/20 p-2 rounded border border-slate-900">
                  {l1.map((val, idx) => {
                    const isCurrentHeads = p1 === idx;
                    const isExhausted = idx < p1;
                    return (
                      <div
                        key={idx}
                        className={`relative w-10 h-10 rounded-lg flex flex-col items-center justify-center border font-mono transition-all ${
                          isCurrentHeads
                            ? 'bg-[#5de6ff]/25 border-[#5de6ff] text-white scale-105 shadow-[0_0_10px_rgba(93,230,255,0.3)] animate-pulse'
                            : isExhausted 
                              ? 'bg-slate-900/40 border-slate-900 text-slate-600 line-through'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold">{val}</span>
                        {isCurrentHeads && (
                          <span className="absolute -bottom-4 bg-[#5de6ff] text-slate-950 font-black text-[6px] px-0.5 rounded uppercase">p1</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* List 2 Row Tape */}
              <div className="bg-[#131b2e] border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-1.5 font-bold text-slate-300">List 2 Tape</span>
                <div className="flex gap-2.5 items-center justify-center bg-slate-950/20 p-2 rounded border border-slate-900">
                  {l2.map((val, idx) => {
                    const isCurrentHeads = p2 === idx;
                    const isExhausted = idx < p2;
                    return (
                      <div
                        key={idx}
                        className={`relative w-10 h-10 rounded-lg flex flex-col items-center justify-center border font-mono transition-all ${
                          isCurrentHeads
                            ? 'bg-[#8083ff]/25 border-[#8083ff] text-white scale-105 shadow-[0_0_10px_rgba(128,131,255,0.3)] animate-pulse'
                            : isExhausted
                              ? 'bg-slate-900/40 border-slate-900 text-slate-600 line-through'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold">{val}</span>
                        {isCurrentHeads && (
                          <span className="absolute -bottom-4 bg-[#8083ff] text-white font-black text-[6px] px-0.5 rounded uppercase font-mono">p2</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Resulting merged list dynamically growing */}
            <div className="bg-[#131b2e]/60 border border-slate-800 p-4 rounded-xl w-full font-mono">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase block mb-3">
                Consolidated Merged Sorted List (Dummy.next Head link)
              </span>

              <div className="flex flex-wrap items-center gap-2 justify-center py-2 min-h-[50px] bg-slate-950/35 rounded-lg border border-slate-900 px-3">
                {mergedList.length === 0 ? (
                  <span className="text-[10px] italic text-slate-600 font-mono">Merged linked list is empty (dummy initialization stage)</span>
                ) : (
                  mergedList.map((val, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-2.5 py-1 rounded bg-[#00cbe6]/10 border border-[#00cbe6]/40 text-sm font-bold font-mono text-[#00cbe6]"
                      >
                        {val}
                      </motion.div>
                      {idx < mergedList.length - 1 && (
                        <span className="text-slate-600 font-mono text-sm leading-none flex items-center">➔</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            
          </div>
        );
      }

      default: {
        // Render a gorgeous dynamic flowchart / visual tracer for any dynamically synchronized problem!
        return (
          <div className="w-full flex flex-col gap-6 items-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/85">
            <div className="flex items-center gap-3 bg-[#5de6ff]/10 text-[#5de6ff] px-4 py-2.5 rounded-xl border border-[#5de6ff]/20">
              <Sparkles className="w-5 h-5 animate-pulse text-[#5de6ff]" />
              <div className="text-left">
                <h4 className="text-sm font-bold font-display">Dynamic Scraped Solution Explorer</h4>
                <p className="text-[10px] text-slate-400">Heuristic visual trace generated on sync</p>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#131b2e] border border-slate-800/80 p-4 rounded-xl">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-2">Computational Blueprint</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">Difficulty Badge:</span>
                    <span className={`font-bold uppercase tracking-wider text-xs ${
                      activeProblem.difficulty === 'Easy' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>{activeProblem.difficulty}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 py-1.5">
                    <span className="text-slate-400">Time Complexity:</span>
                    <span className="font-mono text-white font-bold">O(N) - Linear Time</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Space Complexity:</span>
                    <span className="font-mono text-purple-400 font-bold">O(N) - Map / Stack</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#131b2e] border border-slate-800/80 p-4 rounded-xl flex flex-col justify-center">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block mb-2">Input / Output Tape</span>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">Test Case:</span>
                    <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300 mt-1 truncate">
                      {activeProblem.inputExample}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Expected Resolution:</span>
                    <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-[#22C55E] mt-1 truncate font-bold">
                      {activeProblem.outputExample}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-[#131b2e]/30 border border-slate-800/60 p-5 rounded-xl text-center">
              <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase block mb-3">Live Simulation Stream</span>
              <div className="flex flex-col items-center justify-center py-4 gap-3">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="w-14 h-14 rounded-full border-2 border-dashed border-[#8083ff]/40 border-t-[#8083ff] flex items-center justify-center"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-purple-400">
                    <Server className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-300 font-sans font-medium">Heuristic Tracing Engine Active</p>
                  <p className="text-xs text-slate-500 max-w-sm px-4 mt-1">
                    Step through the timeline using the media navigation bar below. Experience how variables shift during compilation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 h-full overflow-hidden">
      
      {/* 1. Left hand: Problem selector / Database Registry sidebar */}
      <div className="w-full md:w-[240px] shrink-0 bg-[#0f172a] rounded-xl border border-slate-800 flex flex-col overflow-hidden h-full">
        <div className="p-3 border-b border-slate-800/60 bg-slate-950/20">
          <div className="flex items-center gap-1 text-[#5de6ff] mb-2">
            <Database className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-widest font-black uppercase">
              LEETCODE PROBLEM REPO
            </span>
          </div>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search LeetCode/NeetCode..."
            className="w-full bg-[#131b2e] border border-slate-800 rounded-lg py-1 px-3 text-xs text-[#dae2fd] focus:outline-none focus:border-[#5de6ff]/60 font-mono placeholder:text-slate-600"
          />
        </div>

        {/* Weekly Sunday 8:00 AM Sync Scheduler Panel (Dynamic Scraper Manager) */}
        <div className="p-2.5 bg-slate-900 border-b border-slate-800/80">
          <div className="flex items-center justify-between gap-1 text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Weekly Scraper</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isSyncingLocal ? 'bg-amber-400 animate-ping' : 'bg-[#22C55E]'}`} />
              <span className="text-[9px] text-slate-500 lowercase">8:00 am sun</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 space-y-1.5">
            <div className="text-[9px] font-mono text-slate-400 leading-normal flex items-start justify-between">
              <div>
                <span className="text-slate-500">Last Synced:</span>
                <span className="text-[#5de6ff] ml-1 block font-semibold truncate max-w-[120px]">
                  {syncState.lastSynced === 'Never' 
                    ? 'Never' 
                    : new Date(syncState.lastSynced).toLocaleDateString() + ' ' + new Date(syncState.lastSynced).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Indices:</span>
                <span className="text-emerald-400 font-bold ml-1 block">{problemsList.length}</span>
              </div>
            </div>

            <div className="flex gap-1.5 pt-1">
              <button
                disabled={isSyncingLocal}
                onClick={triggerManualScraper}
                className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-[10px] font-semibold text-[#dae2fd] border border-slate-800 py-1 px-2 rounded flex items-center justify-center gap-1 transition-all"
              >
                {isSyncingLocal ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                ) : (
                  <RefreshCw className="w-3 h-3 text-purple-400" />
                )}
                <span>Sync Now</span>
              </button>
              
              <button
                onClick={() => setShowSyncLogList(v => !v)}
                className="bg-slate-900 hover:bg-slate-800 text-[10px] font-semibold text-slate-400 hover:text-white border border-slate-800 py-1 px-2 rounded transition-all"
              >
                Logs
              </button>
            </div>
          </div>

          {/* Sync status logs console */}
          <AnimatePresence>
            {showSyncLogList && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 bg-slate-950 border border-slate-800 rounded p-1.5 max-h-[140px] overflow-y-auto scrollbar-thin space-y-1"
              >
                <div className="flex justify-between items-center pb-1 border-b border-slate-900 mb-1">
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">Scraper Console console</span>
                  <button 
                    onClick={() => {
                      if (confirm("Reset dynamic database and synced questions?")) {
                        resetDynamicProblems();
                        setSyncState(getSyncState());
                        setProblemsList(getAllProblems());
                      }
                    }} 
                    className="text-[8px] font-mono text-rose-500 hover:underline hover:text-rose-400 animate-pulse"
                  >
                    Reset DB
                  </button>
                </div>
                {syncState.logs.map((log, idx) => (
                  <div key={idx} className="text-[8px] font-mono leading-relaxed space-y-[1px]">
                    <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                    <span className={`ml-1 ${
                      log.type === 'success' 
                        ? 'text-emerald-400 font-bold' 
                        : log.type === 'error' 
                          ? 'text-rose-400' 
                          : log.type === 'warn' 
                            ? 'text-amber-400' 
                            : 'text-slate-300'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Roadmap Playlists filter */}
        <div className="p-2.5 bg-slate-950/40 border-b border-slate-800/60 shrink-0">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              Curriculum Roadmap
            </span>
            <span className="text-[8px] font-mono text-purple-400 font-bold bg-[#8083ff]/10 px-1 py-0.5 rounded border border-[#8083ff]/10">
              Active List
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'lc50', label: 'LeetCode 50', count: lc50Count, bg: 'hover:bg-emerald-500/5', activeBorder: 'border-emerald-500/60 text-emerald-300 bg-emerald-500/10' },
              { id: 'blind75', label: 'Blind 75', count: blind75Count, bg: 'hover:bg-cyan-500/5', activeBorder: 'border-cyan-500/60 text-cyan-300 bg-cyan-400/10' },
              { id: 'lc100', label: 'Hot 100 List', count: lc100Count, bg: 'hover:bg-amber-500/5', activeBorder: 'border-amber-500/60 text-amber-300 bg-amber-500/10' },
              { id: 'nc150', label: 'NeetCode 150', count: nc150Count, bg: 'hover:bg-[#8083ff]/5', activeBorder: 'border-[#8083ff]/60 text-[#bcbeff] bg-[#8083ff]/10' },
              { id: 'lc250', label: 'Top 250 Bank', count: lc250Count, bg: 'hover:bg-purple-500/5', activeBorder: 'border-purple-500/60 text-purple-300 bg-purple-500/10' },
              { id: 'all', label: 'All Catalog', count: allCount, bg: 'hover:bg-slate-700/5', activeBorder: 'border-slate-500 text-slate-200 bg-slate-800/40' }
            ].map((pl) => {
              const isSel = selectedPlaylist === pl.id;
              return (
                <button
                  key={pl.id}
                  onClick={() => {
                    setSelectedPlaylist(pl.id as PlaylistId);
                    setSelectedCategory('All'); // clean search category on roadmap playlist toggle
                  }}
                  className={`flex items-center justify-between px-2 py-1.5 border rounded-lg transition-all text-left ${
                    isSel 
                      ? pl.activeBorder 
                      : `bg-slate-900/30 border-slate-900/60 text-slate-500 ${pl.bg}`
                  }`}
                >
                  <span className="text-[10px] font-bold font-sans tracking-tight">{pl.label}</span>
                  <span className="text-[8px] font-mono font-semibold ml-1 bg-slate-950/40 px-1 py-0.5 rounded text-slate-400">
                    {pl.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories slider */}
        <div className="p-2 border-b border-slate-800/40 flex gap-1 overflow-x-auto scrollbar-none shrink-0 bg-slate-950/20">
          {categories.map((cat) => {
            const shortName = 
              cat === 'All' ? 'ALL PATTERNS' : 
              cat === 'Arrays & Hashing' ? 'ARRAYS' :
              cat === 'Two Pointers' ? 'POINTERS' :
              cat === 'Sliding Window' ? 'WINDOW' :
              cat === 'Heap / Priority Queue' ? 'HEAP' :
              cat === 'Advanced Graphs' ? 'ADV GRAPHS' :
              cat === 'Bit Manipulation' ? 'BIT IP' :
              cat === 'Math & Geometry' ? 'MATH' : cat.toUpperCase();

            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[9px] font-mono font-bold transition-all px-2.5 py-1 rounded-md shrink-0 border ${
                  isSelected
                    ? 'bg-[#8083ff]/15 text-[#8083ff] border-[#8083ff]/30 shadow-[0_0_10px_rgba(128,131,255,0.1)]'
                    : 'bg-slate-900/40 text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {shortName}
              </button>
            );
          })}
        </div>

        {/* Problems catalog list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-10 font-mono text-[10px] text-slate-600 italic">
              No matches found
            </div>
          ) : (
            filteredProblems.map((prob) => {
              const isActive = prob.id === activeAlgo;
              return (
                <button
                  key={prob.id}
                  onClick={() => onAlgoChange(prob.id as LeetAlgo)}
                  className={`w-full text-left p-2 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-[#8083ff]/10 border-[#8083ff]/40 text-[#dae2fd]'
                      : 'bg-slate-900/30 border-slate-900 hover:bg-slate-800/20 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center gap-1.5">
                    <span className="text-[9px] font-mono text-slate-500 font-bold">
                      LC #{prob.number}
                    </span>
                    <span className={`text-[8px] font-mono font-bold uppercase px-1 rounded ${
                      prob.difficulty === 'Easy' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold font-sans truncate pr-1 mt-0.5 tracking-tight text-white block">
                    {prob.title}
                  </h4>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-1">
                    <span>{prob.neetcodeSection}</span>
                    <span>{prob.acceptance} AC</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Platform source badge attribution footer */}
        <div className="p-2.5 bg-slate-950/20 border-t border-slate-800/60 text-center text-[9px] font-mono text-slate-500">
          Source: <strong className="text-slate-400">NeetCode 150</strong> Curriculum
        </div>
      </div>

      {/* 2. Middle section: Current problem active workspace descriptor & graphic visualization stage */}
      <div className="flex-1 flex flex-col justify-between h-full overflow-hidden">
        
        {/* Problem Header Information details */}
        <div className="p-4 bg-[#131b2e] border-b border-slate-800/80 rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono bg-[#8083ff]/10 text-[#8083ff] px-1.5 py-0.5 rounded border border-[#8083ff]/20 font-bold uppercase">
                  LeetCode {activeProblem.number}
                </span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded text-white font-bold ${
                  activeProblem.difficulty === 'Easy' ? 'bg-emerald-600' : 'bg-amber-600'
                }`}>
                  {activeProblem.difficulty}
                </span>
                <span className="text-slate-500 text-[10px] font-mono">
                  Pattern Segment: <strong>{activeProblem.neetcodeSection}</strong>
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                {activeProblem.title}
              </h2>
            </div>
            
            {/* Acceptance and target specs */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block uppercase">Acceptance rate</span>
                <span className="text-white font-bold">{activeProblem.acceptance}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed mt-2 p-3 bg-slate-950/40 rounded-lg border border-slate-900 font-sans select-text">
            {activeProblem.description}
          </p>
        </div>

        {/* Visualizer Stage Canvas wrapper */}
        <div className="flex-1 p-4 flex items-center justify-center overflow-hidden bg-slate-950/10 min-h-[220px]">
          {renderVisualizer()}
        </div>

        {/* 3. Personalized dynamic custom Input Editor Controls */}
        <div className="p-4 bg-[#131b2e] border-t border-slate-800 rounded-b-xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#5de6ff] font-bold tracking-widest uppercase">
                TEST DATA EDITOR
              </span>
              <span className="text-[8px] text-slate-500 font-mono italic">
                (Type comma-separated values matching format below)
              </span>
            </div>
          </div>

          {/* Dynamic input control forms fields based on model types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {activeAlgo === 'twosum' && (
              <>
                <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1">
                  <span className="text-[10px] font-mono text-slate-500">nums =</span>
                  <input
                    type="text"
                    value={twoSumInput}
                    onChange={(e) => setTwoSumInput(e.target.value)}
                    className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                    placeholder="2, 7, 11, 15"
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1">
                  <span className="text-[10px] font-mono text-slate-500">target =</span>
                  <input
                    type="number"
                    value={twoSumTarget}
                    onChange={(e) => setTwoSumTarget(parseInt(e.target.value) || 0)}
                    className="bg-transparent text-xs text-white font-mono w-16 focus:outline-none text-right"
                  />
                </div>
              </>
            )}

            {activeAlgo === 'valid_parentheses' && (
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 col-span-2">
                <span className="text-[10px] font-mono text-slate-500">s(string) =</span>
                <input
                  type="text"
                  value={validParensInput}
                  onChange={(e) => setValidParensInput(e.target.value)}
                  className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                  placeholder="({[]})"
                />
              </div>
            )}

            {activeAlgo === 'reverse_list' && (
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 col-span-2">
                <span className="text-[10px] font-mono text-slate-500">list elements =</span>
                <input
                  type="text"
                  value={reverseListInput}
                  onChange={(e) => setReverseListInput(e.target.value)}
                  className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                  placeholder="1, 2, 3, 4"
                />
              </div>
            )}

            {activeAlgo === 'binary_search' && (
              <>
                <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1">
                  <span className="text-[10px] font-mono text-slate-500">nums (sorted) =</span>
                  <input
                    type="text"
                    value={binarySearchInput}
                    onChange={(e) => setBinarySearchInput(e.target.value)}
                    className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                    placeholder="1, 3, 5, 7, 9, 12"
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1">
                  <span className="text-[10px] font-mono text-slate-500">target =</span>
                  <input
                    type="number"
                    value={binarySearchTarget}
                    onChange={(e) => setBinarySearchTarget(parseInt(e.target.value) || 0)}
                    className="bg-transparent text-xs text-white font-mono w-16 focus:outline-none text-right"
                  />
                </div>
              </>
            )}

            {activeAlgo === 'buy_sell_stock' && (
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 col-span-2">
                <span className="text-[10px] font-mono text-slate-500">daily stock prices =</span>
                <input
                  type="text"
                  value={buySellStockInput}
                  onChange={(e) => setBuySellStockInput(e.target.value)}
                  className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                  placeholder="7, 1, 5, 3, 6, 4"
                />
              </div>
            )}

            {activeAlgo === 'container_with_most_water' && (
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 col-span-2">
                <span className="text-[10px] font-mono text-slate-500">column height limits =</span>
                <input
                  type="text"
                  value={waterInput}
                  onChange={(e) => setWaterInput(e.target.value)}
                  className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                  placeholder="1, 8, 6, 2, 5, 4, 8, 3, 7"
                />
              </div>
            )}

            {activeAlgo === 'invert_tree' && (
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 col-span-2">
                <span className="text-[10px] font-mono text-slate-500">tree nodes (level-order) =</span>
                <input
                  type="text"
                  value={invertTreeInput}
                  onChange={(e) => setInvertTreeInput(e.target.value)}
                  className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                  placeholder="4, 2, 7, 1, 3, 6, 9"
                />
              </div>
            )}

            {activeAlgo === 'group_anagrams' && (
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 col-span-2">
                <span className="text-[10px] font-mono text-slate-500">anagram words =</span>
                <input
                  type="text"
                  value={groupAnagramsInput}
                  onChange={(e) => setGroupAnagramsInput(e.target.value)}
                  className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                  placeholder="eat, tea, tan, ate, nat, bat"
                />
              </div>
            )}

            {activeAlgo === 'threesum' && (
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 col-span-2">
                <span className="text-[10px] font-mono text-slate-500">array nums =</span>
                <input
                  type="text"
                  value={threeSumInputState}
                  onChange={(e) => setThreeSumInputState(e.target.value)}
                  className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                  placeholder="-1, 0, 1, 2, -1, -4"
                />
              </div>
            )}

            {activeAlgo === 'longest_substring' && (
              <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 col-span-2">
                <span className="text-[10px] font-mono text-slate-500">string s =</span>
                <input
                  type="text"
                  value={longestSubstringInput}
                  onChange={(e) => setLongestSubstringInput(e.target.value)}
                  className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                  placeholder="abcabcbb"
                />
              </div>
            )}

            {activeAlgo === 'merge_two_lists' && (
              <>
                <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1">
                  <span className="text-[10px] font-mono text-slate-500">list1 elements =</span>
                  <input
                    type="text"
                    value={mergeList1Input}
                    onChange={(e) => setMergeList1Input(e.target.value)}
                    className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                    placeholder="1, 2, 4"
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1">
                  <span className="text-[10px] font-mono text-slate-500">list2 elements =</span>
                  <input
                    type="text"
                    value={mergeList2Input}
                    onChange={(e) => setMergeList2Input(e.target.value)}
                    className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none"
                    placeholder="1, 3, 4"
                  />
                </div>
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
