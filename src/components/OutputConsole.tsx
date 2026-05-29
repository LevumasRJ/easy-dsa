import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { Snapshot } from '../types';

interface OutputConsoleProps {
  snapshots: Snapshot[];
  currentIndex: number;
}

export default function OutputConsole({
  snapshots,
  currentIndex
}: OutputConsoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Accumulate previous console log traces up to current step
  const activeLogs = snapshots.slice(0, currentIndex + 1);

  // Auto scroll terminal to bottom on update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentIndex]);

  const getLogTypeBadge = (log: string) => {
    if (log.includes('[SUCCESS]')) {
      return { badge: 'green', clean: log.replace('[SUCCESS]', '').trim() };
    }
    if (log.includes('[SWAP]')) {
      return { badge: 'yellow', clean: log.replace('[SWAP]', '').trim() };
    }
    if (log.includes('[ERROR]')) {
      return { badge: 'red', clean: log.replace('[ERROR]', '').trim() };
    }
    if (log.includes('[TRACE]')) {
      return { badge: 'slate', clean: log.replace('[TRACE]', '').trim() };
    }
    return { badge: 'blue', clean: log.replace('[INFO]', '').trim() };
  };

  return (
    <div className="w-full h-full bg-[#020617] rounded-xl border border-slate-800 overflow-hidden flex flex-col font-mono">
      {/* Header bar */}
      <div className="px-4 py-2 bg-[#171f33] border-b border-slate-800 flex items-center justify-between">
        <span className="font-mono text-xs text-[#94A3B8] flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#eec200]" />
          Output Terminal
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono select-none">
          Live Trace
        </span>
      </div>

      {/* Terminal log contents */}
      <div 
        ref={containerRef}
        className="flex-1 p-4 font-mono text-[11px] leading-relaxed space-y-2 overflow-y-auto bg-[#070b19] scroll-smooth"
      >
        {activeLogs.length === 0 ? (
          <div className="text-slate-600 italic select-none">
            [CONSOLE] Awaiting timeline initialization...
          </div>
        ) : (
          activeLogs.map((snap, idx) => {
            const { badge, clean } = getLogTypeBadge(snap.consoleOutput);

            if (badge === 'green') {
              return (
                <div key={idx} className="text-emerald-400 font-bold flex items-start gap-2 select-text">
                  <span>[SUCCESS]</span>
                  <span>{clean}</span>
                </div>
              );
            }
            if (badge === 'red') {
              return (
                <div key={idx} className="text-rose-500 font-bold flex items-start gap-2 select-text">
                  <span>[ERROR]</span>
                  <span>{clean}</span>
                </div>
              );
            }
            if (badge === 'yellow') {
              return (
                <div key={idx} className="text-amber-400 flex items-start gap-2 select-text">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                    [SWAP]
                  </span>
                  <span>{clean}</span>
                </div>
              );
            }
            if (badge === 'slate') {
              return (
                <div key={idx} className="text-slate-400 opacity-80 flex items-start gap-2 select-text">
                  <span>[TRACE]</span>
                  <span>{clean}</span>
                </div>
              );
            }

            // default blue info logs
            return (
              <div key={idx} className="text-[#94A3B8] flex items-start gap-2 select-text">
                <span>[INFO]</span>
                <span>{clean}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
