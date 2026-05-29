import { Snapshot, LinkedListNodeState, TreeNodeState } from './types';

// Helper for Two Sum Simulation
export function generateTwoSumSnapshots(nums: number[], target: number): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const map: Record<number, number> = {};
  
  // Initial Snapshot
  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Starting Two Sum. Find two numbers that add up to target = ${target} from nums = [${nums.join(', ')}]`,
    variables: { target, nums: `[${nums.join(', ')}]` },
    consoleOutput: `[INIT] Target: ${target}, Numbers count: ${nums.length}`
  });

  // Map init
  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: 'Initialize an empty Hash Map to store seen numbers and their indices.',
    variables: { target, hash_map: '{}' },
    consoleOutput: '[INFO] Allocated Map memory.'
  });

  for (let i = 0; i < nums.length; i++) {
    const currentNum = nums[i];
    const complement = target - currentNum;

    // Loop header
    snapshots.push({
      lineHighlighted: 3,
      actionType: 'traverse',
      explanation: `Index i = ${i}: Scanning current element nums[${i}] = ${currentNum}`,
      activeIndices: [i],
      variables: { i, current_value: currentNum, complement, hash_map: JSON.stringify(map) },
      consoleOutput: `[SCAN] Checking index ${i} with value ${currentNum}`
    });

    // Complement calculation
    snapshots.push({
      lineHighlighted: 4,
      actionType: 'compare',
      explanation: `Complement formula: target - current = ${target} - ${currentNum} = ${complement}. Check if ${complement} is in Hash Map.`,
      activeIndices: [i],
      variables: { i, current_value: currentNum, complement, hash_map: JSON.stringify(map) },
      consoleOutput: `[CALC] Complement check: Is ${complement} present?`
    });

    // Search complement in Hash Map
    if (complement in map) {
      const complementIndex = map[complement];
      // Complement found!
      snapshots.push({
        lineHighlighted: 5,
        actionType: 'found',
        explanation: `Success! Complement ${complement} exists at index ${complementIndex} in Hash Map.`,
        activeIndices: [complementIndex, i],
        variables: { i, current_value: currentNum, complement, answer: `[${complementIndex}, ${i}]`, hash_map: JSON.stringify(map) },
        consoleOutput: `[SUCCESS] Complement found in Map. nums[${complementIndex}] (${complement}) + nums[${i}] (${currentNum}) = ${target}`
      });

      snapshots.push({
        lineHighlighted: 6,
        actionType: 'done',
        explanation: `Returning final answer array holding indices [${complementIndex}, ${i}].`,
        activeIndices: [complementIndex, i],
        variables: { answer: `[${complementIndex}, ${i}]` },
        consoleOutput: `[DONE] Result returned successfully: [${complementIndex}, ${i}]`
      });

      return snapshots;
    }

    // Complement not found, save current into map
    snapshots.push({
      lineHighlighted: 8,
      actionType: 'insert',
      explanation: `Complement ${complement} is NOT present in Map. Record current value ${currentNum} at index ${i} in Map and proceed.`,
      activeIndices: [i],
      variables: { i, current_value: currentNum, complement, hash_map: JSON.stringify({ ...map, [currentNum]: i }) },
      consoleOutput: `[MAP] Registered map[${currentNum}] = ${i}`
    });
    map[currentNum] = i;
  }

  // Fallback
  snapshots.push({
    lineHighlighted: 10,
    actionType: 'not_found',
    explanation: 'No such pair forms the target. Returning empty list.',
    variables: { answer: '[]' },
    consoleOutput: '[WARN] No matching pair found.'
  });
  return snapshots;
}

// Helper for Valid Parentheses Simulation
export function generateValidParenthesesSnapshots(s: string): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const stack: string[] = [];
  const brackets: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initializing check for valid parenthetical expression: "${s}"`,
    variables: { expression: s },
    consoleOutput: `[INIT] Evaluating syntax validity for tape text "${s}"`
  });

  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: 'Opening empty Stack framework for matching boundary limits.',
    variables: { expression: s, stack: '[]' },
    consoleOutput: '[INFO] Initialized empty character array stack representation.'
  });

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Loop index
    snapshots.push({
      lineHighlighted: 4,
      actionType: 'traverse',
      explanation: `Analyzing symbol s[${i}] = '${char}'`,
      variables: { i, char, stack: `[${stack.join(', ')}]` },
      consoleOutput: `[SCAN] Checking token at index ${i}: '${char}'`
    });

    if (char === '(' || char === '{' || char === '[') {
      // Loop inner if
      snapshots.push({
        lineHighlighted: 5,
        actionType: 'compare',
        explanation: `'${char}' is an opening token. Must push onto the stack.`,
        variables: { i, char, stack: `[${stack.join(', ')}]` },
        consoleOutput: `[MATCH] '${char}' is an opener.`
      });

      stack.push(char);

      // Pushed snapshot
      snapshots.push({
        lineHighlighted: 6,
        actionType: 'insert',
        explanation: `Pushed '${char}' onto stack. Stack represents unclosed opening brackets in current scope.`,
        variables: { i, char, stack: `[${stack.join(', ')}]` },
        consoleOutput: `[STACK] Push '${char}' -> Active count is ${stack.length}`
      });
    } else {
      // It is a closing token
      snapshots.push({
        lineHighlighted: 8,
        actionType: 'compare',
        explanation: `'${char}' is a closing token. Pop topmost bracket from the stack to verify match.`,
        variables: { i, char, stack: `[${stack.join(', ')}]` },
        consoleOutput: `[MATCH] '${char}' is a closer. Attempting stack popped match.`
      });

      const top = stack.pop();

      snapshots.push({
        lineHighlighted: 9,
        actionType: 'swap',
        explanation: `Popped topmost bracket '${top || 'empty'}' from Stack. Verify if matches closer for '${char}' which is '${brackets[char]}'.`,
        variables: { i, char, top: top || 'empty', expected_opener: brackets[char], stack: `[${stack.join(', ')}]` },
        consoleOutput: `[STACK] Pop: '${top || 'NONE'}'. Checking equivalence with closer mapping.`
      });

      if (top !== brackets[char]) {
        snapshots.push({
          lineHighlighted: 10,
          actionType: 'not_found',
          explanation: `Invalid mismatch! Bracket '${top || 'empty'}' does not close current bracket '${char}'!`,
          variables: { i, char, top: top || 'empty', expected_opener: brackets[char], result: 'false' },
          consoleOutput: `[ERROR] Syntactic mismatch at index ${i}: expected '${brackets[char]}' but popped '${top || 'empty'}'`
        });
        return snapshots;
      }
    }
  }

  // End checks
  const isValid = stack.length === 0;
  snapshots.push({
    lineHighlighted: 14,
    actionType: 'done',
    explanation: `Scan complete. Stack length = ${stack.length}. Stack is ${isValid ? 'empty! String is valid.' : 'not empty! Unclosed openings left behind.'}`,
    variables: { final_stack: `[${stack.join(', ')}]`, isValid: String(isValid) },
    consoleOutput: isValid ? '[SUCCESS] Parentheses syntax validated! No errors.' : '[ERROR] Stack not empty: remaining openings.'
  });

  return snapshots;
}

