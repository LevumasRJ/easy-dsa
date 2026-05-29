# 🏛️ AlgoFlow Architecture Design Document

This document details the software architecture, state synchronization paradigms, and layout systems that power the **AlgoFlow** interactive visualizer.

---

## 🎨 Architectural Overview

AlgoFlow utilizes an **offline, timeline-driven deterministic simulation architecture**. Rather than running algorithms in real-time alongside visual frames (which is highly vulnerable to synchronization flaws, timing drift, and infinite render states in React), code execution is separate from visual rendering.

```
┌─────────────────────────────────┐
│        Trigger Event            │   (User enters custom array, Change Algo)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│      Dynamic Snapshot Generator │   (Code executes instantly, accumulates logs)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   Snapshot Chronology (Timeline) │  (Array of Snapshot[] objects)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│       Main Conductor State      │   (currentIndex tracks current viewport)
└──────┬─────────┬─────────┬──────┘
       │         │         │
       ▼         ▼         ▼
┌──────────────┐┌──────────────┐┌──────────────┐
│  Code Panel  ││Visual Canvas ││Watchlist &  │  (Synced UI updates)
│  (Highlights)││ (Animations) ││Console Logs │
└──────────────┘└──────────────┘└──────────────┘
```

---

## 💾 Core Data Structures & Timeline Pipeline

The entire visual system relies on a consistent schema defined in `/src/types.ts`. All algorithms output a list of individual timeline snapshots containing metadata:

```typescript
export interface Snapshot {
  lineHighlighted: number;       // 1-indexed value representing active line of code
  actionType: 'init' | 'compare' | 'swap' | 'sorted' | 'traverse' | 'pointer_rewire' | 'insert' | 'delete' | 'found' | 'not_found' | 'done';
  explanation: string;           // Custom explanation text describing the step in detail
  
  // Topic states (optional, depending on active subject category)
  arrayState?: number[];         // Active array sequence (e.g. sorted/swapping)
  linkedListState?: LinkedListNodeState[];  // LinkedList node configurations
  treeState?: TreeNodeState[];   // BST tree positions
  
  // Highlight states
  activeIndices?: number[];      // Indices currently loaded into scanners
  highlightedNodes?: string[];   // Specific node IDs that require a pulsing outline
  highlightedLine?: number;      // Override line marker
  
  // Watchlist tracker items
  variables?: Record<string, string | number>; // Scope properties
  
  // Command lines
  consoleOutput: string;         // String literal appended to bottom debugger logs
}
```

Every step in the program corresponds to a single compiled `Snapshot`. The main application loops or steps forward by incrementing `currentIndex` through this chronology.

---

## 🔌 State Conductor: `App.tsx`

`App.tsx` serves as the primary controller holding general navigation, execution speed, and chronological position states. It handles state synchronization for all downstream subcomponents:

### 1. Unified Playback Intervals
The continuous automated timeline advancement loops securely via an efficient React `useEffect` callback keyed with the playing state and speed configurations:

```typescript
useEffect(() => {
  if (!isPlaying) return;

  const tick = () => {
    setCurrentIndex((prev) => {
      if (prev >= snapshots.length - 1) {
        setIsPlaying(false);
        return prev; // Stop at completion
      }
      return prev + 1;
    });
  };

  const intervalId = setInterval(tick, speed);
  return () => clearInterval(intervalId); // Graceful clean-up on state mutations
}, [isPlaying, speed, snapshots.length]);
```

### 2. Standard State Dispatching Props
When a user switches algorithms, the active workspace canvas performs calculations and returns the snapshot collection up to `App.tsx` through `handleSnapshotsGenerated()`:

```typescript
const handleSnapshotsGenerated = (generatedSnapshots: Snapshot[]) => {
  setSnapshots(generatedSnapshots);
  setCurrentIndex(0);
  setIsPlaying(false);
};
```

---

## 🧱 Component Layout Specifications

AlgoFlow divides the screen real estate into modular boxes, ensuring standard screen scaling (fluidity and responsiveness) and absolute ease of readability:

### 1. Explorer Rail & Problem Deck (`ExploreLibrary.tsx`)
A searchable central library displaying lists of sorted category cards. It supports full text-based keyword matching across titles, categories, and descriptions, allowing easy curation of the problems.

### 2. High-Contrast Code Panel (`CodeEditorPanel.tsx`)
* Receives the active language templates and `activeLineNumber` from the synced timeline state.
* Renders code with exact indentation levels in a customizable dark editor viewport.
* Programmatically targets and highlights the active executing line using smooth background highlights, providing a real-time correlation between visual components and logic statements.

### 3. Dynamic Visual Stage (`LeetCodeCanvas`, `SortingCanvas`, etc.)
* Receives the active snapshot parameters (`arrayState`, `activeIndices`, `highlightedNodes`).
* Translates values into graphic elements (SVG nodes, interactive SVG path links, HTML flexboxes, or tall vertical column meters).
* Incorporates animations via `motion/react` to highlight operations (such as swapping elements or shifting boundaries).

### 4. Variables Watchlist (`VariablesTracker.tsx`)
* Collects execution metadata from the active snapshot (`variables` dictionary).
* Dynamically parses key-value parameters.
* Renders custom variables side-by-side using key-value badges to reveal state details (like mathematical variables, active strings, sliding pointers, or current sums).

### 5. Debug Terminal (`OutputConsole.tsx`)
An emulation of an IDE debugger output. It streams previous steps alongside the current line, highlighting current entries with custom text styles to match the status types (e.g. errors vs comparisons vs completions).

---

## ⚡ Animation and Styling Guidelines

To guarantee high execution frame-rates and a premium tactile user feel, the layout conforms to modern front-end styling rules:

1. **Responsive Flexboxes and Grids**: All layouts use Tailwind containers (`grid-cols-1 lg:grid-cols-12`, `flex flex-col lg:flex-row`) to cleanly adapt from compact viewports to wide desktop monitors.
2. **Tailwind Color Palette**: Strict adherence to a cool, dark-theme palette (`bg-[#0b1326]`, `bg-[#131b2e]`, and text `text-[#dae2fd]`) which is easy on the eyes and provides an attractive, modern tech aesthetics.
3. **Optimized Render Schedules**: State values inside dependency arrays are stabilized to prevent infinite re-renders. Canvas resize operations use dynamic layouts rather than fixed, hardcoded calculation ratios.
