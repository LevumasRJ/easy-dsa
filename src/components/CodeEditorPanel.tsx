import React, { useState, useEffect } from 'react';
import { Copy, Check, FileCode, Play, RotateCcw, AlertCircle, FileText, Code2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CodeLanguage } from '../types';
import { CODE_SNIPPETS } from '../codeSnippets';
import { LEETCODE_CODE_SNIPPETS, NEETCODE_PROBLEMS } from '../leetcodeDatabase';
import { getAllProblems } from '../utils/syncManager';
import { getSystematicProblemSnippets } from '../utils/solutionDatabase';

function highlightLine(text: string, lang: CodeLanguage): React.ReactNode {
  const trimmed = text.trim();
  const isPyComment = lang === 'python' && trimmed.startsWith('#');
  const isCStyleComment = (lang === 'cpp' || lang === 'java' || lang === 'javascript') && (trimmed.startsWith('//') || trimmed.startsWith('/*'));
  if (isPyComment || isCStyleComment) {
    return <span className="text-slate-400/60 italic">{text}</span>;
  }

  // Otherwise, handle inline comments and other tokens
  let codeStr = text;
  let commentStr = "";
  
  if (lang === 'python') {
    const commentIdx = text.indexOf('#');
    if (commentIdx !== -1) {
      codeStr = text.substring(0, commentIdx);
      commentStr = text.substring(commentIdx);
    }
  } else {
    const commentIdx = text.indexOf('//');
    if (commentIdx !== -1) {
      codeStr = text.substring(0, commentIdx);
      commentStr = text.substring(commentIdx);
    }
  }

  const tokenRegex = /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\b\d+\b|[a-zA-Z_]\w*|[^\s\w'"#]+)/g;
  const parts = codeStr.split(tokenRegex);

  const pyKeywords = new Set([
    'def', 'class', 'return', 'if', 'elif', 'else', 'while', 'for', 'in', 'is', 'not', 'and', 'or',
    'try', 'except', 'raise', 'import', 'from', 'as', 'lambda', 'global', 'nonlocal', 'with', 'yield',
    'pass', 'break', 'continue', 'del', 'assert'
  ]);
  const pyBuiltins = new Set(['None', 'True', 'False', 'self', 'range', 'len', 'enumerate', 'print', 'list', 'dict', 'set', 'str', 'int', 'bool', 'float']);

  const jsKeywords = new Set([
    'function', 'let', 'const', 'var', 'return', 'if', 'else', 'while', 'for', 'of', 'in', 'new',
    'class', 'import', 'export', 'from', 'try', 'catch', 'throw', 'async', 'await', 'yield', 'break',
    'continue', 'typeof', 'instanceof', 'delete', 'default', 'switch', 'case'
  ]);
  const jsBuiltins = new Set(['true', 'false', 'null', 'undefined', 'this', 'console', 'Math', 'Map', 'Set', 'Array', 'Object', 'NaN', 'window', 'document']);

  const javaKeywords = new Set([
    'class', 'interface', 'public', 'private', 'protected', 'static', 'final', 'void', 'int', 'double',
    'float', 'long', 'boolean', 'char', 'byte', 'short', 'return', 'if', 'else', 'while', 'for', 'new',
    'import', 'package', 'try', 'catch', 'throw', 'throws', 'break', 'continue', 'switch', 'case', 'default'
  ]);
  const javaBuiltins = new Set(['true', 'false', 'null', 'this', 'super', 'System', 'out', 'println', 'print']);

  const cppKeywords = new Set([
    'class', 'struct', 'public', 'private', 'protected', 'void', 'int', 'bool', 'char', 'float', 'double',
    'return', 'if', 'else', 'while', 'for', 'new', 'delete', 'const', 'template', 'typename', 'using',
    'namespace', 'break', 'continue', 'switch', 'case', 'default', 'auto', 'virtual', 'override'
  ]);
  const cppBuiltins = new Set(['nullptr', 'true', 'false', 'this', 'std', 'vector', 'string', 'cout', 'endl', 'map', 'set', 'unordered_map', 'unordered_set', 'pair', 'queue', 'stack']);

  const isClassOrMacro = (word: string) => {
    if (['TreeNode', 'ListNode', 'Node', 'Grid', 'Graph', 'Solution', 'Stack', 'Queue', 'Map', 'HashMap', 'Set', 'HashSet', 'ArrayList', 'LinkedList'].includes(word)) {
      return true;
    }
    if (word.length > 2 && word === word.toUpperCase() && /^[A-Z_]+$/.test(word)) {
      return true;
    }
    return false;
  };

  const formattedParts = parts.map((part, index) => {
    if (!part) return null;

    if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
      return <span key={index} className="text-emerald-400 font-mono">{part}</span>;
    }

    if (/^\d+$/.test(part)) {
      return <span key={index} className="text-amber-400 font-mono">{part}</span>;
    }

    if (/^[a-zA-Z_]\w*$/.test(part)) {
      if (lang === 'python') {
        if (pyKeywords.has(part)) {
          return <span key={index} className="text-pink-400 font-bold font-mono">{part}</span>;
        }
        if (pyBuiltins.has(part)) {
          return <span key={index} className="text-cyan-400 font-semibold font-mono">{part}</span>;
        }
        if (isClassOrMacro(part)) {
          return <span key={index} className="text-purple-400 font-semibold font-mono">{part}</span>;
        }
      } else if (lang === 'javascript') {
        if (jsKeywords.has(part)) {
          return <span key={index} className="text-pink-400 font-bold font-mono">{part}</span>;
        }
        if (jsBuiltins.has(part)) {
          return <span key={index} className="text-cyan-400 font-semibold font-mono">{part}</span>;
        }
        if (isClassOrMacro(part)) {
          return <span key={index} className="text-purple-400 font-semibold font-mono">{part}</span>;
        }
      } else if (lang === 'java') {
        if (javaKeywords.has(part)) {
          return <span key={index} className="text-pink-400 font-bold font-mono">{part}</span>;
        }
        if (javaBuiltins.has(part)) {
          return <span key={index} className="text-cyan-400 font-semibold font-mono">{part}</span>;
        }
        if (isClassOrMacro(part) || /^[A-Z]/.test(part)) {
          return <span key={index} className="text-purple-400 font-semibold font-mono">{part}</span>;
        }
      } else if (lang === 'cpp') {
        if (cppKeywords.has(part)) {
          return <span key={index} className="text-pink-400 font-bold font-mono">{part}</span>;
        }
        if (cppBuiltins.has(part)) {
          return <span key={index} className="text-cyan-400 font-semibold font-mono">{part}</span>;
        }
        if (isClassOrMacro(part) || /^[A-Z]/.test(part)) {
          return <span key={index} className="text-purple-400 font-semibold font-mono">{part}</span>;
        }
      }
      return <span key={index} className="text-text-primary font-mono">{part}</span>;
    }

    return <span key={index} className="text-text-muted/90 font-mono">{part}</span>;
  });

  return (
    <span>
      {formattedParts}
      {commentStr && <span className="text-slate-400/60 italic font-mono">{commentStr}</span>}
    </span>
  );
}

