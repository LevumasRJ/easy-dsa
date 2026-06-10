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

      {/* SECTION 2: Concept Sandboxes with Real-world Use Cases Grouping */}
      {sandboxCards.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-800/60 pb-3">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            <h2 className="text-xl font-display font-medium text-[#dae2fd]">
              Practical Systems Engineering Sandboxes
            </h2>
          </div>
          <p className="text-[#94A3B8] text-sm mb-6 max-w-2xl leading-relaxed">
             Fundamental software architectures are built on data structures. These interactive sandboxes visualize exactly how basic data models solve complex modern engineering challenges.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sandboxCards.map(card => {
              if (card.id === 'astart') {
                return (
                  <div 
                    key={card.id}
                    onClick={() => onNavigate('graphs')}
                    className="bento-card border border-slate-800 hover:border-[#bfdbfe]/60 bg-[#171f33] rounded-2xl p-6 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-lg h-full hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                          {card.icon}
                        </div>
                        <span className="bg-[#bfdbfe]/10 text-[#bfdbfe] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-[#bfdbfe]/20">
                          Routing Engine
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-[#bfdbfe] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[#94A3B8] text-xs leading-relaxed mb-4">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-4 bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 text-xs font-mono text-blue-300">
                      <div className="font-bold text-[#bfdbfe] mb-1">🖥️ Systems Use Case:</div>
                      {card.useCase}
                    </div>
                  </div>
                );
              }

              if (card.id === 'bst') {
                return (
                  <div 
                    key={card.id}
                    onClick={card.action}
                    className="bento-card border border-slate-800 hover:border-[#c0c1ff]/60 bg-[#171f33] rounded-2xl p-6 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-lg h-full hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                          {card.icon}
                        </div>
                        <span className="bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-[#c0c1ff]/20">
                          Search Indexer
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-[#c0c1ff] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[#94A3B8] text-xs leading-relaxed mb-4">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-4 bg-purple-500/5 p-3 rounded-xl border border-purple-500/10 text-xs font-mono text-purple-300">
                      <div className="font-bold text-[#c0c1ff] mb-1">🖥️ Systems Use Case:</div>
                      {card.useCase}
                    </div>
                  </div>
                );
              }

              if (card.id === 'quicksort') {
                return (
                  <div 
                    key={card.id}
                    onClick={card.action}
                    className="bento-card border border-slate-800 hover:border-amber-500/60 bg-[#171f33] rounded-2xl p-6 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-lg h-full hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl">
                          {card.icon}
                        </div>
                        <span className="bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-amber-500/20">
                          Data Ordering
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[#94A3B8] text-xs leading-relaxed mb-4">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-4 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-xs font-mono text-amber-300">
                      <div className="font-bold text-amber-400 mb-1">🖥️ Systems Use Case:</div>
                      {card.useCase}
                    </div>
                  </div>
                );
              }

              if (card.id === 'linkedlist') {
                return (
                  <div 
                    key={card.id}
                    onClick={card.action}
                    className="bento-card border border-slate-800 hover:border-emerald-500/60 bg-[#171f33] rounded-2xl p-6 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-lg h-full hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                          {card.icon}
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-emerald-500/20">
                          Queue Splicor
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[#94A3B8] text-xs leading-relaxed mb-4">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-4 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 text-xs font-mono text-emerald-300">
                      <div className="font-bold text-emerald-400 mb-1">🖥️ Systems Use Case:</div>
                      {card.useCase}
                    </div>
                  </div>
                );
              }

              return null;
            })}
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
