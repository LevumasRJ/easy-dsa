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

export type PrimaryLearningTrack = 'DSA' | 'LLD' | 'NETWORKING' | 'OS' | 'DATABASES' | 'APTITUDE' | 'ROADMAP';
export type AlgorithmicApproach = 'BRUTE_FORCE' | 'OPTIMIZED_TRICK';

// LLD State types
export interface LLDClassNode {
  id: string;
  name: string;
  type: 'class' | 'interface' | 'abstract';
  pattern?: 'Strategy' | 'Factory' | 'Observer' | 'Singleton' | 'Facade';
  attributes: string[];
  methods: string[];
  x: number;
  y: number;
  highlighted?: boolean;
  activeMethod?: string;
}

export interface LLDLink {
  source: string;
  target: string;
  relation: 'implements' | 'extends' | 'composes' | 'uses';
  active?: boolean;
}

export interface LLDState {
  systemScenario: string; // e.g. "Parking Lot", "Splitwise", "Elevator System"
  classes: LLDClassNode[];
  links: LLDLink[];
  activeObjectInstance?: string;
  activeSequenceMessage?: string;
  callStack?: string[];
}

// Networking State types
export interface NetworkPacketHeader {
  layer: 'Application' | 'Transport' | 'Network' | 'DataLink' | 'Physical';
  protocol: 'HTTP/3' | 'HTTP/1.1' | 'TCP' | 'UDP' | 'IP' | 'Ethernet' | 'Bits';
  details: Record<string, string | number>;
}

export interface NetworkHostNode {
  id: string;
  name: string;
  role: 'client' | 'server' | 'router' | 'dns';
  ip: string;
  mac: string;
  port?: number;
}

export interface NetworkingState {
  scenario: string; // "TCP 3-Way Handshake" | "HTTP Request/Response" | "DNS Resolution" | "TLS 1.3 Handshake"
  stage: string;
  headers: NetworkPacketHeader[];
  hosts: NetworkHostNode[];
  activePacketPosition: { fromHost: string; toHost: string; progress: number; label: string };
  windowBuffer?: { seq: number; ack: number; windowSize: number; sentBytes: number[] };
  rawBits?: string;
}

// Operating Systems State types
export interface OSCPUSlot {
  id: string;
  pc: number; // Program counter
  sp: number; // Stack pointer
  r0: number;
  r1: number;
  state: 'KERNEL' | 'USER' | 'IDLE';
  currentProcessId: string | null;
}

export interface OSProcessPCB {
  pid: string;
  name: string;
  state: 'READY' | 'RUNNING' | 'BLOCKED' | 'TERMINATED';
  priority: number;
  cpuTime: number;
  allocatedFrames: number[];
}

export interface OSMemoryPage {
  pageNumber: number;
  frameNumber: number;
  valid: boolean;
  dirty: boolean;
  accessed: boolean;
}

export interface OSState {
  scenario: string; // "Round Robin CPU Scheduling" | "Deadlock Dining Philosophers" | "Virtual Memory Page Fault"
  cpu: OSCPUSlot;
  readyQueue: OSProcessPCB[];
  blockedQueue: OSProcessPCB[];
  runningProcess: OSProcessPCB | null;
  pageTable: OSMemoryPage[];
  physicalFrames: Array<{ frame: number; content: string; processId: string }>;
  deadlockCycle?: string[];
  locks: Array<{ resource: string; heldBy: string | null; waiting: string[] }>;
}

// Database Engine State types
export interface DBBTreeNode {
  id: string;
  keys: number[];
  isLeaf: boolean;
  nextLeafId?: string | null;
  x: number;
  y: number;
  highlightedKeyIndex?: number;
  isActive?: boolean;
}

export interface DBWALEntry {
  lsn: number; // Log Sequence Number
  txId: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE' | 'COMMIT' | 'CHECKPOINT';
  targetTable: string;
  key: number;
  value: string;
  committed: boolean;
}