// Helper for Reverse Linked List Simulation
export function generateReverseLinkedListSnapshots(initialVals: number[]): Snapshot[] {
  const snapshots: Snapshot[] = [];

  // Construct initial linked list state
  let listState: LinkedListNodeState[] = initialVals.map((val, idx) => ({
    id: `node-${idx}`,
    value: val,
    nextId: idx < initialVals.length - 1 ? `node-${idx + 1}` : null
  }));

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initiating reversal of Singly Linked List: ${initialVals.join(' → ')}`,
    linkedListState: JSON.parse(JSON.stringify(listState)),
    variables: { prev: 'null', curr: 'node-0' },
    consoleOutput: '[INIT] Iterative Pointer swap active.'
  });

  // prev = null
  let prevId: string | null = null;
  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: 'Initialize variable prev = null. This represents the new tail of our reversed list.',
    linkedListState: JSON.parse(JSON.stringify(listState)),
    variables: { prev: 'null', curr: 'node-0' },
    consoleOutput: '[INFO] Pointer variables initialized. prev set to NULL'
  });

  // curr = head
  let currId: string | null = 'node-0';
  snapshots.push({
    lineHighlighted: 3,
    actionType: 'init',
    explanation: 'Initialize curr = node-0 (head node). We will iterate through nodes step-by-step.',
    linkedListState: JSON.parse(JSON.stringify(listState)),
    variables: { prev: 'null', curr: currId },
    consoleOutput: `[INFO] curr assigned to head node-0WithValue(${initialVals[0]})`
  });

  while (currId !== null) {
    const currIdx = listState.findIndex(n => n.id === currId);
    if (currIdx === -1) break;

    const currNode = listState[currIdx];
    const nextId = currNode.nextId;

    // while check
    snapshots.push({
      lineHighlighted: 4,
      actionType: 'traverse',
      explanation: `Top of Loop. curr is active node '${currNode.value}' (ID: ${currId}). Node is not null, so process.`,
      linkedListState: JSON.parse(JSON.stringify(listState)),
      highlightedNodes: [currId],
      variables: { prev: prevId || 'null', curr: currId, next: nextId || 'null' },
      consoleOutput: `[ITERATION] Active pointer node: Value(${currNode.value})`
    });

    // next = curr.next
    snapshots.push({
      lineHighlighted: 5,
      actionType: 'traverse',
      explanation: `Cache the next node to avoid losing reference. next = curr.next which points to node '${nextId ? listState.find(n => n.id === nextId)?.value : 'null'}' (ID: ${nextId || 'null'})`,
      linkedListState: JSON.parse(JSON.stringify(listState)),
      highlightedNodes: [currId],
      variables: { prev: prevId || 'null', curr: currId, next: nextId || 'null' },
      consoleOutput: `[CACHE] Saved forward connection address: ${nextId || 'NULL'}`
    });

    // curr.next = prev
    listState[currIdx].nextId = prevId;
    snapshots.push({
      lineHighlighted: 6,
      actionType: 'pointer_rewire',
      explanation: `Pointer rewiring! Redirect curr.next pointer to point backward to prev node ('${prevId ? listState.find(n => n.id === prevId)?.value : 'null'}')`,
      linkedListState: JSON.parse(JSON.stringify(listState)),
      highlightedNodes: [currId],
      variables: { prev: prevId || 'null', curr: currId, next: nextId || 'null' },
      consoleOutput: `[REWIRE] Changed next pointer of Node(${currNode.value}) to backward pointer: ${prevId || 'NULL'}`
    });

    // prev = curr
    prevId = currId;
    snapshots.push({
      lineHighlighted: 7,
      actionType: 'traverse',
      explanation: `Advance prev pointer forward to curr node ('${currNode.value}').`,
      linkedListState: JSON.parse(JSON.stringify(listState)),
      highlightedNodes: [prevId],
      variables: { prev: prevId, curr: currId, next: nextId || 'null' },
      consoleOutput: `[POINTER] Shifted prev forward to match current: Value(${currNode.value})`
    });

    // curr = next
    currId = nextId;
    snapshots.push({
      lineHighlighted: 8,
      actionType: 'traverse',
      explanation: `Advance curr pointer forward to next node '${currId ? listState.find(n => n.id === currId)?.value : 'null'}'.`,
      linkedListState: JSON.parse(JSON.stringify(listState)),
      highlightedNodes: currId ? [currId] : [],
      variables: { prev: prevId, curr: currId || 'null' },
      consoleOutput: `[POINTER] Shifted curr forward to: ${currId || 'NULL'}`
    });
  }

  // return prev
  snapshots.push({
    lineHighlighted: 10,
    actionType: 'done',
    explanation: `Done! curr has hit null boundary. Reversal complete! prev points to the new head of list: value '${prevId ? listState.find(n => n.id === prevId)?.value : 'null'}'`,
    linkedListState: JSON.parse(JSON.stringify(listState)),
    variables: { return_head: prevId || 'null' },
    consoleOutput: `[DONE] Reversed head returned successfully. New head value: ${prevId ? listState.find(n => n.id === prevId)?.value : 'NULL'}`
  });

  return snapshots;
}

// Helper for Binary Search Simulation
export function generateBinarySearchSnapshots(nums: number[], target: number): Snapshot[] {
  const snapshots: Snapshot[] = [];
  let l = 0;
  let r = nums.length - 1;

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initializing Binary Search for target = ${target} in sorted list nums = [${nums.join(', ')}]`,
    variables: { target, nums: `[${nums.join(', ')}]` },
    consoleOutput: `[INIT] Target value ${target} sought using O(log N) split pointers.`
  });

  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: `Set search boundaries: left (l) = ${l}, right (r) = ${r}`,
    variables: { l, r, target },
    consoleOutput: `[POINTERS] Bound range spans from index ${l} to ${r}`
  });

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    const midVal = nums[mid];

    // while head
    snapshots.push({
      lineHighlighted: 3,
      actionType: 'traverse',
      explanation: `Check bound condition: l (${l}) <= r (${r}) is true. Spanning ${r - l + 1} candidates.`,
      activeIndices: Array.from({ length: r - l + 1 }, (_, index) => l + index),
      variables: { l, r, mid: 'not calculated yet', target },
      consoleOutput: `[RANGE] Current search span contains ${r - l + 1} items`
    });

    // mid calc
    snapshots.push({
      lineHighlighted: 4,
      actionType: 'compare',
      explanation: `Calculate mid-index: math.floor((l + r)/2) = math.floor((${l} + ${r})/2) = ${mid}. nums[${mid}] = ${midVal}`,
      activeIndices: [mid],
      variables: { l, r, mid, midVal, target },
      consoleOutput: `[MIDPOINT] Calculated mid index = ${mid} (Value: ${midVal})`
    });

    // check equality
    snapshots.push({
      lineHighlighted: 5,
      actionType: 'compare',
      explanation: `Evaluating if nums[mid] (${midVal}) === target (${target})`,
      activeIndices: [mid],
      variables: { l, r, mid, midVal, target, conditionResult: String(midVal === target) },
      consoleOutput: `[TEST] Evaluation: ${midVal} === ${target}`
    });

    if (midVal === target) {
      snapshots.push({
        lineHighlighted: 6,
        actionType: 'found',
        explanation: `Match discovered! nums[mid] equals target (${target}). Index found: ${mid}.`,
        activeIndices: [mid],
        variables: { l, r, mid, midVal, target, return_idx: mid },
        consoleOutput: `[SUCCESS] Value ${target} found at sorted index: ${mid}`
      });
      return snapshots;
    }

    // check less
    snapshots.push({
      lineHighlighted: 7,
      actionType: 'compare',
      explanation: `Evaluate split conditions: Is nums[mid] (${midVal}) < target (${target})?`,
      activeIndices: [mid],
      variables: { l, r, mid, midVal, target, is_less: String(midVal < target) },
      consoleOutput: `[TEST] Evaluation: ${midVal} < ${target}`
    });

    if (midVal < target) {
      const prevL = l;
      l = mid + 1;
      snapshots.push({
        lineHighlighted: 8,
        actionType: 'swap',
        explanation: `Since ${midVal} is less than ${target}, target must reside in right sub-portion. Shift left boundary pointer: l = mid + 1 = ${l}`,
        activeIndices: [mid],
        variables: { prevL, target, mid, midVal, r, l },
        consoleOutput: `[POINTER] Shifted left pointer bounds forward past midpoint: l = ${l}`
      });
    } else {
      const prevR = r;
      r = mid - 1;
      snapshots.push({
        lineHighlighted: 10,
        actionType: 'swap',
        explanation: `Since ${midVal} is greater than ${target}, target must reside in left sub-portion. Shift right boundary pointer: r = mid - 1 = ${r}`,
        activeIndices: [mid],
        variables: { l, target, mid, midVal, prevR, r },
        consoleOutput: `[POINTER] Shifted right pointer bounds backward past midpoint: r = ${r}`
      });
    }
  }

  // Not found
  snapshots.push({
    lineHighlighted: 13,
    actionType: 'not_found',
    explanation: `Search exhausted. l (${l}) > r (${r}). Target ${target} does not exist in array range. Returning -1.`,
    variables: { target, return_val: -1 },
    consoleOutput: `[FAILED] Value ${target} is not in search array. Returned -1`
  });

  return snapshots;
}

