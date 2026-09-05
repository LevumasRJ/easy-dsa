import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle2, Clock, ArrowRight, BookOpen, AlertCircle, RotateCcw, Sparkles, Target, ChevronRight, CheckSquare, Square, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RoadmapTask, DSATopic } from '../types';
import { soundSynth } from '../utils/soundSynthesizer';

interface RoadmapPlannerProps {
  onNavigateTopic: (topic: DSATopic, algo?: string) => void;
}

const INITIAL_TASKS: RoadmapTask[] = [
  // Phase 1: Core Fundamentals & Two Pointers
  {
    id: 'task-1',
    topicId: 'two_sum',
    title: 'Two Sum & Hash Map Lookup',
    track: 'DSA',
    category: 'Arrays & Hashing',
    prerequisites: [],
    estimatedMinutes: 30,
    status: 'COMPLETED',
    targetDayIndex: 1,
    difficulty: 'EASY',
    description: 'Master $O(N)$ one-pass hash map complement indexing over $O(N^2)$ brute force.',
    dsaTopicNav: 'leetcode',
    defaultAlgo: 'twosum'
  },
  {
    id: 'task-2',
    topicId: 'container_water',
    title: 'Container With Most Water',
    track: 'DSA',
    category: 'Two Pointers',
    prerequisites: ['task-1'],
    estimatedMinutes: 45,
    status: 'COMPLETED',
    targetDayIndex: 1,
    difficulty: 'MEDIUM',
    description: 'Inward pointer constriction strategy based on limiting wall height.',
    dsaTopicNav: 'leetcode',
    defaultAlgo: 'container_with_most_water'
  },
  {
    id: 'task-3',
    topicId: 'reverse_list',
    title: 'Reverse Singly Linked List',
    track: 'DSA',
    category: 'Linked Lists',
    prerequisites: ['task-1'],
    estimatedMinutes: 40,
    status: 'PENDING',
    targetDayIndex: 2,
    difficulty: 'EASY',
    description: 'Three-pointer iterative rewiring: prev, curr, and next node preservation.',
    dsaTopicNav: 'linked-list',
    defaultAlgo: 'deleteNode'
  },
  {
    id: 'task-4',
    topicId: 'valid_parentheses',
    title: 'Valid Parentheses & Stack Frames',
    track: 'DSA',
    category: 'Stacks',
    prerequisites: [],
    estimatedMinutes: 30,
    status: 'PENDING',
    targetDayIndex: 2,
    difficulty: 'EASY',
    description: 'LIFO bracket matching with strict closing bracket alignment validation.',
    dsaTopicNav: 'leetcode',
    defaultAlgo: 'valid_parentheses'
  },
  {
    id: 'task-5',
    topicId: 'binary_search',
    title: 'Binary Search & Boundary Invariants',
    track: 'DSA',
    category: 'Searching',
    prerequisites: ['task-1'],
    estimatedMinutes: 35,
    status: 'PENDING',
    targetDayIndex: 3,
    difficulty: 'EASY',
    description: 'Logarithmic division with overflow-safe midpoint calculation.',
    dsaTopicNav: 'leetcode',
    defaultAlgo: 'binary_search'
  },
  {
    id: 'task-6',
    topicId: 'invert_tree',
    title: 'Invert Binary Tree & DFS Traversal',
    track: 'DSA',
    category: 'Binary Trees',
    prerequisites: ['task-3'],
    estimatedMinutes: 45,
    status: 'PENDING',
    targetDayIndex: 4,
    difficulty: 'EASY',
    description: 'Recursive left-right pointer swapping across subtree leaves.',
    dsaTopicNav: 'trees',
    defaultAlgo: 'insertBST'
  },
  {
    id: 'task-7',
    topicId: 'quicksort_partition',
    title: 'QuickSort Lomuto Partitioning',
    track: 'DSA',
    category: 'Divide & Conquer',
    prerequisites: ['task-5'],
    estimatedMinutes: 50,
    status: 'BACKLOG',
    targetDayIndex: 5,
    difficulty: 'MEDIUM',
    description: 'Pivot element boundary swaps with recursive divide-and-conquer.',
    dsaTopicNav: 'sorting',
    defaultAlgo: 'quicksort'
  },

  // Systems & LLD Track
  {
    id: 'task-8',
    topicId: 'lld_parking_lot',
    title: 'Parking Lot Object-Oriented Architecture',
    track: 'LLD',
    category: 'Object-Oriented Design',
    prerequisites: [],
    estimatedMinutes: 60,
    status: 'PENDING',
    targetDayIndex: 6,
    difficulty: 'MEDIUM',
    description: 'Polymorphic spot assignment and decoupled strategy fee calculation.',
    dsaTopicNav: 'lld'
  },
  {
    id: 'task-9',
    topicId: 'net_tcp_handshake',
    title: 'TCP 3-Way Handshake & Wire Encapsulation',
    track: 'Networking',
    category: 'Protocols',
    prerequisites: [],
    estimatedMinutes: 45,
    status: 'PENDING',
    targetDayIndex: 7,
    difficulty: 'MEDIUM',
    description: 'SYN, SYN-ACK, ACK sequence number tracking and OSI packet header wrapping.',
    dsaTopicNav: 'networking'
  },
  {
    id: 'task-10',
    topicId: 'os_context_switch',
    title: 'OS Context Switching & PCB Management',
    track: 'OS',
    category: 'Kernel Schedulers',
    prerequisites: [],
    estimatedMinutes: 50,
    status: 'PENDING',
    targetDayIndex: 8,
    difficulty: 'HARD',
    description: 'Round-robin quantum slicing, register preservation to PCB, and memory mapping.',
    dsaTopicNav: 'os'
  },
  {
    id: 'task-11',
    topicId: 'db_btree_wal',
    title: 'B+ Tree Indexing & WAL ACID Pipeline',
    track: 'Databases',
    category: 'Storage Engines',
    prerequisites: ['task-6'],
    estimatedMinutes: 60,
    status: 'PENDING',
    targetDayIndex: 9,
    difficulty: 'HARD',
    description: 'Disk-optimized B+ Tree page traversal, node split rebalancing, and WAL persistence.',
    dsaTopicNav: 'databases'
  }
];

