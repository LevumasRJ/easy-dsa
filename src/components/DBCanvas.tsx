import React, { useState, useEffect } from 'react';
import { Database, FileText, HardDrive, RefreshCw, Terminal, Layers, ArrowRight, CheckCircle2, Search, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Snapshot, DBState, DBBTreeNode, DBWALEntry } from '../types';
import { soundSynth } from '../utils/soundSynthesizer';

interface DBCanvasProps {
  currentSnapshot?: Snapshot;
  onSnapshotsGenerated: (snapshots: Snapshot[]) => void;
}

export type DBScenarioId = 'btree_search' | 'btree_split' | 'wal_pipeline' | 'query_optimizer';

interface ScenarioMeta {
  id: DBScenarioId;
  title: string;
  focus: string;
  badge: string;
  desc: string;
}

const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'btree_search',
    title: 'B+ Tree Index Walk (Key Search)',
    focus: 'Indexing & Storage',
    badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    desc: 'Multi-tier pointer traversal narrowing search boundaries down to leaf disk page'
  },
  {
    id: 'btree_split',
    title: 'B+ Tree Node Split & Promotion',
    focus: 'Page Rebalancing',
    badge: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    desc: 'Leaf node overflow triggering middle key promotion to parent index page'
  },
  {
    id: 'wal_pipeline',
    title: 'WAL (Write-Ahead Log) & ACID Pipeline',
    focus: 'Crash Recovery & Durability',
    badge: 'border-[#5de6ff]/30 text-[#5de6ff] bg-[#5de6ff]/10',
    desc: 'Memory buffer commit -> sequential disk append -> asynchronous page flush'
  },
  {
    id: 'query_optimizer',
    title: 'Query Plan: Index Scan vs Full Table Scan',
    focus: 'Query Optimization',
    badge: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    desc: 'Cost-based query execution plan fork comparing I/O page reads'
  }
];