// Helper for Best Time to Buy and Sell Stock Simulation
export function generateBuySellStockSnapshots(prices: number[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  let l = 0; // Buy day pointer
  let r = 1; // Sell day pointer
  let maxP = 0;

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Init Buy/Sell Stock. Find max profit intervals. Prices list = [${prices.join(', ')}]`,
    variables: { max_profit: 0 },
    consoleOutput: `[INIT] Best stock trade optimizer started on series: [${prices.join(', ')}]`
  });

  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: 'Set dynamic indices: left window pointer l = 0 (buy day), right pointer r = 1 (sell day), maxP = 0.',
    variables: { l, r, maxP },
    consoleOutput: '[POINTERS] Buy Day pointer set at 0, Sell Day pointer set at 1.'
  });

  while (r < prices.length) {
    const buyPrice = prices[l];
    const sellPrice = prices[r];

    // while conditional
    snapshots.push({
      lineHighlighted: 4,
      actionType: 'traverse',
      explanation: `Tick Window check: r (${r}) < size (${prices.length}). Analyze current trade frame.`,
      activeIndices: [l, r],
      variables: { l, r, buyPrice, sellPrice, max_profit: maxP },
      consoleOutput: `[WINDOW] Buy Day ${l} ($${buyPrice}) ↔ Sell Day ${r} ($${sellPrice})`
    });

    // compare buy & sell
    snapshots.push({
      lineHighlighted: 5,
      actionType: 'compare',
      explanation: `Check profit window validator: Is buyPrice ($${buyPrice}) < sellPrice ($${sellPrice})?`,
      activeIndices: [l, r],
      variables: { l, r, buyPrice, sellPrice, max_profit: maxP, profitable: String(buyPrice < sellPrice) },
      consoleOutput: `[CHECK] Evaluating check buy(${buyPrice}) < sell(${sellPrice})`
    });

    if (buyPrice < sellPrice) {
      const profit = sellPrice - buyPrice;
      const prevMax = maxP;
      maxP = Math.max(maxP, profit);

      snapshots.push({
        lineHighlighted: 6,
        actionType: 'found',
        explanation: `Profitable trade window! Current transaction profit = $${sellPrice} - $${buyPrice} = $${profit}. Updating max profit: max(${prevMax}, ${profit}) = $${maxP}`,
        activeIndices: [l, r],
        variables: { l, r, buyPrice, sellPrice, window_profit: profit, max_profit: maxP },
        consoleOutput: `[PROFIT] Profitable window of +$${profit} found! Max overall profit updated to $${maxP}.`
      });
    } else {
      const prevL = l;
      l = r;
      snapshots.push({
        lineHighlighted: 9,
        actionType: 'swap',
        explanation: `Negative bounds! Buy price ($${buyPrice}) is higher than Sell price ($${sellPrice}). Moving buy marker l forward to cover r @ ${r} ($${sellPrice}) because it's a lower buying floor.`,
        activeIndices: [r],
        variables: { prevL, newL: l, buyPrice: prices[l], sellPrice, max_profit: maxP },
        consoleOutput: `[POINTER] Lower purchase price found! Shifting buy day marker l from ${prevL} to ${l} ($${prices[l]})`
      });
    }

    r++;
    snapshots.push({
      lineHighlighted: 11,
      actionType: 'traverse',
      explanation: `Incrementing right explorer day pointer r = r + 1 to test subsequent seller prices.`,
      activeIndices: l === r ? [l] : [l, r],
      variables: { l, r, max_profit: maxP },
      consoleOutput: `[POINTER] Shifted sell tracker pointer r forward to ${r}`
    });
  }

  // Done
  snapshots.push({
    lineHighlighted: 13,
    actionType: 'done',
    explanation: `Done! Iteration index pointer r has run out of time steps. Reached end of prices list. Maximum recorded profit is $${maxP}.`,
    variables: { final_max_profit: maxP },
    consoleOutput: `[DONE] Maximized overall trading profit yields: $${maxP}`
  });

  return snapshots;
}