export interface DBState {
  scenario: string; // "B+ Tree Index Walk & Split" | "WAL & ACID Durability Pipeline" | "Buffer Pool LRU Cache" | "Index vs Table Scan Execution Plan"
  bTreeNodes: DBBTreeNode[];
  walLog: DBWALEntry[];
  bufferPool: Array<{ pageId: number; table: string; isDirty: boolean; lruRank: number }>;
  diskPages: Array<{ pageId: number; keys: number[]; flushed: boolean }>;
  queryPlan?: {
    sql: string;
    chosenPlan: 'INDEX_SCAN' | 'FULL_TABLE_SCAN';
    costEstimate: number;
    rowsScanned: number;
  };
}

export interface Snapshot {
  lineHighlighted: number; // 1-indexed to highlight the code/pseudocode
  actionType: 'init' | 'compare' | 'swap' | 'sorted' | 'traverse' | 'pointer_rewire' | 'insert' | 'delete' | 'found' | 'not_found' | 'done';
  explanation: string;
  approachType?: AlgorithmicApproach;
  
  // Topic states (optional, depending on current topic)
  arrayState?: number[];
  linkedListState?: LinkedListNodeState[];
  treeState?: TreeNodeState[];
  
  // New domain states
  lldState?: LLDState;
  networkingState?: NetworkingState;
  osState?: OSState;
  dbState?: DBState;

  // Vector canvas overlays
  canvasVectorPositions?: {
    nodes?: Array<{ id: string; label: string; x: number; y: number; stateFlag?: string; colorHex?: string }>;
    links?: Array<{ source: string; target: string; directionalArrow?: boolean; activeState?: boolean }>;
    packetHeaders?: Record<string, any>;
    cpuRegisters?: Record<string, string | number>;
    databaseLogBuffer?: string[];
  };

  // Highlighting states for items
  activeIndices?: number[]; // for sorting array
  highlightedNodes?: string[]; // node IDs for list or BST nodes
  highlightedLine?: number;
  
  // Custom metadata variables to print in watchlist
  variables?: Record<string, string | number>;
  
  // Custom description line for details
  consoleOutput: string;
}

export type CodeLanguage = 'java' | 'javascript' | 'cpp' | 'python';

export interface CodeTemplate {
  language: CodeLanguage;
  code: { line: number; text: string; indent: number }[];
}

export type DSATopic = 
  | 'explore' 
  | 'sorting' 
  | 'linked-list' 
  | 'trees' 
  | 'graphs' 
  | 'dp' 
  | 'leetcode' 
  | 'jvm-mode' 
  | 'system-design' 
  | 'advanced-ds'
  | 'lld'
  | 'networking'
  | 'os'
  | 'databases'
  | 'aptitude'
  | 'roadmap';

export type SortingAlgo = 'quicksort' | 'bubblesort';
export type ListAlgo = 'insertAfter' | 'deleteNode';
export type TreeAlgo = 'insertBST' | 'searchBST' | 'inorderBST';
export type LeetAlgo = 'twosum' | 'valid_parentheses' | 'reverse_list' | 'invert_tree' | 'binary_search' | 'buy_sell_stock' | 'container_with_most_water' | 'group_anagrams' | 'threesum' | 'longest_substring' | 'merge_two_lists' | string;

// Roadmap Task Definition
export interface RoadmapTask {
  id: string;
  topicId: string;
  title: string;
  track: 'DSA' | 'LLD' | 'Networking' | 'OS' | 'Databases';
  category: string;
  prerequisites: string[];
  estimatedMinutes: number;
  status: 'PENDING' | 'COMPLETED' | 'BACKLOG';
  targetDayIndex: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  description: string;
  dsaTopicNav?: DSATopic;
  defaultAlgo?: string;
}

// Timed Aptitude Exam Models
export interface AptitudeQuestion {
  id: string;
  category: 
    | 'Quantitative Reasoning'
    | 'Logical Reasoning'
    | 'Verbal Ability'
    | 'Data Interpretation'
    | 'Puzzles & Brain Teasers'
    | 'Probability & Combinatorics'
    | 'CS Core Basics'
    | 'Pattern Series';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  mathDerivation?: string[];
  formulaUsed?: string;
}
