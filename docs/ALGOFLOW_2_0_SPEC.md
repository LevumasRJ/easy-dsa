# AlgoFlow 2.0 — Enterprise-Grade AI-Powered Interactive DSA Learning Ecosystem
## Architectural Specifications, Design Systems, and Multi-Phase Engineering Blueprint

---

## 1. Complete Architecture Diagram

Below is the high-level, production-grade full-stack architecture diagram for AlgoFlow 2.0, utilizing a modular, unidirectional data flow and plugin-driven visualization model.

```
+---------------------------------------------------------------------------------------------------------+
|                                        UX ARCHITECTURE & CLIENT LAYER                                   |
|                                                                                                         |
|   +-----------------------+   +------------------------+   +-------------------+   +----------------+   |
|   |  Standard Desktop UI  |   | Adaptive Responsive UI |   |  Code Editor Panel|   |  Canvas Stage  |   |
|   | (Tri-Panel Workspace) |   | (Mobile Tabbed Layout) |   | (Monaco/Code Mirror)| (HTML5/SVG/WebGL)|   |
|   +-----------+-----------+   +-----------+------------+   +---------+---------+   +--------+-------+   |
|               |                           |                          |                      |           |
+---------------|---------------------------|--------------------------|----------------------|-----------+
                |                           |                          |                      |
                v                           v                          v                      v
+---------------------------------------------------------------------------------------------------------+
|                                        APPLICATION STATE ENGINE (ZUSTAND)                               |
|                                                                                                         |
|   +------------------------------------+   +------------------------------------+   +---------------+   |
|   |          TIMELINE CONTROLLER       |   |         COMPARE CONTROLLER         |   | USER SESSION  |   |
|   | - stepIndex / maxSteps             |   | - dualState (Algorithm A vs B)     |   |   & STREAKS   |   |
|   | - isPlaying / speedMultiplier      |   | - unifiedPlaybackSynchronization   |   | - XP / Level  |   |
|   | - snapshotHistory[]                |   | - activeComparisonsCount           |   | - Active streak|   |
|   +-----------------+------------------+   +-----------------+------------------+   +-------+-------+   |
|                     |                                        |                              |           |
+---------------------|----------------------------------------|------------------------------|-----------+
                      |                                        |                              |
                      v                                        v                              v
+---------------------------------------------------------------------------------------------------------+
|                                     ALGOFLOW VISUALIZATION CORE ENGINE V2                               |
|                                                                                                         |
|   +------------------------------------++-------------------------------------+ +--------------------+  |
|   |            PLUGIN SYSTEM           ||          EXECUTION TRACKER          | |     AI TUTOR     |  |
|   | - IVisualizer (Schema Mapper)      || - AST Parser / Variable Inspector   | | - Explanation Gen|  |
|   | - IDatastructure (Node, Pointer)   || - Stack Frames / Heap Reference Maps| | - Socratic Hints |  |
|   | - Custom Data Injector             || - Web Worker Execution sandbox      | | - Speech (TTS)   |  |
|   +-----------------+------------------++-------------------------------------+ +---------+----------+  |
+---------------------|---------------------------------------------------------------------|-------------+
                      |                                                                     |
                      v                                                                     v
+---------------------------------------------------------------------------------------------------------+
|                                     PERSISTENCE MATCHING & DEPLOYMENT                                   |
|                                                                                                         |
|       +------------------------------------+       +------------------------------------+               |
|       |     OFFLINE LOCAL DATA STORAGE     |       |       REMOTE ENTERPRISE CLOUD      |               |
|       |     - IndexedDB (Dexie.js)         |       |       - Firebase Firestore Syncer  |               |
|       |     - CacheStorage (PWA Assets)    |       |       - OAuth 2.0 Auth Gateways    |               |
|       +------------------------------------+       +------------------------------------+               |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Component Hierarchy

This nested tree outlines the adaptive component structure configured for the diverse device targets, ranging from desktop ultra-wides to compact mobile viewports.

```
App (Root Component)
├── DesignSystemProvider (Theme, Accessibility Mappings)
├── LayoutManager (Responsive Viewport Matcher)
│   ├── DesktopLayout (Tri-Panel Windowed Workspace)
│   │   ├── LeftPanel (Interactive Algorithm Side Explorer)
│   │   ├── CenterPanel (Unified Visualization Stage)
│   │   │   ├── CompareVisualizer (Side-by-Side Canvas)
│   │   │   │   ├── StageA (Canvas/SVG/WebGL)
│   │   │   │   └── StageB (Canvas/SVG/WebGL)
│   │   │   ├── StandardVisualizer (Active Canvas)
│   │   │   └── TimelineControlBar (Play, Speed, Frame Triggers, Stepper)
│   │   ├── RightPanel (Vertical Split Workspace)
│   │   │   ├── CodeEditorContainer (Monaco/CodeMirror Wrapper with Line Markers)
│   │   │   └── VariablesTrackerContainer (Active Live Pointers, Stack Frames)
│   │   └── BottomPanel (Debug Stream Console Log)
│   │
│   ├── TabletLayout (Adaptive Master-Detail Stack)
│   │   ├── ScreenSplitTop (Active Visualizer & Timeline)
│   │   ├── ScreenSplitMiddle (Toggleable Code Editor with Execution Highlights)
│   │   └── ScreenSplitBottom (Combined Stack Frame Variables + Console Tabs)
│   │
│   └── MobileLayout (Swipeable Tab-Bar Navigation Shell)
│       ├── ViewportContainer (Touch Gestures: Swipe left/right, Pinch zoom)
│       │   ├── Tab[Visualizer] (Full-Screen Visualizer Stage & Floating Mini-Controls)
│       │   ├── Tab[Code] (Monaco Reader mode / CodeMirror with collapsible lines)
│       │   ├── Tab[Variables] (Simple variable cards with memory diagrams)
│       │   ├── Tab[Console] (Collapsible trace output list)
│       │   └── Tab[AITutor] (Conversational chat pane with micro-guides & speech)
│       └── SystemBarNavigation (Bottom Tab Panel Shell with active accessibility focus)
│
└── ToastFeedbackSystem (Level Up notifications, Streak status, offline sync status)
```

---

## 3. Folder Structure

A backward-compatible directory layout designed to isolate the execution context, design system patterns, and custom data structure structures cleanly.

```
/src
│
├── main.tsx                      # App entry point
├── App.tsx                       # Context routing and root Layout Selector
├── types.ts                      # Legacy mappings & structural V2 type system
├── index.css                     # Font loads (@font-face Inter & Mono) & Tailwind theme
│
├── /algorithms                   # Unified algorithm definitions and state creators
│   ├── index.ts                  # Registry entry point
│   ├── base.ts                   # Algorithm & Snapshot base types
│   ├── /sorting                  # Bubble, Quick, Heap, Shell, Counting, Radix, Merge
│   ├── /graphs                   # BFS, DFS, Dijkstra, Prim, Kruskal, Bellman-Ford, A*
│   ├── /dynamic-programming      # LCS, LIS, Knapsack, Coin Change, Matrix Chain
│   └── /backtracking             # N-Queens, Sudoku, Word Search
│
├── /components                   # Shared architectural layouts & design system primitives
│   ├── /ui                       # Tokens (Buttons, Selects, Modals, Badges, Tabs)
│   ├── /design-system            # Color schema variables, AMOLED, Cyberpunk sheets
│   ├── LinkedListCanvas.tsx      # Legacy-preserving canvas
│   ├── BSTCanvas.tsx             # Legacy-preserving tree canvas
│   ├── LeetCodeCanvas.tsx        # Legacy-preserving hub view
│   ├── CompareVisualizer.tsx     # Side-by-side execution canvas
│   └── TimelinePanel.tsx         # Unified steppers & frame slider
│
├── /core                         # Upgraded engine layers
│   ├── timeline.ts               # Upgraded time-travel controller using action-logs
│   ├── astParser.ts              # Custom code execution visual runtime
│   ├── workerPool.ts             # Web Workers for headless algorithm stepping
│   └── pluginRegistry.ts         # Metadata-driven architecture resolver
│
├── /db                           # Local persistence schemas
│   ├── indexedDb.ts              # Dexie.js offline DB connection
│   └── cacheStrategy.ts          # Offline problem sets and PWA sync handlers
│
└── /docs                         # Local developer resources
    ├── ALGORITHMS.md
    ├── ARCHITECTURE.md
    └── ALGOFLOW_2_0_SPEC.md      # This specification blueprint
