import { DSATopic } from '../types';
import { Play, Brain, ListCollapse, Network, GitPullRequest, Search, BookOpen } from 'lucide-react';

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
      desc: 'Visualize how A* intelligently navigates complex grids, balancing distance to the goal with movement cost to find the optimal path.',
      icon: <Network className="w-10 h-10 text-[#bfdbfe]" />,
      color: 'border-[#bfdbfe]/20 hover:border-[#bfdbfe]/60',
      action: () => onNavigate('graphs')
    },
    {
      id: 'bst',
      title: 'Binary Search Trees',
      category: 'Trees',
      desc: 'Understand insertion, deletion, and traversal operations step-by-step in an auto-layout hierarchical diagram.',
      icon: <Brain className="w-10 h-10 text-[#c0c1ff]" />,
      color: 'border-[#c0c1ff]/20 hover:border-[#c0c1ff]/60',
      action: () => onNavigate('trees', 'inorderBST')
    },
    {
      id: 'quicksort',
      title: 'Quick Sort',
      category: 'Sorting',
      desc: 'Dive into pivot selection, recursive subdivisions, and array partitioning mechanics with variable tracking.',
      icon: <ListCollapse className="w-10 h-10 text-[#eec200]" />,
      color: 'border-[#eec200]/20 hover:border-[#eec200]/60',
      action: () => onNavigate('sorting', 'quicksort')
    },
    {
      id: 'linkedlist',
      title: 'Linked List Splicing',
      category: 'Linked Lists',
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
    card.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-[#dae2fd] mb-2">Explore Library</h1>
          <p className="text-[#c7c4d7] text-lg">Interactive visualizations for core data structures and algorithms.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#94A3B8] font-mono bg-[#171f33] px-3 py-1.5 rounded-md border border-slate-800">
            {filteredCards.length} visualizers found
          </span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hero featured card */}
        {filteredCards.some(c => c.id === 'astart') && (
          <div className="bento-card md:col-span-2 row-span-2 bg-[#171f33] rounded-2xl border border-slate-800/80 hover:border-[#5de6ff]/30 transition-all duration-300 relative overflow-hidden group min-h-[400px] flex flex-col justify-end p-8">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#171f33]/90 to-transparent z-10" />
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(93,230,255,0.4) 1.5px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-20">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#5de6ff]/20 text-[#5de6ff] text-xs font-mono font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-[#5de6ff]/30">
                  Featured
                </span>
                <span className="bg-slate-800 text-slate-300 text-xs font-mono px-2.5 py-1 rounded uppercase tracking-wider">
                  Pathfinding
                </span>
              </div>
              <h3 className="text-3xl font-display font-medium text-[#dae2fd] mb-3 group-hover:text-[#5de6ff] transition-colors">
                A* Search Algorithm
              </h3>
              <p className="text-[#c7c4d7] mb-6 max-w-xl line-clamp-3">
                Watch A* navigate dynamic maps using heuristics to target high probability cells, calculating coordinates, G/H costs recursively.
              </p>
              <button 
                onClick={() => onNavigate('graphs')}
                className="flex items-center gap-2 bg-[#c0c1ff] active:scale-95 text-[#1000a9] text-xs font-bold tracking-wider px-5 py-2.5 rounded-lg hover:bg-[#e1e0ff] transition-all cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-current" />
                Launch A* Grid Pathfinding Visualizer
              </button>
            </div>
          </div>
        )}

        {/* Regular Cards */}
        {filteredCards.filter(c => c.id !== 'astart').map(card => (
          <div 
            key={card.id}
            onClick={card.action}
            className={`bento-card bg-[#171f33] rounded-2xl border ${card.color} p-6 transition-all duration-300 flex flex-col min-h-[220px] cursor-pointer group hover:scale-[1.01]`}
          >
            <div className="w-12 h-12 bg-slate-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <div className="mt-auto">
              <div className="text-xs font-mono text-[#94A3B8] mb-1">{card.category}</div>
              <h3 className="text-lg font-headline-sm text-[#dae2fd] mb-2 group-hover:text-white transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-[#94A3B8] line-clamp-2">
                {card.desc}
              </p>
            </div>
          </div>
        ))}

        {filteredCards.length === 0 && (
          <div className="col-span-full py-16 text-center text-[#94A3B8]">
            <Search className="w-12 h-12 mx-auto stroke-slate-700 mb-4 animate-pulse" />
            <p className="text-lg font-display mb-1 text-slate-300">No matching algorithms found</p>
            <p className="text-sm text-slate-500">Try searching for "Trees", "Sorting", or "Lists"</p>
          </div>
        )}
      </div>
    </div>
  );
}
