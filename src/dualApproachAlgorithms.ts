import { Snapshot, AlgorithmicApproach } from './types';

export interface ApproachBenchmark {
  approach: AlgorithmicApproach;
  title: string;
  timeComplexity: string;
  spaceComplexity: string;
  concreteOpsEstimate: number; // e.g. for N = 1000
  keyTechnique: string;
  summary: string;
}

export interface ProblemComparison {
  problemId: string;
  problemTitle: string;
  bruteForce: ApproachBenchmark;
  optimizedTrick: ApproachBenchmark;
}

export const DUAL_APPROACH_BENCHMARKS: Record<string, ProblemComparison> = {
  twosum: {
    problemId: 'twosum',
    problemTitle: 'Two Sum',
    bruteForce: {
      approach: 'BRUTE_FORCE',
      title: 'Nested Loops ($O(N^2)$)',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1)',
      concreteOpsEstimate: 500000,
      keyTechnique: 'Exhaustive pairwise scanning of all $(i, j)$ indices.',
      summary: 'Compares every pair of elements until sum equals target.'
    },
    optimizedTrick: {
      approach: 'OPTIMIZED_TRICK',
      title: 'One-Pass Hash Map ($O(N)$)',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      concreteOpsEstimate: 1000,
      keyTechnique: 'Constant-time $O(1)$ complement lookup via hash table indexing.',
      summary: 'Stores seen values in a hash map, checking if target - current exists.'
    }
  },
  container_with_most_water: {
    problemId: 'container_with_most_water',
    problemTitle: 'Container With Most Water',
    bruteForce: {
      approach: 'BRUTE_FORCE',
      title: 'All Pair Lines ($O(N^2)$)',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1)',
      concreteOpsEstimate: 500000,
      keyTechnique: 'Evaluate area for every boundary pair $(i, j)$ where $j > i$.',
      summary: 'Calculates $(\\text{width}) \\times \\min(h[i], h[j])$ for all $\\binom{N}{2}$ pairs.'
    },
    optimizedTrick: {
      approach: 'OPTIMIZED_TRICK',
      title: 'Two Pointers Constriction ($O(N)$)',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      concreteOpsEstimate: 1000,
      keyTechnique: 'Greedy constriction: always advance the pointer at the shorter boundary.',
      summary: 'Starts at outer edges, discarding suboptimal heights in a single pass.'
    }
  },
  sorting: {
    problemId: 'sorting',
    problemTitle: 'Array Sorting',
    bruteForce: {
      approach: 'BRUTE_FORCE',
      title: 'Bubble Sort ($O(N^2)$)',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1)',
      concreteOpsEstimate: 500000,
      keyTechnique: 'Adjacent item comparisons and swaps.',
      summary: 'Bubbles the largest element to the end in each quadratic pass.'
    },
    optimizedTrick: {
      approach: 'OPTIMIZED_TRICK',
      title: 'QuickSort Lomuto Partitioning ($O(N \\log N)$)',
      timeComplexity: 'O(N \\log N)',
      spaceComplexity: 'O(\\log N)',
      concreteOpsEstimate: 9965,
      keyTechnique: 'Divide & conquer: partition around pivot in place.',
      summary: 'Recursively places pivot in sorted position in sub-quadratic time.'
    }
  }
};

// Two Sum Brute Force vs Optimized Snapshots
export function generateTwoSumDualSnapshots(approach: AlgorithmicApproach): Snapshot[] {
  const nums = [2, 7, 11, 15];
  const target = 9;

  if (approach === 'BRUTE_FORCE') {
    return [
      {
        lineHighlighted: 1,
        actionType: 'init',
        approachType: 'BRUTE_FORCE',
        explanation: 'Brute Force Two Sum: Initialize outer loop index i=0. Target sum = 9. Worst-case operations: N*(N-1)/2.',
        arrayState: [...nums],
        activeIndices: [0],
        variables: { i: 0, 'nums[i]': nums[0], target, comparisons: 0 },
        consoleOutput: '[BRUTE FORCE] Starting outer loop at index 0.'
      },
      {
        lineHighlighted: 3,
        actionType: 'compare',
        approachType: 'BRUTE_FORCE',
        explanation: 'Inner loop j=1: Check if nums[0] + nums[1] == target (2 + 7 == 9). Pair found on first comparison!',
        arrayState: [...nums],
        activeIndices: [0, 1],
        variables: { i: 0, j: 1, 'sum': 9, target, comparisons: 1 },
        consoleOutput: '[BRUTE FORCE] nums[0] (2) + nums[1] (7) == 9! Target match found.'
      },
      {
        lineHighlighted: 5,
        actionType: 'found',
        approachType: 'BRUTE_FORCE',
        explanation: 'Return indices [0, 1]. Brute force inspected 1 pair here, but would require 500,000 comparisons for N=1,000 in worst case.',
        arrayState: [...nums],
        activeIndices: [0, 1],
        variables: { result: '[0, 1]', theoreticalTime: 'O(N^2)' },
        consoleOutput: '[BRUTE FORCE] Completed. Output: [0, 1].'
      }
    ];
  }

  // Optimized Trick: Hash Map
  return [
    {
      lineHighlighted: 1,
      actionType: 'init',
      approachType: 'OPTIMIZED_TRICK',
      explanation: 'Optimized Trick: Initialize empty Hash Map to store { value: index }. We achieve O(N) by trading O(N) space.',
      arrayState: [...nums],
      activeIndices: [],
      variables: { hashMap: '{}', target },
      consoleOutput: '[OPTIMIZED] Initialized empty lookup hash map.'
    },
    {
      lineHighlighted: 3,
      actionType: 'compare',
      approachType: 'OPTIMIZED_TRICK',
      explanation: 'Index i=0 (val=2): Calculate complement = target - 2 = 7. Check if 7 exists in Hash Map. Not found -> store 2 at index 0.',
      arrayState: [...nums],
      activeIndices: [0],
      variables: { i: 0, currentVal: 2, complement: 7, inMap: 'FALSE', hashMap: '{ 2: 0 }' },
      consoleOutput: '[OPTIMIZED] 7 not in map. Saved 2 -> index 0.'
    },
    {
      lineHighlighted: 6,
      actionType: 'found',
      approachType: 'OPTIMIZED_TRICK',
      explanation: 'Index i=1 (val=7): Calculate complement = target - 7 = 2. Check Hash Map for 2 -> FOUND at index 0! Return [0, 1] in O(1) step!',
      arrayState: [...nums],
      activeIndices: [0, 1],
      variables: { i: 1, currentVal: 7, complement: 2, inMap: 'TRUE (index 0)', result: '[0, 1]' },
      consoleOutput: '[OPTIMIZED] Complement 2 found in hash table! Total operations: exactly N iterations.'
    }
  ];
}
