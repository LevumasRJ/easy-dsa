import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, X, Info, Layers, HelpCircle, AlertCircle, Sparkles, Sliders } from 'lucide-react';
import { Snapshot } from '../types';

interface ComplexityOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeTopic: string;
  activeAlgo: string;
  snapshots: Snapshot[];
  currentIndex: number;
}

export default function ComplexityOverlay({
  isOpen,
  onClose,
  activeTopic,
  activeAlgo,
  snapshots,
  currentIndex
}: ComplexityOverlayProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  // Interactive customizable input size slider state (1 to 50)
  const [sliderInputSize, setSliderInputSize] = useState<number>(15);
  const [highlightedClass, setHighlightedClass] = useState<string | null>(null);

  // Derive current algorithm complexity class and display name
  const { algoName, complexityClass, description, complexityTip } = useMemo(() => {
    let name = activeAlgo;
    let comp = 'O(n)';
    let desc = 'Linear time complexity. Execution time increases proportionally with input size.';
    let tip = 'Each element is visited a constant number of times (eg. single pass loop).';

    if (activeTopic === 'sorting') {
      if (activeAlgo === 'quicksort') {
        name = 'QuickSort';
        comp = 'O(n log n)';
        desc = 'Linearithmic complexity. Divide-and-conquer strategy splits array and sorts partitions recursively.';
        tip = 'Considered the gold standard for in-place sorting, running in average O(N log N) but can degrade to O(N²) on bad pivots.';
      } else {
        name = 'BubbleSort';
        comp = 'O(n^2)';
        desc = 'Quadratic complexity. Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.';
        tip = 'Highly redundant. Incurs N² swaps/comparisons, making it inefficient for larger input arrays.';
      }
    } else if (activeTopic === 'linked-list') {
      name = activeAlgo === 'insertAfter' ? 'Linked List Insertion' : 'Linked List Deletion';
      comp = 'O(1)';
      desc = 'Constant complexity. Modifies adjacent pointers directly without traversing the full structure.';
      tip = 'If the target node reference is already known, rewiring the pointers takes O(1) time regardless of list size.';
    } else if (activeTopic === 'trees') {
      if (activeAlgo === 'insertBST') {
        name = 'BST Node Insertion';
        comp = 'O(log n)';
        desc = 'Logarithmic complexity on average. Divides search space in half at each step down the binary tree.';
        tip = 'Time is proportional to the tree height. If the tree becomes highly skewed, performance degrades to O(N) linear scan.';
      } else if (activeAlgo === 'searchBST') {
        name = 'BST Binary Search';
        comp = 'O(log n)';
        desc = 'Logarithmic search path. Progresses down left/right children based on key comparison.';
        tip = 'Extremely efficient. Searching 1,000,000 nodes only takes around 20 operations on a balanced tree!';
      } else {
        name = 'BST In-order Traversal';
        comp = 'O(n)';
        desc = 'Linear depth-first search. Enumerate tree nodes recursively to print elements sorted.';
        tip = 'Requires visiting every single node in the tree exactly once to complete the traversal output.';
      }
    } else if (activeTopic === 'leetcode') {
      const formatted = activeAlgo.replace(/_/g, ' ');
      name = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      
      switch (activeAlgo) {
        case 'binary_search':
          comp = 'O(log n)';
          desc = 'Logarithmic binary search. Halves active index limits dynamically with each comparison step.';
          tip = 'A classic divide-and-conquer algorithm. Demands pre-sorted inputs to isolate target values.';
          break;
        case 'threesum':
          comp = 'O(n^2)';
          desc = 'Quadratic complexity. Uses a primary loop backed by a two-pointer scan for zero sums.';
          tip = 'A brute force approach would be O(N³). Sorting first and using two-pointers optimizes the trace to O(N²).';
          break;
        case 'group_anagrams':
          comp = 'O(n)';
          desc = 'Linear/Linearithmic complexity. Collects buckets flagged by sorted key identifiers in a hash map.';
          tip = 'Using character count hashing runs in O(N × W) where W is max word length, substantially faster than sorting words.';
          break;
        default:
          comp = 'O(n)';
          desc = 'Linear time scan. Keeps one or two pointers sliding forward to evaluate limits.';
          tip = 'Optimizes memory footprint is typically O(1) auxiliary space, checking each element once.';
          break;
      }
    }
    
    return { algoName: name, complexityClass: comp, description: desc, complexityTip: tip };
  }, [activeTopic, activeAlgo]);

  // Derive input size N from current active snapshots list
  const currentInputSize = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return 10;
    const snap = snapshots[0];
    
    // Fallback trackers checking state contents
    if (snap.arrayState && snap.arrayState.length > 0) return snap.arrayState.length;
    if (snap.linkedListState && snap.linkedListState.length > 0) return snap.linkedListState.length;
    if (snap.treeState && snap.treeState.length > 0) return snap.treeState.length;
    
    // Variables inspection
    if (snap.variables) {
      if (snap.variables.strs) return String(snap.variables.strs).split(',').length;
      if (snap.variables.s) return String(snap.variables.s).length;
      if (snap.variables.nums) {
        const parsed = String(snap.variables.nums).replace(/[\[\]]/g, '').split(',');
        return parsed.length > 1 ? parsed.length : 8;
      }
      if (snap.variables.list1 && snap.variables.list2) {
        const p1 = String(snap.variables.list1).split(',').length;
        const p2 = String(snap.variables.list2).split(',').length;
        return p1 + p2;
      }
    }
    return 8;
  }, [snapshots]);

  // Update slider size default value when snapshots input size changes
  useEffect(() => {
    if (currentInputSize > 0 && currentInputSize <= 50) {
      setSliderInputSize(currentInputSize);
    }
  }, [currentInputSize]);

  // Complexity curve function rules
  const curvesList = [
    { id: 'O(1)', label: 'Constant O(1)', calc: (x: number) => 10, color: '#94a3b8' },
    { id: 'O(log n)', label: 'Logarithmic O(log N)', calc: (x: number) => 15 * Math.log2(x + 1), color: '#38bdf8' },
    { id: 'O(n)', label: 'Linear O(N)', calc: (x: number) => 1.8 * x, color: '#34d399' },
    { id: 'O(n log n)', label: 'Linearithmic O(N log N)', calc: (x: number) => 0.4 * x * Math.log2(x + 1), color: '#a78bfa' },
    { id: 'O(n^2)', label: 'Quadratic O(N²)', calc: (x: number) => 0.04 * x * x, color: '#f87171' }
  ];

  // Helper calculating specific Y coordinate for dynamic point rendering
  const activeCalcFn = useMemo(() => {
    const matched = curvesList.find(c => c.id === complexityClass);
    return matched ? matched.calc : (x: number) => 1.8 * x;
  }, [complexityClass]);

  // Handle D3 Chart Construction Core
  useEffect(() => {
    if (!isOpen || !svgRef.current) return;

    // Clear previous elements
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 30, right: 120, bottom: 40, left: 50 };
    const width = 450 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Define X & Y scales
    const xScale = d3.scaleLinear()
      .domain([1, 50])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Define Grid lines
    svg.append('g')
      .attr('class', 'grid-lines opacity-20')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(() => ''));

    svg.append('g')
      .attr('class', 'grid-lines opacity-20')
      .call(d3.axisLeft(yScale).ticks(8).tickSize(-width).tickFormat(() => ''));

    // Custom Axes style
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(6);

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .style('font-family', 'ui-monospace, monospace')
      .style('font-size', '9px');

    svg.append('g')
      .call(yAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .style('font-family', 'ui-monospace, monospace')
      .style('font-size', '9px');

    // Generate x datasets
    const xValues = d3.range(1, 51, 1);

    // Plot curves
    curvesList.forEach(curve => {
      const isSelected = curve.id === complexityClass;
      const isHovered = highlightedClass === curve.id;
      
      const lineGenerator = d3.line<number>()
        .x(d => xScale(d))
        .y(d => yScale(Math.min(100, Math.max(0, curve.calc(d)))));

      svg.append('path')
        .datum(xValues)
        .attr('fill', 'none')
        .attr('stroke', curve.color)
        .attr('stroke-width', isSelected ? 4 : (isHovered ? 2.5 : 1.5))
        .attr('stroke-dasharray', isSelected ? '0' : '4, 4')
        .attr('opacity', isSelected ? 1.0 : (isHovered ? 0.8 : 0.25))
        .attr('d', lineGenerator)
        .style('transition', 'stroke-width 200ms, opacity 200ms')
        .attr('id', `curve-${curve.id.replace(/\s+/g, '')}`);

      // Add text label at the end of each trace curve
      svg.append('text')
        .attr('x', xScale(51))
        .attr('y', yScale(Math.min(98, Math.max(2, curve.calc(50)))))
        .attr('fill', curve.color)
        .attr('alignment-baseline', 'middle')
        .style('font-family', 'ui-monospace, monospace')
        .style('font-size', '8px')
        .style('font-weight', isSelected ? 'bold' : 'normal')
        .style('opacity', isSelected ? 0.9 : (isHovered ? 0.75 : 0.3))
        .text(curve.id);
    });

    // 1. Plot current algorithmic input point as a prominent flashing circle
    const currentY = activeCalcFn(currentInputSize);
    svg.append('circle')
      .attr('cx', xScale(currentInputSize))
      .attr('cy', yScale(Math.min(100, currentY)))
      .attr('r', 7)
      .attr('fill', '#22c55e')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('class', 'animate-pulse')
      .append('title')
      .text(`Active Run: input size = ${currentInputSize}`);

    // Pulse halo ring
    svg.append('circle')
      .attr('cx', xScale(currentInputSize))
      .attr('cy', yScale(Math.min(100, currentY)))
      .attr('r', 13)
      .attr('fill', 'none')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 1)
      .attr('opacity', 0.5)
      .attr('class', 'animate-ping');

    // 2. Plot User Interactive Slider/Hover preview probe values point
    const sliderY = activeCalcFn(sliderInputSize);
    svg.append('circle')
      .attr('cx', xScale(sliderInputSize))
      .attr('cy', yScale(Math.min(100, sliderY)))
      .attr('r', 5)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .append('title')
      .text(`Interactive probe: size = ${sliderInputSize}`);

    // Vertical dashed trace projection lines for active states
    svg.append('line')
      .attr('x1', xScale(sliderInputSize))
      .attr('y1', yScale(0))
      .attr('x2', xScale(sliderInputSize))
      .attr('y2', yScale(Math.min(100, sliderY)))
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2, 2');

    // 3. Mark the "Actual Trace Steps Count" (number of snapshots)
    // Helps compare empirical operations against hypothetical limits
    const totalSnapshots = snapshots.length;
    if (totalSnapshots > 0) {
      // Map actual snapshots length relative to grid coordinate space
      // Since snapshots count might exceed 100, we clamp it visually or map it
      const mappedYActual = Math.min(100, totalSnapshots * 1.5); // normalization factor for plotting
      
      svg.append('circle')
        .attr('cx', xScale(currentInputSize))
        .attr('cy', yScale(mappedYActual))
        .attr('r', 6)
        .attr('fill', '#e11d48') // crimson
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5)
        .append('title')
        .text(`Empirical trace steps: ${totalSnapshots} frames`);

      // Draw pointer connecting expectation to reality
      svg.append('line')
        .attr('x1', xScale(currentInputSize))
        .attr('y1', yScale(Math.min(100, currentY)))
        .attr('x2', xScale(currentInputSize))
        .attr('y2', yScale(mappedYActual))
        .attr('stroke', '#f43f5e')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '1, 3');

      // Legend descriptor text
      svg.append('text')
        .attr('x', xScale(currentInputSize) + 10)
        .attr('y', yScale(mappedYActual) - 5)
        .attr('fill', '#f43f5e')
        .style('font-family', 'ui-monospace, monospace')
        .style('font-size', '8px')
        .style('font-weight', 'bold')
        .text(`Empirical Steps (${totalSnapshots})`);
    }

    // Chart titles and legend labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .style('font-family', 'system-ui, sans-serif')
      .style('font-size', '10px')
      .style('font-weight', '600')
      .text(`X: Input Size (N)   vs   Y: Expected Operations / Growth`);

  }, [isOpen, complexityClass, currentInputSize, sliderInputSize, highlightedClass, snapshots.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            id="complexity-chart-dialog"
            className="relative w-full max-w-2xl bg-bg-card border border-border-custom rounded-2xl shadow-3xl overflow-hidden flex flex-col font-sans text-white"
          >
            {/* Header top row panel */}
            <div className="px-5 py-4 bg-bg-panel/95 border-b border-border-custom flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-[#5de6ff] animate-pulse" />
                <div>
                  <h3 className="font-display font-black text-sm sm:text-base text-white tracking-tight">
                    Interactive Time Complexity Analyzer
                  </h3>
                  <p className="text-[10px] font-mono text-[#5de6ff]/85">
                    Measuring growth bounds for <span className="font-bold underline">{algoName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-bg-card hover:bg-zinc-800 border border-border-custom text-text-muted hover:text-white transition-all cursor-pointer"
                title="Close overlay"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Split layout: Chart vs Informative summaries */}
            <div className="flex-1 p-5 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-y-auto max-h-[80vh]">
              
              {/* D3 visualizer widget panel (7 cols) */}
              <div className="md:col-span-8 flex flex-col items-center justify-start bg-bg-panel/40 border border-border-custom/50 rounded-xl p-3">
                <div className="w-full relative overflow-x-auto flex justify-center">
                  <svg ref={svgRef} className="max-w-full overflow-visible" />
                </div>
                
                {/* Horizontal guide of curves selectors */}
                <div className="w-full mt-3 pt-2 border-t border-border-custom/30 flex justify-center flex-wrap gap-2 text-[9px] font-mono">
                  {curvesList.map(curve => {
                    const isActiveClass = curve.id === complexityClass;
                    return (
                      <button
                        key={curve.id}
                        onMouseEnter={() => setHighlightedClass(curve.id)}
                        onMouseLeave={() => setHighlightedClass(null)}
                        className={`px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                          isActiveClass
                            ? 'bg-accent-custom text-white border-accent-custom font-black shadow-md scale-105'
                            : 'bg-bg-card hover:bg-[#324545]/20 text-text-muted hover:text-white border-border-custom/60'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: curve.color }} />
                        <span>{curve.id} {isActiveClass && '🎯'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic calculations values & descriptions panel (4 cols) */}
              <div className="md:col-span-4 flex flex-col justify-between gap-4 font-sans border-t md:border-t-0 md:border-l border-border-custom pt-4 md:pt-0 md:pl-4">
                
                {/* 1. Curve math description box */}
                <div className="space-y-2.5">
                  <div className="bg-emerald-500/5 border border-emerald-500/25 p-3 rounded-lg">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase tracking-widest">
                      ACTIVE COMPLEXITY
                    </span>
                    <h4 className="text-sm font-black text-white mt-0.5 font-display flex items-center gap-1">
                      {complexityClass} Growth
                    </h4>
                    <p className="text-[11px] leading-relaxed text-zinc-300 mt-1">
                      {description}
                    </p>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/25 p-3 rounded-lg">
                    <span className="text-[9px] font-mono text-blue-400 font-bold block uppercase tracking-widest">
                      GUIDING LEARNING TIP
                    </span>
                    <p className="text-[11px] leading-relaxed text-zinc-300 mt-1">
                      {complexityTip}
                    </p>
                  </div>
                </div>

                {/* 2. Interactive Input Size Slider Controller */}
                <div className="bg-bg-panel/80 border border-border-custom p-3 rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#5de6ff] mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-blue-400" />
                      SIMULATION CAP
                    </span>
                    <span className="text-white font-black bg-blue-500/20 px-1.5 py-0.2 rounded border border-blue-500/30">
                      N = {sliderInputSize}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-text-muted leading-tight mb-2">
                    Drag the slider to preview the theoretical operations count as scale grows:
                  </p>
                  
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={sliderInputSize}
                    onChange={(e) => setSliderInputSize(parseInt(e.target.value))}
                    className="accent-blue-400 w-full bg-slate-800 rounded-lg cursor-pointer h-1"
                  />

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-border-custom/30 font-mono text-[10px]">
                    <div className="bg-bg-card p-1.5 rounded text-left border border-border-custom/40">
                      <span className="text-text-muted block text-[8px] uppercase">EXPECTED AT N</span>
                      <span className="text-white font-black text-[11px]">
                        {Math.round(activeCalcFn(sliderInputSize))} steps
                      </span>
                    </div>
                    <div className="bg-bg-card p-1.5 rounded text-left border border-[#22c55e]/20">
                      <span className="text-emerald-400 block text-[8px] uppercase">ACTIVE RUN N ({currentInputSize})</span>
                      <span className="text-emerald-300 font-black text-[11px]">
                        {Math.round(activeCalcFn(currentInputSize))} steps
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer informational disclaimer banner */}
            <div className="px-5 py-3.5 bg-bg-panel border-t border-border-custom flex items-center justify-between text-[10px] font-mono text-text-muted flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-amber-500/90 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Graph normalized for viewport scale ratio comparisons.
              </span>
              <span className="text-emerald-400 font-bold">
                ● Live Input Point: Size N = {currentInputSize}
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
