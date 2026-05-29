export interface LinkedListNodeState {
  id: string;
  value: number;
  nextId: string | null;
  isTemp?: boolean;
}

export interface TreeNodeState {
  id: string; // e.g. "50", "30", "20"
  value: number;
  leftId: string | null;
  rightId: string | null;
  x: number;
  y: number;
  highlighted?: boolean;
  traversed?: boolean;
}

export interface Snapshot {
  lineHighlighted: number; // 1-indexed to highlight the code/pseudocode
  actionType: 'init' | 'compare' | 'swap' | 'sorted' | 'traverse' | 'pointer_rewire' | 'insert' | 'delete' | 'found' | 'not_found' | 'done';
  explanation: string;
  
  // Topic states (optional, depending on current topic)
  arrayState?: number[];
  linkedListState?: LinkedListNodeState[];
  treeState?: TreeNodeState[];
  
  // Highlighting states for items
  activeIndices?: number[]; // for sorting array
  highlightedNodes?: string[]; // node IDs for list or BST nodes
  highlightedLine?: number;
  
  // Custom metadata variables to print in watchlist
  variables?: Record<string, string | number>;
  
  // Custom description line for details
  consoleOutput: string;
}

export type CodeLanguage = 'cpp' | 'python' | 'javascript' | 'java';

export interface CodeTemplate {
  language: CodeLanguage;
  code: { line: number; text: string; indent: number }[];
}

export type DSATopic = 'explore' | 'sorting' | 'linked-list' | 'trees' | 'graphs' | 'dp' | 'leetcode' | 'jvm-mode' | 'system-design' | 'advanced-ds';
export type SortingAlgo = 'quicksort' | 'bubblesort';
export type ListAlgo = 'insertAfter' | 'deleteNode';
export type TreeAlgo = 'insertBST' | 'searchBST' | 'inorderBST';
export type LeetAlgo = 'twosum' | 'valid_parentheses' | 'reverse_list' | 'invert_tree' | 'binary_search' | 'buy_sell_stock' | 'container_with_most_water' | 'group_anagrams' | 'threesum' | 'longest_substring' | 'merge_two_lists' | string;