```

---

## 4. State Management Design

The global state model leverages `Zustand` for highly performant, reactive updates, dividing operations into specific transaction packages while maintaining raw backward compatibility.

```typescript
import { create } from 'zustand';

export interface ActionLog {
  id: string;
  type: 'COMPUTE' | 'COMPARE' | 'SWAP' | 'MARK_TRAVERSED' | 'DEREFERENCE';
  description: string;
  timestamp: number;
  delta: Record<string, any>; // Reversible delta state
}

export interface Snapshot {
  id: string;
  nodes: any[];
  edges?: any[];
  variables: Record<string, any>;
  highlightedNodes: string[];
  explanation: string;
  lineNum: number; // For synchronization
}

interface PerformanceMetrics {
  comparisons: number;
  swaps: number;
  executionTimeMs: number;
}

interface AlgoFlowStateV2 {
  // Session Configuration & Streaks
  currentTheme: 'dark' | 'light' | 'amoled' | 'hacker' | 'cyberpunk';
  userXp: number;
  dailyStreak: number;
  isOffline: boolean;

  // Real-time Playback State
  activeAlgorithmId: string;
  snapshots: Snapshot[];
  currentSnapshotIndex: number;
  isPlaying: boolean;
  speed: number; // 0.25x to 4x
  actionLogs: ActionLog[];

