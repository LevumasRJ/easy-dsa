import React, { useState } from 'react';
import { DSATopic } from '../types';
import { Play, Brain, ListCollapse, Network, GitPullRequest, Search, BookOpen, Sparkles, HelpCircle, Cpu, Database, Layers, Wifi, Shield, Calendar, Trophy, ArrowRight, Code, Server, HardDrive } from 'lucide-react';

interface ExploreLibraryProps {
  onNavigate: (topic: DSATopic, defaultAlgo?: string) => void;
  searchQuery: string;
}

export type TrackCategory = 'ALL' | 'DSA' | 'LLD' | 'NETWORKING' | 'OS' | 'DATABASES' | 'SYSTEM_DESIGN' | 'PREP';

interface ModuleCard {
  id: string;
  title: string;
  track: TrackCategory;
  category: string;
  tag?: string;
  desc: string;
  useCase: string;
  icon: React.ReactNode;
  color: string;
  badgeColor: string;
  action: () => void;
  featured?: boolean;
}

export default function ExploreLibrary({ onNavigate, searchQuery }: ExploreLibraryProps) {
  const [selectedTrack, setSelectedTrack] = useState<TrackCategory>('ALL');

  const cards: ModuleCard[] = [
    // 1. DSA Track
    {
      id: 'leetcode',
      title: 'LeetCode & NeetCode Classics',
      track: 'DSA',
      category: 'Curriculum Solutions',
      tag: 'Core DSA',
      featured: true,
      desc: 'Interactive step-by-step visualizations for Two Sum, Container With Most Water, Valid Parentheses, Reverse List, Invert Tree, and Binary Search.',
      useCase: 'Technical coding interviews and whiteboard architectural evaluations.',
      icon: <BookOpen className="w-8 h-8 text-[#5de6ff]" />,
      color: 'border-[#5de6ff]/30 hover:border-[#5de6ff]',
      badgeColor: 'bg-[#5de6ff]/10 text-[#5de6ff] border-[#5de6ff]/30',
      action: () => onNavigate('leetcode', 'twosum')
    },
    {
      id: 'sorting',
      title: 'Sorting Algorithms (QuickSort & BubbleSort)',
      track: 'DSA',
      category: 'Divide & Conquer',
      desc: 'Animate pivot partitions, Lomuto boundary swaps, and recursive subdivisions with real-time complexity meters.',
      useCase: 'High-performance database query sorting, operating system sort routines (qsort).',
      icon: <ListCollapse className="w-8 h-8 text-amber-400" />,
      color: 'border-amber-500/30 hover:border-amber-500',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      action: () => onNavigate('sorting', 'quicksort')
    },
    {
      id: 'trees',
      title: 'Binary Search Trees & Hierarchies',
      track: 'DSA',
      category: 'Tree Structures',
      desc: 'Inspect recursive BST insertions, root-to-leaf searches, and in-order depth-first traversals on a continuous coordinate canvas.',
      useCase: 'File system directory trees, relational database indexing, and hierarchical namespaces.',
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      color: 'border-purple-500/30 hover:border-purple-500',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      action: () => onNavigate('trees', 'inorderBST')
    },
    {
      id: 'linkedlist',
      title: 'Linked List Splicing & Pointer Rewiring',
      track: 'DSA',
      category: 'Linear Structures',
      desc: 'Watch pointer rewires, node deletions, and middle element fast-slow pointer detection with instantaneous vector lines.',
      useCase: 'LRU cache eviction chains, browser undo/redo history stacks, and kernel memory pools.',
      icon: <GitPullRequest className="w-8 h-8 text-emerald-400" />,
      color: 'border-emerald-500/30 hover:border-emerald-500',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      action: () => onNavigate('linked-list', 'insertAfter')
    },
    {
      id: 'graphs',
      title: 'A* Heuristic & Graph Pathfinding',
      track: 'DSA',
      category: 'Pathfinding',
      desc: 'Dynamic grid obstacle navigation combining Manhattan heuristic cost and step distance to compute the shortest path.',
      useCase: 'GPS turn-by-turn routing (Google Maps) and robotics autonomous navigation.',
      icon: <Network className="w-8 h-8 text-blue-400" />,
      color: 'border-blue-500/30 hover:border-blue-500',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      action: () => onNavigate('graphs')
    },

    // 2. Low-Level Design (LLD)
    {
      id: 'lld',
      title: 'Low-Level Design (LLD) & UML Engine',
      track: 'LLD',
      category: 'Object-Oriented Design',
      tag: 'New Track',
      featured: true,
      desc: 'Interactive UML class diagrams and real-time method call sequence flows for Parking Lot, Splitwise, Elevator Dispatch, and Notification Services.',
      useCase: 'Staff engineer object-oriented design rounds, design patterns (Strategy, Observer, Factory, Singleton).',
      icon: <Layers className="w-8 h-8 text-purple-400" />,
      color: 'border-purple-500/40 hover:border-purple-400',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
      action: () => onNavigate('lld')
    },

    // 3. Computer Networking
    {
      id: 'networking',
      title: 'Computer Networking & Protocol Wire',
      track: 'NETWORKING',
      category: 'OSI & TCP/IP Protocols',
      tag: 'New Track',
      featured: true,
      desc: 'Visual wire simulation and nested packet encapsulation: TCP 3-Way Handshake, HTTP Request/Response, DNS Recursive Resolution, and TLS 1.3.',
      useCase: 'Distributed systems debugging, network latency profiling, and backend client-server communication.',
      icon: <Wifi className="w-8 h-8 text-blue-400" />,
      color: 'border-blue-500/40 hover:border-blue-400',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
      action: () => onNavigate('networking')
    },

    // 4. Operating Systems Kernel
    {
      id: 'os',
      title: 'Operating Systems Kernel & MMU Visual',
      track: 'OS',
      category: 'Kernel Internals',
      tag: 'New Track',
      featured: true,
      desc: 'Hardware CPU registers (PC, SP, R0, R1), Round Robin scheduler context switching, Mutex deadlock circular cycle detection, and Virtual Memory page faults.',
      useCase: 'Concurrency engineering, thread pool synchronization, high-frequency low-latency systems.',
      icon: <Cpu className="w-8 h-8 text-amber-400" />,
      color: 'border-amber-500/40 hover:border-amber-400',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      action: () => onNavigate('os')
    },

    // 5. Databases & Storage Engines
    {
      id: 'databases',
      title: 'Databases & B+ Tree Storage Engines',
      track: 'DATABASES',
      category: 'Storage & Indexing',
      tag: 'New Track',
      featured: true,
      desc: 'Multi-tier B+ Tree index walk & leaf split, Write-Ahead Logging (WAL) ACID durability pipeline, Buffer Pool LRU cache, and Index vs Table Scan query plans.',
      useCase: 'PostgreSQL and MySQL database internals, index performance tuning, and storage crash recovery.',
      icon: <Database className="w-8 h-8 text-indigo-400" />,
      color: 'border-indigo-500/40 hover:border-indigo-400',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
      action: () => onNavigate('databases')
    },

    // 6. System Design & Cloud Architecture
    {
      id: 'system-design',
      title: 'System Design Architecture Sandbox',
      track: 'SYSTEM_DESIGN',
      category: 'Distributed Systems',
      tag: 'Cloud Arch',
      desc: 'Simulate high-concurrency microservice architectures with active load balancers, Redis caches, Kafka message streams, and SQL replicas.',
      useCase: 'Scalable system design rounds, microservices topology, and disaster recovery planning.',
      icon: <Server className="w-8 h-8 text-emerald-400" />,
      color: 'border-emerald-500/30 hover:border-emerald-500',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      action: () => onNavigate('system-design')
    },
    {
      id: 'jvm-mode',
      title: 'JVM Developer Mode & GC Internals',
      track: 'SYSTEM_DESIGN',
      category: 'Runtime Internals',
      desc: 'Inspect JVM bytecode execution, stack frames, Eden/Survivor/Tenured heap generations, and garbage collection memory sweeps.',
      useCase: 'Enterprise Java tuning, heap dump diagnostics, and low-latency runtime optimization.',
      icon: <Code className="w-8 h-8 text-cyan-400" />,
      color: 'border-cyan-500/30 hover:border-cyan-500',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      action: () => onNavigate('jvm-mode')
    },

    // 7. Interview Preparation & Mock Aptitude
    {
      id: 'roadmap',
      title: 'Adaptive Interview Roadmap Planner',
      track: 'PREP',
      category: 'Interview Preparation',
      tag: 'Personalized',
      featured: true,
      desc: 'Linear prerequisite dependency scheduler. Set your 7, 30, 45, or 90-day target timeline with daily micro-goals and automated backlog rollover.',
      useCase: 'Structured, anxiety-free interview prep pacing with direct one-click visualizer launches.',
      icon: <Calendar className="w-8 h-8 text-amber-400" />,
      color: 'border-amber-500/40 hover:border-amber-400',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      action: () => onNavigate('roadmap')
    },
    {
      id: 'aptitude',
      title: 'Timed Aptitude & CS Core Mock Test',
      track: 'PREP',
      category: 'Examination Engine',
      tag: 'Timed Exam',
      featured: true,
      desc: 'Industry benchmark aptitude tests covering Quantitative, Logical, Probability, and CS Core arithmetic with full step-by-step analytical derivations.',
      useCase: 'Screening round assessments, campus placements, and quantitative engineering tests.',
      icon: <Trophy className="w-8 h-8 text-emerald-400" />,
      color: 'border-emerald-500/40 hover:border-emerald-400',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      action: () => onNavigate('aptitude')
    }
  ];

  // Filtering
  const filteredCards = cards.filter(card => {
    const matchesTrack = selectedTrack === 'ALL' || card.track === selectedTrack;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      card.title.toLowerCase().includes(query) ||
      card.category.toLowerCase().includes(query) ||
      card.desc.toLowerCase().includes(query) ||
      card.useCase.toLowerCase().includes(query);

    return matchesTrack && matchesSearch;
  });

  const TRACK_TABS: Array<{ id: TrackCategory; label: string }> = [
    { id: 'ALL', label: 'All Tracks' },
    { id: 'DSA', label: 'DSA & LeetCode' },
    { id: 'LLD', label: 'Low-Level Design (LLD)' },
    { id: 'NETWORKING', label: 'Networking' },
    { id: 'OS', label: 'Operating Systems' },
    { id: 'DATABASES', label: 'Databases' },
    { id: 'SYSTEM_DESIGN', label: 'System Design & JVM' },
    { id: 'PREP', label: 'Roadmap & Aptitude' }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Hero Welcome Banner (Chai Visual Style) */}
      <div className="bg-gradient-to-r from-bg-panel via-bg-card to-bg-panel border border-border-custom rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded font-bold bg-[#5de6ff]/10 text-[#5de6ff] border border-[#5de6ff]/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Chai Visual Multi-Track Platform
            </span>
            <span className="text-xs font-mono text-text-muted">v2.4 Production Engine</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight leading-tight">
            The Interactive Visual Learning Platform for Engineers
          </h1>
          <p className="text-xs md:text-sm text-text-muted mt-2 leading-relaxed font-mono">
            Explore algorithms, object-oriented design, network packets, operating system kernels, and database storage engines through unified step-by-step vector graphics.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> 6 Visual Disciplines
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#5de6ff]" /> Brute Force vs Optimized Dual Playback
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Full Mock Aptitude Suite
            </span>
          </div>
        </div>
      </div>

      {/* Track Selector Navigation Hub */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border-custom">
        {TRACK_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTrack(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTrack === tab.id
                ? 'bg-accent-custom text-white shadow-lg'
                : 'text-text-muted hover:text-white hover:bg-bg-card'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modules Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCards.map(card => (
          <div
            key={card.id}
            onClick={card.action}
            className={`bento-card rounded-2xl border ${card.color} bg-bg-panel/90 p-5 transition-all duration-200 cursor-pointer group flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5 ${
              card.featured ? 'ring-1 ring-accent-custom/20' : ''
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-bg-card border border-border-custom group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${card.badgeColor}`}>
                    {card.tag || card.track}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">{card.category}</span>
                </div>
              </div>

              <h3 className="text-base font-mono font-bold text-white group-hover:text-[#5de6ff] transition-colors leading-snug">
                {card.title}
              </h3>

              <p className="text-xs text-text-muted mt-2 line-clamp-3 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border-custom/60 space-y-2">
              <div className="text-[10px] font-mono text-slate-300 bg-bg-card/70 p-2 rounded-lg border border-border-custom/40">
                <span className="text-text-accent font-bold">💡 Real-World: </span>
                {card.useCase}
              </div>

              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#5de6ff] pt-1">
                <span>Launch Interactive Module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="py-16 text-center text-text-muted font-mono">
          <Search className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-white">No matching modules found</h3>
          <p className="text-xs mt-1">Try switching tracks or clearing the search query.</p>
        </div>
      )}
    </div>
  );
}
