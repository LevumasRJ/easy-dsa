import { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';
import { CodeLanguage } from '../types';
import { CODE_SNIPPETS } from '../codeSnippets';
import { LEETCODE_CODE_SNIPPETS } from '../leetcodeDatabase';

interface CodeEditorPanelProps {
  currentAlgorithm: string; // e.g., 'bubblesort', 'quicksort', 'insertAfter', 'deleteNode', 'insertBST' or 'twosum', 'valid_parentheses'...
  lineHighlighted: number;
}

export default function CodeEditorPanel({
  currentAlgorithm,
  lineHighlighted
}: CodeEditorPanelProps) {
  const [activeLang, setActiveLang] = useState<CodeLanguage>('cpp');
  const [copied, setCopied] = useState(false);

  // Retrieve lines (checking if currentAlgorithm is in LEETCODE_CODE_SNIPPETS first)
  const isLeetCode = currentAlgorithm in LEETCODE_CODE_SNIPPETS;
  const algoSnippets = isLeetCode 
    ? LEETCODE_CODE_SNIPPETS[currentAlgorithm] 
    : (CODE_SNIPPETS[currentAlgorithm] || CODE_SNIPPETS.bubblesort);
    
  const lines = algoSnippets[activeLang];

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
      
      {/* Tab bar header */}
      <div className="px-4 py-3 bg-[#171f33] border-b border-slate-800 flex items-center justify-between">
        <span className="font-mono text-xs text-[#94A3B8] flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#5de6ff]" />
          {extNames[activeLang]}
        </span>
        
        {/* Languages select */}
        <div className="flex bg-[#0f172a] p-0.5 rounded-lg border border-slate-800/80">
          {(['cpp', 'python', 'javascript', 'java'] as CodeLanguage[]).map(lang => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-2 py-1 text-[10px] uppercase font-mono rounded transition-colors ${
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
          className="text-[#94A3B8] hover:text-white cursor-pointer active:scale-90 transition-transform"
          title="Copy full code block"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Code body block container with active line highlighting */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed text-[#c7c4d7] bg-[#0c1020]">
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
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </code>
      </div>

    </div>
  );
}