export default function RoadmapPlanner({ onNavigateTopic }: RoadmapPlannerProps) {
  const [tasks, setTasks] = useState<RoadmapTask[]>(INITIAL_TASKS);
  const [prepDays, setPrepDays] = useState<number>(30);
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL');

  // Toggle task status
  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
          soundSynth.playNote(nextStatus === 'COMPLETED' ? 880 : 440, 0.08, 'sine');
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Move task to backlog
  const moveTaskToBacklog = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'BACKLOG' } : t))
    );
    soundSynth.playNote(300, 0.08, 'triangle');
  };

  // Statistics calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const backlog = tasks.filter(t => t.status === 'BACKLOG').length;
    const pending = tasks.filter(t => t.status === 'PENDING').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const completedMinutes = tasks
      .filter(t => t.status === 'COMPLETED')
      .reduce((acc, t) => acc + t.estimatedMinutes, 0);

    return { total, completed, backlog, pending, percentage, hoursSpent: (completedMinutes / 60).toFixed(1) };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (selectedTrack === 'ALL') return tasks;
    return tasks.filter(t => t.track === selectedTrack);
  }, [tasks, selectedTrack]);

  // Group tasks by Day or Backlog
  const activeDays = useMemo(() => {
    const dayMap = new Map<number, RoadmapTask[]>();
    filteredTasks
      .filter(t => t.status !== 'BACKLOG')
      .forEach(t => {
        const existing = dayMap.get(t.targetDayIndex) || [];
        existing.push(t);
        dayMap.set(t.targetDayIndex, existing);
      });
    return Array.from(dayMap.entries()).sort(([a], [b]) => a - b);
  }, [filteredTasks]);

  const backlogTasks = useMemo(() => {
    return filteredTasks.filter(t => t.status === 'BACKLOG');
  }, [filteredTasks]);

  return (
    <div className="w-full h-full flex flex-col bg-bg-app p-4 md:p-6 overflow-y-auto">
      {/* Header & Configuration Bar */}
      <div className="max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-panel border border-border-custom rounded-2xl p-5 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Adaptive Prep Schedule
              </span>
              <span className="text-xs font-mono text-text-muted">Chai Visual Curriculum</span>
            </div>
            <h2 className="text-xl md:text-2xl font-mono font-bold text-white tracking-tight">
              Interview Readiness Roadmap
            </h2>
            <p className="text-xs text-text-muted mt-1 max-w-xl">
              Linear prerequisite dependency scheduler. Target daily micro-goals across DSA, LLD, Networking, OS, and Databases.
            </p>
          </div>

          {/* Config Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[10px] font-mono text-text-muted uppercase block mb-1">Timeline Window</label>
              <select
                value={prepDays}
                onChange={(e) => setPrepDays(Number(e.target.value))}
                className="bg-bg-card text-xs font-mono text-white border border-border-custom px-3 py-1.5 rounded-xl focus:outline-none focus:border-accent-custom cursor-pointer"
              >
                <option value={7}>7 Days (Express Sprint)</option>
                <option value={30}>30 Days (Standard Prep)</option>
                <option value={45}>45 Days (Comprehensive)</option>
                <option value={90}>90 Days (Full Mastery)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-text-muted uppercase block mb-1">Daily Capacity</label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="bg-bg-card text-xs font-mono text-white border border-border-custom px-3 py-1.5 rounded-xl focus:outline-none focus:border-accent-custom cursor-pointer"
              >
                <option value={1}>1 Hour / Day</option>
                <option value={2}>2 Hours / Day</option>
                <option value={4}>4 Hours / Day (Hardcore)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Readiness Analytics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-bg-panel border border-border-custom rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-text-muted">Readiness Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-mono font-bold text-[#5de6ff]">{stats.percentage}%</span>
              <span className="text-[10px] font-mono text-emerald-400">Target: 85%+</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#5de6ff] h-full rounded-full transition-all duration-500" style={{ width: `${stats.percentage}%` }} />
            </div>
          </div>

          <div className="p-4 bg-bg-panel border border-border-custom rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-text-muted">Tasks Completed</span>
            <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
              {stats.completed} <span className="text-xs text-text-muted font-normal">/ {stats.total}</span>
            </div>
            <span className="text-[10px] font-mono text-text-muted mt-2">Active tasks left: {stats.pending}</span>
          </div>

          <div className="p-4 bg-bg-panel border border-border-custom rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-text-muted">Estimated Hours</span>
            <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
              {stats.hoursSpent} <span className="text-xs text-text-muted font-normal">hrs</span>
            </div>
            <span className="text-[10px] font-mono text-text-muted mt-2">Paced at {dailyHours}h / day</span>
          </div>

          <div className="p-4 bg-bg-panel border border-border-custom rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-text-muted">Backlog Rollover</span>
            <div className="text-2xl font-mono font-bold text-rose-400 mt-1">
              {stats.backlog} <span className="text-xs text-text-muted font-normal">tasks</span>
            </div>
            <span className="text-[10px] font-mono text-text-muted mt-2">Requires rescheduling</span>
          </div>
        </div>

        {/* Track Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-mono text-text-muted flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter Track:
          </span>
          {['ALL', 'DSA', 'LLD', 'Networking', 'OS', 'Databases'].map(tr => (
            <button
              key={tr}
              onClick={() => setSelectedTrack(tr)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedTrack === tr
                  ? 'bg-accent-custom text-white font-bold'
                  : 'bg-bg-panel text-text-muted hover:text-white border border-border-custom'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>

        {/* Daily Schedule Timeline Grid */}
        <div className="space-y-6">
          {activeDays.map(([dayIndex, dayTasks]) => (
            <div key={dayIndex} className="bg-bg-panel border border-border-custom rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border-custom pb-2.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#5de6ff]" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Day #{dayIndex} Schedule
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  {dayTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0)} mins total
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dayTasks.map(task => {
                  const isCompleted = task.status === 'COMPLETED';

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'bg-bg-card border-border-custom hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className="flex items-center gap-2 text-left cursor-pointer group"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
                            )}
                            <span className={`text-xs font-mono font-bold transition-colors ${
                              isCompleted ? 'line-through text-slate-400' : 'text-white'
                            }`}>
                              {task.title}
                            </span>
                          </button>

                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                            task.difficulty === 'EASY'
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : task.difficulty === 'MEDIUM'
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          }`}>
                            {task.difficulty}
                          </span>
                        </div>

                        <p className="text-[11px] text-text-muted pl-6 line-clamp-2">
                          {task.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border-custom/60 pl-6">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.estimatedMinutes}m
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bg-panel border border-border-custom text-text-accent">
                            {task.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveTaskToBacklog(task.id)}
                            className="text-[10px] font-mono text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Rollover to Backlog"
                          >
                            Postpone
                          </button>

                          {task.dsaTopicNav && (
                            <button
                              onClick={() => {
                                soundSynth.playNote(520, 0.08, 'sine');
                                onNavigateTopic(task.dsaTopicNav!, task.defaultAlgo);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-accent-custom/20 hover:bg-accent-custom text-white text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border border-accent-custom/40"
                            >
                              Launch Visualizer <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Dedicated Backlog Rollover Section */}
          {backlogTasks.length > 0 && (
            <div className="bg-bg-panel border border-rose-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
                    Overdue Backlog Rollover ({backlogTasks.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  Auto-rolled over without breaking timeline structure
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {backlogTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white">{task.title}</h4>
                      <div className="text-[10px] font-mono text-text-muted mt-0.5">
                        {task.category} • {task.estimatedMinutes}m • Originally Day #{task.targetDayIndex}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="px-2 py-1 rounded bg-bg-card hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-border-custom transition-all cursor-pointer"
                      >
                        Mark Done
                      </button>
                      {task.dsaTopicNav && (
                        <button
                          onClick={() => onNavigateTopic(task.dsaTopicNav!, task.defaultAlgo)}
                          className="px-2 py-1 rounded bg-accent-custom text-white text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          Start <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
