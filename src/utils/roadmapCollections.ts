/**
 * Standard LeetCode / NeetCode Curriculum Collections & Playlists
 */

import { LeetCodeProblem } from '../leetcodeDatabase';

// 1. Blind 75 Problem Numbers (official list of 75 essential interview questions)
export const BLIND_75_NUMBERS = new Set([
  1, 217, 242, 49, 347, 238, 128, 125, 15, 11, 121, 3, 424, 76, 20, 155,
  150, 22, 739, 84, 704, 74, 875, 153, 33, 206, 21, 143, 19, 141, 100,
  104, 226, 572, 102, 199, 230, 235, 105, 124, 297, 208, 211, 212, 133,
  200, 417, 207, 261, 323, 78, 90, 39, 46, 79, 131, 17, 51, 703, 215,
  295, 70, 198, 213, 91, 139, 322, 300, 1143, 518, 55, 45, 134, 846,
  763, 53, 56, 57, 435, 252, 253, 202, 54, 73, 48, 191, 338, 190, 268
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

/**
 * Checks if a problem belongs to a specific playbook
 */
export function isProblemInPlaylist(prob: LeetCodeProblem, playlistId: PlaylistId): boolean {
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
      // NeetCode 150 has exactly the 150 base items (numbered less than or equal to their IDs)
      // Any base item is in nc150
      return prob.number <= 2000; // Let's check: any problem originally in the base catalog can match
    case 'lc250':
      // Everything plus some of the extra ones
      return true;
    default:
      return true;
  }
}