// Helper for Container With Most Water Simulation
export function generateContainerWithMostWaterSnapshots(height: number[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  let l = 0;
  let r = height.length - 1;
  let maxA = 0;

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Container With Most Water calculation. Heights list: [${height.join(', ')}]`,
    variables: { max_area: 0 },
    consoleOutput: `[INIT] Starting container water capacity optimizer on heights layout series: [${height.join(', ')}]`
  });

  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: `Set boundary bounds. Left pointer l = 0 (height: ${height[0]}), right pointer r = ${r} (height: ${height[r]}), maxArea = 0`,
    variables: { l, r, lHeight: height[0], rHeight: height[r], max_area: maxA },
    consoleOutput: `[POINTERS] Boundaries placed at left boundary (0) and right boundary (${r})`
  });

  while (l < r) {
    const width = r - l;
    const hL = height[l];
    const hR = height[r];
    const minHeight = Math.min(hL, hR);
    const area = minHeight * width;
    const prevMax = maxA;
    maxA = Math.max(maxA, area);

    // while check
    snapshots.push({
      lineHighlighted: 4,
      actionType: 'traverse',
      explanation: `Current state: l = ${l}, r = ${r}, width = ${width}. Left wall = ${hL}, Right wall = ${hR}. min(left, right) = ${minHeight}. Area = ${minHeight} * ${width} = ${area}.`,
      activeIndices: [l, r],
      variables: { l, r, width, leftHeight: hL, rightHeight: hR, area, max_area: maxA },
      consoleOutput: `[EVALUATE] l:${l} ↔ r:${r} | Wall heights: [L:${hL} R:${hR}] | Calculated volume area: ${area}`
    });

    // Check pointers update
    snapshots.push({
      lineHighlighted: 7,
      actionType: 'compare',
      explanation: `Check wall height dominance: Is left wall height (${hL}) < right wall height (${hR})?`,
      activeIndices: [l, r],
      variables: { l, r, leftHeight: hL, rightHeight: hR, max_area: maxA, leftIsLower: String(hL < hR) },
      consoleOutput: `[COMPARE] Evaluate: left height (${hL}) < right height (${hR})`
    });

    if (hL < hR) {
      const prevL = l;
      l++;
      snapshots.push({
        lineHighlighted: 8,
        actionType: 'swap',
        explanation: `Left wall (${hL}) is lower than Right wall (${hR}). Shift left pointer forward (l++) to search for taller walls: new l = ${l}`,
        activeIndices: [l],
        variables: { prevL, newL: l, leftHeight: height[l], max_area: maxA },
        consoleOutput: `[POINTER] Shifted left pointer forward: from ${prevL} to ${l}`
      });
    } else {
      const prevR = r;
      r--;
      snapshots.push({
        lineHighlighted: 10,
        actionType: 'swap',
        explanation: `Right wall (${hR}) is lower than or equal to Left wall (${hL}). Shift right pointer backward (r--) to seek taller boundaries: new r = ${r}`,
        activeIndices: [r],
        variables: { prevR, newR: r, rightHeight: height[r], max_area: maxA },
        consoleOutput: `[POINTER] Shifted right pointer backward: from ${prevR} to ${r}`
      });
    }
  }

  // Done
  snapshots.push({
    lineHighlighted: 13,
    actionType: 'done',
    explanation: `Done! l (${l}) and r (${r}) crossed boundaries. Max recorded fluid container capacity is ${maxA}.`,
    variables: { max_area: maxA },
    consoleOutput: `[DONE] Fluid bounds search optimized successfully! Yielded maximum volume = ${maxA}`
  });

  return snapshots;
}

// Helper for Invert Binary Tree Simulation
export function generateInvertTreeSnapshots(initialVals: number[]): Snapshot[] {
  const snapshots: Snapshot[] = [];

  // Helper tree generator from arrays (bfs style)
  // Let's create visual coordinates for a nicely aligned binary tree
  // root ID: node-0
  const buildTreeState = (vals: number[]): TreeNodeState[] => {
    const nodes: TreeNodeState[] = [];
    if (!vals || vals.length === 0) return [];
    
    // Position mappings for a 3-level binary tree visually
    const coords: Record<number, { x: number; y: number }> = {
      0: { x: 300, y: 50 }, // Root
      1: { x: 150, y: 130 }, // Left child
      2: { x: 450, y: 130 }, // Right child
      3: { x: 75, y: 210 },  // Left-Left
      4: { x: 225, y: 210 }, // Left-Right
      5: { x: 375, y: 210 }, // Right-Left
      6: { x: 525, y: 210 }  // Right-Right
    };

    for (let i = 0; i < vals.length; i++) {
      if (vals[i] === null) continue;
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      const c = coords[i] || { x: 300, y: 50 + 80 * Math.floor(Math.log2(i + 1)) };

      nodes.push({
        id: `node-${i}`,
        value: vals[i],
        leftId: leftIdx < vals.length && vals[leftIdx] !== null ? `node-${leftIdx}` : null,
        rightId: rightIdx < vals.length && vals[rightIdx] !== null ? `node-${rightIdx}` : null,
        x: c.x,
        y: c.y,
        highlighted: false,
        traversed: false
      });
    }
    return nodes;
  };

  let treeState = buildTreeState(initialVals);

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initializing mirror inversion of Binary Tree with nodes: [${initialVals.filter(v => v !== null).join(', ')}]`,
    treeState: JSON.parse(JSON.stringify(treeState)),
    variables: { root: 'node-0' },
    consoleOutput: `[INIT] Inverting Binary Tree structure recursively (LeetCode 226).`
  });

  // We will simulate recursive calls level-by-level using dry run
  const invertRecursive = (nodeIdx: number) => {
    if (nodeIdx >= initialVals.length || initialVals[nodeIdx] === null) {
      return;
    }

    const nodeId = `node-${nodeIdx}`;
    
    // Visit check
    snapshots.push({
      lineHighlighted: 2,
      actionType: 'traverse',
      explanation: `Visit node-ID '${nodeId}' (Value: ${initialVals[nodeIdx]}). Check if root === null.`,
      treeState: JSON.parse(JSON.stringify(treeState)),
      highlightedNodes: [nodeId],
      variables: { currentSubtreeRoot: nodeId, rootValue: initialVals[nodeIdx] },
      consoleOutput: `[RECURSION] Visiting node ${nodeId} (${initialVals[nodeIdx]})`
    });

    // Cache left
    const leftIdx = 2 * nodeIdx + 1;
    const rightIdx = 2 * nodeIdx + 2;
    const hasLeft = leftIdx < initialVals.length && initialVals[leftIdx] !== null;
    const hasRight = rightIdx < initialVals.length && initialVals[rightIdx] !== null;

    snapshots.push({
      lineHighlighted: 3,
      actionType: 'traverse',
      explanation: `Saving reference temp = left child (left: '${hasLeft ? initialVals[leftIdx] : 'null'}')`,
      treeState: JSON.parse(JSON.stringify(treeState)),
      highlightedNodes: [nodeId],
      variables: { currentSubtreeRoot: nodeId, temp: hasLeft ? `node-${leftIdx}` : 'null' },
      consoleOutput: `[CACHE] Saved temporary pointer reference for left subtree.`
    });

    // Swapping pointers
    const nodeInTreeIdx = treeState.findIndex(n => n.id === nodeId);
    if (nodeInTreeIdx !== -1) {
      const oldLeft = treeState[nodeInTreeIdx].leftId;
      const oldRight = treeState[nodeInTreeIdx].rightId;
      
      treeState[nodeInTreeIdx].leftId = oldRight;
      treeState[nodeInTreeIdx].rightId = oldLeft;

      // Adjust positions of subtrees visually during inversion swaps to show real physical movement!
      // This is super cool. We can swap visual coords for kids to make it highly graphical!
      const swapSubtreeCoordinates = (li: number, ri: number) => {
        const lNodeIdx = treeState.findIndex(n => n.id === `node-${li}`);
        const rNodeIdx = treeState.findIndex(n => n.id === `node-${ri}`);
        if (lNodeIdx !== -1 && rNodeIdx !== -1) {
          const tempX = treeState[lNodeIdx].x;
          treeState[lNodeIdx].x = treeState[rNodeIdx].x;
          treeState[rNodeIdx].x = tempX;
          
          // Also swap their children coordinate properties if existing recursively
          const leftLeft = 2 * li + 1;
          const leftRight = 2 * li + 2;
          const rightLeft = 2 * ri + 1;
          const rightRight = 2 * ri + 2;
          swapSubtreeCoordinates(leftLeft, rightLeft);
          swapSubtreeCoordinates(leftRight, rightRight);
        }
      };

      swapSubtreeCoordinates(leftIdx, rightIdx);

      snapshots.push({
        lineHighlighted: 4,
        actionType: 'swap',
        explanation: `Assign left link to recursive mirror of right subtree. Swapping subtree bindings.`,
        treeState: JSON.parse(JSON.stringify(treeState)),
        highlightedNodes: [nodeId, `node-${leftIdx}`, `node-${rightIdx}`].filter(id => treeState.some(n => n.id === id)),
        variables: { currentSubtreeRoot: nodeId, newLeft: oldRight || 'null', newRight: oldLeft || 'null' },
        consoleOutput: `[REORDER] Swapped pointers for children of node ${nodeId}`
      });
    }

    // Recurse left
    if (hasLeft) {
      invertRecursive(leftIdx);
    }
    // Recurse right
    if (hasRight) {
      invertRecursive(rightIdx);
    }
  };

  // Run recurrence starting from Root Index 0
  invertRecursive(0);

  // Return root
  snapshots.push({
    lineHighlighted: 6,
    actionType: 'done',
    explanation: 'Recursive mirroring stack finished. Hierarchical mirror complete. Returning root node reference.',
    treeState: JSON.parse(JSON.stringify(treeState)),
    variables: { revertedRoot: 'node-0' },
    consoleOutput: `[SUCCESS] Mirror operations completely completed!`
  });

  return snapshots;
}

