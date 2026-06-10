import { DSATopic } from '../types';
import { Play, Brain, ListCollapse, Network, GitPullRequest, Search, BookOpen, Sparkles, HelpCircle } from 'lucide-react';

interface ExploreLibraryProps {
  onNavigate: (topic: DSATopic, defaultAlgo?: string) => void;
  searchQuery: string;
}

export default function ExploreLibrary({ onNavigate, searchQuery }: ExploreLibraryProps) {
  const cards = [
    {
      id: 'leetcode',
      title: 'LeetCode & NeetCode Classics',
      category: 'Curriculum Solutions',
      tag: 'New',
      group: 'interview',
      useCase: 'Target technical and whiteboard interviews with standard problem structures.',
      desc: 'Animate and step-through solutions to structural classics including Two Sum, Valid Parentheses, Reverse List, Invert Tree, Binary Search, and Container with Most Water.',
      icon: <BookOpen className="w-10 h-10 text-[#5de6ff]" />,
      color: 'border-[#5de6ff]/20 hover:border-[#5de6ff]/60',
      action: () => onNavigate('leetcode', 'twosum')
    },
    {
      id: 'astart',
      title: 'A* Search Algorithm',
      category: 'Pathfinding',
      tag: 'Featured',
      group: 'sandboxes',
      useCase: 'Real/Live GPS Navigation (e.g., Google Maps routes) & Game AI robotics path movement.',
      desc: 'Visualize how A* intelligently navigates complex grids, balancing distance to the goal with movement cost to find the optimal path.',
      icon: <Network className="w-10 h-10 text-[#bfdbfe]" />,
      color: 'border-[#bfdbfe]/20 hover:border-[#bfdbfe]/60',
      action: () => onNavigate('graphs')
    },
    {
      id: 'bst',
      title: 'Binary Search Trees',
      category: 'Trees',
      group: 'sandboxes',
      useCase: 'Database indexes/B-Trees, system directory file structures, and search maps.',
      desc: 'Understand insertion, deletion, and traversal operations step-by-step in an auto-layout hierarchical diagram.',
      icon: <Brain className="w-10 h-10 text-[#c0c1ff]" />,
      color: 'border-[#c0c1ff]/20 hover:border-[#c0c1ff]/60',
      action: () => onNavigate('trees', 'inorderBST')
    },
    {
      id: 'quicksort',
      title: 'Quick Sort',
      category: 'Sorting',
      group: 'sandboxes',
      useCase: 'High-speed system sort engines (e.g., C++ std::sort) and database ordering.',
      desc: 'Dive into pivot selection, recursive subdivisions, and array partitioning mechanics with variable tracking.',
      icon: <ListCollapse className="w-10 h-10 text-[#eec200]" />,
      color: 'border-[#eec200]/20 hover:border-[#eec200]/60',
      action: () => onNavigate('sorting', 'quicksort')
    },
    {
      id: 'linkedlist',
      title: 'Linked List Splicing',
      category: 'Linked Lists',
      group: 'sandboxes',
      useCase: 'Cache algorithms (LRU Cache), audio playlist queues, and browser history logs.',
      desc: 'See pointer rewires, node allocations, and element insertion/deletion step-by-step with continuous coordinate recalculation.',
      icon: <GitPullRequest className="w-10 h-10 text-[#22C55E]" />,
      color: 'border-[#22C55E]/20 hover:border-[#22C55E]/60',
      action: () => onNavigate('linked-list', 'insertAfter')
    }
  ];

  // Filter based on search query
  const filteredCards = cards.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.useCase.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const interviewCards = filteredCards.filter(c => c.group === 'interview');
  const sandboxCards = filteredCards.filter(c => c.group === 'sandboxes');

  return (
    <div className="w-full">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-[#dae2fd] mb-2">Explore Library</h1>
          <p className="text-[#c7c4d7] text-lg">Interactive visualizations and play environments for algorithms.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#94A3B8] font-mono bg-[#171f33] px-3 py-1.5 rounded-md border border-slate-800">
            {filteredCards.length} modules available
          </span>
        </div>
      </header>

      {/* SECTION 1: LeetCode Interview Preparation */}
      {interviewCards.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800/60 pb-3">
            <BookOpen className="w-5 h-5 text-[#5de6ff]" />
            <h2 className="text-xl font-display font-medium text-[#dae2fd]">
              Interview Coding Curriculum
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewCards.map(card => (
              <div 
                key={card.id}
                onClick={card.action}
                className={`bento-card md:col-span-3 bg-gradient-to-r from-[#171f33] to-[#111827] rounded-2xl border ${card.color} p-6 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 cursor-pointer group hover:scale-[1.005]`}
              >
                <div className="w-14 h-14 bg-slate-900/50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#5de6ff]/20 text-[#5de6ff] text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-[#5de6ff]/30">
                      {card.tag || 'Interactive'}
                    </span>
                    <span className="text-xs font-mono text-[#94A3B8]">{card.category}</span>
                  </div>
                  <h3 className="text-xl font-display font-medium text-[#dae2fd] mb-1 group-hover:text-white transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#94A3B8] mb-2 leading-relaxed">
                    {card.desc}
                  </p>
                  <p className="text-xs font-mono text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded inline-block border border-emerald-500/10">
                    💡 <span className="font-bold">Real-World Use Case:</span> {card.useCase}
                  </p>
                </div>
                <div className="shrink-0">
                  <button className="flex items-center gap-1.5 bg-[#5de6ff] text-slate-950 font-mono text-xs font-bold px-4 py-2 rounded-xl border border-[#5de6ff]/30 hover:bg-[#a6f3ff] transition-all cursor-pointer shadow-lg active:scale-95">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Open Interview Set</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Concept Sandboxes */}
      {sandboxCards.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800/60 pb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-display font-medium text-[#dae2fd]">
              Advanced DSA Concept Sandboxes & Playgrounds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Render A* specifically as a big featured card if it's in sandboxes */}
            {sandboxCards.some(c => c.id === 'astart') && (
              <div 
                onClick={() => onNavigate('graphs')}
                className="bento-card md:col-span-2 row-span-2 bg-[#171f33] rounded-2xl border border-slate-800 hover:border-[#bfdbfe]/60 transition-all duration-300 relative overflow-hidden group min-h-[340px] flex flex-col justify-end p-8 cursor-pointer shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0fb0ff]/10 via-transparent to-transparent opacity-40 z-0 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#bfdbfe]/20 text-[#bfdbfe] text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-[#bfdbfe]/30">
                      Featured
                    </span>
                    <span className="text-xs font-mono text-[#94A3B8]">Pathfinding Algorithm</span>
                  </div>
                  <h3 className="text-2xl font-display font-medium text-[#dae2fd] mb-2 group-hover:text-white transition-colors">
                    A* Search Algorithm
                  </h3>
                  <p className="text-[#c7c4d7] text-sm mb-4 max-w-xl leading-relaxed">
                    Visualize how A* intelligently navigates complex grids, calculating cumulative step weights and heuristic distances dynamically.
                  </p>
                  
                  {/* Real-world Use Case Explanation Box */}
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 mb-5 text-xs text-blue-300 font-mono flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#bfdbfe]" />
                    <div>
                      <span className="font-bold text-[#bfdbfe]">🖥️ Practical Real-World Use Case:</span> GPS map services (Google Maps routing), autonomous driving path planners, and robotic path movement.
                    </div>
                  </div>

                  <button className="flex items-center gap-2 bg-[#bfdbfe] active:scale-95 text-slate-950 text-xs font-bold tracking-wider px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer shadow-lg">
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch Grid Pathfinder</span>
                  </button>
                </div>
              </div>
            )}

            {/* Render rest of Regular Sandboxes */}
            {sandboxCards.filter(c => c.id !== 'astart').map(card => (
              <div 
                key={card.id}
                onClick={card.action}
                className={`bento-card bg-[#171f33] rounded-2xl border ${card.color} p-6 transition-all duration-300 flex flex-col min-h-[260px] cursor-pointer group hover:scale-[1.01]`}
              >
                <div className="w-12 h-12 bg-slate-900/50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <div>
                  <div className="text-xs font-mono text-[#94A3B8] mb-1">{card.category}</div>
                  <h3 className="text-lg font-headline-sm text-[#dae2fd] mb-2 group-hover:text-white transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed line-clamp-3">
                    {card.desc}
                  </p>
                </div>
                
                {/* Use Case highlight */}
                <div className="mt-auto pt-3 border-t border-slate-800/50 text-[11px] font-mono text-emerald-400 bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                  <span className="font-bold">🖥️ Use Case:</span> {card.useCase}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredCards.length === 0 && (
        <div className="col-span-full py-16 text-center text-[#94A3B8]">
          <Search className="w-12 h-12 mx-auto stroke-slate-700 mb-4 animate-pulse" />
          <p className="text-lg font-display mb-1 text-slate-300">No matching algorithms found</p>
          <p className="text-sm text-slate-500">Try searching for other keywords...</p>
        </div>
      )}
    </div>
  );
}
