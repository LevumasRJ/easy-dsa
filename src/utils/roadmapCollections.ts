/**
 * Standard LeetCode / NeetCode Curriculum Collections & Playlists
 */

import { LeetCodeProblem, NEETCODE_PROBLEMS } from '../leetcodeDatabase';

// 1. Blind 75 Problem Numbers (official list of 75 essential interview questions)
export const BLIND_75_NUMBERS = new Set([
  1, 121, 217, 238, 53, 152, 153, 33, 15, 11, // Arrays/Pointers
  371, 191, 338, 190, 268, // Binary
  70, 322, 300, 1143, 139, 39, 198, 213, 91, 62, 55, // DP / Backtracking / Seq
  133, 207, 417, 200, 128, 269, 261, 323, // Graph
  57, 56, 435, 252, 253, // Intervals
  206, 141, 21, 23, 19, 143, // Linked List
  73, 54, 48, 79, // Matrix
  3, 424, 76, 242, 49, 20, 125, 5, 647, // String
  104, 100, 226, 124, 102, 297, 572, 105, 98, 230, 235, 236, // Tree
  347, 295, 212, 208, 211 // Heap / Trie / Advanced
]);

// 2. LeetCode 50 Problem Numbers (highly selective subset of top-tier foundational patterns)
export const LEETCODE_50_NUMBERS = new Set([
  1, 217, 242, 49, 347, 125, 15, 11, 121, 3, 20, 206, 21, 141, 100, 104,
  226, 704, 33, 153, 19, 102, 235, 128, 155, 70, 198, 133, 200, 207, 39,
  78, 105, 56, 57, 191, 136, 13, 9, 8, 22, 143, 54, 73, 48, 424, 230,
  215, 208, 322
]);

// 3. LeetCode Hot 100 Problem Numbers (combined with Blind 75 plus notable popular questions)
export const LEETCODE_100_NUMBERS = new Set([
  1, 2, 3, 4, 11, 15, 17, 19, 20, 21, 22, 23, 31, 32, 33, 34, 39, 41, 42,
  46, 48, 49, 53, 54, 55, 56, 62, 64, 70, 72, 73, 74, 75, 76, 78, 79, 94,
  96, 98, 101, 102, 104, 105, 108, 114, 121, 124, 128, 131, 136, 138, 139,
  141, 142, 146, 148, 152, 153, 155, 160, 169, 189, 198, 200, 206, 207, 208,
  215, 226, 230, 234, 236, 238, 239, 240, 242, 279, 283, 287, 295, 300, 322,
  338, 347, 394, 416, 437, 438, 543, 560, 572, 739, 994, 1143, 287, 230,
  56, 57, 202, 54, 73, 48, 191
]);

export type PlaylistId = 'all' | 'lc50' | 'blind75' | 'lc100' | 'nc150' | 'lc250';

export interface PlaylistInfo {
  id: PlaylistId;
  name: string;
  description: string;
  shortLabel: string;
  iconBg: string;
  textCol: string;
}

export const PLAYLISTS: PlaylistInfo[] = [
  {
    id: 'lc50',
    name: 'LeetCode 50 Essentials',
    shortLabel: 'LC 50',
    description: 'Fast track of core foundational coding interview puzzles.',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30',
    textCol: 'text-emerald-400'
  },
  {
    id: 'blind75',
    name: 'Blind 75 Roadmap',
    shortLabel: 'Blind 75',
    description: 'The world-famous curated list covering critical high-yield questions.',
    iconBg: 'bg-cyan-500/10 border-cyan-500/30',
    textCol: 'text-cyan-400'
  },
  {
    id: 'lc100',
    name: 'LeetCode Hot 100',
    shortLabel: 'Hot 100',
    description: 'The standard curated roster most frequently queried by top companies.',
    iconBg: 'bg-amber-500/10 border-amber-500/30',
    textCol: 'text-amber-400'
  },
  {
    id: 'nc150',
    name: 'NeetCode 150 Curated',
    shortLabel: 'NC 150',
    description: 'Comprehensive curriculum layout meticulously mapping every concept tier.',
    iconBg: 'bg-[#8083ff]/10 border-[#8083ff]/30',
    textCol: 'text-indigo-400'
  },
  {
    id: 'lc250',
    name: 'LeetCode Expanded 250',
    shortLabel: 'LC 250',
    description: 'Extensive interview bank compiling extra practice questions.',
    iconBg: 'bg-purple-500/10 border-purple-500/30',
    textCol: 'text-purple-400'
  },
  {
    id: 'all',
    name: 'All Catalog Problems',
    shortLabel: 'All Repo',
    description: 'Unfiltered combination of catalog elements and newly synced problems.',
    iconBg: 'bg-slate-800 border-slate-700',
    textCol: 'text-slate-300'
  }
];

// Lazy-loaded set for precise NeetCode 150 members check
let neetcode150Ids: Set<string> | null = null;
export function getNeetcode150Ids(): Set<string> {
  if (!neetcode150Ids) {
    neetcode150Ids = new Set((NEETCODE_PROBLEMS || []).map(p => p.id));
  }
  return neetcode150Ids;
}

