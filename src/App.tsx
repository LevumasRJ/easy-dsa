import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, 
  Settings, HelpCircle, Search, User, Sparkles, 
  Layers, ChevronDown, ListCollapse,
  Brain, Network, BookOpen, Crown, ChevronRight, PlayCircle
} from 'lucide-react';

import { DSATopic, SortingAlgo, ListAlgo, TreeAlgo, LeetAlgo, Snapshot } from './types';
import { DEFAULT_BST_NODES } from './algorithms';

import ExploreLibrary from './components/ExploreLibrary';
import SortingCanvas from './components/SortingCanvas';
import LinkedListCanvas from './components/LinkedListCanvas';
import BSTCanvas from './components/BSTCanvas';
import LeetCodeCanvas from './components/LeetCodeCanvas';
import CodeEditorPanel from './components/CodeEditorPanel';
import VariablesTracker from './components/VariablesTracker';
import OutputConsole from './components/OutputConsole';

export default function App() {
  // Navigation State
  const [activeTopic, setActiveTopic] = useState<DSATopic>('explore');
  const [searchQuery, setSearchQuery] = useState('');

  // Timeline & Playback States
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // milliseconds step delay
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExplanationCollapsed, setIsExplanationCollapsed] = useState(false);

  // Active Algorithm Selectors for each workspace
  const [activeSortingAlgo, setActiveSortingAlgo] = useState<SortingAlgo>('quicksort');
  const [activeListAlgo, setActiveListAlgo] = useState<ListAlgo>('insertAfter');
  const [activeTreeAlgo, setActiveTreeAlgo] = useState<TreeAlgo>('insertBST');
  const [activeLeetAlgo, setActiveLeetAlgo] = useState<LeetAlgo>('twosum');

  // Triggered when any Canvas generates a deterministic timeline
  const handleSnapshotsGenerated = (generatedSnapshots: Snapshot[]) => {
    setSnapshots(generatedSnapshots);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  // Playback loop scheduler
  useEffect(() => {
    if (!isPlaying) return;

    const tick = () => {
      setCurrentIndex((prev) => {
        if (prev >= snapshots.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    };

    const intervalId = setInterval(tick, speed);
    return () => clearInterval(intervalId);
  }, [isPlaying, speed, snapshots.length]);

  // Stepping controls
  const handlePlayPause = () => {
    if (currentIndex >= snapshots.length - 1) {
      // Loop back reset if played to final
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.min(snapshots.length - 1, prev + 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleSkipToEnd = () => {
    setIsPlaying(false);
    setCurrentIndex(snapshots.length - 1);
  };

  // Determine current tracing details
  const activeSnap = snapshots[currentIndex] || {
    lineHighlighted: 1,
    actionType: 'init',
    explanation: 'Awaiting visualization setup initialization...',
    consoleOutput: '[INFO] Workspace initialized.'
  };

  // Map active algorithm name to display code template
  const getEditorAlgoId = () => {
    if (activeTopic === 'sorting') return activeSortingAlgo;
    if (activeTopic === 'linked-list') return activeListAlgo;
    if (activeTopic === 'leetcode') return activeLeetAlgo;
    return activeTreeAlgo;
  };

  // Clear snapshots and triggers on topic navigation
  const handleTopicNavigation = (topic: DSATopic, defaultAlgo?: string) => {
    setActiveTopic(topic);
    setIsPlaying(false);
    setCurrentIndex(0);
    setSearchQuery('');
    
    if (defaultAlgo) {
      if (topic === 'sorting') setActiveSortingAlgo(defaultAlgo as SortingAlgo);
      if (topic === 'linked-list') setActiveListAlgo(defaultAlgo as ListAlgo);
      if (topic === 'trees') setActiveTreeAlgo(defaultAlgo as TreeAlgo);
      if (topic === 'leetcode') setActiveLeetAlgo(defaultAlgo as LeetAlgo);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col selection:bg-[#8083ff]/30 antialiased overflow-x-hidden">
      
      {/* 1. Header Navigation Bar */}
      <header className="fixed w-full flex justify-between items-center px-6 h-16 bg-[#0b1326]/85 backdrop-blur-xl border-b border-slate-800/80 z-50">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => handleTopicNavigation('explore')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8083ff] to-[#5de6ff] flex items-center justify-center p-[1px]">
              <div className="w-full h-full rounded-[7px] bg-[#0b1326] flex items-center justify-center font-bold text-sm text-[#5de6ff] group-hover:scale-95 transition-all">
                A
              </div>
            </div>
            <span className="font-display text-2xl font-black bg-gradient-to-r from-white via-[#c0c1ff] to-[#5de6ff] bg-clip-text text-transparent tracking-tighter">
              AlgoFlow
            </span>
          </div>

          {/* Search Bar - only visible on Explore desk */}
          {activeTopic === 'explore' && (
            <div className="hidden md:flex relative w-64 group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5de6ff] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search algorithms..."
                className="w-full bg-[#131b2e] border border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-xs text-[#dae2fd] focus:outline-none focus:border-[#5de6ff]/60 transition-all font-mono placeholder:text-slate-600"
              />
            </div>
          )}
        </div>

        {/* Global Toolbar Tabs */}
        <nav className="hidden md:flex items-center gap-6 h-full">
          <button 
            onClick={() => handleTopicNavigation('explore')}
            className={`h-full flex items-center text-xs font-mono font-bold tracking-wider uppercase border-b-2 px-1 transition-colors ${
              activeTopic === 'explore' 
                ? 'text-[#8083ff] border-[#8083ff] pb-[1px]' 
                : 'text-[#94A3B8] border-transparent hover:text-white'
            }`}
          >
            Visualizer
          </button>
          <button 
            onClick={() => handleTopicNavigation('leetcode', 'twosum')}
            className={`h-full flex items-center text-xs font-mono font-bold tracking-wider uppercase border-b-2 px-1 transition-colors ${
              activeTopic === 'leetcode' 
                ? 'text-[#8083ff] border-[#8083ff] pb-[1px]' 
                : 'text-[#94A3B8] border-transparent hover:text-white'
            }`}
          >
            LeetCode Setup
          </button>
          <a href="#" className="h-full flex items-center text-xs font-mono font-bold tracking-wider uppercase text-[#94A3B8] hover:text-white transition-colors">
            Courses
          </a>
          <a href="#" className="h-full flex items-center text-xs font-mono font-bold tracking-wider uppercase text-[#94A3B8] hover:text-white transition-colors">
            Leaderboard
          </a>
          <a href="#" className="h-full flex items-center text-xs font-mono font-bold tracking-wider uppercase text-[#94A3B8] hover:text-white transition-colors">
            Docs
          </a>
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/40 cursor-pointer transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/40 cursor-pointer transition-colors relative">
            <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full absolute top-2 right-2 ring-1 ring-[#0b1326]" />
            <User className="w-4 h-4" />
          </button>
          
          <button className="hidden sm:inline-flex items-center gap-1 bg-[#8083ff]/10 border border-[#8083ff]/30 text-[#c0c1ff] active:scale-95 text-xs font-bold tracking-wider px-3 py-1.5 rounded-lg hover:bg-[#8083ff]/20 transition-all cursor-pointer">
            <Crown className="w-3.5 h-3.5 text-[#eec200]" />
            Sign In
          </button>
        </div>
      </header>

      {/* 2. Main Layout Compartment */}
      <div className="flex flex-1 pt-16 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Collapsible Left Sidebar */}
        <aside className={`bg-[#0f172a] border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 ${
          isSidebarOpen ? 'w-[260px]' : 'w-[64px]'
        } shrink-0 overflow-y-auto`}>
          
          {/* Top content */}
          <div>
            {/* User Profile widget */}
            {isSidebarOpen ? (
              <div className="p-4 border-b border-slate-800/50 mb-4 bg-[#131b2e]/40">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#5de6ff] to-[#8083ff] p-[2px] shadow-lg">
                    <div className="w-full h-full bg-[#0f172a] overflow-hidden rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold font-mono text-[#5de6ff]">ORB</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[140px]">Luminous User</h4>
                    <span className="text-[10px] font-mono text-[#eec200] block mt-0.5">64% Mastered</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#5de6ff] to-[#8083ff] w-[64%]" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-4 border-b border-slate-800/50 mb-4 hover:scale-105 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#5de6ff]/20 border border-[#5de6ff]/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#5de6ff]" />
                </div>
              </div>
            )}

            {/* Main Tabs list */}
            <nav className="px-2 space-y-1">
              <button
                onClick={() => handleTopicNavigation('explore')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'explore'
                    ? 'bg-[#8083ff]/10 text-[#8083ff] border-r-2 border-[#8083ff] shadow-[0_0_15px_rgba(128,131,255,0.15)]'
                    : 'text-[#94A3B8] hover:bg-slate-800/30 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>Explore</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('sorting', 'quicksort')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'sorting'
                    ? 'bg-[#8083ff]/10 text-[#8083ff] border-r-2 border-[#8083ff] shadow-[0_0_15px_rgba(128,131,255,0.15)]'
                    : 'text-[#94A3B8] hover:bg-slate-800/30 hover:text-white'
                }`}
              >
                <ListCollapse className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>Sorting</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('linked-list', 'insertAfter')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'linked-list'
                    ? 'bg-[#8083ff]/10 text-[#8083ff] border-r-2 border-[#8083ff] shadow-[0_0_15px_rgba(128,131,255,0.15)]'
                    : 'text-[#94A3B8] hover:bg-slate-800/30 hover:text-white'
                }`}
              >
                <Network className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>Linked Lists</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('trees', 'insertBST')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'trees'
                    ? 'bg-[#8083ff]/10 text-[#8083ff] border-r-2 border-[#8083ff] shadow-[0_0_15px_rgba(128,131,255,0.15)]'
                    : 'text-[#94A3B8] hover:bg-slate-800/30 hover:text-white'
                }`}
              >
                <Brain className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>BST Trees</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('leetcode', 'twosum')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'leetcode'
                    ? 'bg-[#8083ff]/10 text-[#8083ff] border-r-2 border-[#8083ff] shadow-[0_0_15px_rgba(128,131,255,0.15)]'
                    : 'text-[#94A3B8] hover:bg-slate-800/30 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0 text-[#5de6ff]" />
                {isSidebarOpen && <span>LeetCode / NeetCode</span>}
              </button>
            </nav>
          </div>

          {/* Bottom links and collapse handle */}
          <div className="p-2 border-t border-slate-800/50">
            {isSidebarOpen && (
              <div className="bg-gradient-to-br from-[#171f33] to-[#0f172a] p-4 rounded-xl border border-slate-800 mb-3">
                <Sparkles className="w-5 h-5 text-[#eec200] mb-2" />
                <h5 className="text-[11px] font-mono tracking-wider font-bold text-white mb-1 uppercase">Pro Subscription</h5>
                <p className="text-[10px] text-[#94A3B8] leading-relaxed mb-3">Unlock graph-theory pathfinding trace grids & advanced datasets.</p>
                <button className="w-full bg-[#dae2fd] hover:bg-white text-[#0b1326] text-[10px] font-mono tracking-wider font-bold py-1.5 rounded-lg active:scale-95 transition-all">
                  UPGRADE
                </button>
              </div>
            )}
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full py-2 flex items-center justify-center text-slate-500 hover:text-white rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors cursor-pointer text-xs font-mono font-semibold"
            >
              {isSidebarOpen ? 'COLLAPSE' : 'EXPAND'}
            </button>
          </div>
        </aside>

        {/* 3. Main Workspace Area (Dynamic depending on active topic) */}
        <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden p-4 gap-4 bg-[#0a0f1d]">
          {activeTopic === 'explore' ? (
            <div className="flex-1 overflow-y-auto p-4">
              <ExploreLibrary 
                onNavigate={handleTopicNavigation} 
                searchQuery={searchQuery}
              />
            </div>
          ) : (
            // Full interactive workspaces with canvas left, editors right
            <>
              {/* Center Canvas Workspace Block */}
              <div className="flex-1 flex flex-col justify-between bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden relative">
                
                {/* Visualizer header indicating complexity metrics */}
                {activeTopic !== 'leetcode' && (
                  <div className="p-4 bg-[#171f33] border-b border-slate-800/80 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#5de6ff] uppercase font-bold bg-[#5de6ff]/10 px-2 py-0.5 rounded border border-[#5de6ff]/20">
                        {activeTopic === 'sorting' ? 'O(n log n)' : activeTopic === 'linked-list' ? 'O(1)' : 'O(log n)'}
                      </span>
                      <h2 className="text-lg font-secondary font-bold text-white ml-2 inline-block align-middle">
                        {activeTopic === 'sorting' 
                          ? (activeSortingAlgo === 'quicksort' ? 'QuickSort' : 'BubbleSort')
                          : activeTopic === 'linked-list'
                            ? (activeListAlgo === 'insertAfter' ? 'insertAfter List Splicing' : 'deleteNode List Removal')
                            : (activeTreeAlgo === 'insertBST' ? 'BST Insert Flow' : activeTreeAlgo === 'searchBST' ? 'BST Search Flow' : 'BST In-Order DFS Traversal')
                        }
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      Step {currentIndex + 1} of {snapshots.length || 1}
                    </span>
                  </div>
                )}

                {/* Sub Visualizer Stage Canvas */}
                <div className={`flex-1 relative flex items-center justify-center overflow-hidden ${activeTopic === 'leetcode' ? 'p-0 h-full w-full' : 'p-6'}`}>
                  
                  {activeTopic === 'sorting' && (
                    <SortingCanvas 
                      currentSnapshot={activeSnap}
                      onSnapshotsGenerated={handleSnapshotsGenerated}
                      activeAlgo={activeSortingAlgo}
                      onAlgoChange={setActiveSortingAlgo}
                    />
                  )}

                  {activeTopic === 'linked-list' && (
                    <LinkedListCanvas
                      currentSnapshot={activeSnap}
                      onSnapshotsGenerated={handleSnapshotsGenerated}
                      activeAlgo={activeListAlgo}
                      onAlgoChange={setActiveListAlgo}
                    />
                  )}

                  {activeTopic === 'trees' && (
                    <BSTCanvas
                      currentSnapshot={activeSnap}
                      onSnapshotsGenerated={handleSnapshotsGenerated}
                      activeAlgo={activeTreeAlgo}
                      onAlgoChange={setActiveTreeAlgo}
                    />
                  )}

                  {activeTopic === 'leetcode' && (
                    <LeetCodeCanvas
                      currentSnapshot={activeSnap}
                      onSnapshotsGenerated={handleSnapshotsGenerated}
                      activeAlgo={activeLeetAlgo}
                      onAlgoChange={setActiveLeetAlgo}
                    />
                  )}

                </div>

                {/* Plain English step-by-step Collapsible Explanation Card */}
                {!isExplanationCollapsed && (
                  <div className="m-4 bg-[#131b2e]/90 backdrop-blur border border-slate-800 rounded-xl p-4 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-widest text-[#8083ff] font-bold uppercase block">
                        English Trace Analyst
                      </span>
                      <button 
                        onClick={() => setIsExplanationCollapsed(true)}
                        className="text-xs text-slate-500 hover:text-white font-mono cursor-pointer"
                      >
                        [Hide]
                      </button>
                    </div>
                    <p className="text-xs font-mono leading-relaxed text-[#dae2fd] text-justify select-text">
                      {activeSnap.explanation}
                    </p>
                  </div>
                )}

                {isExplanationCollapsed && (
                  <button 
                    onClick={() => setIsExplanationCollapsed(false)}
                    className="absolute bottom-4 left-4 bg-slate-900 border border-slate-800 text-xs font-mono text-slate-500 hover:text-white px-3 py-1.5 rounded-lg font-bold"
                  >
                    [Show English Explanation Analyser]
                  </button>
                )}

                {/* Timeline Floating Playback Controls Bar */}
                <div className="px-4 py-3 bg-[#131b2e] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Skip and Play action cluster */}
                  <div className="flex items-center gap-1 bg-[#0f172a] rounded-xl border border-slate-800 p-1">
                    <button
                      onClick={handleReset}
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 active:scale-90 transition-all cursor-pointer"
                      title="Reset timeline"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleStepBackward}
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 active:scale-90 transition-all cursor-pointer"
                      title="Step previous"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handlePlayPause}
                      className="w-9 h-9 bg-[#8083ff]/10 text-[#c0c1ff] hover:bg-[#8083ff]/30 border border-[#8083ff]/30 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(128,131,255,0.15)]"
                      title={isPlaying ? 'Pause' : 'Play algorithm step-by-step'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current text-[#5de6ff]" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      onClick={handleStepForward}
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 active:scale-90 transition-all cursor-pointer"
                      title="Step forward"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSkipToEnd}
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 active:scale-90 transition-all cursor-pointer"
                      title="Skip to end of trace"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Playbacks slide controls slider */}
                  <div className="flex items-center gap-3 bg-[#0f172a] px-4 py-2 rounded-xl border border-slate-800 w-full sm:w-auto">
                    <span className="text-[10px] tracking-widest font-mono text-slate-500 font-bold">SPEED</span>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={2100 - speed} // Inverts so right-side slider movement is faster speed (lower mill interval!)
                      onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
                      className="accent-[#5de6ff] w-28 bg-slate-800 rounded-lg cursor-pointer h-1"
                    />
                    <span className="text-[10px] font-mono font-medium text-[#5de6ff]">
                      {((2100 - speed) / 1000).toFixed(1)}s Delay
                    </span>
                  </div>

                </div>

              </div>

              {/* Right Sidebar Tabbed Panels (Code editor + Variables tracking + terminal console) */}
              <div className="w-full md:w-[350px] lg:w-[400px] shrink-0 flex flex-col gap-4 overflow-y-auto">
                <div className="h-[45%]">
                  <CodeEditorPanel 
                    currentAlgorithm={getEditorAlgoId()} 
                    lineHighlighted={activeSnap.lineHighlighted}
                  />
                </div>
                
                <div className="h-[30%]">
                  <VariablesTracker 
                    variables={activeSnap.variables} 
                    activeTopic={activeTopic}
                  />
                </div>
                
                <div className="h-[25%]">
                  <OutputConsole 
                    snapshots={snapshots}
                    currentIndex={currentIndex}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
