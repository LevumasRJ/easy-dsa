import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, RefreshCw, Layers, Sparkles, AlertTriangle, 
  Trash2, Cpu, FileJson, Play, Settings, Plus 
} from 'lucide-react';

type JvmModeType = 'memory_diagram' | 'hashmap_internals';

interface HeapObject {
  id: string;
  className: string;
  sizeBytes: number;
  referenced: boolean;
  fields: Record<string, string>;
}

interface HashMapNode {
  key: string;
  val: string;
  hash: number;
}

export default function JvmDeveloperMode({ triggerXp }: { triggerXp?: (x: number, reason: string) => void }) {
  const [activeTab, setActiveTab] = useState<JvmModeType>('memory_diagram');
  const [logFeed, setLogFeed] = useState<string>('JVM initialized & loading complete.');

  // Memory states
  const [heapObjects, setHeapObjects] = useState<HeapObject[]>([
    { id: '@0x5A4', className: 'java.lang.String', sizeBytes: 24, referenced: true, fields: { value: '"aistudio"' } },
    { id: '@0x1B8', className: 'com.algo.UserNode', sizeBytes: 56, referenced: true, fields: { name: '"rjlev"', level: '3' } },
    { id: '@0x3F2', className: 'java.util.UUID', sizeBytes: 128, referenced: false, fields: { bits: '0x992FEA' } },
    { id: '@0x712', className: 'java.util.ArrayList', sizeBytes: 1024, referenced: true, fields: { size: '42' } },
    { id: '@0x9E8', className: 'java.lang.StringBuffer', sizeBytes: 96, referenced: false, fields: { buffer: '"leak_data"' } },
  ]);

  const [stackFrames, setStackFrames] = useState<Array<{ method: string; line: number; locals: string }>>([
    { method: 'main()', line: 12, locals: 'args[]' },
    { method: 'initializeLearningEngine()', line: 45, locals: 'level=3, xp=420' },
    { method: 'generateSnapshots()', line: 112, locals: 'initialArr[9]' },
  ]);

  // HashMap States
  const [buckets, setBuckets] = useState<Record<number, HashMapNode[]>>({
    1: [{ key: 'user', val: 'rjlev', hash: 1021 }],
    3: [{ key: 'port', val: '3000', hash: 3123 }],
    5: [
      { key: 'env', val: 'prod', hash: 1105 },
      { key: 'api', val: 'v2', hash: 2153 } // Collision demonstration
    ],
    7: [{ key: 'db', val: 'firestore', hash: 9942 }]
  });
  const [insertKey, setInsertKey] = useState('');
  const [insertVal, setInsertVal] = useState('');

  const appendLogger = (msg: string) => {
    setLogFeed(msg);
  };

  // Run Garbage Collector Sweeper
  const runGarbageCollector = () => {
    // Audit active reference leaks
    const leakedCount = heapObjects.filter(obj => !obj.referenced).length;
    if (leakedCount === 0) {
      appendLogger('[JVM GC] No unreferenced leak candidate objects detected on Heap.');
      return;
    }

    setHeapObjects(prev => prev.filter(obj => obj.referenced));
    appendLogger(`[JVM GC] Reclaimed ${leakedCount} unreferenced objects from Young Gen Eden survivor space. Freed up memory chunks.`);
    if (triggerXp) {
      triggerXp(40, `Triggered JVM Mark-Sweep Garbage Collection cycle! 🧹`);
    }
  };

  // Create Heap object simulation allocation
  const allocateHeapObject = () => {
    const hex = '0x' + Math.floor(Math.random() * 4095).toString(16).toUpperCase();
    const newObj: HeapObject = {
      id: `@${hex}`,
      className: Math.random() > 0.5 ? 'java.lang.StringBuilder' : 'com.algo.CustomInstance',
      sizeBytes: Math.floor(Math.random() * 256) + 32,
      referenced: Math.random() > 0.3, // 70% chance of active link
      fields: { allocatedAt: '2026-05-29' }
    };
    setHeapObjects(prev => [...prev, newObj]);
    appendLogger(`[JVM Heap] Allocated 32-bit offset memory chunk for ${newObj.className} reference ${newObj.id}.`);
  };

  // Insert Map record key resolver
  const allocateHashMapRecord = () => {
    if (!insertKey.trim()) {
      appendLogger('[JVM HashMap] Validation failed: Please insert an alphabetical key.');
      return;
    }

    const key = insertKey.trim();
    const val = insertVal.trim() || 'null';
    
    // Hash generator simulator index = (n - 1) & hash
    const hash = key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 17;
    const bucketIdx = hash % 8; // Array size of 8 indices
    
    setBuckets(prev => {
      const next = { ...prev };
      const currentList = next[bucketIdx] ? [...next[bucketIdx]] : [];
      
      // Prevent duplicates
      const dupIdx = currentList.findIndex(n => n.key === key);
      if (dupIdx !== -1) {
        currentList[dupIdx].val = val;
        appendLogger(`[HashMap Override] Resolved Hash collision. Replaced value at Bucket [${bucketIdx}] for key: "${key}"`);
      } else {
        currentList.push({ key, val, hash });
        appendLogger(`[HashMap PUT] Key "${key}" mapped. HashCode: ${hash}. Resolves via (n-1)&hash into Bucket [${bucketIdx}]`);
      }
      next[bucketIdx] = currentList;
      return next;
    });

    setInsertKey('');
    setInsertVal('');

    if (triggerXp) {
      triggerXp(15, `Inserted Key into JVM HashMap Bucket [${bucketIdx}] Successfully`);
    }
  };

  return (
    <div id="jvm-developer-panel" className="w-full h-full flex flex-col bg-bg-panel border border-border-custom rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Visual top selector ribbon */}
      <div className="p-4 bg-bg-card/95 border-b border-border-custom flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h3 className="font-display font-black text-white text-sm sm:text-base tracking-tight">
            Java Developer Mode & JVM Engine Analyzer
          </h3>
        </div>

        {/* JVM micro live tracer */}
        <div className="bg-[#051408] border border-emerald-500/30 px-3 py-1 rounded-xl w-full sm:w-auto">
          <p className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            GC Console: {logFeed}
          </p>
        </div>
      </div>

      {/* Mode selectors */}
      <div className="px-4 py-2 bg-bg-panel/40 border-b border-border-custom flex gap-2">
        <button
          onClick={() => setActiveTab('memory_diagram')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'memory_diagram' 
              ? 'bg-emerald-600 text-white' 
              : 'text-text-muted hover:text-white border border-border-custom/40'
          }`}
        >
          JVM Heap & Stack Allocation
        </button>
        <button
          onClick={() => setActiveTab('hashmap_internals')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'hashmap_internals' 
              ? 'bg-emerald-600 text-white' 
              : 'text-text-muted hover:text-white border border-border-custom/40'
          }`}
        >
          HashMap Buckets (n-1)&hash Mapping
        </button>
      </div>

      {/* 3. Visual Stage */}
      <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto min-h-[300px]">
        
        {/* Render active layout diagram */}
        <div className="flex-1 flex items-stretch justify-center gap-4 mb-4">
          
          {activeTab === 'memory_diagram' ? (
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Stack Segment */}
              <div className="border border-border-custom bg-bg-card/45 rounded-xl p-3 flex flex-col">
                <span className="text-[9px] font-mono font-bold text-[#5de6ff] uppercase block mb-3">THREAD STACK FRAMES</span>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {stackFrames.map((frame, idx) => (
                    <div 
                      key={idx}
                      className="p-2 border border-border-custom bg-bg-panel text-white font-mono rounded-lg relative"
                    >
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1">
                        <span>Line {frame.line}</span>
                        {idx === 0 && <span className="bg-emerald-500/10 text-emerald-400 font-bold px-1.5 rounded text-[8px] uppercase">ACTIVE</span>}
                      </div>
                      <p className="text-xs font-bold font-mono text-emerald-400 truncate">{frame.method}</p>
                      <p className="text-[9px] text-zinc-400 mt-1">Locals: {frame.locals}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heap Segment */}
              <div className="border border-border-custom bg-bg-card/45 rounded-xl p-3 flex flex-col">
                <span className="text-[9px] font-mono font-bold text-amber-500 uppercase block mb-3">JVM HEAP SPACE (EDEN / SURVIVOR)</span>
                <div className="flex-1 space-y-2 overflow-y-auto max-h-[220px]">
                  {heapObjects.map((obj, idx) => (
                    <motion.div 
                      layout
                      key={obj.id}
                      className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between ${
                        obj.referenced 
                          ? 'bg-bg-panel border-border-custom text-white' 
                          : 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                      }`}
                    >
                      <div>
                        <span className="block font-bold text-slate-300 font-mono text-[10px]">{obj.className}</span>
                        <span className="text-[9px] text-zinc-500">{obj.id} | Size: {obj.sizeBytes}B</span>
                      </div>
                      <div className="text-right">
                        {obj.referenced ? (
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 py-0.2 rounded font-black">GC KEEP</span>
                        ) : (
                          <span className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1 py-0.2 rounded font-black animate-pulse">UNREFERENCED</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Metaspace / Garbage Collector triggers */}
              <div className="border border-border-custom bg-bg-card/45 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-purple-400 uppercase block mb-3">METASPACE & CLASSPATHS</span>
                  <div className="p-3 bg-bg-panel/60 rounded-lg space-y-2 text-[10px] font-mono text-zinc-400 leading-relaxed">
                    <p>● Loaded classes count: <strong className="text-white">1,424 System Classes</strong></p>
                    <p>● JIT Compiler: <strong className="text-white">HotSpot Tiered (Active)</strong></p>
                    <p>● String Constant Pool: <strong className="text-[#5de6ff]">"aistudio", "orb", "dev_3000"</strong></p>
                    <p>● JVM Flag parameters: <strong className="text-amber-400">-XX:+UseG1GC -XX:MaxMetaspaceSize=256m</strong></p>
                  </div>
                </div>

                <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2 mt-4">
                  <div className="flex gap-2 items-center text-[10px] text-rose-400 font-black font-mono">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>EDEN SURVIVOR ACCUMULATION WARN</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-tight">Unreferenced classes memory leak hazard detected in thread runtime pools.</p>
                </div>
              </div>

            </div>
          ) : (
            // HashMap Buckets Mapping Section
            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* HashMap parameters board */}
              <div className="p-3 border border-border-custom bg-bg-card/45 rounded-xl flex flex-col justify-between font-mono text-[10px] text-zinc-400 leading-relaxed">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-2">HASHMAP TUNNING PARAMETERS</span>
                  <p>● Array Initial Capacity: <strong className="text-white">16 slots</strong></p>
                  <p>● Load Factor Limit: <strong className="text-white">0.75 ratio</strong></p>
                  <p>● Dynamic Threshold: <span className="text-amber-400 font-bold">12 entries before rehash</span></p>
                  <p>● Treeify Threshold: <strong className="text-red-400 bg-red-400/10 px-1 rounded">TREEIFY_THRESHOLD = 8</strong></p>
                </div>

                <div className="mt-3 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-[9px]">
                  <p className="text-emerald-400">Formula resolved index location:</p>
                  <code className="block bg-bg-panel p-1 rounded mt-1 font-bold text-slate-300">index = (n - 1) & hash;</code>
                </div>
              </div>

              {/* Bucket list visual representation */}
              <div className="md:col-span-3 border border-border-custom bg-bg-card/45 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-3">INTERNAL ARRAY BUCKETS & LINKED LIST CHAINS</span>
                
                {/* Visual slot row */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[220px]">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((bucketIdx) => {
                    const listNodes = buckets[bucketIdx] || [];
                    const hasCollision = listNodes.length > 1;

                    return (
                      <div key={bucketIdx} className="flex items-center gap-2 border-b border-slate-800/40 pb-2">
                        {/* Bucket pointer */}
                        <div className="w-16 h-8 bg-bg-panel border border-border-custom/80 flex flex-col items-center justify-center font-mono text-[10px] rounded-lg text-emerald-400 shrink-0 uppercase font-black">
                          <span>Bucket</span>
                          <span className="font-bold text-slate-400 font-mono">[{bucketIdx}]</span>
                        </div>

                        {/* Linked node chain */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                          {listNodes.map((node, nIdx) => (
                            <React.Fragment key={nIdx}>
                              {nIdx > 0 && <span className="text-emerald-500">→</span>}
                              <div className={`px-2 py-1 h-7 rounded border font-mono text-[9px] text-[#2a3042] flex items-center gap-1.5 shrink-0 ${
                                nIdx > 0 ? 'bg-amber-400 border-amber-500 text-bg-app' : 'bg-slate-300 border-border-custom'
                              }`}>
                                <span className="font-bold text-[10px]">Key: "{node.key}"</span>
                                <span className="text-[#3c3a4f] opacity-70">Val: {node.val}</span>
                                <span className="text-zinc-600">| #{node.hash}</span>
                              </div>
                            </React.Fragment>
                          ))}

                          {listNodes.length === 0 && (
                            <span className="text-zinc-600 text-[9px] font-semibold italic">null</span>
                          )}

                          {hasCollision && (
                            <span className="text-[8px] bg-red-400/20 text-red-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-tight animate-pulse ml-2">
                              Collision detected
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Console Action Bar row */}
        <div className="p-3 bg-bg-card/70 border border-border-custom rounded-xl flex flex-col sm:flex-row items-center gap-3">
          {activeTab === 'memory_diagram' ? (
            <div className="w-full flex justify-between gap-3 flex-wrap">
              <button 
                onClick={allocateHeapObject}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-black py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Allocate Heap Object (.new)
              </button>

              <button 
                onClick={runGarbageCollector}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-black py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_12px_rgba(239,68,68,0.25)]"
              >
                <Trash2 className="w-4 h-4" /> Trigger Garbage Collection Sweep (GCCycle)
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3">
              <div className="flex gap-2 w-full sm:flex-1">
                <input 
                  type="text"
                  value={insertKey}
                  onChange={e => setInsertKey(e.target.value)}
                  placeholder="Insert Key (e.g., config)..."
                  className="bg-bg-panel border border-border-custom/80 focus:border-emerald-600 px-3 py-1.5 w-1/2 rounded-xl text-xs text-white"
                />
                <input 
                  type="text"
                  value={insertVal}
                  onChange={e => setInsertVal(e.target.value)}
                  placeholder="Insert Value (e.g., aistudio)..."
                  className="bg-bg-panel border border-border-custom/80 focus:border-emerald-600 px-3 py-1.5 w-1/2 rounded-xl text-xs text-white"
                />
              </div>

              <button 
                onClick={allocateHashMapRecord}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-black py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer shrink-0 transition-all"
              >
                Put Map Entry (.put)
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
