import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, 
  Settings, HelpCircle, Search, User, Sparkles, 
  Layers, ChevronDown, ListCollapse,
  Brain, Network, BookOpen, Crown, ChevronRight, PlayCircle,
  Trophy, Timer, Target, Star, Zap, Split, Cpu, RefreshCw, Database,
  FileJson, Compass, Volume2, VolumeX, Command
} from 'lucide-react';

import { DSATopic, SortingAlgo, ListAlgo, TreeAlgo, LeetAlgo, Snapshot } from './types';
import { DEFAULT_BST_NODES, generateBubbleSortSnapshots, generateQuickSortSnapshots } from './algorithms';
import { soundSynth } from './utils/soundSynthesizer';

import ExploreLibrary from './components/ExploreLibrary';
import SortingCanvas from './components/SortingCanvas';
import LinkedListCanvas from './components/LinkedListCanvas';
import BSTCanvas from './components/BSTCanvas';
import LeetCodeCanvas from './components/LeetCodeCanvas';
import CodeEditorPanel from './components/CodeEditorPanel';
import VariablesTracker from './components/VariablesTracker';
import OutputConsole from './components/OutputConsole';
import JvmDeveloperMode from './components/JvmDeveloperMode';
import SystemDesignSandbox from './components/SystemDesignSandbox';
import AdvancedDsSandbox from './components/AdvancedDsSandbox';
import GraphCanvas from './components/GraphCanvas';
import ComplexityOverlay from './components/ComplexityOverlay';
import CommandPaletteModal from './components/CommandPaletteModal';