export function generateDBSnapshots(scenarioId: DBScenarioId): Snapshot[] {
  if (scenarioId === 'btree_search') {
    const rootNode: DBBTreeNode = { id: 'root', keys: [50], isLeaf: false, x: 280, y: 30, isActive: false };
    const leftChild: DBBTreeNode = { id: 'left_child', keys: [20, 35], isLeaf: false, x: 120, y: 130, isActive: false };
    const rightChild: DBBTreeNode = { id: 'right_child', keys: [70, 85], isLeaf: false, x: 440, y: 130, isActive: false };
    const leaf1: DBBTreeNode = { id: 'leaf_1', keys: [5, 12], isLeaf: true, nextLeafId: 'leaf_2', x: 40, y: 240, isActive: false };
    const leaf2: DBBTreeNode = { id: 'leaf_2', keys: [20, 30], isLeaf: true, nextLeafId: 'leaf_3', x: 180, y: 240, isActive: false };
    const leaf3: DBBTreeNode = { id: 'leaf_3', keys: [35, 42], isLeaf: true, nextLeafId: 'leaf_4', x: 320, y: 240, isActive: false };
    const leaf4: DBBTreeNode = { id: 'leaf_4', keys: [70, 80], isLeaf: true, nextLeafId: null, x: 460, y: 240, isActive: false };

    const initialNodes = [rootNode, leftChild, rightChild, leaf1, leaf2, leaf3, leaf4];

    return [
      {
        lineHighlighted: 1,
        actionType: 'init',
        explanation: 'User executes query: "SELECT * FROM users WHERE id = 30". Database engine initiates B+ Tree index lookup starting at Root Node.',
        dbState: {
          scenario: 'B+ Tree Index Walk',
          bTreeNodes: initialNodes.map(n => n.id === 'root' ? { ...n, isActive: true } : n),
          walLog: [],
          bufferPool: [{ pageId: 1, table: 'users_idx_root', isDirty: false, lruRank: 1 }],
          diskPages: [{ pageId: 1, keys: [50], flushed: true }]
        },
        variables: { targetKey: 30, searchLevel: 'Root (Depth 0)', nodeComparison: '30 < 50 (Follow Left Pointer)' },
        consoleOutput: '[B+ TREE] Inspecting Root [50]. Target 30 < 50 -> Routing to left child index page #2.'
      },
      {
        lineHighlighted: 5,
        actionType: 'traverse',
        explanation: 'Descending to Depth 1: Node [20, 35]. Comparing target 30 against keys. Since 20 <= 30 < 35, engine routes to middle child leaf pointer.',
        dbState: {
          scenario: 'B+ Tree Index Walk',
          bTreeNodes: initialNodes.map(n => n.id === 'left_child' ? { ...n, isActive: true, highlightedKeyIndex: 0 } : n),
          walLog: [],
          bufferPool: [
            { pageId: 1, table: 'users_idx_root', isDirty: false, lruRank: 2 },
            { pageId: 2, table: 'users_idx_internal', isDirty: false, lruRank: 1 }
          ],
          diskPages: [{ pageId: 2, keys: [20, 35], flushed: true }]
        },
        variables: { targetKey: 30, searchLevel: 'Internal (Depth 1)', rangeSelected: '[20 <= key < 35]' },
        consoleOutput: '[B+ TREE] Key 30 falls in range [20, 35). Loading Leaf Page #4.'
      },
      {
        lineHighlighted: 10,
        actionType: 'done',
        explanation: 'Arrived at Leaf Node [20, 30]. Exact match found! Tuple pointer retrieved from leaf payload with 0 table scans.',
        dbState: {
          scenario: 'B+ Tree Index Walk',
          bTreeNodes: initialNodes.map(n => n.id === 'leaf_2' ? { ...n, isActive: true, highlightedKeyIndex: 1 } : n),
          walLog: [],
          bufferPool: [
            { pageId: 4, table: 'users_leaf_data', isDirty: false, lruRank: 1 }
          ],
          diskPages: [{ pageId: 4, keys: [20, 30], flushed: true }]
        },
        variables: { targetKey: 30, status: 'KEY_FOUND', rowData: '{ id: 30, name: "Alice", email: "alice@chaicode.com" }', totalDiskPageReads: 3 },
        consoleOutput: '[B+ TREE] SUCCESS: Record found at Leaf Page #4 offset 1. Execution took 3 page accesses ($O(\\log_B N)$).'
      }
    ];
  }

  // WAL Durability Pipeline Scenario
  return [
    {
      lineHighlighted: 1,
      actionType: 'init',
      explanation: 'Transaction BEGIN (TxId: TX-4091). Client issues: "UPDATE accounts SET balance = balance + 500 WHERE id = 101".',
      dbState: {
        scenario: 'WAL & ACID Pipeline',
        bTreeNodes: [],
        walLog: [
          { lsn: 101, txId: 'TX-4091', type: 'INSERT', targetTable: 'accounts', key: 101, value: 'balance: 1500', committed: false }
        ],
        bufferPool: [
          { pageId: 12, table: 'accounts_page_12', isDirty: true, lruRank: 1 }
        ],
        diskPages: [
          { pageId: 12, keys: [1000], flushed: false }
        ]
      },
      variables: { txStatus: 'ACTIVE', logSequenceNumber: 101, bufferPoolDirty: 'Page 12 marked DIRTY' },
      consoleOutput: '[WAL] Transaction TX-4091: Appended record to in-memory WAL buffer. Page 12 in RAM modified.'
    },
    {
      lineHighlighted: 8,
      actionType: 'pointer_rewire',
      explanation: 'Fsync called: In-memory WAL buffer flushed synchronously to disk write-ahead log file before modifying disk tables.',
      dbState: {
        scenario: 'WAL & ACID Pipeline',
        bTreeNodes: [],
        walLog: [
          { lsn: 101, txId: 'TX-4091', type: 'INSERT', targetTable: 'accounts', key: 101, value: 'balance: 1500', committed: true },
          { lsn: 102, txId: 'TX-4091', type: 'COMMIT', targetTable: 'accounts', key: 101, value: 'TX_COMMIT', committed: true }
        ],
        bufferPool: [
          { pageId: 12, table: 'accounts_page_12', isDirty: true, lruRank: 1 }
        ],
        diskPages: [
          { pageId: 12, keys: [1000], flushed: false }
        ]
      },
      variables: { diskSync: 'FSYNC_SUCCESS', committedLSN: 102, walOnDisk: 'TRUE' },
      consoleOutput: '[WAL] fsync() SUCCESS: WAL LSN 101-102 safely written to disk block 40960. Crash safety guaranteed!'
    },
    {
      lineHighlighted: 15,
      actionType: 'done',
      explanation: 'Background Checkpointer runs: Dirty Page 12 from RAM Buffer Pool is lazily flushed to primary table files.',
      dbState: {
        scenario: 'WAL & ACID Pipeline',
        bTreeNodes: [],
        walLog: [
          { lsn: 101, txId: 'TX-4091', type: 'INSERT', targetTable: 'accounts', key: 101, value: 'balance: 1500', committed: true },
          { lsn: 102, txId: 'TX-4091', type: 'COMMIT', targetTable: 'accounts', key: 101, value: 'TX_COMMIT', committed: true },
          { lsn: 103, txId: 'SYS', type: 'CHECKPOINT', targetTable: 'accounts', key: 0, value: 'CHECKPOINT_OK', committed: true }
        ],
        bufferPool: [
          { pageId: 12, table: 'accounts_page_12', isDirty: false, lruRank: 1 }
        ],
        diskPages: [
          { pageId: 12, keys: [1500], flushed: true }
        ]
      },
      variables: { checkpointStatus: 'CLEAN', bufferPoolDirty: 'Page 12 CLEAN', persistence: 'DURABLE' },
      consoleOutput: '[CHECKPOINT] Asynchronous flusher synchronized dirty RAM pages with disk tables. WAL entries safe to prune.'
    }
  ];
}

