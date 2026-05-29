# 🌌 AlgoFlow: High-Fidelity Interactive DSA & LeetCode Visualizer

AlgoFlow is a highly polished, interactive, step-by-step visualizer for core Data Structures, Algorithms (DSA), and highly popular NeetCode/LeetCode problems. Designed with elegant slate-colored display typography and smooth motion transitions, AlgoFlow behaves like a professional time-travelling debugger, allowing students, educators, and engineers to play, pause, step, and analyze algorithms at a micro-level.

---

## 🚀 Key Visualizer Features

### 1. Unified Time-Traveling Playback Engine
* **Incremental Timeline Control**: Standard media-style controls to play, pause, rewind, fast-forward, reset, or jump to the end of any algorithm's execution history.
* **Granular Playback Speed**: Adjustable step intervals (from 100ms up to 2 seconds) to slow down fast recursive loops or speed up large scanning tasks.
* **Deterministic Snapshot Pipeline**: Algorithms generate a complete list of historical state snapshots on activation, guaranteeing instantaneous seeks and stable step-by-step playback.

### 2. Immersive Visual Workspaces

* **📂 Explore Library (`ExploreLibrary.tsx`)**:
  A modern, responsive catalog containing problem lists. Users can search and filter algorithms by category (*Arrays & Hashing, Stacks, Binary Search, Sliding Window, Lists, Trees, Double Pointers*) and difficulty levels (*Easy, Medium, Hard*).

* **📊 Sorting Arena (`SortingCanvas.tsx`)**:
  Interactive 3D-feeling column graphs representing arrays. Visualizes **Bubble Sort** and **Quick Sort** in real-time, detailing pivot selections, index ranges, elements being compared, and swaps.

* **🔗 Linked List Labs (`LinkedListCanvas.tsx`)**:
  Displays a singly linked list sequence. Highlights recursive structural modifications like inserting nodes after specified elements (`insertAfter`) or pointer-rewiring during element deletions (`deleteNode`).

* **🌳 BST Gardens (`BSTCanvas.tsx`)**:
  Renders node-link layouts of Binary Search Trees. Step through BST creations, search paths (highlighting parent-child steps), and DFS In-Order traversals.

* **🏆 LeetCode Visualizer (`LeetCodeCanvas.tsx`)**:
  Features state-of-the-art visual simulations for premium LeetCode/NeetCode problems across multiple categories:
  * **Arrays & Hashing**: 
    * *Two Sum*: Monitors complement calculation, lookup indexes, and active hashmap inserts.
    * *Group Anagrams*: Alphabetically sorts strings to compile bucket partitions, grouping clusters of anagram arrays dynamically.
  * **Two Pointers**:
    * *Container With Most Water*: Shifts left/right column margins inward, computing area increments and trapping peaks.
    * *3Sum*: Operates standard anchor anchors in tandem with dual scanning pointers, identifying triplets summing to exactly `0` while bypassing duplicates.
  * **Stack**:
    * *Valid Parentheses*: Dynamic pushes, peek lookups, matching comparisons, and pops in chronological order.
  * **Trees**:
    * *Invert Binary Tree*: Swaps child subtrees recursively with color transitions.
  * **Binary Search**:
    * *Standard Binary Search*: Computes midpoints, updates boundaries, and halves search sectors.
  * **Sliding Window**:
    * *Best Time to Buy & Sell Stock*: Positions buying thresholds, shifts selling margins, and captures max profit.
    * *Longest Substring Without Repeating Characters*: Shifts left and right sliding window bounds, logging active character memory sets.
  * **Linked Lists**:
    * *Reverse Linked List*: Re-wires active next pointer directions inline.
    * *Merge Two Sorted Lists*: Moves p1/p2 cursors, linking nodes into a consolidated linked results ribbon.

### 3. Integrated Context Panels
* **💻 Interactive Code Editor (`CodeEditorPanel.tsx`)**: 
  Displays actual production-quality implementation text in multiple languages (**TypeScript/JavaScript**, **Python**, **C++**, and **Java**). Syncs line highlighted states exactly with the active visualizer snapshot timeline index.
* **👁️ Variables Watchlist (`VariablesTracker.tsx`)**:
  Live scoreboard detailing stack/pointer values, tracking string states, complements, boundaries, arrays, and sets in real-time.
* **🖥️ Console Output Logger (`OutputConsole.tsx`)**:
  A terminal console appending step-by-step debug actions, highlighting exactly what comparison or swap was performed under the hood.