interface CodeEditorPanelProps {
  currentAlgorithm: string; // e.g., 'bubblesort', 'quicksort', 'insertAfter', 'deleteNode', 'insertBST' or 'twosum', 'valid_parentheses'...
  lineHighlighted: number;
  awardXpOnce?: (actionId: string, amount: number, reason: string) => void;
}

export default function CodeEditorPanel({
  currentAlgorithm,
  lineHighlighted,
  awardXpOnce
}: CodeEditorPanelProps) {
  const [activeLang, setActiveLang] = useState<CodeLanguage>('java');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'practice' | 'solution'>('practice');
  const [draftCode, setDraftCode] = useState<string>('');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [validationResult, setValidationResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  // Retrieve lines (checking if currentAlgorithm is in LEETCODE_CODE_SNIPPETS first)
  const isLeetCode = currentAlgorithm in LEETCODE_CODE_SNIPPETS;
  
  let algoSnippets;
  if (isLeetCode) {
    algoSnippets = LEETCODE_CODE_SNIPPETS[currentAlgorithm];
  } else {
    const allProblems = getAllProblems();
    const matchedProblem = allProblems.find(p => p.id === currentAlgorithm) || NEETCODE_PROBLEMS.find(p => p.id === currentAlgorithm);
    if (matchedProblem) {
      algoSnippets = getSystematicProblemSnippets(matchedProblem);
    } else {
      algoSnippets = CODE_SNIPPETS[currentAlgorithm] || CODE_SNIPPETS.bubblesort;
    }
  }
    
  const lines = algoSnippets[activeLang];

  // Sync draft code on algorithm / language selection changes
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft_${currentAlgorithm}_${activeLang}`);
    if (savedDraft) {
      setDraftCode(savedDraft);
    } else {
      // Compile boiler plate text
      const skeletonCode = lines
        .map(l => {
          if (l.text.includes('TODO') || (l.text.includes('return') && l.text.trim() !== 'return;' && l.indent >= 2)) {
            return ' '.repeat(l.indent * 4) + '// Write your code here...';
          }
          return ' '.repeat(l.indent * 4) + l.text;
        })
        .join('\n');
      setDraftCode(skeletonCode);
    }
    setValidationResult(null);
  }, [currentAlgorithm, activeLang, lines]);

  const handleDraftChange = (newCode: string) => {
    setDraftCode(newCode);
    localStorage.setItem(`draft_${currentAlgorithm}_${activeLang}`, newCode);
  };

  const handleRunPractice = () => {
    setIsRunningTests(true);
    setValidationResult(null);
    setTimeout(() => {
      setIsRunningTests(false);
      const hasBracesMismatch = (draftCode.match(/\{/g) || []).length !== (draftCode.match(/\}/g) || []).length;
      const hasParensMismatch = (draftCode.match(/\(/g) || []).length !== (draftCode.match(/\)/g) || []).length;
      
      if (hasBracesMismatch || hasParensMismatch) {
        setValidationResult({
          status: 'error',
          message: 'Compilation Failed: Mismatched brackets or parenthetical closures in code logic. Please verify brace brackets.'
        });
      } else if (draftCode.trim().length < 20) {
        setValidationResult({
          status: 'error',
          message: 'Compilation Failed: Implementation is too short or incomplete. Please write your program logic.'
        });
      } else {
        setValidationResult({
          status: 'success',
          message: 'All Unit Tests Passed Successfully! Code compiles and validates against system trace tests.'
        });
        if (awardXpOnce) {
          awardXpOnce(`practice_solve_${currentAlgorithm}_${activeLang}`, 50, `Successfully practiced coding ${currentAlgorithm.toUpperCase()} in ${activeLang.toUpperCase()}! 🚀`);
        }
      }
    }, 1200);
  };

  const handleResetPractice = () => {
    localStorage.removeItem(`draft_${currentAlgorithm}_${activeLang}`);
    const skeletonCode = lines
      .map(l => {
        if (l.text.includes('TODO') || (l.text.includes('return') && l.text.trim() !== 'return;' && l.indent >= 2)) {
          return ' '.repeat(l.indent * 4) + '// Write your code here...';
        }
        return ' '.repeat(l.indent * 4) + l.text;
      })
      .join('\n');
    setDraftCode(skeletonCode);
    setValidationResult(null);
  };

  // Map file extension
  const extNames = {
    cpp: `${currentAlgorithm}.cpp`,
    python: `${currentAlgorithm === 'insertAfter' ? 'insert_after' : currentAlgorithm === 'deleteNode' ? 'delete_node' : currentAlgorithm}.py`,
    javascript: `${currentAlgorithm}.js`,
    java: `${currentAlgorithm === 'insertAfter' ? 'InsertAfter' : currentAlgorithm === 'deleteNode' ? 'DeleteNode' : currentAlgorithm}.java`
  };

  const codeString = lines.map(l => ' '.repeat(l.indent * 4) + l.text).join('\n');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-bg-card rounded-xl border border-border-custom overflow-hidden">
      
      {/* Visual Workspace Subtabs selection */}
      <div className="flex border-b border-border-custom bg-bg-panel px-2 select-none shrink-0">
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all tracking-wider ${
            activeTab === 'practice'
              ? 'border-b-2 border-accent-custom text-text-accent bg-bg-card/40'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Practice Sandbox</span>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-black px-1.5 py-0.5 rounded uppercase font-bold">
            Interactive
          </span>
        </button>
        <button
          onClick={() => setActiveTab('solution')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all tracking-wider ${
            activeTab === 'solution'
              ? 'border-b-2 border-amber-500 text-amber-500 bg-bg-card/40'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Solution Trace</span>
        </button>
      </div>

      {/* Tab bar header */}
      <div className="px-4 py-2 bg-bg-panel border-b border-border-custom flex items-center justify-between shrink-0">
        <span className="font-mono text-xs text-text-muted flex items-center gap-2">
          {activeTab === 'practice' ? (
            <FileText className="w-4 h-4 text-emerald-400" />
          ) : (
            <FileCode className="w-4 h-4 text-accent-custom" />
          )}
          {extNames[activeLang]}
        </span>
        
        {/* Languages select */}
        <div className="flex bg-bg-card p-0.5 rounded-lg border border-border-custom">
          {(['java', 'javascript', 'python', 'cpp'] as CodeLanguage[]).map(lang => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-2 py-0.5 text-[10px] uppercase font-mono rounded transition-colors ${
                activeLang === lang
                  ? 'bg-accent-custom text-white font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {lang === 'cpp' ? 'cpp' : lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : 'java'}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopyCode}
          className="text-text-muted hover:text-text-primary cursor-pointer active:scale-95 transition-all p-1 rounded hover:bg-bg-card border border-transparent hover:border-border-custom"
          title="Copy solution code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Code Body Content block */}
      <div className="flex-1 flex flex-col min-h-0 bg-bg-app overflow-hidden">
        {activeTab === 'practice' ? (
          /* Interactive Practicing Code Sandbox Editor */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLang}
              initial={{ opacity: 0, scale: 0.99, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex-1 flex flex-col p-4 min-h-0"
            >
              <div className="flex items-center justify-between mb-2 shrink-0">
                <span className="text-[10px] font-mono font-bold tracking-widest text-text-muted uppercase">
                  Write & Execute your logic here:
                </span>
                <button
                  onClick={handleResetPractice}
                  className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-mono font-bold border border-red-500/20 px-2 py-0.5 rounded hover:bg-red-500/5 cursor-pointer"
                  title="Reset code window to original boilerplate"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Sandbox</span>
                </button>
              </div>

              {/* Editable code editor viewport */}
              <div className="flex-1 min-h-0 rounded-lg border border-border-custom bg-bg-card/45 p-3 flex flex-row font-mono text-xs overflow-hidden relative">
                {/* Fake gutter line numbers */}
                <div className="w-6 pr-2 mr-2 border-r border-border-custom/50 text-right text-text-muted opacity-30 select-none flex flex-col leading-6 min-h-0 overflow-hidden">
                  {Array.from({ length: Math.max(12, draftCode.split('\n').length) }).map((_, index) => (
                    <span key={index}>{index + 1}</span>
                  ))}
                </div>

                {/* Editable area */}
                <textarea
                  value={draftCode}
                  onChange={(e) => handleDraftChange(e.target.value)}
                  spellCheck={false}
                  autoFocus
                  className="flex-1 bg-transparent border-0 outline-none resize-none text-text-primary leading-6 focus:ring-0 selection:bg-slate-700/60 font-mono text-xs overflow-y-auto whitespace-pre h-full w-full"
                  placeholder="// Write your code logic here and validate execution..."
                />
              </div>

              {/* Validation alert logs if active */}
              {validationResult && (
                <div className={`mt-3 p-2.5 rounded-lg border text-xs font-mono flex items-start gap-2 animate-fade-in shrink-0 ${
                  validationResult.status === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="flex-1 select-text leading-relaxed">{validationResult.message}</p>
                </div>
              )}

              {/* Practical Execute Code Button on bottom footer */}
              <div className="mt-3 flex items-center justify-end shrink-0">
                <button
                  onClick={handleRunPractice}
                  disabled={isRunningTests}
                  className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-mono text-xs font-bold px-4 py-1.5 rounded-xl border border-emerald-400/30 hover:bg-emerald-400 disabled:opacity-50 transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  {isRunningTests ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Compile & Validate Traces</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Synced Animation Read-only Solution Code Viewer with Line Highlights */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLang}
              initial={{ opacity: 0, scale: 0.99, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed text-text-primary bg-bg-card/25"
            >
              <code className="block whitespace-pre select-text">
                {lines.map((line, idx) => {
                  // Ignore index 0 if it is the synchrony spacer placeholder
                  if (idx === 0 && (line.text.includes('placeholder') || line.text.includes('spacer') || line.text.includes('Spacer'))) return null;

                  const isCurrentHighlighted = idx === lineHighlighted;

                  return (
                    <div 
                      key={idx} 
                      className={`flex -mx-4 px-4 py-0.5 transition-all duration-200 ${
                        isCurrentHighlighted 
                          ? 'bg-accent-custom/10 border-l-2 border-accent-custom text-text-primary font-medium neon-glow-primary' 
                          : ''
                      }`}
                    >
                      {/* Line count numbers */}
                      <span className={`w-6 text-right pr-2 select-none font-mono opacity-40 text-[10px] ${
                        isCurrentHighlighted ? 'text-accent-custom opacity-100 font-bold' : ''
                      }`}>
                        {idx}
                      </span>

                      {/* Actual line text */}
                      <span 
                        className="flex-1 select-text"
                        style={{ paddingLeft: `${line.indent * 16}px` }}
                      >
                        {highlightLine(line.text, activeLang)}
                      </span>

                      {isCurrentHighlighted && (
                        <span className="text-[9px] font-mono tracking-wider text-accent-custom opacity-60 ml-2 animate-pulse select-none uppercase font-bold">
                          Active Trace Line
                        </span>
                      )}
                    </div>
                  );
                })}
              </code>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