// Sets of IDs for each playlist, lazy loaded and cached based on allProblemsList
let playlistIdCache: Record<PlaylistId, Set<string>> | null = null;
let lastProblemsListRef: any = null;

export function buildPlaylistIdCache(allProblems: LeetCodeProblem[]) {
  if (playlistIdCache && lastProblemsListRef === allProblems) {
    return playlistIdCache;
  }
  
  const cache: Record<PlaylistId, Set<string>> = {
    all: new Set(allProblems.map(p => p.id)),
    lc50: new Set<string>(),
    blind75: new Set<string>(),
    lc100: new Set<string>(),
    nc150: new Set<string>(),
    lc250: new Set<string>()
  };

  // 1. NeetCode 150: Exactly the original 150 base problems (those within the base 150 catalog)
  const nc150List = allProblems.filter(p => !p.id.startsWith('supp_') && !p.id.startsWith('proc_') && !p.id.startsWith('scraped_')).slice(0, 150);
  nc150List.forEach(p => cache.nc150.add(p.id));

  // 2. LeetCode 50: Target exactly 50
  const lc50Candidates = allProblems.filter(p => LEETCODE_50_NUMBERS.has(p.number));
  const uniqueLc50: LeetCodeProblem[] = [];
  const seenLc50 = new Set<number>();
  lc50Candidates.forEach(p => {
    if (!seenLc50.has(p.number)) {
      seenLc50.add(p.number);
      uniqueLc50.push(p);
    }
  });
  if (uniqueLc50.length < 50) {
    const filler = allProblems.filter(p => !uniqueLc50.some(u => u.id === p.id));
    uniqueLc50.push(...filler.slice(0, 50 - uniqueLc50.length));
  }
  uniqueLc50.slice(0, 50).forEach(p => cache.lc50.add(p.id));

  // 3. Blind 75: Target exactly 75
  const blind75Candidates = allProblems.filter(p => BLIND_75_NUMBERS.has(p.number));
  const uniqueBlind75: LeetCodeProblem[] = [];
  const seenBlind75 = new Set<number>();
  blind75Candidates.forEach(p => {
    if (!seenBlind75.has(p.number)) {
      seenBlind75.add(p.number);
      uniqueBlind75.push(p);
    }
  });
  if (uniqueBlind75.length < 75) {
    const filler = allProblems.filter(p => !uniqueBlind75.some(u => u.id === p.id));
    uniqueBlind75.push(...filler.slice(0, 75 - uniqueBlind75.length));
  }
  uniqueBlind75.slice(0, 75).forEach(p => cache.blind75.add(p.id));

  // 4. LeetCode 100: Target exactly 100
  const lc100Candidates = allProblems.filter(p => LEETCODE_100_NUMBERS.has(p.number));
  const uniqueLc100: LeetCodeProblem[] = [];
  const seenLc100 = new Set<number>();
  lc100Candidates.forEach(p => {
    if (!seenLc100.has(p.number)) {
      seenLc100.add(p.number);
      uniqueLc100.push(p);
    }
  });
  if (uniqueLc100.length < 100) {
    const filler = allProblems.filter(p => !uniqueLc100.some(u => u.id === p.id));
    uniqueLc100.push(...filler.slice(0, 100 - uniqueLc100.length));
  }
  uniqueLc100.slice(0, 100).forEach(p => cache.lc100.add(p.id));

  // 5. LeetCode 250 (Top 250 Bank): Target exactly 250 problems
  // Filters for base 250 (excluding scraped items), ensuring exactly 250 are captured, fallback to filler if needed.
  const lc250Problems = allProblems.filter(p => !p.id.startsWith('scraped_')).slice(0, 250);
  if (lc250Problems.length < 250) {
    const filler = allProblems.filter(p => !lc250Problems.some(u => u.id === p.id));
    lc250Problems.push(...filler.slice(0, 250 - lc250Problems.length));
  }
  lc250Problems.forEach(p => cache.lc250.add(p.id));

  playlistIdCache = cache;
  lastProblemsListRef = allProblems;
  return cache;
}

/**
 * Checks if a problem belongs to a specific playbook
 */
export function isProblemInPlaylist(prob: LeetCodeProblem, playlistId: PlaylistId, allProblems?: LeetCodeProblem[]): boolean {
  if (allProblems) {
    const cache = buildPlaylistIdCache(allProblems);
    return cache[playlistId].has(prob.id);
  }
  
  switch (playlistId) {
    case 'all':
      return true;
    case 'lc50':
      return LEETCODE_50_NUMBERS.has(prob.number);
    case 'blind75':
      return BLIND_75_NUMBERS.has(prob.number);
    case 'lc100':
      return LEETCODE_100_NUMBERS.has(prob.number);
    case 'nc150':
      // Return true only if it is actually in the original NeetCode 150 bank
      return getNeetcode150Ids().has(prob.id);
    case 'lc250':
      return !prob.id.startsWith('scraped_');
    default:
      return true;
  }
}