// ----------------------------------------------------
// Helper for Group Anagrams Animation
// ----------------------------------------------------
export function generateGroupAnagramsSnapshots(strs: string[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const map: Record<string, string[]> = {};
  
  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Starting Group Anagrams. Input strings: [${strs.map(s => `"${s}"`).join(', ')}]`,
    variables: { strs: strs.join(', '), map_state: '{}' },
    consoleOutput: `[INIT] Analyzing ${strs.length} input strings`
  });

  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: `Initialize an empty HashMap where key will be sorted string, and value will be list of anagrams.`,
    variables: { strs: strs.join(', '), map_state: '{}' },
    consoleOutput: `[INIT] Hash Map created`
  });

  for (let i = 0; i < strs.length; i++) {
    const s = strs[i];
    const sorted = s.split('').sort().join('');
    
    snapshots.push({
      lineHighlighted: 3,
      actionType: 'traverse',
      explanation: `Iteration i = ${i}: Examining string "${s}".`,
      activeIndices: [i],
      variables: { i, current_str: s, sorted_key: sorted, map_state: JSON.stringify(map) },
      consoleOutput: `[SCAN] string: "${s}"`
    });

    snapshots.push({
      lineHighlighted: 4,
      actionType: 'compare',
      explanation: `Sort characters of "${s}" alphabetically to form key: "${sorted}".`,
      activeIndices: [i],
      variables: { i, current_str: s, sorted_key: sorted, map_state: JSON.stringify(map) },
      consoleOutput: `[SORT] sorted "${s}" -> "${sorted}"`
    });

    const isAdded = (sorted in map);
    if (!isAdded) {
      map[sorted] = [];
      snapshots.push({
        lineHighlighted: 5,
        actionType: 'insert',
        explanation: `Key "${sorted}" not in map. Initialize a new list for it.`,
        activeIndices: [i],
        variables: { i, current_str: s, sorted_key: sorted, map_state: JSON.stringify(map) },
        consoleOutput: `[INSERT] Initialized new bucket for key: "${sorted}"`
      });
    }

    map[sorted].push(s);
    snapshots.push({
      lineHighlighted: 6,
      actionType: 'insert',
      explanation: `Push word "${s}" into the bucket of key "${sorted}".`,
      activeIndices: [i],
      variables: { i, current_str: s, sorted_key: sorted, map_state: JSON.stringify(map) },
      consoleOutput: `[PUSH] Added "${s}" to "${sorted}" bucket`
    });
  }

  const result = Object.values(map);
  snapshots.push({
    lineHighlighted: 8,
    actionType: 'done',
    explanation: `Finished processing all strings. Extract values from HashMap to get grouped result.`,
    variables: { map_state: JSON.stringify(map), result: JSON.stringify(result) },
    consoleOutput: `[DONE] Grouped anagrams: ${JSON.stringify(result)}`
  });

  return snapshots;
}

// ----------------------------------------------------
// Helper for Three Sum Animation
// ----------------------------------------------------
export function generateThreeSumSnapshots(nums: number[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const sorted = [...nums].sort((a, b) => a - b);
  const triplets: [number, number, number][] = [];

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initially sort array for matching pointers. Original: [${nums.join(', ')}]. Sorted: [${sorted.join(', ')}]`,
    arrayState: sorted,
    variables: { sorted: sorted.join(', '), triplets: '[]' },
    consoleOutput: `[SORT] Triplet optimizer sorted array: ${JSON.stringify(sorted)}`
  });

  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: `Initialize empty result list of triplets that sum to 0.`,
    arrayState: sorted,
    variables: { triplets: '[]' },
    consoleOutput: `[INIT] Results array instantiated`
  });

  for (let i = 0; i < sorted.length - 2; i++) {
    // Skip duplicate elements
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      snapshots.push({
        lineHighlighted: 4,
        actionType: 'traverse',
        explanation: `i = ${i}: Element sorted[${i}] (${sorted[i]}) is same as sorted[${i-1}] (${sorted[i-1]}). Skip to avoid duplicates.`,
        arrayState: sorted,
        activeIndices: [i],
        variables: { i, triplets: JSON.stringify(triplets) },
        consoleOutput: `[SKIP] duplicate i-anchor at value ${sorted[i]}`
      });
      continue;
    }

    snapshots.push({
      lineHighlighted: 3,
      actionType: 'traverse',
      explanation: `Anchor pointer i is set at index i = ${i} (value: ${sorted[i]}). Initializing left and right scan pointers.`,
      arrayState: sorted,
      activeIndices: [i],
      variables: { i, triplets: JSON.stringify(triplets) },
      consoleOutput: `[ANCHOR] Setting central focus at elements[${i}] = ${sorted[i]}`
    });

    let l = i + 1;
    let r = sorted.length - 1;

    snapshots.push({
      lineHighlighted: 5,
      actionType: 'traverse',
      explanation: `Set left scanner l = ${l} (value: ${sorted[l]}), right scanner r = ${r} (value: ${sorted[r]}).`,
      arrayState: sorted,
      activeIndices: [i, l, r],
      variables: { i, l, r, currentSum: sorted[i] + sorted[l] + sorted[r], triplets: JSON.stringify(triplets) },
      consoleOutput: `[POINTERS] left index ${l}, right index ${r}`
    });

    while (l < r) {
      const sum = sorted[i] + sorted[l] + sorted[r];

      snapshots.push({
        lineHighlighted: 6,
        actionType: 'compare',
        explanation: `Compare sum of values: sorted[i] + sorted[l] + sorted[r] = ${sorted[i]} + ${sorted[l]} + ${sorted[r]} = ${sum}. Checking matching sum values against 0.`,
        arrayState: sorted,
        activeIndices: [i, l, r],
        variables: { i, l, r, currentSum: sum, triplets: JSON.stringify(triplets) },
        consoleOutput: `[CHECK] Evaluating sum: ${sorted[i]} + ${sorted[l]} + ${sorted[r]} = ${sum}`
      });

      if (sum === 0) {
        triplets.push([sorted[i], sorted[l], sorted[r]]);
        
        snapshots.push({
          lineHighlighted: 8,
          actionType: 'found',
          explanation: `Success! Element sum is exactly 0. Adding triplet [${sorted[i]}, ${sorted[l]}, ${sorted[r]}] to triplets database.`,
          arrayState: sorted,
          activeIndices: [i, l, r],
          variables: { i, l, r, currentSum: sum, triplets: JSON.stringify(triplets) },
          consoleOutput: `[TRIPLET FOUND] [${sorted[i]}, ${sorted[l]}, ${sorted[r]}] adds perfectly up to 0!`
        });

        // Skip duplicates for left pointer
        const oldL = l;
        while (l < r && sorted[l] === sorted[l + 1]) l++;
        if (l !== oldL) {
          snapshots.push({
            lineHighlighted: 9,
            actionType: 'traverse',
            explanation: `Skip duplicate left pointer values to avoid redundant combinations. Pushing left pointer to index ${l}.`,
            arrayState: sorted,
            activeIndices: [i, l, r],
            variables: { i, l, r, triplets: JSON.stringify(triplets) },
            consoleOutput: `[SKIP DUPLICATES] Shifted left because of duplicates`
          });
        }

        // Skip duplicates for right pointer
        const oldR = r;
        while (l < r && sorted[r] === sorted[r - 1]) r--;
        if (r !== oldR) {
          snapshots.push({
            lineHighlighted: 10,
            actionType: 'traverse',
            explanation: `Skip duplicate right pointer values to avoid redundant combinations. Pushing right pointer to index ${r}.`,
            arrayState: sorted,
            activeIndices: [i, l, r],
            variables: { i, l, r, triplets: JSON.stringify(triplets) },
            consoleOutput: `[SKIP DUPLICATES] Shifted right because of duplicates`
          });
        }

        l++;
        r--;
        
        snapshots.push({
          lineHighlighted: 11,
          actionType: 'traverse',
          explanation: `Advance both pointers inbound: l becomes ${l}, r becomes ${r}.`,
          arrayState: sorted,
          activeIndices: [i, l, r],
          variables: { i, l, r, triplets: JSON.stringify(triplets) },
          consoleOutput: `[SCAN] Moved pointers inbound to look for next match`
        });

      } else if (sum < 0) {
        l++;
        snapshots.push({
          lineHighlighted: 12,
          actionType: 'traverse',
          explanation: `Sum (${sum}) is less than 0. We need a larger value. Advance the left pointer (l++) to index ${l} (value: ${sorted[l]}).`,
          arrayState: sorted,
          activeIndices: [i, l, r],
          variables: { i, l, r, currentSum: sum, triplets: JSON.stringify(triplets) },
          consoleOutput: `[SHIFT LEFT] Sum ${sum} < 0, increment left index to ${l}`
        });
      } else {
        r--;
        snapshots.push({
          lineHighlighted: 13,
          actionType: 'traverse',
          explanation: `Sum (${sum}) is greater than 0. We need a smaller value. Decrement the right pointer (r--) to index ${r} (value: ${sorted[r]}).`,
          arrayState: sorted,
          activeIndices: [i, l, r],
          variables: { i, l, r, currentSum: sum, triplets: JSON.stringify(triplets) },
          consoleOutput: `[SHIFT RIGHT] Sum ${sum} > 0, decrement right index to ${r}`
        });
      }
    }
  }

  snapshots.push({
    lineHighlighted: 17,
    actionType: 'done',
    explanation: `Completed traversing the sorted elements. Returning unique qualifying triplets list.`,
    arrayState: sorted,
    variables: { triplets: JSON.stringify(triplets) },
    consoleOutput: `[COMPLETED] Total triplets output: ${triplets.length}`
  });

  return snapshots;
}

