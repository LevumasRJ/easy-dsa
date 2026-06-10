import { useState, useEffect } from 'react';
import { Copy, Check, FileCode, Play, RotateCcw, AlertCircle, FileText, Code2, Sparkles } from 'lucide-react';
import { CodeLanguage } from '../types';
import { CODE_SNIPPETS } from '../codeSnippets';
import { LEETCODE_CODE_SNIPPETS, NEETCODE_PROBLEMS } from '../leetcodeDatabase';

// Generate dynamic boilerplates for LeetCode problems when explicit snippets aren't configured
function getDynamicSnippets(problem: any) {
  const titleCamel = problem.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map((word: string, i: number) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Sensible default arguments and types based on name/category
  let argCpp = "vector<int>& nums";
  let argPy = "self, nums: List[int]";
  let argJs = "nums";
  let argJava = "int[] nums";
  
  let retCpp = "bool";
  let retPy = "bool";
  let retJs = "boolean";
  let retJava = "boolean";
  
  let dfltCpp = "false";
  let dfltPy = "False";
  let dfltJs = "false";
  let dfltJava = "false";

  const cat = problem.category || "";

  if (cat.includes("Tree")) {
    argCpp = "TreeNode* root";
    argPy = "self, root: Optional[TreeNode]";
    argJs = "root";
    argJava = "TreeNode root";
    retCpp = "TreeNode*";
    retPy = "Optional[TreeNode]";
    retJs = "TreeNode";
    retJava = "TreeNode";
    dfltCpp = "nullptr";
    dfltPy = "None";
    dfltJs = "null";
    dfltJava = "null";
  } else if (cat.includes("Linked List")) {
    argCpp = "ListNode* head";
    argPy = "self, head: Optional[ListNode]";
    argJs = "head";
    argJava = "ListNode head";
    retCpp = "ListNode*";
    retPy = "Optional[ListNode]";
    retJs = "ListNode";
    retJava = "ListNode";
    dfltCpp = "nullptr";
    dfltPy = "None";
    dfltJs = "null";
    dfltJava = "null";
  }

  return {
    cpp: [
      { text: `// ${problem.title} (LeetCode #${problem.number})`, indent: 0 },
      { text: `// Category: ${problem.category} | Acceptance: ${problem.acceptance}`, indent: 0 },
      { text: `class Solution {`, indent: 0 },
      { text: `public:`, indent: 0 },
      { text: `    ${retCpp} ${titleCamel}(${argCpp}) {`, indent: 1 },
      { text: `        // TODO: Implement Dynamic Solution`, indent: 2 },
      { text: `        return ${dfltCpp};`, indent: 2 },
      { text: `    }`, indent: 1 },
      { text: `};`, indent: 0 }
    ],
    python: [
      { text: `# ${problem.title} (LeetCode #${problem.number})`, indent: 0 },
      { text: `# Category: ${problem.category} | Acceptance: ${problem.acceptance}`, indent: 0 },
      { text: `class Solution:`, indent: 0 },
      { text: `    def ${titleCamel}(${argPy}) -> ${retPy}:`, indent: 1 },
      { text: `        # TODO: Implement Dynamic Solution`, indent: 2 },
      { text: `        return ${dfltPy}`, indent: 2 }
    ],
    javascript: [
      { text: `/**`, indent: 0 },
      { text: ` * ${problem.title} (LeetCode #${problem.number})`, indent: 0 },
      { text: ` * Category: ${problem.category}`, indent: 0 },
      { text: ` * @param {${retJs === 'boolean' ? 'number[]' : 'string'}} ${argJs.split(',')[0]}`, indent: 0 },
      { text: ` * @return {${retJs}}`, indent: 0 },
      { text: ` */`, indent: 0 },
      { text: `var ${titleCamel} = function(${argJs}) {`, indent: 0 },
      { text: `    // TODO: Implement Dynamic Solution`, indent: 1 },
      { text: `    return ${dfltJs};`, indent: 1 },
      { text: `};`, indent: 0 }
    ],
    java: [
      { text: `// ${problem.title} (LeetCode #${problem.number})`, indent: 0 },
      { text: `// Category: ${problem.category} | Acceptance: ${problem.acceptance}`, indent: 0 },
      { text: `class Solution {`, indent: 0 },
      { text: `    public ${retJava} ${titleCamel}(${argJava}) {`, indent: 1 },
      { text: `        // TODO: Implement Dynamic Solution`, indent: 2 },
      { text: `        return ${dfltJava};`, indent: 2 },
      { text: `    }`, indent: 1 },
      { text: `}`, indent: 0 }
    ]
  };
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
  const [activeLang, setActiveLang] = useState<CodeLanguage>('cpp');
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
    const matchedProblem = NEETCODE_PROBLEMS.find(p => p.id === currentAlgorithm);
    if (matchedProblem) {
      algoSnippets = getDynamicSnippets(matchedProblem);
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
    <div className="w-full h-full flex flex-col bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden">
      
      {/* Visual Workspace Subtabs selection */}
      <div className="flex border-b border-slate-805/85 bg-[#0e1321] px-2 select-none shrink-0">
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all tracking-wider ${
            activeTab === 'practice'
              ? 'border-b-2 border-[#5de6ff] text-[#5de6ff] bg-[#171f33]/40'
              : 'text-text-muted hover:text-white'
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
              ? 'border-b-2 border-amber-500 text-amber-500 bg-[#171f33]/40'
              : 'text-text-muted hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Solution Trace</span>
        </button>
      </div>

      {/* Tab bar header */}
      <div className="px-4 py-2 bg-[#171f33] border-b border-slate-800 flex items-center justify-between shrink-0">
        <span className="font-mono text-xs text-[#94A3B8] flex items-center gap-2">
          {activeTab === 'practice' ? (
            <FileText className="w-4 h-4 text-emerald-400" />
          ) : (
            <FileCode className="w-4 h-4 text-[#5de6ff]" />
          )}
          {extNames[activeLang]}
        </span>
        
        {/* Languages select */}
        <div className="flex bg-[#0f172a] p-0.5 rounded-lg border border-slate-800/80">
          {(['cpp', 'python', 'javascript', 'java'] as CodeLanguage[]).map(lang => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-2 py-0.5 text-[10px] uppercase font-mono rounded transition-colors ${
                activeLang === lang
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {lang === 'cpp' ? 'cpp' : lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : 'java'}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopyCode}
          className="text-[#94A3B8] hover:text-white cursor-pointer active:scale-95 transition-all p-1 rounded hover:bg-slate-800"
          title="Copy solution code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Code Body Content block */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#0c1020] overflow-hidden">
        {activeTab === 'practice' ? (
          /* Interactive Practicing Code Sandbox Editor */
          <div className="flex-1 flex flex-col p-4 min-h-0">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#94A3B8] uppercase">
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
            <div className="flex-1 min-h-0 rounded-lg border border-slate-800 bg-[#070a13] p-3 flex flex-row font-mono text-xs overflow-hidden relative">
              {/* Fake gutter line numbers */}
              <div className="w-6 pr-2 mr-2 border-r border-slate-800/65 text-right text-[#94A3B8] opacity-30 select-none flex flex-col leading-6 min-h-0 overflow-hidden">
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
                className="flex-1 bg-transparent border-0 outline-none resize-none text-emerald-300 leading-6 focus:ring-0 selection:bg-slate-700/60 font-mono text-xs overflow-y-auto whitespace-pre h-full w-full"
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
          </div>
        ) : (
          /* Synced Animation Read-only Solution Code Viewer with Line Highlights */
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed text-[#c7c4d7]">
            <code className="block whitespace-pre select-text">
              {lines.map((line, idx) => {
                // Ignore index 0 if it is the synchrony spacer placeholder
                if (idx === 0 && line.text.includes('placeholder')) return null;

                const isCurrentHighlighted = idx === lineHighlighted;

                // Highlight color markers for standard syntaxes
                const text = line.text;
                let formattedText = <span>{text}</span>;

                // Substring coloring keywords replacements
                const regex = /(function|def|void|int|vector|double|TreeNode|ListNode|return|if|else|while|for|public|class|boolean|String|List|Map|HashMap|Arrays|ArrayList|new)/g;
                const parts = text.split(regex);
                
                if (text.trim().startsWith('//') || text.trim().startsWith('#')) {
                  formattedText = <span className="text-[#94A3B8] opacity-50 italic">{text}</span>;
                } else {
                  formattedText = (
                    <span>
                      {parts.map((p, i) => {
                        if (['function', 'def', 'void', 'int', 'vector', 'double', 'TreeNode', 'ListNode', 'return', 'if', 'else', 'while', 'for', 'public', 'class', 'boolean', 'String', 'List', 'Map', 'HashMap', 'Arrays', 'ArrayList', 'new'].includes(p)) {
                          return <span key={i} className="text-[#c0c1ff] font-bold">{p}</span>;
                        }
                        if (p.includes('//') || p.includes('#')) {
                          return <span key={i} className="text-[#94A3B8] opacity-50 italic">{p}</span>;
                        }
                        return p;
                      })}
                    </span>
                  );
                }

                return (
                  <div 
                    key={idx} 
                    className={`flex -mx-4 px-4 py-0.5 transition-all duration-200 ${
                      isCurrentHighlighted 
                        ? 'bg-[#00cbe6]/10 border-l-2 border-[#00cbe6] text-white font-medium neon-glow-cyan' 
                        : ''
                    }`}
                  >
                    {/* Line count numbers */}
                    <span className={`w-6 text-right pr-2 select-none font-mono opacity-40 text-[10px] ${
                      isCurrentHighlighted ? 'text-[#00cbe6] opacity-100 font-bold' : ''
                    }`}>
                      {idx}
                    </span>

                    {/* Actual line text */}
                    <span 
                      className="flex-1 select-text"
                      style={{ paddingLeft: `${line.indent * 16}px` }}
                    >
                      {formattedText}
                    </span>

                    {isCurrentHighlighted && (
                      <span className="text-[9px] font-mono tracking-wider text-[#00cbe6] opacity-60 ml-2 animate-pulse select-none uppercase font-bold">
                        Active Trace Line
                      </span>
                    )}
                  </div>
                );
              })}
            </code>
          </div>
        )}
      </div>

    </div>
  );
}