export default function DBCanvas({ currentSnapshot, onSnapshotsGenerated }: DBCanvasProps) {
  const [selectedScenario, setSelectedScenario] = useState<DBScenarioId>('btree_search');
  const [activeView, setActiveView] = useState<'btree' | 'wal' | 'buffer_pool'>('btree');

  useEffect(() => {
    const snaps = generateDBSnapshots(selectedScenario);
    onSnapshotsGenerated(snaps);
  }, [selectedScenario]);

  const db = currentSnapshot?.dbState;
  const meta = SCENARIOS.find(s => s.id === selectedScenario) || SCENARIOS[0];

  return (
    <div className="w-full h-full flex flex-col bg-bg-app rounded-xl overflow-hidden border border-border-custom">
      {/* Header */}
      <div className="p-3 bg-bg-panel/90 border-b border-border-custom flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Database className="w-3 h-3" />
            Databases & Storage Engine Visual
          </span>
          <select
            value={selectedScenario}
            onChange={(e) => {
              const next = e.target.value as DBScenarioId;
              setSelectedScenario(next);
              soundSynth.playNote(65, 0.08, 'triangle');
            }}
            aria-label="Select Database Simulation Scenario"
            className="bg-bg-card text-xs font-mono text-white border border-border-custom px-2.5 py-1 rounded-lg focus:outline-none focus:border-accent-custom"
          >
            {SCENARIOS.map(s => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${meta.badge}`}>
            {meta.focus}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-bg-card/60 p-0.5 rounded-lg border border-border-custom">
          <button
            onClick={() => setActiveView('btree')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              activeView === 'btree' ? 'bg-accent-custom text-white font-bold' : 'text-text-muted hover:text-white'
            }`}
          >
            B+ Tree Index
          </button>
          <button
            onClick={() => setActiveView('wal')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              activeView === 'wal' ? 'bg-accent-custom text-white font-bold' : 'text-text-muted hover:text-white'
            }`}
          >
            WAL Log Pipeline
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 p-4 overflow-auto flex flex-col justify-between font-mono">
        {activeView === 'btree' ? (
          <div className="relative min-w-[620px] min-h-[360px] flex-1">
            {/* SVG Connector Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Root to Left Child */}
              <line x1="330" y1="70" x2="200" y2="130" stroke="#334155" strokeWidth="1.5" />
              {/* Root to Right Child */}
              <line x1="350" y1="70" x2="480" y2="130" stroke="#334155" strokeWidth="1.5" />
              {/* Left Child to Leaves */}
              <line x1="160" y1="170" x2="100" y2="240" stroke="#334155" strokeWidth="1.5" />
              <line x1="190" y1="170" x2="230" y2="240" stroke="#334155" strokeWidth="1.5" />
              {/* Right Child to Leaves */}
              <line x1="480" y1="170" x2="380" y2="240" stroke="#334155" strokeWidth="1.5" />
              <line x1="510" y1="170" x2="520" y2="240" stroke="#334155" strokeWidth="1.5" />
              {/* Horizontal Leaf Node Linked List Pointers */}
              <line x1="150" y1="260" x2="180" y2="260" stroke="#5de6ff" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="290" y1="260" x2="320" y2="260" stroke="#5de6ff" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="430" y1="260" x2="460" y2="260" stroke="#5de6ff" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>

            {/* B+ Tree Nodes */}
            {db?.bTreeNodes.map(node => (
              <motion.div
                key={node.id}
                layout
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`absolute p-3 rounded-xl border z-10 transition-all ${
                  node.isActive
                    ? 'border-accent-custom bg-accent-custom/15 ring-2 ring-accent-custom/50 shadow-[0_0_20px_rgba(93,230,255,0.3)]'
                    : 'border-border-custom bg-bg-panel hover:border-slate-700'
                }`}
              >
                <div className="text-[9px] font-mono text-text-muted uppercase mb-1 flex items-center justify-between gap-2">
                  <span>{node.isLeaf ? 'Leaf Page' : 'Index Page'}</span>
                  <span className="text-[#5de6ff]">{node.id}</span>
                </div>

                <div className="flex items-center gap-1">
                  {node.keys.map((k, kidx) => {
                    const isKeyHighlighted = node.highlightedKeyIndex === kidx;
                    return (
                      <div
                        key={kidx}
                        className={`px-2.5 py-1 rounded text-xs font-bold font-mono transition-all ${
                          isKeyHighlighted
                            ? 'bg-yellow-400 text-bg-app font-black shadow'
                            : 'bg-bg-card border border-border-custom text-white'
                        }`}
                      >
                        {k}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* WAL (Write Ahead Logging) Stream View */
          <div className="space-y-4 max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5de6ff]" />
                Append-Only Write-Ahead Log (WAL) Records
              </h4>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                ACID Durability
              </span>
            </div>

            <div className="space-y-2">
              {db?.walLog.map((entry) => (
                <div
                  key={entry.lsn}
                  className="p-3 bg-bg-panel border border-border-custom rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-yellow-400">
                      LSN #{entry.lsn}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-card border border-border-custom text-[#5de6ff]">
                      {entry.txId}
                    </span>
                    <span className="text-xs font-mono text-white font-bold">
                      {entry.type} {entry.targetTable} [Key: {entry.key}]
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{entry.value}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      entry.committed 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {entry.committed ? 'COMMITTED TO DISK' : 'IN-MEMORY BUFFER'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Buffer Pool Cache Status */}
            <div className="p-4 bg-bg-panel border border-border-custom rounded-xl mt-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                In-Memory Buffer Pool (LRU Cache)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {db?.bufferPool.map(page => (
                  <div key={page.pageId} className="p-2.5 bg-bg-card rounded-lg border border-border-custom flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">Page #{page.pageId} ({page.table})</div>
                      <div className="text-[10px] text-text-muted">LRU Rank: #{page.lruRank}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      page.isDirty ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {page.isDirty ? 'DIRTY (RAM MODIFIED)' : 'CLEAN (SYNCED)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="mt-3 p-3 rounded-xl bg-bg-panel border border-border-custom flex items-start gap-3">
          <Terminal className="w-4 h-4 text-[#5de6ff] shrink-0 mt-0.5" />
          <div className="text-xs font-mono">
            <span className="text-white font-bold">{currentSnapshot?.actionType.toUpperCase()}: </span>
            <span className="text-slate-300">{currentSnapshot?.explanation || 'Ready.'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
