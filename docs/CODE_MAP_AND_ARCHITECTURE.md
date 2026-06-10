# 🗺️ AlgoFlow 2.0 Codebase Mapping & Architecture Manual

This technical overview details the complete component hierarchy, file-level responsibilities, state synchronization model, and pipeline configurations that power the interactive DSA learning ecosystem.

---

## 🏛️ System Architecture Outline

AlgoFlow 2.0 operates as an **offline-first, client-driven interactive trace simulator**, decoupling algorithmic execution from visual components. Rather than computing states on the fly inside visual rendering loops, algorithms execute instantly upon parameter updates, compiling a deterministic timeline of **snapshots** which are subsequently scrubbed and rendered step-by-step.

```
       [ USER ACTIONS ] (eg. Draw Wall, Customize Array, Slide Step Index)
             │
             ├──► [ Snapshots Generator ] (Instant execution & trace compile)
             │          │
             │          ▼
             ├──► [ Snapshots Chronology ] (Timeline array list representation)
             │          │
             │          ▼
             └──► [ State Conductor (App.tsx) ] (Coordinates playback speed/index)
                        │
        ┌───────────────┼───────────────┬────────────────┐
        ▼               ▼               ▼                ▼
 ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
 │ Code Editor │ │ Watchlist   │ │ Visualizer  │ │ Interactive  │
 │ Highlight   │ │ Variables   │ │ Canvas Stage│ │ D3 Curves    │
 └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘
```

---

## 🗂️ File Registry & Module Responsibilities

### 1. Application Entry & Settings
*   **`/src/main.tsx`**: Mounts the React application tree inside the standard HTML viewport.
*   **`/src/App.tsx`**: The core state orchestrator. Manages topic navigation, user streaks, game XP levels, timeline playback loops, and layout splits.
*   **`/src/types.ts`**: Unified type specifications, tracking snapshot structures, algorithm configurations, and canvas item properties.
*   **`/src/index.css`**: Configures custom theme systems (Default theme, AMOLED, Cyberpunk, Hacker green) and loads fonts like *Inter* (UI elements) and *JetBrains Mono* (memory models and consoles).

### 2. Algorithmic Processing Engine
*   **`/src/algorithms.ts`**: Pure TypeScript implementations for basic algorithms (such as QuickSort, BubbleSort) and BST insertions/traversals, producing consistent `Snapshot` sequences.
*   **`/src/leetcodeAlgorithms.ts`**: Contains optimized visual snapshots compilers for NeetCode or LeetCode classics (Valid Parentheses, Two Sum, Reverse LinkList, Container with Most Water, Invert Tree, Binary Search, Buy/Sell Stocks).
*   **`/src/leetcodeDatabase.ts`**: Stores curriculum metadata for LeetCode playlists (LeetCode 50, Blind 75, NeetCode 150).

### 3. Modular Visual Canvases
*   **`/src/components/ExploreLibrary.tsx`**: The main landing page. A responsive layout featuring interactive search filters, category tags, and links to sandboxes.
*   **`/src/components/SortingCanvas.tsx`**: Custom vertical column visualizer detailing comparative sorting execution (Bubble vs Quick).
*   **`/src/components/LinkedListCanvas.tsx`**: Dynamic linked list animator drawing pointer arrows and allocation nodes.
*   **`/src/components/BSTCanvas.tsx`**: Renders dynamic, auto-balanced SVG hierarchical trees for search or insertion processes.
*   **`/src/components/LeetCodeCanvas.tsx`**: Houses problem cards, problem prompts, custom input text boxes, and live database synchronizers.
*   **`/src/components/GraphCanvas.tsx`**: *(New Feature)* Interactive 2D Grid Pathfinder. Paints custom barriers, start and target points, and steps node-by-node through A* Manhattan Distance search mechanics.

### 4. Interactive Overlays & Toolbars
*   **`/src/components/ComplexityOverlay.tsx`**: *(New Feature)* D3.js powered time-complexity graph. Plots reference curves ($O(1)$, $O(\log N)$, $O(N)$, $O(N \log N)$, $O(N^2)$), highlights the current algorithm's mathematical curve, implements interactive input size sweep sliders, and contrasts theoretical bounds against empirical traces.
*   **`/src/components/CodeEditorPanel.tsx`**: High-contrast simulated code viewer highlighting active program lines.
*   **`/src/components/VariablesTracker.tsx`**: Visualizes snapshot scope dictionaries (indexes, sums, nodes, open queue).
*   **`/src/components/OutputConsole.tsx`**: Emulates an IDE debugger output streaming execution statements.

---

## 💾 Core Snapshot Data Schema

Every step in an algorithm produces a `Snapshot` interface. This enables seamless, zero-latency time-travel debugging:

```typescript
export interface Snapshot {
  lineHighlighted: number;       // active line number on the Code Panel
  actionType: 'init' | 'compare' | 'swap' | 'sorted' | 'traverse' | 'insert' | 'delete' | 'found' | 'done';
  explanation: string;           // plain human-readable step descriptions
  consoleOutput: string;         // formatted logs shown on the console
  variables?: Record<string, string | number>; // live scope watches
  arrayState?: number[];         // active array representation
  linkedListState?: any[];       // linked list state nodes
  treeState?: any[];             // BST tree nodes / custom coordinate grids
}
```

---

## 🚀 Unified Timeline Conductor Flow

When the user modifies an input configuration or clicks play:
1. The canvas hooks into parameters and triggers the associated `generateAlgorithmSnapshots()` method.
2. The compiled array is dispatched to `App.tsx` via `onSnapshotsGenerated(snapshots)`.
3. `App.tsx` zeroes out `currentIndex` and schedules intervals to sequentially increment the pointer relative to the timeline speed multiplier (`speed`).
4. Reactive bindings instantly repaint all downstream widgets (`OutputConsole`, `CodeEditorPanel`, `VariablesTracker`, `ComplexityOverlay`).
