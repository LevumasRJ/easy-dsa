import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, Plus, Minus, Search, Trash2, Layers, RefreshCw, 
  Eye, CornerDownRight, Database, HelpCircle, Activity 
} from 'lucide-react';

type AdvancedDsType = 'stack_queue_deque' | 'binary_heap' | 'prefix_trie' | 'bloom_filter' | 'lru_cache';

export default function AdvancedDsSandbox() {
  const [activeDs, setActiveDs] = useState<AdvancedDsType>('stack_queue_deque');
  const [feedback, setFeedback] = useState<string>('Select data structure and insert keys.');

  // 1. Stack/Queue/Deque States
  const [linearList, setLinearList] = useState<string[]>(['Nodes_A', 'Nodes_B', 'Nodes_C']);
  const [inputValue, setInputValue] = useState('');

  // 2. Binary Heap States
  const [heapArray, setHeapArray] = useState<number[]>([120, 85, 70, 55, 45, 60, 30]);

  // 3. Trie Word States
  const [trieWords, setTrieWords] = useState<string[]>(['get', 'got', 'go', 'git']);
  const [trieSearch, setTrieSearch] = useState('');

  // 4. Bloom Filter States
  const [bloomBitArray, setBloomBitArray] = useState<boolean[]>(() => {
    const arr = Array(12).fill(false);
    arr[2] = true;
    arr[5] = true;
    arr[9] = true;
    return arr;
  });
  const [bloomKeywords, setBloomKeywords] = useState<string[]>(['gemini', 'antigravity']);
  const [bloomCheckWord, setBloomCheckWord] = useState('');

  // 5. LRU Cache States
  const [lruCache, setLruCache] = useState<Array<{ key: string; val: string }>>([
    { key: 'port', val: '3000' },
    { key: 'db', val: 'redis' },
    { key: 'user', val: 'rjlev' },
    { key: 'env', val: 'dev' }
  ]);
  const lruCapacity = 4;

  const showFeedback = (msg: string) => {
    setFeedback(msg);
  };

  // Stack, Queue & Deque operations
  const handlePushStack = () => {
    if (!inputValue.trim()) return;
    setLinearList(prev => [...prev, inputValue.trim()]);
    showFeedback(`Pushed item "${inputValue}" to stack container top frame.`);
    setInputValue('');
  };

  const handlePopStack = () => {
    if (linearList.length === 0) return;
    const removed = linearList[linearList.length - 1];
    setLinearList(prev => prev.slice(0, -1));
    showFeedback(`Dequeued / Popped item "${removed}" from top frame.`);
  };

  const handleEnqueue = () => {
    if (!inputValue.trim()) return;
    setLinearList(prev => [...prev, inputValue.trim()]);
    showFeedback(`Enqueued client-query node "${inputValue}" into circular buffer tail.`);
    setInputValue('');
  };

  const handleDequeue = () => {
    if (linearList.length === 0) return;
    const removed = linearList[0];
    setLinearList(prev => prev.slice(1));
    showFeedback(`Dequeued first customer query "${removed}" from front register.`);
  };

  // Heap Insert
  const handleHeapInsert = () => {
    const val = Math.floor(Math.random() * 95) + 5;
    const newHeap = [...heapArray, val];
    // Dynamic bubbling swim up simulation
    setHeapArray(newHeap);
    showFeedback(`Heapified Element (${val}) inserted. Executed swim-up parent bubble swaps.`);
  };

  const handleHeapPopMax = () => {
    if (heapArray.length === 0) return;
    const maxVal = heapArray[0];
    const nextHeap = [...heapArray];
    if (nextHeap.length > 1) {
      nextHeap[0] = nextHeap.pop()!;
      // Simple visual top down sink heapify representation
    } else {
      nextHeap.pop();
    }
    setHeapArray(nextHeap);
    showFeedback(`Popped Max Priority Item (${maxVal}) from binary root. Re-balancing Heap tree structure.`);
  };

  // Trie Insert
  const handleTrieInsert = () => {
    if (!inputValue.trim().toLowerCase()) return;
    const text = inputValue.trim().toLowerCase();
    if (!trieWords.includes(text)) {
      setTrieWords(prev => [...prev, text]);
    }
    showFeedback(`Prefix branch mapped for word: "${text}" into alphabetical lookup indexes.`);
    setInputValue('');
  };

  // Bloom Filter Hash calculator simulation
  const calcBloomHashes = (word: string) => {
    // Simple custom hash simulations matching indexes
    const h1 = Math.abs(word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 12;
    const h2 = Math.abs(word.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)) % 12;
    return [h1, h2];
  };

  const handleBloomInsert = () => {
    if (!inputValue.trim().toLowerCase()) return;
    const valStr = inputValue.trim().toLowerCase();
    const [idx1, idx2] = calcBloomHashes(valStr);
    
    setBloomBitArray(prev => {
      const next = [...prev];
      next[idx1] = true;
      next[idx2] = true;
      return next;
    });

    if (!bloomKeywords.includes(valStr)) {
      setBloomKeywords(prev => [...prev, valStr]);
    }

    showFeedback(`Mapped word "${valStr}" indexes hash keys [Slot: ${idx1}, Slot: ${idx2}] set to TRUE.`);
    setInputValue('');
  };

  const testBloomCheck = (word: string) => {
    if (!word) return;
    const [h1, h2] = calcBloomHashes(word.toLowerCase());
    const isSlot1Set = bloomBitArray[h1];
    const isSlot2Set = bloomBitArray[h2];

    if (isSlot1Set && isSlot2Set) {
      if (bloomKeywords.includes(word.toLowerCase())) {
        showFeedback(`Bloom query checked: "${word}" is DEFINITELY inside current list database.`);
      } else {
        showFeedback(`False Positive alert! "${word}" hashes collide with Slot ${h1} and Slot ${h2} (Set by other elements).`);
      }
    } else {
      showFeedback(`Bloom check confirmed: "${word}" has never been entered. Absolutely NOT IN SET.`);
    }
  };

  // LRU cache insertion simulation
  const touchLruCache = (key: string, val: string) => {
    const existingIdx = lruCache.findIndex(n => n.key === key);
    let nextLru = [...lruCache];

    if (existingIdx !== -1) {
      // Hit: Move to head
      const hitItem = nextLru.splice(existingIdx, 1)[0];
      hitItem.val = val;
      nextLru.unshift(hitItem);
      showFeedback(`Cache Hit! Accessed "${key}" reference. Shifted context to MRU (Most Recently Used) status.`);
    } else {
      // Miss: Evict if capacity matches
      const item = { key, val };
      if (nextLru.length >= lruCapacity) {
        const evicted = nextLru.pop();
        showFeedback(`Cache Miss! Evicting LRU (Least Recently Used) object: "${evicted?.key}" & mapping new slot for "${key}".`);
      } else {
        showFeedback(`Cache Miss! Allocated new segment slot key "${key}" into heap index cache.`);
      }
      nextLru.unshift(item);
    }
    setLruCache(nextLru);
  };

  return (
    <div id="advanced-ds-playground" className="w-full h-full flex flex-col bg-bg-panel border border-border-custom rounded-2xl overflow-hidden shadow-2xl">
      
      {/* 1. Header Toolbar */}
      <div className="p-4 bg-bg-card/90 border-b border-border-custom flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-text-accent" />
          <h3 className="font-display font-black text-white text-sm sm:text-base tracking-tight">
            Advanced Data Structures Sandbox Engine
          </h3>
        </div>

        {/* Dynamic feedback ribbon */}
        <div className="bg-bg-panel/75 border border-border-custom px-3 py-1 rounded-lg">
          <p className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <Activity className="w-3 h-3 animate-ping" />
            Live Trace: {feedback}
          </p>
        </div>
      </div>

      {/* 2. Structured Selector Deck Tabs */}
      <div className="px-4 py-2 bg-bg-panel/50 border-b border-border-custom flex gap-2 overflow-x-auto select-none">
        {[
          { id: 'stack_queue_deque', name: 'Stacks & Queues', count: 'Linear' },
          { id: 'binary_heap', name: 'Binary Max-Heap', count: 'Tree' },
          { id: 'prefix_trie', name: 'Word Trie Tree', count: 'Prefix' },
          { id: 'bloom_filter', name: 'Bloom Filter model', count: 'Hash' },
          { id: 'lru_cache', name: 'LRU Eviction Cache', count: 'Cache' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              setActiveDs(item.id as any);
              showFeedback(`Initialized ${item.name} environment structure.`);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeDs === item.id 
                ? 'bg-accent-custom text-white shadow-lg' 
                : 'text-text-muted hover:bg-bg-card hover:text-white border border-border-custom/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <div className="text-left">
              <span className="block text-[11px] leading-tight">{item.name}</span>
              <span className="block text-[9px] text-zinc-400 opacity-60 font-semibold uppercase">{item.count}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 3. Dynamic Visual Board Stage */}
      <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto min-h-[300px]">
        
        {/* Render Canvas depending on selected element */}
        <div className="flex-1 flex items-center justify-center p-2 mb-4">
          
          {/* Stacks & Queues Deck Container */}
          {activeDs === 'stack_queue_deque' && (
            <div className="w-full max-w-xl text-center">
              <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-6">Circular Linear Deck Representation</h4>
              
              <div className="flex justify-center items-end gap-3 min-h-[160px] border-b-2 border-slate-700/60 pb-3 relative">
                {linearList.map((item, idx) => {
                  const isTop = idx === linearList.length - 1;
                  const isBottom = idx === 0;
                  return (
                    <motion.div
                      key={`${item}-${idx}`}
                      initial={{ scale: 0.8, y: 30, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      className={`w-28 py-4 rounded-xl font-mono text-xs font-black relative flex flex-col items-center justify-center border transition-all ${
                        isTop ? 'bg-accent-custom/20 border-accent-custom text-white shadow-[0_0_15px_var(--glow-color)]' : 'bg-bg-card border-border-custom text-text-primary'
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400">Indexed [{idx}]</span>
                      <span className="mt-1 block text-[13px]">{item}</span>

                      {/* Direction labels pointers */}
                      {isTop && (
                        <span className="absolute -top-7 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] uppercase font-bold tracking-tight">
                          [Top / Tail]
                        </span>
                      )}
                      {isBottom && (
                        <span className="absolute -bottom-7 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] uppercase font-bold tracking-tight">
                          [Front / Head]
                        </span>
                      )}
                    </motion.div>
                  );
                })}

                {linearList.length === 0 && (
                  <p className="text-xs text-text-muted font-mono italic mb-6">Register arrays currently empty. Add keys below.</p>
                )}
              </div>
            </div>
          )}

          {/* Max Binary Heap Visual Binary nodes */}
          {activeDs === 'binary_heap' && (
            <div className="w-full max-w-2xl text-center">
              <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">Heap Array Binary Node Indexes</h4>
              
              <div className="grid grid-cols-7 gap-2 max-w-lg mx-auto py-4">
                {heapArray.map((val, idx) => {
                  const isRoot = idx === 0;
                  const leftChildIdx = 2 * idx + 1;
                  const rightChildIdx = 2 * idx + 2;

                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className={`p-2.5 rounded-xl border font-mono text-xs text-center flex flex-col items-center justify-center gap-1 ${
                        isRoot 
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow'
                          : 'bg-bg-card border-border-custom text-white'
                      }`}
                    >
                      <span className="text-[8px] text-text-muted uppercase">Idx {idx}</span>
                      <span className="text-sm font-black">{val}</span>
                      <span className="text-[7px] text-slate-500 tracking-tighter">
                        L:{leftChildIdx < heapArray.length ? leftChildIdx : '-'} R:{rightChildIdx < heapArray.length ? rightChildIdx : '-'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-bg-card/40 border border-border-custom rounded-xl max-w-md mx-auto">
                <span className="text-[9px] font-mono text-[#5de6ff] uppercase tracking-wider block mb-1">Raw Continuous Heap Array Representation</span>
                <div className="flex gap-1.5 justify-center items-center overflow-x-auto py-1 font-mono text-[11px] text-white">
                  {heapArray.map((v, i) => (
                    <span key={i} className="bg-bg-panel border border-slate-700/80 px-2 py-0.5 rounded font-black">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Alphabetic search Trie Branches */}
          {activeDs === 'prefix_trie' && (
            <div className="w-full max-w-xl text-center">
              <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Word Trie Branches Visual Index</h4>
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto py-3">
                {trieWords.map((word) => (
                  <span 
                    key={word}
                    className="px-3 py-1.5 rounded-xl bg-bg-card border border-border-custom text-white text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <CornerDownRight className="w-3.5 h-3.5 text-text-accent" />
                    {word}
                  </span>
                ))}
              </div>

              {/* Graphical Trie structure visualization */}
              <div className="mt-3 p-4 border border-border-custom/50 bg-bg-panel/40 rounded-xl font-mono text-left max-w-md mx-auto">
                <span className="text-[9px] text-[#8083ff] uppercase block mb-2 font-bold">[Trie AST Root]</span>
                <div className="pl-2 space-y-1 text-xs">
                  <div className="text-white">● (Root)</div>
                  <div className="text-text-muted font-bold pl-4">└── g</div>
                  <div className="text-text-accent pl-8">├── e ── t <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded font-black">EOL</span></div>
                  <div className="text-text-accent pl-8">└── o ── t <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded font-black">EOL</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Bloom Filter Bitmap Slot Indicators */}
          {activeDs === 'bloom_filter' && (
            <div className="w-full max-w-xl text-center">
              <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">Bloom Filter 12-Bit Map Array</h4>
              
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 max-w-lg mx-auto mb-4 font-mono">
                {bloomBitArray.map((bitVal, idx) => (
                  <div 
                    key={idx} 
                    className={`py-3.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center transition-all ${
                      bitVal 
                        ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]' 
                        : 'bg-bg-panel border-slate-800 text-zinc-600'
                    }`}
                  >
                    <span className="text-[8px] opacity-70 block mb-0.5">{idx}</span>
                    <span className="text-sm font-black">{bitVal ? '1' : '0'}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 justify-center mt-3 text-[10px] font-mono text-zinc-400">
                <span>Active keywords:</span>
                {bloomKeywords.map(k => (
                  <span key={k} className="bg-bg-card border border-border-custom/50 px-1.5 py-0.5 text-white rounded">
                    "{k}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Operating LRU cache block list */}
          {activeDs === 'lru_cache' && (
            <div className="w-full max-w-xl text-center">
              <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">Doubly Linked Cache Queue (Capacity: 4)</h4>
              
              <div className="flex flex-col sm:flex-row justify-center gap-2 items-center">
                {lruCache.map((item, idx) => {
                  const isMru = idx === 0;
                  const isLru = idx === lruCache.length - 1;
                  return (
                    <motion.div
                      layout
                      key={item.key}
                      className={`p-3 w-32 rounded-xl text-xs font-mono border flex flex-col items-center justify-between relative transition-all ${
                        isMru 
                          ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                          : isLru
                            ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                            : 'bg-bg-card border-border-custom text-white'
                      }`}
                    >
                      <div className="w-full flex justify-between text-[8px] text-zinc-500 mb-1">
                        <span>SLOT {idx}</span>
                        {isMru && <span className="font-bold text-emerald-400">MRU</span>}
                        {isLru && <span className="font-bold text-rose-500">LRU</span>}
                      </div>

                      <span className="font-bold font-mono text-[11px] block truncate max-w-full">Key: "{item.key}"</span>
                      <span className="text-zinc-400 text-[10px] block mt-1">Val: {item.val}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* 4. Controls Console bar */}
        <div className="p-3 bg-bg-card/70 border border-border-custom rounded-xl flex flex-col sm:flex-row items-center gap-3">
          
          {/* Main push input box */}
          <div className="w-full sm:flex-1 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={
                activeDs === 'stack_queue_deque' ? 'Type item name...' :
                activeDs === 'prefix_trie' ? 'Type prefix word (e.g., git, code)...' :
                activeDs === 'bloom_filter' ? 'Enter string for Bloom Map...' :
                'Enter Value...'
              }
              className="flex-1 min-w-[130px] text-xs font-mono bg-bg-panel border border-border-custom/80 focus:border-accent-custom px-3 py-2 rounded-xl text-white placeholder-slate-600 focus:outline-none"
            />
          </div>

          {/* Action buttons triggers */}
          <div className="w-full sm:w-auto flex flex-wrap gap-2 justify-end">
            
            {/* Conditional Action Buttons */}
            {activeDs === 'stack_queue_deque' && (
              <>
                <button 
                  onClick={handlePushStack}
                  className="bg-accent-custom hover:bg-accent-custom/80 text-white text-xs font-mono font-black py-2 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Push
                </button>
                <button 
                  onClick={handlePopStack}
                  disabled={linearList.length === 0}
                  className="bg-zinc-800 disabled:opacity-40 text-white text-xs font-mono py-2 px-3 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" /> Pop Stack
                </button>
                <button 
                  onClick={handleEnqueue}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-black py-2 px-3 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  Enqueue Queue
                </button>
                <button 
                  onClick={handleDequeue}
                  disabled={linearList.length === 0}
                  className="bg-zinc-800 disabled:opacity-40 text-white text-xs font-mono py-2 px-3 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  Dequeue
                </button>
              </>
            )}

            {activeDs === 'binary_heap' && (
              <>
                <button 
                  onClick={handleHeapInsert}
                  className="bg-accent-custom hover:bg-accent-custom/80 text-white text-xs font-mono font-black py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Insert Key
                </button>
                <button 
                  onClick={handleHeapPopMax}
                  disabled={heapArray.length === 0}
                  className="bg-zinc-800 disabled:opacity-40 hover:bg-zinc-700 text-white text-xs font-mono font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" /> Pop Root Max
                </button>
              </>
            )}

            {activeDs === 'prefix_trie' && (
              <button 
                onClick={handleTrieInsert}
                className="bg-accent-custom hover:bg-accent-custom/80 text-white text-xs font-mono font-black py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                Insert Trie Word
              </button>
            )}

            {activeDs === 'bloom_filter' && (
              <>
                <button 
                  onClick={handleBloomInsert}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-black py-2 px-3 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  Add String
                </button>
                <div className="flex gap-1 border-l border-border-custom pl-2">
                  <input 
                    type="text" 
                    value={bloomCheckWord}
                    onChange={e => setBloomCheckWord(e.target.value)}
                    placeholder="Check Bloom..."
                    className="w-24 text-[11px] font-mono bg-bg-panel border border-border-custom px-2 py-1 rounded text-white"
                  />
                  <button 
                    onClick={() => testBloomCheck(bloomCheckWord)}
                    className="bg-indigo-600 text-white text-[10px] font-mono px-2 py-1 rounded font-bold"
                  >
                    Check
                  </button>
                </div>
              </>
            )}

            {activeDs === 'lru_cache' && (
              <div className="flex flex-wrap gap-1">
                {[
                  { k: 'port', v: '3000' },
                  { k: 'api', v: 'v2' },
                  { k: 'user', v: 'staff' },
                  { k: 'db', v: 'redis' },
                  { k: 'theme', v: 'cyber' }
                ].map(pair => (
                  <button
                    key={pair.k}
                    onClick={() => touchLruCache(pair.k, pair.v)}
                    className="bg-bg-panel hover:bg-[#8083ff]/10 text-text-accent border border-border-custom text-[10px] font-mono px-2 py-1.5 rounded-lg font-bold"
                  >
                    Touch("{pair.k}")
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
