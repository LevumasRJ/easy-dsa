import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, Layers, Sparkles, BookOpen, Brain, ListCollapse, Network, Cpu, Database, Compass, X, Moon, Sun, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DSATopic } from '../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (topic: DSATopic, defaultAlgo?: string) => void;
  onThemeChange: (theme: 'dark' | 'light' | 'amoled' | 'hacker' | 'cyberpunk') => void;
  currentTheme: string;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigate,
  onThemeChange,
  currentTheme
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'commands' | 'shortcuts'>('commands');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: 'leetcode-twosum',
      title: 'LeetCode: Two Sum',
      category: 'Interview Problems',
      icon: <BookOpen className="w-4 h-4 text-[#5de6ff]" />,
      action: () => { onNavigate('leetcode', 'twosum'); onClose(); },
      keywords: 'array hash map target sum'
    },
    {
      id: 'leetcode-valid_parentheses',
      title: 'LeetCode: Valid Parentheses',
      category: 'Interview Problems',
      icon: <BookOpen className="w-4 h-4 text-[#5de6ff]" />,
      action: () => { onNavigate('leetcode', 'valid_parentheses'); onClose(); },
      keywords: 'stack brackets strings'
    },
    {
      id: 'leetcode-reverse_list',
      title: 'LeetCode: Reverse Linked List',
      category: 'Interview Problems',
      icon: <BookOpen className="w-4 h-4 text-[#5de6ff]" />,
      action: () => { onNavigate('leetcode', 'reverse_list'); onClose(); },
      keywords: 'pointers node head'
    },
    {
      id: 'leetcode-invert_tree',
      title: 'LeetCode: Invert Binary Tree',
      category: 'Interview Problems',
      icon: <BookOpen className="w-4 h-4 text-[#5de6ff]" />,
      action: () => { onNavigate('leetcode', 'invert_tree'); onClose(); },
      keywords: 'bst recursion left right'
    },
    {
      id: 'leetcode-binary_search',
      title: 'LeetCode: Binary Search',
      category: 'Interview Problems',
      icon: <BookOpen className="w-4 h-4 text-[#5de6ff]" />,
      action: () => { onNavigate('leetcode', 'binary_search'); onClose(); },
      keywords: 'sorted array divide conquer'
    },
    {
      id: 'algo-quicksort',
      title: 'QuickSort Partition Engine',
      category: 'Sorting Module',
      icon: <ListCollapse className="w-4 h-4 text-yellow-400" />,
      action: () => { onNavigate('sorting', 'quicksort'); onClose(); },
      keywords: 'pivot recursive divide'
    },
    {
      id: 'algo-bubblesort',
      title: 'BubbleSort Engine',
      category: 'Sorting Module',
      icon: <ListCollapse className="w-4 h-4 text-yellow-400" />,
      action: () => { onNavigate('sorting', 'bubblesort'); onClose(); },
      keywords: 'adjacent swap pass'
    },
    {
      id: 'algo-linkedlist',
      title: 'Linked List Splicer (Insert / Delete)',
      category: 'Linked List Module',
      icon: <Network className="w-4 h-4 text-emerald-400" />,
      action: () => { onNavigate('linked-list', 'insertAfter'); onClose(); },
      keywords: 'head next pointer rewire'
    },
    {
      id: 'algo-bst',
      title: 'Binary Search Tree (Insert / Search / DFS)',
      category: 'Tree Module',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
      action: () => { onNavigate('trees', 'insertBST'); onClose(); },
      keywords: 'root inorder traversal'
    },
    {
      id: 'algo-graphs',
      title: 'A* Grid Pathfinding Engine',
      category: 'Graph Module',
      icon: <Compass className="w-4 h-4 text-[#5de6ff]" />,
      action: () => { onNavigate('graphs'); onClose(); },
      keywords: 'heuristic obstacle route'
    },
    {
      id: 'module-jvm',
      title: 'JVM Developer Mode (Memory & GC Visualizer)',
      category: 'System Internals',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      action: () => { onNavigate('jvm-mode'); onClose(); },
      keywords: 'heap stack garbage collector offsets'
    },
    {
      id: 'module-sysdesign',
      title: 'System Design Architecture Sandbox',
      category: 'Architecture',
      icon: <Network className="w-4 h-4 text-indigo-400" />,
      action: () => { onNavigate('system-design'); onClose(); },
      keywords: 'load balancer cache database kafka'
    },
    {
      id: 'module-advancedds',
      title: 'Advanced DS Deck (B-Tree, Trie, Segment Tree)',
      category: 'Data Structures',
      icon: <Database className="w-4 h-4 text-amber-400" />,
      action: () => { onNavigate('advanced-ds'); onClose(); },
      keywords: 'prefix trie interval segment btree'
    },
    // Theme options
    {
      id: 'theme-dark',
      title: 'Theme: Dark Obsidian',
      category: 'App Themes',
      icon: <Moon className="w-4 h-4 text-indigo-300" />,
      action: () => { onThemeChange('dark'); onClose(); },
      keywords: 'dark background night'
    },
    {
      id: 'theme-light',
      title: 'Theme: Light Crisp',
      category: 'App Themes',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      action: () => { onThemeChange('light'); onClose(); },
      keywords: 'light bright daytime'
    },
    {
      id: 'theme-amoled',
      title: 'Theme: AMOLED Pure Black',
      category: 'App Themes',
      icon: <Moon className="w-4 h-4 text-slate-100" />,
      action: () => { onThemeChange('amoled'); onClose(); },
      keywords: 'oled black contrast'
    },
    {
      id: 'theme-hacker',
      title: 'Theme: Matrix Hacker Green',
      category: 'App Themes',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => { onThemeChange('hacker'); onClose(); },
      keywords: 'green matrix terminal'
    },
    {
      id: 'theme-cyberpunk',
      title: 'Theme: Cyberpunk Neon',
      category: 'App Themes',
      icon: <Sparkles className="w-4 h-4 text-pink-400" />,
      action: () => { onThemeChange('cyberpunk'); onClose(); },
      keywords: 'neon pink cyan future'
    }
  ];

  const filtered = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase()) ||
    (c.keywords && c.keywords.toLowerCase().includes(query.toLowerCase()))
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause Timeline Execution' },
    { key: '→', desc: 'Step Forward 1 Trace State' },
    { key: '←', desc: 'Step Backward 1 Trace State' },
    { key: 'R', desc: 'Reset Trace to Initial State' },
    { key: 'M', desc: 'Toggle Side-by-Side Comparison Mode' },
    { key: 'Mute / Sound', desc: 'Toggle Web Audio Synthesizer Feedback' },
    { key: 'Cmd + K / Ctrl + K', desc: 'Open Command Palette' },
    { key: '?', desc: 'Show Keyboard Shortcuts Guide' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          onClick={e => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          className="w-full max-w-xl bg-bg-panel border border-border-custom rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border-custom px-4 py-3 bg-bg-card/50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('commands')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'commands' ? 'bg-accent-custom text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                Commands & Navigation
              </button>
              <button
                onClick={() => setActiveTab('shortcuts')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'shortcuts' ? 'bg-accent-custom text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                Keyboard Hotkeys (?)
              </button>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-bg-card transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeTab === 'commands' ? (
            <>
              {/* Search Bar Input */}
              <div className="flex items-center px-4 py-3 border-b border-border-custom bg-bg-app/40 gap-3">
                <Search className="w-4 h-4 text-text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type an algorithm name, problem, or theme..."
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                  className="w-full bg-transparent text-sm font-mono text-white placeholder-text-muted/60 focus:outline-none"
                />
                <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 bg-bg-card border border-border-custom rounded text-text-muted">
                  ESC
                </kbd>
              </div>

              {/* Results List */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-text-muted">
                    No matching commands or algorithms found.
                  </div>
                ) : (
                  filtered.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        idx === selectedIndex
                          ? 'bg-accent-custom/20 border border-accent-custom/40 text-white'
                          : 'hover:bg-bg-card/50 text-text-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <div>
                          <p className="text-xs font-mono font-bold text-white">{item.title}</p>
                          <p className="text-[10px] font-mono text-text-muted">{item.category}</p>
                        </div>
                      </div>
                      <kbd className="text-[9px] font-mono px-2 py-0.5 bg-bg-card border border-border-custom rounded text-text-muted">
                        ↵ Enter
                      </kbd>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Shortcuts Tab */
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto font-mono text-xs">
              <p className="text-text-muted text-[11px] mb-2">
                Use these hotkeys anywhere in AlgoFlow to control playback speed, trace steps, and switch views without taking your hands off the keyboard.
              </p>
              <div className="grid grid-cols-1 gap-2">
                {shortcuts.map((sc) => (
                  <div key={sc.key} className="flex justify-between items-center p-2 rounded-lg bg-bg-card/40 border border-border-custom">
                    <span className="text-text-muted text-[11px]">{sc.desc}</span>
                    <kbd className="px-2.5 py-1 bg-bg-panel border border-border-custom rounded text-[10px] font-bold text-[#5de6ff]">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-2.5 border-t border-border-custom bg-bg-card/30 flex justify-between items-center text-[10px] font-mono text-text-muted px-4">
            <span>AlgoFlow Quick Action Bar</span>
            <span>Use ↑ ↓ to navigate, ↵ to select</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
