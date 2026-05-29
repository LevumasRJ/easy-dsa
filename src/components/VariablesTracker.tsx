import { CodeLanguage } from '../types';
import { Network } from 'lucide-react';

interface VariablesTrackerProps {
  variables?: Record<string, string | number>;
  activeTopic: string;
}

export default function VariablesTracker({
  variables = {},
  activeTopic
}: VariablesTrackerProps) {
  
  // Convert map to list
  const varList = Object.entries(variables);

  // Dots positioning helper
  const getPointerBadgeStyles = (key: string) => {
    switch (key.toLowerCase()) {
      case 'head':
      case 'root':
        return { dot: 'bg-[#c0c1ff]', text: 'text-[#c0c1ff] bg-[#c0c1ff]/10 border-[#c0c1ff]/20' };
      case 'temp':
      case 'newnode':
      case 'val':
        return { dot: 'bg-[#5de6ff] neon-glow-cyan', text: 'text-[#5de6ff] bg-[#5de6ff]/10 border-[#5de6ff]/20 animate-pulse' };
      case 'current':
      case 'prevnode':
        return { dot: 'bg-[#eec200]', text: 'text-[#eec200] bg-[#eec200]/10 border-[#eec200]/20' };
      case 'pivot':
        return { dot: 'bg-indigo-400', text: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' };
      case 'i':
        return { dot: 'bg-red-500', text: 'text-red-500 bg-red-400/10 border-red-400/20' };
      case 'j':
        return { dot: 'bg-yellow-400', text: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' };
      default:
        return { dot: 'bg-[#dae2fd]', text: 'text-[#c7c4d7] bg-[#171f33]' };
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#131b2e] rounded-xl border border-slate-800 overflow-hidden">
      {/* Header bar */}
      <div className="px-4 py-3 bg-[#171f33] border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-mono text-xs text-[#94A3B8] flex items-center gap-2">
          <Network className="w-4 h-4 text-[#8083ff]" />
          Variables Watch
        </h3>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#94A3B8]">
          Stack Frame
        </span>
      </div>

      {/* Variables Table */}
      <div className="flex-1 p-4 overflow-y-auto">
        {varList.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-[#94A3B8]/60 font-mono italic text-center">
              No active scopes variable initialized.<br/>Play algorithm to watch variables.
            </p>
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-[#94A3B8] border-b border-slate-800/80">
                <th className="font-normal pb-2 uppercase tracking-wide">Identifier Name</th>
                <th className="font-normal pb-2 pl-4 uppercase tracking-wide">Runtime Value / Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {varList.map(([key, val]) => {
                const colors = getPointerBadgeStyles(key);
                const valStr = String(val);

                // Check formatting
                const isReferenceNode = valStr.includes('Node') || valStr.includes('TreeNode') || key === 'temp';

                return (
                  <tr key={key} className="hover:bg-slate-800/10 transition-colors">
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded border font-mono font-medium text-[11px] ${colors.text}`}>
                        {key}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-white font-mono flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full inline-block ${colors.dot}`} />
                      {isReferenceNode ? (
                        <span>
                          {valStr}{' '}
                          <span className="text-slate-500 text-[10px] tracking-tight">
                            @{key === 'temp' ? '0x9F2' : key === 'current' ? '0x2B8' : key === 'head' ? '0x1A4' : '0x3D1'}
                          </span>
                        </span>
                      ) : (
                        <span className={isNaN(Number(valStr)) ? 'text-[#dae2fd]' : 'text-green-400 font-bold'}>
                          {valStr}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