  // Side-by-Side Compare Engine
  compareMode: boolean;
  compareAlgorithmIdA: string | null;
  compareAlgorithmIdB: string | null;
  snapshotsA: Snapshot[];
  snapshotsB: Snapshot[];
  currentIndexA: number;
  currentIndexB: number;
  metricsA: PerformanceMetrics;
  metricsB: PerformanceMetrics;

  // Actions / State Mutators
  setTheme: (theme: 'dark' | 'light' | 'amoled' | 'hacker' | 'cyberpunk') => void;
  loadAlgorithm: (id: string, initialInput: any) => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToSnapshot: (index: number) => void;
  togglePlayback: () => void;
  triggerSyncSideBySide: () => void;
  addXp: (amount: number) => void;
}
```

---

## 5. Responsive Design Strategy

AlgoFlow 2.0 ensures dynamic screen utilization through a rigorous, mobile-first design strategy, avoiding viewport layout overflow while maximizing rendering performance.

### A. Breakpoint Framework
- **Mobile (`< 768px`)**: Single visual container. Users transition between code, visualization, and step logs using a tactile swipe gesture or active navigation tab buttons. Responsive interactive touch-zone limits are explicitly defined at `min-h-[44px]`.
- **Tablet (`768px - 1280px`)**: Two-column layout with vertical splitting. Visualization forms the upper focal region; split code panel and combined variable inspector/console tabs organize below.
- **Desktop (`>= 1280px`)**: Full tri-panel interface (Layout: Left list tracker + Center Visualization Canvas + Right vertical split Code/Variables + Bottom debug log terminal).

### B. Gestures & Interactivity Wrapper
```typescript
interface TouchGestureConfig {
  swipeThreshold: number; // Swipe left/right threshold to transition Tabs (e.g. 50px)
  pinchZoomScaleRange: [number, number]; // WebGL/SVG Zoom limits (0.5x to 2.5x)
  doubleTapTimeout: number; // 300ms window to highlight node/edge details on touch devices
}
```

---

## 6. Accessibility Strategy (WCAG AA Compliance)

Every interaction path is architected to perform seamlessly under strict access conditions, utilizing semantic tags, screen-reading announce systems, and robust focus managers.

### A. ARIA Focus and Audio Announcements
```typescript
// Hook to handle active speech announcements per snapshot progress
export function useAriaLiveAnnouncer() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const el = document.getElementById('a11y-live-announcement') || createAnnouncerElement();
    el.innerText = message;
    el.setAttribute('aria-live', politeness);
  };
  return { announce };
}
```

### B. Keyboard Accessibility Grid
1. **`[Spacebar]`**: Toggle visualization pause/resume state.
2. **`[Left Arrow] / [Right Arrow]`**: Frame step backward / frame step forward.
3. **`[Tab]` / `[Shift + Tab]`**: Cycle focusing sequentially through control buttons, sidebars, interactive nodes, and line numbers. Focus targets are isolated with high-visibility neon outline wrappers (`focus:ring-2 focus:ring-offset-2 focus:ring-[#00cbe6]`).
4. **`[Escape]`**: Release modal popups, reset selection overlays, or unfocus canvas zooms.

---

## 7. Performance Strategy

To easily render up to 100,000 nodes without CPU bottlenecking, the visualization engine operates across dedicated rendering tiers.

- **Under 1,000 Nodes**: Fully animated SVG elements with micro-motions coupled with `framer-motion` for smooth layout shifts.
- **1,000 to 10,000 Nodes**: HTML5 Canvas Rendering with single-pass coordinate draw loops to maintain full responsive layouts at 60 FPS.
- **10,000+ Nodes**: Optimized WebGL rendering leveraging dynamic buffers, offscreen calculation layers (using CSS ResizeObservers), viewport clamping (only rendering elements currently inside screen viewports), and asynchronous computation processing.

### Multi-Threaded Execution Runtime
```
+---------------------------------+              +---------------------------------+
|        MAIN DISPLAY THREAD      |              |        ASYNC WEB WORKERS        |
|                                 |              |                                 |
| - Render Canvas frame buffers   |  Message     | - Generate massive AST profiles |
| - Manage UI and touch gestures  | ------------>| - Calculate detailed paths      |
| - Display AI text streams       | <------------| - Map deep trace variable arrays|
|                                 |  Snapshots   |                                 |
+---------------------------------+              +---------------------------------+
```

---

## 8. Migration Plan from Existing AlgoFlow

To deploy version 2.0 smoothly without breaking standard visual states, we apply a clear Adapter Pattern mapping existing generators smoothly to the dynamic multi-step platform.

```typescript
// Snapshot legacy wrapper maintaining data continuity
export function transformLegacySnapshot(legacyNodes: any[], explanation: string): Snapshot {
  return {
    id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    nodes: legacyNodes.map(node => ({
      id: node.id.toString(),
      value: node.value,
      nextId: node.nextId ? node.nextId.toString() : undefined,
      leftId: node.leftId ? node.leftId.toString() : undefined,
      rightId: node.rightId ? node.rightId.toString() : undefined,
      traversed: node.traversed || false,
      isTemp: node.isTemp || false,
    })),
    variables: {},
    highlightedNodes: [],
    explanation: explanation,
    lineNum: 0
  };
}
```

### Implementation Rules for Legacy Canvas Components
- Keep the `LinkedListCanvas`, `BSTCanvas`, and `LeetCodeCanvas` intact as fallback rendering contexts.
- Pass updated, sanitized state formats to their rendering modules by validating element existence and preventing `TypeError: Cannot read properties of undefined` failures.

---

## 9. Incremental Roadmap

### Phase 1: Foundation (Core Modernization)
- Standardize design theme properties (AMOLED, Hacker, Cyberpunk CSS configurations).
- Integrate global Zustand framework layer in parallel with local state.
- Embed ARIA Live reader layers in visualization stages.

### Phase 2: Advanced Visualizations (Data Expansion & Side-by-Side Compare)
- Build container components supporting the new linear types (Queues, Circular Stacks, Deques, Bloom Filters).
- Introduce standard Graph/Matrix canvases including dynamic coordinate resolvers.
- Implement the split visual container supporting algorithm comparison mode.

### Phase 3: AI Tutor (Context-Aware Micro-Leads)
- Add the interactive AI chat visual sidebar.
- Implement step variables context compiler that sends the visual footprint to the text generators.
- Create multi-difficulty options (Beginner analogies vs. advanced complexity traces).

### Phase 4: Interview Platform (Timed Challenges & Tracking)
- Create visual countdown and challenge control dashboards.
- Build progress tracker widgets displaying solved quantities, difficulty distribution, and streak trends.
- Scaffold spacing-review (Spaced Repetitive) tracking structures under local state storage.

### Phase 5: System Design (Architecture Sandboxing)
- Design and integrate dynamic schematic maps representing standard microservices patterns (Load Balancer, API Gateway, Distributed Caching).
- Enable interactive traffic throughput sliders simulating system component health and data bottlenecks.

### Phase 6: Mobile Apps (Responsive Wrapper & Cross-Compile)
- Incorporate touch swipe gesture processors to switch views smoothly on small smartphone screens.
- Implement PWA install support sheets and local Dexie DB syncing states.

### Phase 7: Enterprise Platform (User Sync & Team Workspace)
- Build remote auth gateways linked to professional secure profiles.
- Enable multiplayer/collaborative visual rooms with WebSocket feedback hooks.
