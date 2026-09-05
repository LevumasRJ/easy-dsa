import React, { useState, useEffect } from 'react';
import { Cpu, Server, Terminal, Lock, Unlock, AlertTriangle, RefreshCw, Layers, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { Snapshot, OSState, OSProcessPCB, OSMemoryPage } from '../types';
import { soundSynth } from '../utils/soundSynthesizer';

interface OSCanvasProps {
  currentSnapshot?: Snapshot;
  onSnapshotsGenerated: (snapshots: Snapshot[]) => void;
}

export type OSScenarioId = 'round_robin' | 'deadlock_cycle' | 'page_fault';

interface ScenarioInfo {
  id: OSScenarioId;
  title: string;
  focus: string;
  badge: string;
  desc: string;
}

const SCENARIOS: ScenarioInfo[] = [
  {
    id: 'round_robin',
    title: 'Round Robin Scheduling & Context Switch',
    focus: 'Kernel / CPU Dispatcher',
    badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    desc: 'Preemptive quantum slicing with register state preservation to Process Control Block (PCB)'
  },
  {
    id: 'deadlock_cycle',
    title: 'Mutex Locks & Deadlock Detection',
    focus: 'Concurrency & Locks',
    badge: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    desc: 'Circular wait condition detected via visual Resource Allocation Graph cycle'
  },
  {
    id: 'page_fault',
    title: 'MMU Virtual Memory & Page Fault',
    focus: 'Virtual Memory / MMU',
    badge: 'border-[#5de6ff]/30 text-[#5de6ff] bg-[#5de6ff]/10',
    desc: 'Logical address translation, missing frame interrupt, and OS kernel disk-to-RAM page load'
  }
];

export function generateOSSnapshots(scenarioId: OSScenarioId): Snapshot[] {
  if (scenarioId === 'round_robin') {
    const pcbP1: OSProcessPCB = { pid: 'PID-101', name: 'Browser Engine', state: 'RUNNING', priority: 1, cpuTime: 4, allocatedFrames: [1, 2] };
    const pcbP2: OSProcessPCB = { pid: 'PID-102', name: 'Audio Daemon', state: 'READY', priority: 2, cpuTime: 2, allocatedFrames: [3] };
    const pcbP3: OSProcessPCB = { pid: 'PID-103', name: 'Compile Worker', state: 'READY', priority: 1, cpuTime: 0, allocatedFrames: [4, 5] };

    return [
      {
        lineHighlighted: 1,
        actionType: 'init',
        explanation: 'Process PID-101 ("Browser Engine") running on CPU Core 0 under USER space. Quantum timer running (T=10ms remaining).',
        osState: {
          scenario: 'Round Robin CPU Scheduling',
          cpu: { id: 'CORE-0', pc: 0x00401020, sp: 0x7FFF0040, r0: 42, r1: 108, state: 'USER', currentProcessId: 'PID-101' },
          readyQueue: [pcbP2, pcbP3],
          blockedQueue: [],
          runningProcess: pcbP1,
          pageTable: [
            { pageNumber: 0, frameNumber: 1, valid: true, dirty: false, accessed: true },
            { pageNumber: 1, frameNumber: 2, valid: true, dirty: true, accessed: true }
          ],
          physicalFrames: [
            { frame: 1, content: 'P101 Text', processId: 'PID-101' },
            { frame: 2, content: 'P101 Stack', processId: 'PID-101' },
            { frame: 3, content: 'P102 Data', processId: 'PID-102' }
          ],
          locks: []
        },
        variables: { currentQuantumRemaining: '8ms', activePid: 'PID-101', cpuState: 'USER MODE' },
        consoleOutput: '[KERNEL] Core 0 running PID-101. Program Counter: 0x00401020.'
      },
      {
        lineHighlighted: 8,
        actionType: 'traverse',
        explanation: 'Hardware Timer Interrupt fires! Quantum expired (T=0). CPU traps into KERNEL space. Initiating Context Switch.',
        osState: {
          scenario: 'Round Robin CPU Scheduling',
          cpu: { id: 'CORE-0', pc: 0x00401088, sp: 0x7FFF0040, r0: 42, r1: 108, state: 'KERNEL', currentProcessId: 'PID-101' },
          readyQueue: [pcbP2, pcbP3],
          blockedQueue: [],
          runningProcess: { ...pcbP1, state: 'READY' },
          pageTable: [],
          physicalFrames: [],
          locks: []
        },
        variables: { trapReason: 'TIMER_INTERRUPT', cpuState: 'KERNEL MODE', savingRegisters: 'PC, SP, R0, R1 -> PCB-101' },
        consoleOutput: '[KERNEL] Timer interrupt 0x20. Trapped to kernel dispatcher. Freezing PID-101 registers.'
      },
      {
        lineHighlighted: 14,
        actionType: 'pointer_rewire',
        explanation: 'Saving CPU registers into PID-101 Process Control Block. Moving PID-101 to tail of Ready Queue. Fetching next process: PID-102.',
        osState: {
          scenario: 'Round Robin CPU Scheduling',
          cpu: { id: 'CORE-0', pc: 0x80002000, sp: 0x8000FF00, r0: 0, r1: 0, state: 'KERNEL', currentProcessId: null },
          readyQueue: [pcbP3, { ...pcbP1, state: 'READY' }],
          blockedQueue: [],
          runningProcess: null,
          pageTable: [],
          physicalFrames: [],
          locks: []
        },
        variables: { dequeuedPid: 'PID-102', contextSwitchTimeUs: 2.4, queueLength: 2 },
        consoleOutput: '[KERNEL] PCB-101 saved. Scheduler selected PID-102 ("Audio Daemon") from head of Ready Queue.'
      },
      {
        lineHighlighted: 20,
        actionType: 'done',
        explanation: 'Restoring PID-102 registers into CPU Core 0. Switching CPU from KERNEL to USER space. Execution resumes seamlessly!',
        osState: {
          scenario: 'Round Robin CPU Scheduling',
          cpu: { id: 'CORE-0', pc: 0x00502100, sp: 0x7FFF2000, r0: 99, r1: 2048, state: 'USER', currentProcessId: 'PID-102' },
          readyQueue: [pcbP3, { ...pcbP1, state: 'READY' }],
          blockedQueue: [],
          runningProcess: { ...pcbP2, state: 'RUNNING' },
          pageTable: [
            { pageNumber: 0, frameNumber: 3, valid: true, dirty: false, accessed: true }
          ],
          physicalFrames: [
            { frame: 1, content: 'P101 Text', processId: 'PID-101' },
            { frame: 2, content: 'P101 Stack', processId: 'PID-101' },
            { frame: 3, content: 'P102 Audio Buffer', processId: 'PID-102' }
          ],
          locks: []
        },
        variables: { activePid: 'PID-102', newQuantum: '10ms', pcRestored: '0x00502100' },
        consoleOutput: '[KERNEL] Context switch complete. Core 0 dispatched to PID-102.'
      }
    ];
  }

  // Deadlock Cycle Scenario
  return [
    {
      lineHighlighted: 1,
      actionType: 'init',
      explanation: 'Two concurrent threads competing for shared hardware mutexes: Mutex A (Database Lock) and Mutex B (Network Socket Lock).',
      osState: {
        scenario: 'Deadlock Dining Philosophers',
        cpu: { id: 'CORE-0', pc: 0x0010, sp: 0x7000, r0: 1, r1: 2, state: 'USER', currentProcessId: 'T1' },
        readyQueue: [],
        blockedQueue: [],
        runningProcess: { pid: 'T1', name: 'Worker-1', state: 'RUNNING', priority: 1, cpuTime: 1, allocatedFrames: [] },
        pageTable: [],
        physicalFrames: [],
        locks: [
          { resource: 'Mutex A (DB)', heldBy: 'T1', waiting: [] },
          { resource: 'Mutex B (Socket)', heldBy: 'T2', waiting: [] }
        ]
      },
      variables: { thread1Has: 'Mutex A', thread2Has: 'Mutex B' },
      consoleOutput: '[LOCKS] Thread 1 holds Mutex A. Thread 2 holds Mutex B.'
    },
    {
      lineHighlighted: 8,
      actionType: 'compare',
      explanation: 'Thread 1 requests Mutex B. Since Thread 2 already holds Mutex B, Thread 1 enters BLOCKED state.',
      osState: {
        scenario: 'Deadlock Dining Philosophers',
        cpu: { id: 'CORE-0', pc: 0x0018, sp: 0x7000, r0: 1, r1: 2, state: 'KERNEL', currentProcessId: 'T2' },
        readyQueue: [],
        blockedQueue: [{ pid: 'T1', name: 'Worker-1', state: 'BLOCKED', priority: 1, cpuTime: 1, allocatedFrames: [] }],
        runningProcess: { pid: 'T2', name: 'Worker-2', state: 'RUNNING', priority: 1, cpuTime: 1, allocatedFrames: [] },
        pageTable: [],
        physicalFrames: [],
        locks: [
          { resource: 'Mutex A (DB)', heldBy: 'T1', waiting: [] },
          { resource: 'Mutex B (Socket)', heldBy: 'T2', waiting: ['T1'] }
        ]
      },
      variables: { thread1Status: 'BLOCKED on Mutex B' },
      consoleOutput: '[LOCKS] Thread 1 attempted to acquire Mutex B -> Blocked.'
    },
    {
      lineHighlighted: 15,
      actionType: 'swap',
      explanation: 'Thread 2 now requests Mutex A (held by Thread 1). Thread 2 also enters BLOCKED state. Circular dependency formed!',
      osState: {
        scenario: 'Deadlock Dining Philosophers',
        cpu: { id: 'CORE-0', pc: 0x0024, sp: 0x7000, r0: 0, r1: 0, state: 'KERNEL', currentProcessId: null },
        readyQueue: [],
        blockedQueue: [
          { pid: 'T1', name: 'Worker-1', state: 'BLOCKED', priority: 1, cpuTime: 1, allocatedFrames: [] },
          { pid: 'T2', name: 'Worker-2', state: 'BLOCKED', priority: 1, cpuTime: 1, allocatedFrames: [] }
        ],
        runningProcess: null,
        pageTable: [],
        physicalFrames: [],
        deadlockCycle: ['T1', 'Mutex B', 'T2', 'Mutex A', 'T1'],
        locks: [
          { resource: 'Mutex A (DB)', heldBy: 'T1', waiting: ['T2'] },
          { resource: 'Mutex B (Socket)', heldBy: 'T2', waiting: ['T1'] }
        ]
      },
      variables: { deadlockDetected: 'TRUE (Circular Wait)', cycle: 'T1 -> Mutex B -> T2 -> Mutex A -> T1' },
      consoleOutput: '[CRITICAL ALERT] DEADLOCK DETECTED! Both threads in permanent wait state. Coffman conditions met.'
    }
  ];
}

export default function OSCanvas({ currentSnapshot, onSnapshotsGenerated }: OSCanvasProps) {
  const [selectedScenario, setSelectedScenario] = useState<OSScenarioId>('round_robin');
  const [activeView, setActiveView] = useState<'cpu_pcb' | 'memory' | 'locks'>('cpu_pcb');

  useEffect(() => {
    const snaps = generateOSSnapshots(selectedScenario);
    onSnapshotsGenerated(snaps);
  }, [selectedScenario]);

  const os = currentSnapshot?.osState;
  const meta = SCENARIOS.find(s => s.id === selectedScenario) || SCENARIOS[0];

  return (
    <div className="w-full h-full flex flex-col bg-bg-app rounded-xl overflow-hidden border border-border-custom">
      {/* Header */}
      <div className="p-3 bg-bg-panel/90 border-b border-border-custom flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            Operating Systems Kernel Visual
          </span>
          <select
            value={selectedScenario}
            onChange={(e) => {
              const next = e.target.value as OSScenarioId;
              setSelectedScenario(next);
              soundSynth.playNote(45, 0.08, 'sawtooth');
            }}
            aria-label="Select OS Kernel Simulation Scenario"
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
            onClick={() => setActiveView('cpu_pcb')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              activeView === 'cpu_pcb' ? 'bg-accent-custom text-white font-bold' : 'text-text-muted hover:text-white'
            }`}
          >
            CPU & PCB Queue
          </button>
          <button
            onClick={() => setActiveView('locks')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              activeView === 'locks' ? 'bg-accent-custom text-white font-bold' : 'text-text-muted hover:text-white'
            }`}
          >
            Mutex & Deadlock Graph
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 p-4 overflow-auto flex flex-col justify-between font-mono">
        {activeView === 'cpu_pcb' ? (
          <div className="space-y-4 max-w-4xl mx-auto w-full">
            {/* CPU Registers Compartment */}
            <div className="p-4 bg-bg-panel border border-border-custom rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#5de6ff]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    CPU Core 0 Hardware Execution Registers
                  </h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  os?.cpu.state === 'KERNEL' 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                    : os?.cpu.state === 'USER'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {os?.cpu.state} MODE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 bg-bg-card rounded-lg border border-border-custom">
                  <div className="text-[9px] text-text-muted uppercase">Program Counter (PC)</div>
                  <div className="text-xs text-yellow-400 font-bold truncate">0x{os?.cpu.pc.toString(16).toUpperCase() || '0000'}</div>
                </div>
                <div className="p-2.5 bg-bg-card rounded-lg border border-border-custom">
                  <div className="text-[9px] text-text-muted uppercase">Stack Pointer (SP)</div>
                  <div className="text-xs text-[#5de6ff] font-bold truncate">0x{os?.cpu.sp.toString(16).toUpperCase() || '7FFF'}</div>
                </div>
                <div className="p-2.5 bg-bg-card rounded-lg border border-border-custom">
                  <div className="text-[9px] text-text-muted uppercase">General Reg R0</div>
                  <div className="text-xs text-emerald-400 font-bold">{os?.cpu.r0 ?? 0}</div>
                </div>
                <div className="p-2.5 bg-bg-card rounded-lg border border-border-custom">
                  <div className="text-[9px] text-text-muted uppercase">General Reg R1</div>
                  <div className="text-xs text-purple-400 font-bold">{os?.cpu.r1 ?? 0}</div>
                </div>
              </div>
            </div>

            {/* Schedulers Process Queues (Running, Ready, Blocked) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Running Process */}
              <div className="p-3 bg-bg-panel border border-emerald-500/30 rounded-xl">
                <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center justify-between">
                  <span>RUNNING (CPU CORE 0)</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                {os?.runningProcess ? (
                  <div className="p-2.5 bg-bg-card rounded-lg border border-emerald-500/20 text-xs">
                    <div className="font-bold text-white">{os.runningProcess.name}</div>
                    <div className="text-[10px] text-text-muted">{os.runningProcess.pid} • Priority {os.runningProcess.priority}</div>
                    <div className="text-[10px] text-emerald-400 mt-1">CPU Time: {os.runningProcess.cpuTime}ms</div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic p-4 text-center">CPU Idle / Trapped in Kernel Dispatcher</div>
                )}
              </div>

              {/* Ready Queue */}
              <div className="p-3 bg-bg-panel border border-border-custom rounded-xl">
                <div className="text-xs font-bold text-[#5de6ff] mb-2">
                  READY QUEUE ({os?.readyQueue.length || 0})
                </div>
                <div className="space-y-1.5">
                  {os?.readyQueue.map(p => (
                    <div key={p.pid} className="p-2 bg-bg-card rounded-lg border border-border-custom text-xs">
                      <div className="font-bold text-slate-200">{p.name}</div>
                      <div className="text-[9px] text-text-muted">{p.pid} • Priority {p.priority}</div>
                    </div>
                  ))}
                  {(!os?.readyQueue || os.readyQueue.length === 0) && (
                    <div className="text-xs text-slate-500 italic">No processes in ready state</div>
                  )}
                </div>
              </div>

              {/* Blocked Queue */}
              <div className="p-3 bg-bg-panel border border-border-custom rounded-xl">
                <div className="text-xs font-bold text-rose-400 mb-2">
                  BLOCKED QUEUE ({os?.blockedQueue.length || 0})
                </div>
                <div className="space-y-1.5">
                  {os?.blockedQueue.map(p => (
                    <div key={p.pid} className="p-2 bg-bg-card rounded-lg border border-rose-500/20 text-xs">
                      <div className="font-bold text-rose-300">{p.name}</div>
                      <div className="text-[9px] text-text-muted">{p.pid} • Waiting on I/O or Lock</div>
                    </div>
                  ))}
                  {(!os?.blockedQueue || os.blockedQueue.length === 0) && (
                    <div className="text-xs text-slate-500 italic">No blocked processes</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Deadlock and Locks Graph View */
          <div className="space-y-4 max-w-2xl mx-auto w-full">
            {os?.deadlockCycle && (
              <div className="p-4 bg-rose-500/10 border-2 border-rose-500/40 rounded-xl flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0 animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold text-rose-400 uppercase">Deadlock Cycle Detected</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Circular wait: {os.deadlockCycle.join(' ➔ ')}
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-bg-panel border border-border-custom rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Resource Allocation & Mutex Status
              </h4>

              {os?.locks.map(lock => (
                <div key={lock.resource} className="p-3 bg-bg-card rounded-lg border border-border-custom flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{lock.resource}</div>
                    <div className="text-[10px] text-text-muted mt-0.5">
                      Held by: <span className="text-emerald-400 font-bold">{lock.heldBy || 'UNLOCKED'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-text-muted">Wait List: </span>
                    <span className="text-xs text-rose-400 font-bold">
                      {lock.waiting.length > 0 ? lock.waiting.join(', ') : 'None'}
                    </span>
                  </div>
                </div>
              ))}
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