// Chai Visual Canvas Engines
import LLDCanvas from './components/LLDCanvas';
import NetworkingCanvas from './components/NetworkingCanvas';
import OSCanvas from './components/OSCanvas';
import DBCanvas from './components/DBCanvas';
import RoadmapPlanner from './components/RoadmapPlanner';
import AptitudeEngine from './components/AptitudeEngine';
import { DUAL_APPROACH_BENCHMARKS, generateTwoSumDualSnapshots } from './dualApproachAlgorithms';
import { AlgorithmicApproach } from './types';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light' | 'amoled' | 'hacker' | 'cyberpunk'>('dark');

  // Command Palette & Sound States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundSynth.getMuted());

  // Navigation State
  const [activeTopic, setActiveTopic] = useState<DSATopic>('explore');
  const [searchQuery, setSearchQuery] = useState('');

  // Dual-Approach Algorithmic State (Brute Force vs Optimized Trick)
  const [activeApproach, setActiveApproach] = useState<AlgorithmicApproach>('OPTIMIZED_TRICK');

  // Mobile layout tabs
  // 'visualizer' | 'code' | 'variables' | 'console' | 'ai-tutor'
  const [activeMobileTab, setActiveMobileTab] = useState<'visualizer' | 'code' | 'variables' | 'console' | 'ai-tutor'>('visualizer');

  // Unified Timeline States
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms delay
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExplanationCollapsed, setIsExplanationCollapsed] = useState(false);

  // Side-by-Side Algorithm Comparison Mode
  const [compareMode, setCompareMode] = useState(false);
  const [compareSnapshots, setCompareSnapshots] = useState<Snapshot[]>([]);
  const [isComplexityOpen, setIsComplexityOpen] = useState(false);
  const [comparisonStats, setComparisonStats] = useState({
    algoAName: 'QuickSort',
    algoBName: 'BubbleSort',
    algoA_Comparisons: 0,
    algoB_Comparisons: 0,
    algoA_Swaps: 0,
    algoB_Swaps: 0,
  });

  // Active Algorithm selectors
  const [activeSortingAlgo, setActiveSortingAlgo] = useState<SortingAlgo>('quicksort');
  const [activeListAlgo, setActiveListAlgo] = useState<ListAlgo>('insertAfter');
  const [activeTreeAlgo, setActiveTreeAlgo] = useState<TreeAlgo>('insertBST');
  const [activeLeetAlgo, setActiveLeetAlgo] = useState<LeetAlgo>('twosum');

  // Timed Interview Mode State
  const [interviewMode, setInterviewMode] = useState(false);
  const [interviewTimer, setInterviewTimer] = useState(180); // 3 minutes
  const [interviewScore, setInterviewScore] = useState(0);
  const [interviewSuccess, setInterviewSuccess] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showInterviewReport, setShowInterviewReport] = useState(false);

  // Gamification & XP State
  const [xp, setXp] = useState(420);
  const [streak, setStreak] = useState(14);
  const [level, setLevel] = useState(3);
  const [showXpAlert, setShowXpAlert] = useState<string | null>(null);
  const [badges, setBadges] = useState<string[]>([
    'Visual Maven',
  ]);
  const [awardedActions, setAwardedActions] = useState<string[]>([]);

  // AI Tutor Coach State
  const [aiTutorDifficulty, setAiTutorDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    { 
      role: 'assistant', 
      text: 'Hello! I am your Socratic AI Coach. Play the trace timeline or ask me structural questions. I’ve tailored my analogies to your current level!', 
      time: '07:54 AM' 
    }
  ]);
  const [userChatInput, setUserChatInput] = useState('');

  // Socratic question hints
  const [socraticQuestion, setSocraticQuestion] = useState('Why do you think we need to save variables inside stack register contexts before shifting values?');

  // Trigger XP award floating notification
  const triggerXpAward = (amount: number, reason: string) => {
    const reasonSlug = 'reason_' + reason.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (awardedActions.includes(reasonSlug)) return;
    setAwardedActions(prev => [...prev, reasonSlug]);

    setXp(v => {
      const nextXp = v + amount;
      const targetLevel = Math.floor(nextXp / 200) + 1;
      if (targetLevel > level) {
        setLevel(targetLevel);
        setShowXpAlert(`Level Up! You reached Level ${targetLevel} 🎉`);
      }
      return nextXp;
    });

    // Check achievement badge unlocks
    setBadges(prev => {
      const updated = [...prev];
      if (xp >= 500 && !updated.includes('Trace Prodigy')) {
        updated.push('Trace Prodigy');
        setShowXpAlert('Completed Achievement unlocked: Trace Prodigy! 🏆');
      }
      if (interviewSuccess && !updated.includes('Interview Victor')) {
        updated.push('Interview Victor');
        setShowXpAlert('Completed Achievement unlocked: Interview Victor! 🏁');
      }
      if (theme === 'hacker' && !updated.includes('Hacker Spirit')) {
        updated.push('Hacker Spirit');
      }
      return updated;
    });

    setShowXpAlert(`+${amount} XP: ${reason}`);
    setTimeout(() => setShowXpAlert(null), 3500);
  };

  // Deduplicating XP award helper
  const awardXpOnce = (actionId: string, amount: number, reason: string) => {
    if (awardedActions.includes(actionId)) return;
    setAwardedActions(prev => [...prev, actionId]);
    triggerXpAward(amount, reason);
  };

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs or textareas
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleReset();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setCompareMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [snapshots.length, isPlaying]);

  // Timed Interview ticking
  useEffect(() => {
    if (!interviewMode) return;
    const interval = setInterval(() => {
      setInterviewTimer(v => {
        if (v <= 1) {
          clearInterval(interval);
          setInterviewMode(false);
          setShowInterviewReport(true);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [interviewMode]);

  // Handle snapshots generated fallback
  const handleSnapshotsGenerated = (generatedSnapshots: Snapshot[]) => {
    setSnapshots(generatedSnapshots);
    setCurrentIndex(0);
    setIsPlaying(false);
    
    // Playback side-by-side comparator if active array sorting is configured
    if (activeTopic === 'sorting') {
      const initialArr = generatedSnapshots[0]?.arrayState || [35, 75, 20, 90, 45, 60, 15, 80, 40];
      const bubbleSnaps = generateBubbleSortSnapshots([...initialArr]);
      const quickSnaps = generateQuickSortSnapshots([...initialArr]);
      
      if (activeSortingAlgo === 'quicksort') {
        setCompareSnapshots(bubbleSnaps);
      } else {
        setCompareSnapshots(quickSnaps);
      }
    }
  };

  // Playback timer ticker loop
  useEffect(() => {
    if (!isPlaying) return;

    const tick = () => {
      setCurrentIndex((prev) => {
        const currentAlgoId = getEditorAlgoId();
        if (prev >= snapshots.length - 1) {
          setIsPlaying(false);
          awardXpOnce(`complete_run_${currentAlgoId}`, 50, 'Completed Entire Execution Stream Trace');
          return prev;
        }

        // Live calculation metrics when running dual compare sandbox
        if (compareMode && activeTopic === 'sorting') {
          const snapshotA = snapshots[prev + 1];
          const snapshotB = compareSnapshots[Math.min(compareSnapshots.length - 1, prev + 1)];
          
          setComparisonStats(stats => ({
            ...stats,
            algoA_Comparisons: snapshots.slice(0, prev + 2).filter(s => s.actionType === 'compare').length,
            algoB_Comparisons: compareSnapshots.slice(0, Math.min(compareSnapshots.length, prev + 2)).filter(s => s.actionType === 'compare').length,
            algoA_Swaps: snapshots.slice(0, prev + 2).filter(s => s.actionType === 'swap').length,
            algoB_Swaps: compareSnapshots.slice(0, Math.min(compareSnapshots.length, prev + 2)).filter(s => s.actionType === 'swap').length,
          }));
        }

        return prev + 1;
      });
    };

    const intervalId = setInterval(tick, speed);
    return () => clearInterval(intervalId);
  }, [isPlaying, speed, snapshots.length, compareMode, compareSnapshots]);

  // Handle timeline actions
  const handlePlayPause = () => {
    if (currentIndex >= snapshots.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.min(snapshots.length - 1, prev + 1));
    awardXpOnce(`manual_step_${getEditorAlgoId()}`, 10, 'Analyzed algorithm state using step debugger');
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
    awardXpOnce(`skip_end_${getEditorAlgoId()}`, 15, 'Analyzed execution state terminal boundary');
  };

  // Tracing snapshot objects
  const activeSnap = snapshots[currentIndex] || {
    lineHighlighted: 1,
    actionType: 'init',
    explanation: 'Awaiting visualization setup initialization...',
    consoleOutput: '[INFO] Workspace initialized.'
  };

  const compareSnap = compareSnapshots[Math.min(compareSnapshots.length - 1, currentIndex)] || {
    lineHighlighted: 1,
    actionType: 'init',
    explanation: 'Comparative flow tracking initiated...',
    consoleOutput: '[INFO] Duplicate monitor active.'
  };

  // Editor matching code algorithms
  const getEditorAlgoId = () => {
    if (activeTopic === 'sorting') return activeSortingAlgo;
    if (activeTopic === 'linked-list') return activeListAlgo;
    if (activeTopic === 'leetcode') return activeLeetAlgo;
    if (activeTopic === 'graphs') return 'astart';
    if (activeTopic === 'lld') return 'lld_parking';
    if (activeTopic === 'networking') return 'net_tcp';
    if (activeTopic === 'os') return 'os_scheduling';
    if (activeTopic === 'databases') return 'db_btree';
    return activeTreeAlgo;
  };

  const handleTopicNavigation = (topic: DSATopic, defaultAlgo?: string) => {
    setActiveTopic(topic);
    setIsPlaying(false);
    setCurrentIndex(0);
    setSearchQuery('');
    setCompareMode(false);
    
    if (defaultAlgo) {
      if (topic === 'sorting') setActiveSortingAlgo(defaultAlgo as SortingAlgo);
      if (topic === 'linked-list') setActiveListAlgo(defaultAlgo as ListAlgo);
      if (topic === 'trees') setActiveTreeAlgo(defaultAlgo as TreeAlgo);
      if (topic === 'leetcode') setActiveLeetAlgo(defaultAlgo as LeetAlgo);
    }
    awardXpOnce(`nav_module_${topic}`, 20, `Entered ${topic.toUpperCase()} Sandbox Module`);
  };

  const exportSnapshotsAsJson = () => {
    if (!snapshots || snapshots.length === 0) {
      triggerXpAward(5, 'Launch an algorithm run trace before exporting! ⚠️');
      return;
    }

    const currentAlgoId = getEditorAlgoId();
    const exportData = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        activeTopic,
        activeAlgorithm: currentAlgoId,
        totalStepsCount: snapshots.length,
        version: "2.0.0"
      },
      snapshots: snapshots.map((s, index) => ({
        step: index + 1,
        lineHighlighted: s.lineHighlighted,
        actionType: s.actionType,
        explanation: s.explanation,
        variables: s.variables || {},
        consoleOutput: s.consoleOutput
      }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `algoflow-trace-${activeTopic}-${currentAlgoId || 'algorithm'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    awardXpOnce(`export_trace_${currentAlgoId}`, 30, 'Exported algorithmic snapshots execution trace JSON file 📥');
  };

  // Custom Socratic tutor automatic responses
  const handleAiChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const userMsg = userChatInput;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [...prev, { role: 'user', text: userMsg, time: timeStr }]);
    setUserChatInput('');

    // Generate responsive context content based on difficulty and current steps
    setTimeout(() => {
      let responseText = '';
      const stepExpl = activeSnap.explanation;
      const stepVars = JSON.stringify(activeSnap.variables || {});

      if (aiTutorDifficulty === 'beginner') {
        responseText = `Let’s look at this like a real-world scenario! imagine we have multiple items lined up like passengers on a bus. ${stepExpl} We use simple indicators so nobody loses their seat in the memory array. Does this helper analogy make sense?`;
        setSocraticQuestion('What happens to the remaining passenger if we swap locations without a backup seat?');
      } else if (aiTutorDifficulty === 'advanced') {
        responseText = `Analyzing execution metrics. Let's inspect the active stack frame pointers. Active registry variables contain ${stepVars}. In the JVM execution model, current indices operate directly as localized offsets, allowing memory lookups to run on thread registers.`;
        setSocraticQuestion('How does the compiler bypass garbage collector checks on continuous array allocations?');
      } else {
        responseText = `Great point! Observing our active trace values: a mutation takes place on line ${activeSnap.lineHighlighted}. We observe that ${stepExpl}. cashing current values avoids a Null Pointer offset risk.`;
        setSocraticQuestion('Why do you think the pivot partitioning divides elements sequentially instead of choosing randomly?');
      }

      setChatMessages(prev => [...prev, { role: 'assistant', text: responseText, time: timeStr }]);
    }, 600);
  };

  // Socratic preset click queries
  const triggerSocraticPrompt = (preset: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { role: 'user', text: preset, time: timeStr }]);

    setTimeout(() => {
      let reply = '';
      if (preset.includes('Analogy')) {
        reply = aiTutorDifficulty === 'beginner' 
          ? 'Absolutely! Think of a Linked List like a treasure hunt: each clue written on a scrap of paper tells you exactly where to walk to find the next clue. If you rip up one scrap of paper, you break the whole trail!'
          : 'Think of memory pointers like parcel tracking tokens. Modifying indices simply redirects reference routes directly inside the heap without copying actual object values.';
      } else if (preset.includes('Socratic')) {
        reply = 'Let’s think this through. If we bypass current node references, how do we guarantee we won’t leave the tail node floating as a memory leak? What steps should the cleanup GC take here?';
      } else if (preset.includes('JVM')) {
        reply = 'Under Java Developer Mode: HashMaps use an array of Node buckets (linked list buckets or Black-Red Trees at TREEIFY_THRESHOLD = 8). When the JVM calculates hashes, bucket locations resolve to index shifts: index = (n - 1) & hash.';
      } else {
        reply = `Analyzing Current Step logic on line ${activeSnap.lineHighlighted}: We are performing a ${activeSnap.actionType}. A temporary memory register caches active pointer contexts to secure the heap.`;
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text: reply, time: timeStr }]);
    }, 500);
  };

  // Submit interview code
  const submitInterviewAttempt = () => {
    setAttempts(v => v + 1);
    if (activeTopic === 'sorting' && activeSortingAlgo === 'quicksort') {
      // Correct!
      setInterviewSuccess(true);
      setInterviewScore(Math.max(40, 100 - (attempts * 10) - (hintsUsed * 15)));
      setInterviewMode(false);
      setShowInterviewReport(true);
      triggerXpAward(200, 'Staff Interview Challenge Solved Successfully! 🏆');
    } else {
      triggerXpAward(15, 'Incorrect solution. Code analyzed, stack traces computed.');
    }
  };

  return (
    <div id="algo-root-container" className={`theme-${theme} min-h-screen bg-bg-app text-text-primary font-sans flex flex-col selection:bg-accent-custom/30 antialiased overflow-x-hidden transition-all duration-300`}>
      
      {/* Dynamic Animated Floating XP alert notifications banner */}
      <AnimatePresence>
        {showXpAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -45, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-mono font-black py-2.5 px-6 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2"
          >
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-spin" />
            {showXpAlert}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Victory Summary Report for Interview completion */}
      <AnimatePresence>
        {showInterviewReport && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-bg-panel border-2 border-accent-custom/40 p-6 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(128,131,255,0.2)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <h3 className="text-xl font-display font-black text-white">Interview Assessment</h3>
              </div>
              <p className="text-xs text-text-muted mb-4 font-mono leading-relaxed">
                Staff Engineer Interview challenge session complete. System metrics generated from compiler logs:
              </p>
              
              <div className="space-y-2 border-y border-border-custom py-4 my-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-text-muted">Result Status:</span>
                  <span className={interviewSuccess ? "text-emerald-400 font-bold" : "text-rose-500 font-bold"}>
                    {interviewSuccess ? "PASSED (Staff Level Approved)" : "FAILED (Timeout)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Score:</span>
                  <span className="text-yellow-400 font-black">{interviewSuccess ? interviewScore : 0} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Attempts Made:</span>
                  <span className="text-white">{attempts} / 3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Hints Consulted:</span>
                  <span className="text-white">{hintsUsed} used</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Time Elapsed:</span>
                  <span className="text-white">{180 - interviewTimer} seconds</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => {
                    setShowInterviewReport(false);
                    setInterviewSuccess(false);
                    setAttempts(0);
                    setHintsUsed(0);
                  }}
                  className="flex-1 bg-accent-custom/20 hover:bg-accent-custom/30 text-text-accent font-mono py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Configure Retake
                </button>
                <button 
                  onClick={() => setShowInterviewReport(false)}
                  className="flex-1 bg-[#dae2fd] hover:bg-white text-bg-app font-mono py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Verify Workspace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. Header Navigation Bar */}
      <header className="fixed w-full flex justify-between items-center px-4 sm:px-6 h-16 bg-bg-header/85 backdrop-blur-xl border-b border-border-custom z-40">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div 
            onClick={() => handleTopicNavigation('explore')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-custom to-[#5de6ff] flex items-center justify-center p-[1px]">
              <div className="w-full h-full rounded-[7px] bg-bg-card flex items-center justify-center font-bold text-sm text-[#5de6ff] group-hover:scale-95 transition-all">
                A
              </div>
            </div>
            <span className="font-display text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-[#c0c1ff] to-[#5de6ff] bg-clip-text text-transparent tracking-tighter">
              AlgoFlow 2.0
            </span>
          </div>

          {/* Gamified XP and Streak Pill widget in Header */}
          <div className="hidden lg:flex items-center gap-3 bg-bg-card/80 px-3 py-1 rounded-full border border-border-custom">
            <div className="flex items-center gap-1.5" title="XP Progress Level">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[10px] font-mono font-bold text-white uppercase">Lvl {level}</span>
            </div>
            <div className="w-16 h-1.5 bg-[#2a3042] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#5de6ff] to-accent-custom transition-all"
                style={{ width: `${Math.min(100, ((xp - (level - 1) * 200) / 200) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-text-muted">{xp} XP</span>
            <span className="text-slate-700 font-mono text-xs">|</span>
            <div className="flex items-center gap-1" title="Daily Streak count">
              <Zap className="w-3 h-3 text-orange-400 fill-orange-400" />
              <span className="text-[10px] font-mono font-black text-orange-400">{streak} Days</span>
            </div>
          </div>
        </div>

        {/* Desktop Theme Switching Dropdown Toolbar */}
        <div className="hidden md:flex items-center gap-2 bg-bg-card/40 p-1 border border-border-custom rounded-xl mr-2">
          {['light', 'dark', 'amoled', 'hacker', 'cyberpunk'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTheme(t as any);
                awardXpOnce(`theme_load_${t}`, 10, `Loaded ${t.toUpperCase()} style token`);
              }}
              className={`px-2 py-1 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                theme === t 
                  ? 'bg-accent-custom text-white shadow' 
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Navigation Action icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Command Palette Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-bg-card/60 border border-border-custom hover:border-accent-custom px-3 py-1.5 rounded-xl text-xs font-mono text-text-muted hover:text-white transition-all cursor-pointer"
            title="Open Command Palette (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#5de6ff]" />
            <span className="hidden lg:inline font-semibold">Search / Actions</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-panel border border-border-custom rounded text-text-muted">
              ⌘K
            </kbd>
          </button>

          {/* Web Audio Synthesizer Sound Toggle */}
          <button
            onClick={() => {
              const nextMuted = soundSynth.toggleMute();
              setIsMuted(nextMuted);
              triggerXpAward(10, nextMuted ? 'Synthesizer Audio Muted' : 'Synthesizer Web Audio Enabled 🎵');
            }}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              !isMuted 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                : 'bg-bg-card/40 border-border-custom text-text-muted hover:text-white'
            }`}
            title={isMuted ? "Unmute Synthesizer Audio" : "Mute Synthesizer Audio"}
          >
            {!isMuted ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-text-muted" />}
          </button>

          {/* Active Interview Challenge indicator button */}
          {interviewMode ? (
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-2 sm:px-3 py-1 rounded-lg text-xs font-mono font-bold animate-pulse">
              <Timer className="w-4 h-4 text-rose-500" />
              <span>{Math.floor(interviewTimer / 60)}:{(interviewTimer % 60).toString().padStart(2, '0')}</span>
            </div>
          ) : (
            <button 
              onClick={() => {
                setInterviewMode(true);
                setInterviewTimer(180);
                awardXpOnce('interview_session_start', 50, 'Staff Interview challenge session started');
              }}
              className="bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold active:scale-95 transition-all"
            >
              Interview Mode
            </button>
          )}

          <button className="p-2 text-text-muted hover:text-white rounded-full bg-bg-card/40 border border-border-custom cursor-pointer transition-colors relative">
            <span className="w-2 h-2 bg-emerald-400 rounded-full absolute top-1.5 right-1.5 animate-ping" />
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Layout Compartment */}
      <div className="flex flex-1 pt-16 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Collapsible Left Sidebar */}
        <aside className={`hidden md:flex bg-bg-panel border-r border-border-custom flex-col justify-between transition-all duration-300 ${
          isSidebarOpen ? 'w-[260px]' : 'w-[64px]'
        } shrink-0 overflow-y-auto`}>
          
          {/* Top sidebar context */}
          <div>
            {/* User Level Widget */}
            {isSidebarOpen ? (
              <div className="p-4 border-b border-border-custom mb-4 bg-bg-card/40">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#5de6ff] to-accent-custom p-[2px] shadow-lg">
                    <div className="w-full h-full bg-bg-panel overflow-hidden rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold font-mono text-[#5de6ff]">ORB</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[140px]">Principal Engineer</h4>
                    <span className="text-[10px] font-mono text-yellow-400 flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      XP: {xp} (Lvl {level})
                    </span>
                  </div>
                </div>
                
                {/* Visual Accomplished Badges list */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {badges.map((b) => (
                    <span 
                      key={b} 
                      className="text-[8px] font-mono font-black uppercase bg-bg-panel border border-yellow-500/30 text-yellow-500 py-0.5 px-1.5 rounded"
                      title="Achievement Badge Unlocked"
                    >
                      🎗️ {b}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-4 border-b border-border-custom mb-4 hover:scale-105 transition-all">
                <div className="w-8 h-8 rounded-full bg-accent-custom/20 border border-accent-custom/40 flex items-center justify-center">
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
                    ? 'bg-bg-card/85 text-text-accent border-r-2 border-accent-custom outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>Explore List</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('sorting', 'quicksort')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'sorting'
                    ? 'bg-bg-card/85 text-text-accent border-r-2 border-accent-custom outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <ListCollapse className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>Sorting Arrays</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('linked-list', 'insertAfter')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'linked-list'
                    ? 'bg-bg-card/85 text-text-accent border-r-2 border-accent-custom outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Network className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>Linked Lists</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('trees', 'insertBST')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'trees'
                    ? 'bg-bg-card/85 text-text-accent border-r-2 border-accent-custom outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Brain className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>BST Trees</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('leetcode', 'twosum')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'leetcode'
                    ? 'bg-bg-card/85 text-text-accent border-r-2 border-accent-custom outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>LeetCode Walk</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('graphs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'graphs'
                    ? 'bg-bg-card/85 text-text-accent border-[#5de6ff] border-r-2 outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 shrink-0 text-[#5de6ff]" />
                {isSidebarOpen && <span>A* Grid Graphs</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('jvm-mode')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'jvm-mode'
                    ? 'bg-bg-card/85 text-text-accent border-r-2 border-accent-custom outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Cpu className="w-4 h-4 shrink-0 text-emerald-400" />
                {isSidebarOpen && <span>JVM Developer Mode</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('system-design')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'system-design'
                    ? 'bg-bg-card/85 text-text-accent border-r-2 border-accent-custom outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Network className="w-4 h-4 shrink-0 text-indigo-400" />
                {isSidebarOpen && <span>System Design</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('advanced-ds')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'advanced-ds'
                    ? 'bg-bg-card/85 text-text-accent border-r-2 border-accent-custom outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4 shrink-0 text-amber-400" />
                {isSidebarOpen && <span>Advanced DS Deck</span>}
              </button>

              {/* Chai Visual New Multitracks */}
              <button
                onClick={() => handleTopicNavigation('lld')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'lld'
                    ? 'bg-bg-card/85 text-purple-400 border-r-2 border-purple-400 outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0 text-purple-400" />
                {isSidebarOpen && <span>Low-Level Design (LLD)</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('networking')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'networking'
                    ? 'bg-bg-card/85 text-blue-400 border-r-2 border-blue-400 outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Network className="w-4 h-4 shrink-0 text-blue-400" />
                {isSidebarOpen && <span>Networking Wire</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('os')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'os'
                    ? 'bg-bg-card/85 text-amber-400 border-r-2 border-amber-400 outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Cpu className="w-4 h-4 shrink-0 text-amber-400" />
                {isSidebarOpen && <span>OS Kernel & MMU</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('databases')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'databases'
                    ? 'bg-bg-card/85 text-indigo-400 border-r-2 border-indigo-400 outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4 shrink-0 text-indigo-400" />
                {isSidebarOpen && <span>Databases & B+ Tree</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('roadmap')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'roadmap'
                    ? 'bg-bg-card/85 text-amber-400 border-r-2 border-amber-400 outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Target className="w-4 h-4 shrink-0 text-amber-400" />
                {isSidebarOpen && <span>Interview Roadmap</span>}
              </button>

              <button
                onClick={() => handleTopicNavigation('aptitude')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all ${
                  activeTopic === 'aptitude'
                    ? 'bg-bg-card/85 text-emerald-400 border-r-2 border-emerald-400 outline-none'
                    : 'text-text-muted hover:bg-bg-card/30 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4 shrink-0 text-emerald-400" />
                {isSidebarOpen && <span>Timed Aptitude Exam</span>}
              </button>
            </nav>
          </div>

          {/* Bottom active collapse controls */}
          <div className="p-2 border-t border-border-custom">
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full py-2 flex items-center justify-center text-text-muted hover:text-white rounded-lg bg-bg-card/45 hover:bg-bg-panel transition-colors cursor-pointer text-xs font-mono font-semibold"
            >
              {isSidebarOpen ? 'COLLAPSE' : 'EXPAND'}
            </button>
          </div>
        </aside>

        {/* 3. Main Workspace Area (Desktop vs Mobile adaptive tabs selectors) */}
        <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden p-3 sm:p-4 gap-4 bg-bg-app">
          
          {/* Active topic is explore selection sheet */}
          {activeTopic === 'explore' ? (
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-bg-app">
              <ExploreLibrary 
                onNavigate={handleTopicNavigation} 
                searchQuery={searchQuery}
              />
            </div>
          ) : activeTopic === 'jvm-mode' ? (
            <div className="flex-1 overflow-y-auto p-1 bg-bg-app">
              <JvmDeveloperMode triggerXp={triggerXpAward} />
            </div>
          ) : activeTopic === 'system-design' ? (
            <div className="flex-1 overflow-y-auto p-1 bg-bg-app">
              <SystemDesignSandbox triggerXp={triggerXpAward} />
            </div>
          ) : activeTopic === 'advanced-ds' ? (
            <div className="flex-1 overflow-y-auto p-1 bg-bg-app">
              <AdvancedDsSandbox />
            </div>
          ) : activeTopic === 'roadmap' ? (
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-bg-app">
              <RoadmapPlanner onNavigateTopic={handleTopicNavigation} />
            </div>
          ) : activeTopic === 'aptitude' ? (
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-bg-app">
              <AptitudeEngine />
            </div>
          ) : (
            // Full interactive layout structure
            <>
              {/* Desktop Workspace: Layout switches dynamically to double comparator if active */}
              {/* Mobile device Tab navigation display */}
              <div className="flex-1 flex flex-col justify-between bg-bg-panel rounded-xl border border-border-custom overflow-hidden relative">
                
                {/* Visualizer header metrics bar */}
                <div className="p-3 sm:p-4 bg-bg-card/90 border-b border-border-custom flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono tracking-widest text-[#5de6ff] uppercase font-bold bg-[#5de6ff]/10 px-2 py-0.5 rounded border border-[#5de6ff]/20">
                      {activeTopic === 'sorting' 
                        ? 'O(n log n)' 
                        : activeTopic === 'linked-list' 
                          ? 'O(1)' 
                          : activeTopic === 'trees' 
                            ? 'O(log n)' 
                            : activeTopic === 'graphs' 
                              ? 'O(V + E)' 
                              : activeTopic === 'lld'
                                ? 'Design Patterns'
                                : activeTopic === 'networking'
                                  ? 'OSI & TCP/IP'
                                  : activeTopic === 'os'
                                    ? 'Kernel & MMU'
                                    : activeTopic === 'databases'
                                      ? 'B+ Tree & ACID'
                                      : 'O(n)'}
                    </span>
                    <h2 className="text-sm sm:text-base font-secondary font-black text-white">
                      {activeTopic === 'sorting' 
                        ? (activeSortingAlgo === 'quicksort' ? 'QuickSort Engine' : 'BubbleSort Engine')
                        : activeTopic === 'linked-list'
                          ? (activeListAlgo === 'insertAfter' ? 'insertAfter Splicer' : 'deleteNode Removal')
                          : activeTopic === 'trees'
                            ? (activeTreeAlgo === 'insertBST' ? 'BST Insert Model' : activeTreeAlgo === 'searchBST' ? 'BST Search Path' : 'BST In-Order DFS')
                            : activeTopic === 'graphs'
                              ? 'A* Grid Pathfinding Engine'
                              : activeTopic === 'lld'
                                ? 'Low-Level Design (LLD) & UML Engine'
                                : activeTopic === 'networking'
                                  ? 'Computer Networking & Wire Simulation'
                                  : activeTopic === 'os'
                                    ? 'Operating Systems Kernel & MMU'
                                    : activeTopic === 'databases'
                                      ? 'Databases & B+ Tree Storage Engine'
                                      : `LeetCode: ${activeLeetAlgo.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`
                      }
                    </h2>

                    {/* Dual-Approach Toggle (Brute Force vs Optimized Trick) for LeetCode Two Sum */}
                    {activeTopic === 'leetcode' && activeLeetAlgo === 'twosum' && (
                      <div className="flex items-center gap-1 bg-bg-card p-0.5 rounded-lg border border-border-custom text-[10px] font-mono">
                        <button
                          onClick={() => {
                            setActiveApproach('BRUTE_FORCE');
                            const snaps = generateTwoSumDualSnapshots('BRUTE_FORCE');
                            setSnapshots(snaps);
                            setCurrentIndex(0);
                            setIsPlaying(false);
                            triggerXpAward(25, 'Switched to Brute Force O(N^2) Benchmark Analysis');
                          }}
                          className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                            activeApproach === 'BRUTE_FORCE'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'text-text-muted hover:text-white'
                          }`}
                          title="Exhaustive pairwise scanning: O(N^2) time, O(1) space"
                        >
                          Brute Force O(N²)
                        </button>
                        <button
                          onClick={() => {
                            setActiveApproach('OPTIMIZED_TRICK');
                            const snaps = generateTwoSumDualSnapshots('OPTIMIZED_TRICK');
                            setSnapshots(snaps);
                            setCurrentIndex(0);
                            setIsPlaying(false);
                            triggerXpAward(25, 'Switched to Optimized Hash Map O(N) Benchmark Analysis');
                          }}
                          className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                            activeApproach === 'OPTIMIZED_TRICK'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'text-text-muted hover:text-white'
                          }`}
                          title="Hash map complement lookup: O(N) time, O(N) space"
                        >
                          Optimized O(N)
                        </button>
                      </div>
                    )}

                    {/* Side-by-Side Algorithm comparison toggle (for Sorting Arrays & Lists) */}
                    {(activeTopic === 'sorting' || activeTopic === 'linked-list') && (
                      <button 
                        onClick={() => {
                          setCompareMode(!compareMode);
                          triggerXpAward(30, 'Loaded Interactive Side-by-Side Comparison Multi-Canvas');
                        }}
                        className={`ml-2 px-2.5 py-0.5 rounded text-[10px] font-mono font-black tracking-wider uppercase flex items-center gap-1 transition-all ${
                          compareMode 
                            ? 'bg-[#5de6ff] text-bg-app shadow' 
                            : 'bg-bg-card text-text-accent border border-border-custom'
                        }`}
                      >
                        <Split className="w-3 h-3" />
                        <span>Compare Mode {compareMode ? 'ON' : 'OFF'}</span>
                      </button>
                    )}

                    {/* Complexity Curve Trigger */}
                    <button 
                      onClick={() => {
                        setIsComplexityOpen(true);
                        triggerXpAward(25, 'Analyzed algorithm math on complexity growth curves');
                      }}
                      className="ml-2 px-2.5 py-0.5 rounded text-[10px] bg-bg-card text-text-accent border border-border-custom hover:border-emerald-500/50 hover:text-white font-mono font-black tracking-wider uppercase flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                      title="Open time complexity growth curves overlay"
                    >
                      <Layers className="w-3 h-3 text-[#5de6ff]" />
                      <span>Complexity Graph</span>
                    </button>
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    Step {currentIndex + 1} of {snapshots.length || 1}
                  </span>
                </div>

                {/* Sub Visualizer Area (Double panels if comparison mode is ticked) */}
                <div className="flex-1 relative flex flex-col md:flex-row items-stretch justify-center overflow-hidden w-full h-full p-2 sm:p-4 gap-4">
                  
                  {/* Tab contents (Render based on mobile selected tab or standard desktop panels) */}
                  <div className={`flex-1 flex flex-col ${activeMobileTab === 'visualizer' ? 'flex' : 'hidden md:flex'}`}>
                    {compareMode ? (
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-full w-full">
                        {/* Column A: Primary selected algorithm */}
                        <div className="flex-1 flex flex-col justify-between border border-border-custom bg-bg-app/50 rounded-xl p-3 relative">
                          <div className="absolute top-2 right-2 bg-accent-custom/10 text-text-accent px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold">
                            Monitor A: {activeSortingAlgo === 'quicksort' ? 'QuickSort' : 'BubbleSort'}
                          </div>
                          
                          <div className="flex-1 w-full flex items-center justify-center">
                            {activeTopic === 'sorting' ? (
                              <SortingCanvas 
                                currentSnapshot={activeSnap}
                                onSnapshotsGenerated={handleSnapshotsGenerated}
                                activeAlgo={activeSortingAlgo}
                                onAlgoChange={setActiveSortingAlgo}
                              />
                            ) : (
                              <LinkedListCanvas
                                currentSnapshot={activeSnap}
                                onSnapshotsGenerated={handleSnapshotsGenerated}
                                activeAlgo={activeListAlgo}
                                onAlgoChange={setActiveListAlgo}
                              />
                            )}
                          </div>

                          {/* Live Statistics */}
                          <div className="bg-bg-card p-2 rounded-lg border border-border-custom/50 text-[10px] font-mono">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Algorithm Comparisons:</span>
                              <span className="text-yellow-400 font-bold">{comparisonStats.algoA_Comparisons} operations</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Swaps / Mutations:</span>
                              <span className="text-rose-500 font-bold">{comparisonStats.algoA_Swaps} times</span>
                            </div>
                          </div>
                        </div>

                        {/* Column B: Alternative secondary engine */}
                        <div className="flex-1 flex flex-col justify-between border border-emerald-500/30 bg-bg-app/50 rounded-xl p-3 relative">
                          <div className="absolute top-2 right-2 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold">
                            Monitor B: {activeSortingAlgo === 'quicksort' ? 'BubbleSort' : 'QuickSort'}
                          </div>

                          <div className="flex-1 w-full flex items-center justify-center">
                            {activeTopic === 'sorting' ? (
                              <SortingCanvas 
                                currentSnapshot={compareSnap}
                                onSnapshotsGenerated={() => {}}
                                activeAlgo={activeSortingAlgo === 'quicksort' ? 'bubblesort' : 'quicksort'}
                                onAlgoChange={() => {}}
                              />
                            ) : (
                              <LinkedListCanvas
                                currentSnapshot={compareSnap}
                                onSnapshotsGenerated={() => {}}
                                activeAlgo={activeListAlgo === 'insertAfter' ? 'deleteNode' : 'insertAfter'}
                                onAlgoChange={() => {}}
                              />
                            )}
                          </div>

                          {/* Live Statistics */}
                          <div className="bg-bg-card p-2 rounded-lg border border-border-custom/50 text-[10px] font-mono">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Algorithm Comparisons:</span>
                              <span className="text-yellow-400 font-bold">{comparisonStats.algoB_Comparisons} operations</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Swaps / Mutations:</span>
                              <span className="text-rose-400 font-bold">{comparisonStats.algoB_Swaps} times</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Single visual representation
                      <div className="w-full h-full flex items-center justify-center">
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

                        {activeTopic === 'graphs' && (
                          <GraphCanvas
                            currentSnapshot={activeSnap}
                            onSnapshotsGenerated={handleSnapshotsGenerated}
                          />
                        )}

                        {activeTopic === 'lld' && (
                          <LLDCanvas
                            currentSnapshot={activeSnap}
                            onSnapshotsGenerated={handleSnapshotsGenerated}
                          />
                        )}

                        {activeTopic === 'networking' && (
                          <NetworkingCanvas
                            currentSnapshot={activeSnap}
                            onSnapshotsGenerated={handleSnapshotsGenerated}
                          />
                        )}

                        {activeTopic === 'os' && (
                          <OSCanvas
                            currentSnapshot={activeSnap}
                            onSnapshotsGenerated={handleSnapshotsGenerated}
                          />
                        )}

                        {activeTopic === 'databases' && (
                          <DBCanvas
                            currentSnapshot={activeSnap}
                            onSnapshotsGenerated={handleSnapshotsGenerated}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mobile Mobile-only layout panels tabs render context */}
                  <div className={`flex-1 w-full h-full md:hidden ${activeMobileTab === 'code' ? 'block' : 'hidden'}`}>
                    <CodeEditorPanel 
                      currentAlgorithm={getEditorAlgoId()} 
                      lineHighlighted={activeSnap.lineHighlighted}
                      awardXpOnce={awardXpOnce}
                    />
                  </div>

                  <div className={`flex-1 w-full h-full md:hidden ${activeMobileTab === 'variables' ? 'block' : 'hidden'}`}>
                    <VariablesTracker 
                      variables={activeSnap.variables} 
                      activeTopic={activeTopic}
                    />
                  </div>

                  <div className={`flex-1 w-full h-full md:hidden ${activeMobileTab === 'console' ? 'block' : 'hidden'}`}>
                    <OutputConsole 
                      snapshots={snapshots}
                      currentIndex={currentIndex}
                    />
                  </div>

                  {/* AI Tutor Chat Tab */}
                  <div className={`flex-1 w-full h-full md:hidden ${activeMobileTab === 'ai-tutor' ? 'block' : 'hidden'}`}>
                    <div className="flex-1 w-full h-full bg-bg-card/70 border border-border-custom p-4 rounded-xl flex flex-col justify-between overflow-y-auto">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-text-accent">AI Socratic Assistant</span>
                        <div className="flex gap-1">
                          {['beginner', 'intermediate', 'advanced'].map((d) => (
                            <button
                              key={d}
                              onClick={() => setAiTutorDifficulty(d as any)}
                              className={`px-2 py-0.5 text-[9px] font-mono rounded capitalize ${
                                aiTutorDifficulty === d ? 'bg-accent-custom text-white' : 'bg-bg-panel text-text-muted'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Chat log */}
                      <div className="flex-1 p-2 bg-bg-panel rounded-lg space-y-2 overflow-y-auto max-h-[220px] text-xs">
                        {chatMessages.map((m, i) => (
                          <div key={i} className={`p-2 rounded-lg ${m.role === 'assistant' ? 'bg-bg-card text-white border-l-2 border-accent-custom' : 'bg-accent-custom/10 text-white ml-6 text-right'}`}>
                            <p className="font-mono">{m.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Timed Interview Prompt controls overlays if Interview mode is ticked */}
                {interviewMode && (
                  <div className="m-4 bg-amber-500/5 min-h-[70px] border-2 border-dashed border-amber-500/30 rounded-xl p-3 text-xs font-mono">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        <Target className="animate-ping w-3 h-3 inline-block bg-amber-500 rounded-full" />
                        STAFF INTERVIEW EXERCISE IN PROGRESS
                      </span>
                      <span>Attempt #{attempts + 1}</span>
                    </div>
                    <p className="text-text-primary mb-2">
                       Optimize QuickSort pivot algorithm selection rules. Select or re-arrange references to complete visual consistency.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setHintsUsed(v => v + 1);
                          triggerSocraticPrompt('Give Me a Socratic Question hints');
                        }}
                        className="bg-bg-panel hover:bg-bg-card border border-border-custom px-3 py-1 rounded text-[10px] text-amber-500 font-bold transition-all"
                      >
                        Request Hints ({hintsUsed})
                      </button>
                      <button 
                        onClick={submitInterviewAttempt}
                        className="bg-amber-500 text-bg-app hover:bg-amber-400 px-3 py-1 rounded font-black text-[10px] uppercase transition-all"
                      >
                        Submit Attempt Code
                      </button>
                    </div>
                  </div>
                )}

                {/* Plain English step-by-step Collapsible Explanation Card */}
                {!isExplanationCollapsed && !interviewMode && (
                  <div className="mx-4 mb-2 bg-[#131b2e]/95 backdrop-blur border border-border-custom rounded-xl p-3 sm:p-4 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-widest text-[#8083ff] font-black uppercase block">
                        English Trace Analyst
                      </span>
                      <button 
                        onClick={() => setIsExplanationCollapsed(true)}
                        className="text-xs text-text-muted hover:text-white font-mono cursor-pointer"
                      >
                        [Hide]
                      </button>
                    </div>
                    <p className="text-[11px] sm:text-xs font-mono leading-relaxed text-text-primary text-justify">
                      {activeSnap.explanation}
                    </p>
                  </div>
                )}

                {isExplanationCollapsed && !interviewMode && (
                  <button 
                    onClick={() => setIsExplanationCollapsed(false)}
                    className="absolute bottom-16 left-4 bg-bg-panel border border-border-custom text-[10px] font-mono text-text-muted hover:text-white px-3 py-1.5 rounded-lg font-bold"
                  >
                    [Show English Explanation Analyser]
                  </button>
                )}

                {/* Timeline control block */}
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-bg-card border-t border-border-custom flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
                  
                  {/* Skip and Play action cluster */}
                  <div className="flex items-center gap-1 bg-bg-panel rounded-xl border border-border-custom p-1">
                    <button
                      onClick={handleReset}
                      className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-bg-card active:scale-95 transition-all cursor-pointer"
                      title="Reset timeline"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleStepBackward}
                      className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-bg-card active:scale-95 transition-all cursor-pointer"
                      title="Step previous"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handlePlayPause}
                      className="w-9 h-9 bg-accent-custom/10 text-white hover:bg-accent-custom/20 border border-accent-custom/30 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_var(--glow-color)]"
                      title={isPlaying ? 'Pause' : 'Play algorithm step-by-step'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current text-[#5de6ff]" /> : <Play className="w-4 h-4 fill-current text-white" />}
                    </button>
                    <button
                      onClick={handleStepForward}
                      className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-bg-card active:scale-95 transition-all cursor-pointer"
                      title="Step forward"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSkipToEnd}
                      className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-bg-card active:scale-95 transition-all cursor-pointer"
                      title="Skip to end of trace"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Playbacks slide controls slider */}
                  <div className="flex items-center gap-3 bg-bg-panel px-4 py-2 rounded-xl border border-border-custom w-full sm:w-auto">
                    <span className="text-[10px] tracking-widest font-mono text-text-muted font-bold">SPEED</span>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={2100 - speed} 
                      onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
                      className="accent-[#5de6ff] w-24 sm:w-28 bg-slate-800 rounded-lg cursor-pointer h-1"
                    />
                    <span className="text-[10px] font-mono font-medium text-[#5de6ff]">
                      {((2100 - speed) / 1000).toFixed(1)}s Delay
                    </span>
                  </div>

                  {/* Export execution trace button */}
                  <button
                    onClick={exportSnapshotsAsJson}
                    className="px-3 py-2 bg-bg-panel hover:bg-bg-card text-[10px] font-mono border border-border-custom hover:border-emerald-500/50 rounded-xl text-emerald-400 font-bold hover:text-white flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 w-full sm:w-auto justify-center"
                    title="Export snapshot trace as JSON"
                  >
                    <FileJson className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export Trace</span>
                  </button>

                </div>

              </div>

              {/* Right Sidebar panels (Visible on Desktop / Adaptive splits on Tablet and widescreen displays) */}
              <div className="hidden md:flex w-full md:w-[320px] lg:w-[380px] shrink-0 flex-col gap-4 overflow-y-auto">
                
                {/* 1. Socratic AI Coach micro-leads companion widget */}
                <div className="h-[32%] bg-bg-card rounded-xl border border-border-custom flex flex-col justify-between overflow-hidden">
                  <div className="px-4 py-2.5 bg-bg-panel border-b border-border-custom flex justify-between items-center flex-wrap gap-2">
                    <span className="font-mono text-xs text-text-accent font-black flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      AI Socratic Coach
                    </span>
                    
                    {/* Socratic level adjusters selector */}
                    <div className="flex bg-bg-card/85 p-0.5 rounded border border-border-custom animate-pulse">
                      {['bgn', 'int', 'adv'].map((d) => {
                        const isMatch = (d === 'bgn' && aiTutorDifficulty === 'beginner') ||
                                        (d === 'int' && aiTutorDifficulty === 'intermediate') ||
                                        (d === 'adv' && aiTutorDifficulty === 'advanced');
                        return (
                          <button
                            key={d}
                            onClick={() => {
                              const targetVal = d === 'bgn' ? 'beginner' : d === 'int' ? 'intermediate' : 'advanced';
                              setAiTutorDifficulty(targetVal);
                              triggerXpAward(15, `Calibrated Socratic level to ${targetVal.toUpperCase()}`);
                            }}
                            className={`px-1.5 py-0.5 text-[8px] font-mono tracking-tighter uppercase rounded ${
                              isMatch ? 'bg-accent-custom text-white font-bold' : 'text-text-muted hover:text-white'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Socratic Active Dialogues Logs */}
                  <div className="flex-1 p-3 font-mono text-[11px] overflow-y-auto space-y-2 bg-bg-panel/40 scroll-smooth">
                    {chatMessages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`p-2 rounded-lg leading-relaxed ${
                          msg.role === 'assistant' 
                            ? 'bg-bg-panel text-white border-l-2 border-accent-custom/80' 
                            : 'bg-accent-custom/10 text-[#dae2fd] ml-4 text-justify'
                        }`}
                      >
                        <div className="flex justify-between text-[9px] text-text-muted mb-0.5 font-bold">
                          <span>{msg.role === 'assistant' ? 'AI COACH' : 'USER'}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick Socratic interactive clickable feedback leads */}
                  <div className="px-3 py-1.5 bg-bg-card border-t border-border-custom flex gap-1 flex-wrap overflow-x-auto select-none">
                    <button 
                      onClick={() => triggerSocraticPrompt('Give Me a Real-World Analogy')}
                      className="text-[9px] font-mono bg-bg-panel border border-border-custom hover:border-accent-custom text-text-accent px-2 py-1 rounded"
                    >
                      💡 Analogy
                    </button>
                    <button 
                      onClick={() => triggerSocraticPrompt('Ask Me a Socratic Question')}
                      className="text-[9px] font-mono bg-bg-panel border border-border-custom hover:border-accent-custom text-text-accent px-2 py-1 rounded"
                    >
                      ❓ Ask Me
                    </button>
                    <button 
                      onClick={() => triggerSocraticPrompt('Explain Java HashMap JVM Memory')}
                      className="text-[9px] font-mono bg-bg-panel border border-border-custom hover:border-emerald-500 text-[#10b981] px-2 py-1 rounded"
                    >
                      ☕ Java mode
                    </button>
                  </div>

                  {/* AI Input submission form bar */}
                  <form onSubmit={handleAiChatSubmit} className="flex border-t border-border-custom bg-bg-card">
                    <input 
                      type="text"
                      value={userChatInput}
                      onChange={e => setUserChatInput(e.target.value)}
                      placeholder="Ask AI Coach..."
                      className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                    />
                    <button 
                      type="submit"
                      className="bg-accent-custom border-l border-border-custom px-4 text-xs font-mono font-bold text-white hover:bg-accent-custom/80"
                    >
                      Ask
                    </button>
                  </form>
                </div>

                {/* 2. Standard Code template tracker panel */}
                <div className="h-[30%] font-mono">
                  <CodeEditorPanel 
                    currentAlgorithm={getEditorAlgoId()} 
                    lineHighlighted={activeSnap.lineHighlighted}
                    awardXpOnce={awardXpOnce}
                  />
                </div>
                
                {/* 3. Variables inspector and stack frames tracking tables */}
                <div className="h-[20%]">
                  <VariablesTracker 
                    variables={activeSnap.variables} 
                    activeTopic={activeTopic}
                  />
                </div>
                
                {/* 4. Console log entries tracker terminal */}
                <div className="h-[18%]">
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

      {/* Touch Tablet & Mobile bottom navigation action bars tab bar */}
      <div className="md:hidden w-full h-14 bg-bg-card border-t border-border-custom flex items-center justify-around fixed bottom-0 left-0 z-40 px-2 font-mono">
        <button
          onClick={() => setActiveMobileTab('visualizer')}
          className={`flex flex-col items-center justify-center p-1 cursor-pointer select-none ${
            activeMobileTab === 'visualizer' ? 'text-text-accent' : 'text-text-muted'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Visualizer</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('code')}
          className={`flex flex-col items-center justify-center p-1 cursor-pointer select-none ${
            activeMobileTab === 'code' ? 'text-text-accent' : 'text-text-muted'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Code</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('variables')}
          className={`flex flex-col items-center justify-center p-1 cursor-pointer select-none ${
            activeMobileTab === 'variables' ? 'text-text-accent' : 'text-text-muted'
          }`}
        >
          <Network className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Variables</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('console')}
          className={`flex flex-col items-center justify-center p-1 cursor-pointer select-none ${
            activeMobileTab === 'console' ? 'text-text-accent' : 'text-text-muted'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Console</span>
        </button>
        <button
          onClick={() => {
            setActiveMobileTab('ai-tutor');
            triggerXpAward(10, 'Accessed Socratic Coach Tab on Mobile device');
          }}
          className={`flex flex-col items-center justify-center p-1 cursor-pointer select-none ${
            activeMobileTab === 'ai-tutor' ? 'text-text-accent' : 'text-text-muted'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] mt-0.5">AI Tutor</span>
        </button>
      </div>

      {/* Complexity Overlay Portal dialog popup */}
      <ComplexityOverlay
        isOpen={isComplexityOpen}
        onClose={() => setIsComplexityOpen(false)}
        activeTopic={activeTopic}
        activeAlgo={getEditorAlgoId()}
        snapshots={snapshots}
        currentIndex={currentIndex}
      />

      {/* Command Palette & Keyboard Shortcuts Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleTopicNavigation}
        onThemeChange={(t) => {
          setTheme(t);
          awardXpOnce(`theme_load_${t}`, 10, `Loaded ${t.toUpperCase()} style token`);
        }}
        currentTheme={theme}
      />

    </div>
  );
}