---

## 📑 File Architecture

```bash
/
├── README.md                  # Main high-level application walkthrough (This file)
├── .env.example               # Declares template environment variables
├── package.json               # Configurations, run scripts, and npm dependencies
├── vite.config.ts             # Vite server pipeline options
├── docs/                      # Supporting documentation folder
│   ├── ARCHITECTURE.md        # Micro-architectural breakdowns & timeline logic
│   └── ALGORITHMS.md          # Theoretical walkthroughs & complex analysis
└── src/
    ├── App.tsx                # Main conductor hosting navigation & playback state
    ├── types.ts               # Core structural interfaces (Snapshot, ListNodeState, DSATopic)
    ├── index.css              # Global custom CSS & Inter/JetBrains fonts configuration
    ├── algorithms.ts          # State generator algorithms for sorting, BST, and Lists
    ├── leetcodeAlgorithms.ts  # Snapshot compilers for individual LeetCode problems
    ├── leetcodeDatabase.ts    # Problems curriculum list, categories, and code snippets
    └── components/            # Specialized canvas visualizers & monitoring modules
        ├── ExploreLibrary.tsx      # Multi-category problem deck navigator
        ├── LeetCodeCanvas.tsx      # Comprehensive custom LeetCode algorithms visualizer 
        ├── SortingCanvas.tsx       # Interactive sorting column visualizer
        ├── LinkedListCanvas.tsx    # Node pointer rewiring canvas
        ├── BSTCanvas.tsx           # Binary Search Tree SVG renderer
        ├── CodeEditorPanel.tsx     # Synchronized code templates (JS, python, cpp, java)
        ├── VariablesTracker.tsx    # Live state variables watcher panel
        └── OutputConsole.tsx       # Live diagnostic debug console logs
```

---

## 🎬 How to Use AlgoFlow

1. **Pick your Subject**:
   Navigate the **Explore tab** on the header or left rail to select a fundamental data structure process (Sorting, Lists, BSTs) or dive into standard LeetCode problems list.
2. **Setup Custom Input Parameters**:
   In the bottom control bar, modify parameters (e.g. keying bespoke arrays like `3, 1, 4, 1, 5` or target targets in binary search/sum equations).
3. **Control Playback**:
   Hit standard **Play** to watch the algorithm execute naturally, or step linearly using **Next/Back** buttons to analyze specific lines of code.
4. **Monitor State**:
   Inspect the **Variables Watchlist** and **Code Panel** simultaneously to trace how specific statements impact variable values, hashset items, or pointer states.

---

## 🛠️ Technology Stack
* **Framework**: React 18+ (bundled with standard Vite)
* **Styling**: Tailwind CSS (loaded seamlessly via raw utility directives)
* **Animations**: `motion/react` (providing graceful, eye-safe entry/exit layouts)
* **Icons**: `lucide-react`
* **Development tool**: TypeScript & TypeScript compiler

---

## 🧑‍💻 Contributing & Adding New Algorithms

To expand the sandbox with any new LeetCode problem, follow this structured pattern:

1. **Define Core Types in `/src/types.ts`**:
   Add the problem ID to the `LeetAlgo` string union type.
2. **Register the Problem in `/src/leetcodeDatabase.ts`**:
   Insert metadata (title, category, neetcodeSection, acceptance, and code snippets in JavaScript, Python, C++, and Java) inside `NEETCODE_PROBLEMS` and `LEETCODE_CODE_SNIPPETS`.
3. **Compile Snapshots in `/src/leetcodeAlgorithms.ts`**:
   Implement a generator function that runs the algorithm step-by-step and compiles historical state objects (`Snapshot[]`). Ensure each step sets parameters:
   * `lineHighlighted` (correlating directly to snippet lines)
   * `actionType`
   * `explanation` (natural language summary)
   * `variables` (local scope logs)
   * `consoleOutput` (chronological telemetry logs)
4. **Build Custom Renderer inside `/src/components/LeetCodeCanvas.tsx`**:
   Expose custom hooks/input state inputs, link them to step generators, and append the JSX markup case inside the switch block.

---

## 📄 Documentation Indices

Check out these in-depth guides to dive deeper into the code:
* [Architecture Design Document (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)
* [DSA & Complexity Reference Manual (docs/ALGORITHMS.md)](docs/ALGORITHMS.md)