// ----------------------------------------------------
// Helper for Longest Substring Animation
// ----------------------------------------------------
export function generateLongestSubstringSnapshots(s: string): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const set = new Set<string>();
  let l = 0;
  let maxLen = 0;

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Starting Longest Substring Without Repeating Characters. String s = "${s}"`,
    variables: { s, l, max_len: maxLen, char_set: '{}' },
    consoleOutput: `[INIT] Analyzing string "${s}"`
  });

  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: `Initialize unique character set cache for the active sliding window, set left pointer l = 0.`,
    variables: { s, l, r: 'not started', max_len: maxLen, char_set: '{}' },
    consoleOutput: `[INIT] Initialized sliding window structures`
  });

  for (let r = 0; r < s.length; r++) {
    const charR = s[r];

    snapshots.push({
      lineHighlighted: 4,
      actionType: 'traverse',
      explanation: `r = ${r}: Scanning current character "${charR}" at position r.`,
      variables: { s, l, r, current_char: charR, max_len: maxLen, char_set: `[${Array.from(set).join(', ')}]` },
      consoleOutput: `[SCAN] r: ${r}, char: "${charR}"`
    });

    while (set.has(charR)) {
      const charL = s[l];
      snapshots.push({
        lineHighlighted: 5,
        actionType: 'compare',
        explanation: `Duplicate character detected! "${charR}" is already inside character cache window: [${Array.from(set).join(', ')}]. Deleting s[l] ("${charL}") and shifting left pointer.`,
        variables: { s, l, r, current_char: charR, duplicate_found: charR, max_len: maxLen, char_set: `[${Array.from(set).join(', ')}]` },
        consoleOutput: `[DUPLICATE] Duplicate character "${charR}" found. Shrinking window from left...`
      });

      set.delete(charL);
      l++;

      snapshots.push({
        lineHighlighted: 6,
        actionType: 'traverse',
        explanation: `Removed s[l] from queue space. New left margin is index l = ${l}.`,
        variables: { s, l, r, current_char: charR, max_len: maxLen, char_set: `[${Array.from(set).join(', ')}]` },
        consoleOutput: `[SHRINK] Shifted left pointer to ${l}`
      });
    }

    set.add(charR);
    snapshots.push({
      lineHighlighted: 8,
      actionType: 'insert',
      explanation: `Add "${charR}" to current sliding window state queue: [${Array.from(set).join(', ')}].`,
      variables: { s, l, r, current_char: charR, max_len: maxLen, char_set: `[${Array.from(set).join(', ')}]` },
      consoleOutput: `[ADD] Added "${charR}" to active window`
    });

    const currLen = r - l + 1;
    const oldMax = maxLen;
    maxLen = Math.max(maxLen, currLen);

    snapshots.push({
      lineHighlighted: 9,
      actionType: 'compare',
      explanation: `Calculate window size: (r - l + 1) = (${r} - ${l} + 1) = ${currLen}. Update maximum substring length from ${oldMax} to ${maxLen}.`,
      variables: { s, l, r, current_char: charR, current_len: currLen, max_len: maxLen, char_set: `[${Array.from(set).join(', ')}]` },
      consoleOutput: `[UPDATE_MAX] Current size: ${currLen}, Best overall size: ${maxLen}`
    });
  }

  snapshots.push({
    lineHighlighted: 11,
    actionType: 'done',
    explanation: `Finished traversing the entry string. The maximum length of non-repeating characters is ${maxLen}.`,
    variables: { max_len: maxLen },
    consoleOutput: `[DONE] Best substring length identified: ${maxLen}`
  });

  return snapshots;
}

// ----------------------------------------------------
// Helper for Merge Sorted Lists Animation
// ----------------------------------------------------
export function generateMergeTwoListsSnapshots(list1: number[], list2: number[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const merged: number[] = [];
  let p1 = 0;
  let p2 = 0;

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Starting Merge Two Sorted Lists. List 1: [${list1.join(', ')}], List 2: [${list2.join(', ')}]`,
    variables: { p1, p2, list1: list1.join(', '), list2: list2.join(', '), merged: '[]' },
    consoleOutput: `[INIT] Merging list1 (${list1.length} nodes) and list2 (${list2.length} nodes)`
  });

  snapshots.push({
    lineHighlighted: 2,
    actionType: 'init',
    explanation: `Initialize a dummy head node. Create a cursor pointer 'tail' referencing it to construct the merged list.`,
    variables: { p1, p2, list1: list1.join(', '), list2: list2.join(', '), merged: '[]', dummy: 0 },
    consoleOutput: `[INIT] Dummy anchor list and tail scanner successfully preallocated`
  });

  while (p1 < list1.length && p2 < list2.length) {
    const val1 = list1[p1];
    const val2 = list2[p2];

    snapshots.push({
      lineHighlighted: 4,
      actionType: 'compare',
      explanation: `While loop: Both lists have nodes remaining. Comparing current list1 node (${val1}) vs list2 node (${val2}).`,
      variables: { p1, p2, val1, val2, list1: list1.join(', '), list2: list2.join(', '), merged: merged.join(', ') },
      consoleOutput: `[COMP] Comparing current heads: List1[${p1}] = ${val1} vs List2[${p2}] = ${val2}`
    });

    if (val1 < val2) {
      merged.push(val1);
      snapshots.push({
        lineHighlighted: 5,
        actionType: 'insert',
        explanation: `Since ${val1} < ${val2}, connect tail to List1 node (${val1}). Advance List1 cursor pointer to list1.next.`,
        variables: { p1, p2, val1, val2, list1: list1.join(', '), list2: list2.join(', '), merged: merged.join(', ') },
        consoleOutput: `[APPEND] connected node ${val1} from List1`
      });
      p1++;
    } else {
      merged.push(val2);
      snapshots.push({
        lineHighlighted: 7,
        actionType: 'insert',
        explanation: `Since ${val1} >= ${val2}, connect tail to List2 node (${val2}). Advance List2 cursor pointer to list2.next.`,
        variables: { p1, p2, val1, val2, list1: list1.join(', '), list2: list2.join(', '), merged: merged.join(', ') },
        consoleOutput: `[APPEND] connected node ${val2} from List2`
      });
      p2++;
    }

    snapshots.push({
      lineHighlighted: 9,
      actionType: 'traverse',
      explanation: `Move the tail tracker pointer forward in merged space.`,
      variables: { p1, p2, list1: list1.join(', '), list2: list2.join(', '), merged: merged.join(', ') },
      consoleOutput: `[TAIL] Tail cursor advanced forward.`
    });
  }

  // Appending leftovers
  if (p1 < list1.length) {
    const remaining = list1.slice(p1);
    merged.push(...remaining);
    snapshots.push({
      lineHighlighted: 11,
      actionType: 'insert',
      explanation: `List 2 is fully exhausted. Append all remaining elements of List 1: [${remaining.join(', ')}] directly to the end of the merged list.`,
      variables: { p1, p2, list1: list1.join(', '), list2: list2.join(', '), merged: merged.join(', ') },
      consoleOutput: `[APPEND] Linked remaining leftovers from List1: ${JSON.stringify(remaining)}`
    });
    p1 = list1.length;
  } else if (p2 < list2.length) {
    const remaining = list2.slice(p2);
    merged.push(...remaining);
    snapshots.push({
      lineHighlighted: 11,
      actionType: 'insert',
      explanation: `List 1 is fully exhausted. Append all remaining elements of List 2: [${remaining.join(', ')}] directly to the end of the merged list.`,
      variables: { p1, p2, list1: list1.join(', '), list2: list2.join(', '), merged: merged.join(', ') },
      consoleOutput: `[APPEND] Linked remaining leftovers from List2: ${JSON.stringify(remaining)}`
    });
    p2 = list2.length;
  }

  snapshots.push({
    lineHighlighted: 12,
    actionType: 'done',
    explanation: `Merge complete! Return dummy.next node reference representing head of merged list: [${merged.join(' -> ')}]`,
    variables: { p1, p2, list1: list1.join(', '), list2: list2.join(', '), merged: merged.join(', ') },
    consoleOutput: `[COMPLETE] Merged final sorted collection sequence: [${merged.join(', ')}]`
  });

  return snapshots;
}

