import { Snapshot, LinkedListNodeState, TreeNodeState } from './types';

// ==========================================
// 1. Array & Sorting Snapshots
// ==========================================

export function generateBubbleSortSnapshots(initialArray: number[]): Snapshot[] {
  const arr = [...initialArray];
  const snapshots: Snapshot[] = [];
  const n = arr.length;

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initializing Bubble Sort on array: [${arr.join(', ')}]`,
    arrayState: [...arr],
    activeIndices: [],
    variables: { i: 0, j: 0, n },
    consoleOutput: `[INFO] Initializing Bubble Sort with data size ${n}...`
  });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      snapshots.push({
        lineHighlighted: 4,
        actionType: 'compare',
        explanation: `Comparing array values: arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`,
        arrayState: [...arr],
        activeIndices: [j, j + 1],
        variables: { i, j, boundary: n - i - 1, compare: `arr[${j}] > arr[${j+1}]` },
        consoleOutput: `[INFO] Scanning elements. Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`
      });

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // Swap step
        snapshots.push({
          lineHighlighted: 5,
          actionType: 'swap',
          explanation: `Swapping values: ${temp} > ${arr[j]} at indices ${j} and ${j + 1}`,
          arrayState: [...arr],
          activeIndices: [j, j + 1],
          variables: { i, j, swapped: 'true', temp },
          consoleOutput: `[SWAP] Swapping elements at indices ${j} and ${j + 1} (${temp} ↔ ${arr[j]})`
        });
      }
    }
  }

  snapshots.push({
    lineHighlighted: 9,
    actionType: 'done',
    explanation: 'Bubble Sort completely finished! Elements are organized in ascending order.',
    arrayState: [...arr],
    activeIndices: [],
    variables: {},
    consoleOutput: `[SUCCESS] Bubble Sort complete! Final order: [${arr.join(', ')}]`
  });

  return snapshots;
}

export function generateQuickSortSnapshots(initialArray: number[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const arr = [...initialArray];

  // Initial Snapshot
  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initializing QuickSort with pivot-partition architecture on array: [${arr.join(', ')}]`,
    arrayState: [...arr],
    activeIndices: [],
    variables: { low: 0, high: arr.length - 1 },
    consoleOutput: `[INFO] Initializing QuickSort... Target elements count: ${arr.length}`
  });

  function runQuickSort(low: number, high: number) {
    snapshots.push({
      lineHighlighted: 2,
      actionType: 'traverse',
      explanation: `Checking recursion boundary limit. low: ${low}, high: ${high}`,
      arrayState: [...arr],
      activeIndices: [low, high],
      variables: { low, high, isSegmentValid: low < high ? 'true' : 'false' },
      consoleOutput: `[TRACE] Evaluating bounds: lower index ${low}, upper index ${high}`
    });

    if (low < high) {
      const pivotVal = arr[high];
      let i = low - 1;

      snapshots.push({
        lineHighlighted: 9,
        actionType: 'compare',
        explanation: `Selecting element at high-boundary ${high} as Pivot point (value: ${pivotVal}). Allocating index counter i = ${i}`,
        arrayState: [...arr],
        activeIndices: [high],
        variables: { low, high, pivot: pivotVal, i },
        consoleOutput: `[INFO] Pivot selected at index ${high} (value: ${pivotVal})`
      });

      for (let j = low; j < high; j++) {
        snapshots.push({
          lineHighlighted: 11,
          actionType: 'compare',
          explanation: `Scanning subarray element at j: ${j} (value: ${arr[j]}). Checking if less than pivot: ${pivotVal}`,
          arrayState: [...arr],
          activeIndices: [j, high],
          variables: { low, high, pivot: pivotVal, i, j, isLess: arr[j] < pivotVal ? 'true' : 'false' },
          consoleOutput: `[TRACE] Scanning array: evaluating index ${j} (value: ${arr[j]})`
        });

        if (arr[j] < pivotVal) {
          i++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          snapshots.push({
            lineHighlighted: 12,
            actionType: 'swap',
            explanation: `Value ${arr[i]} < pivot (${pivotVal}). Incrementing i to ${i} and swapping arr[i] ↔ arr[j]`,
            arrayState: [...arr],
            activeIndices: [i, j],
            variables: { low, high, pivot: pivotVal, i, j },
            consoleOutput: `[SWAP] Swapping elements at indices ${i} and ${j}. Values: ${arr[i]} and ${arr[j]}`
          });
        }
      }

      // Final pivot swap
      const pIdx = i + 1;
      const temp = arr[pIdx];
      arr[pIdx] = arr[high];
      arr[high] = temp;

      snapshots.push({
        lineHighlighted: 15,
        actionType: 'swap',
        explanation: `Subarray scan finished. Splicing pivot (${pivotVal}) into its exact sorted location at index ${pIdx}`,
        arrayState: [...arr],
        activeIndices: [pIdx, high],
        variables: { low, high, pivot: pivotVal, partitionIndex: pIdx },
        consoleOutput: `[SWAP] Placed pivot ${pivotVal} at sorted position ${pIdx}`
      });

      snapshots.push({
        lineHighlighted: 3,
        actionType: 'traverse',
        explanation: `Subdivision sorted. Recursively invoking Left boundaries of pivot: quicksort(arr, ${low}, ${pIdx - 1})`,
        arrayState: [...arr],
        activeIndices: [],
        variables: { low, high: pIdx - 1 },
        consoleOutput: `[TRACE] Traversing left subset recursion [${low} ... ${pIdx - 1}]`
      });
      runQuickSort(low, pIdx - 1);

      snapshots.push({
        lineHighlighted: 4,
        actionType: 'traverse',
        explanation: `Recursively invoking Right boundaries of pivot: quicksort(arr, ${pIdx + 1}, ${high})`,
        arrayState: [...arr],
        activeIndices: [],
        variables: { low: pIdx + 1, high },
        consoleOutput: `[TRACE] Traversing right subset recursion [${pIdx + 1} ... ${high}]`
      });
      runQuickSort(pIdx + 1, high);
    }
  }

  runQuickSort(0, arr.length - 1);

  snapshots.push({
    lineHighlighted: 5,
    actionType: 'done',
    explanation: 'QuickSort execution successfully complete!',
    arrayState: [...arr],
    activeIndices: [],
    variables: {},
    consoleOutput: `[SUCCESS] QuickSort execution complete. Final sorted array: [${arr.join(', ')}]`
  });

  return snapshots;
}

// ==========================================
// 2. Linked List Snapshots
// ==========================================

export function generateListInsertSnapshots(
  initialNodes: { id: string; value: number; nextId: string | null }[],
  insertAfterNodeId: string,
  newValue: number
): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const list = initialNodes.map(n => ({ ...n }));

  if (list.length === 0) {
    const tempId = 'temp_node';
    const newTempNode: { id: string; value: number; nextId: string | null; isTemp?: boolean } = { id: tempId, value: newValue, nextId: null, isTemp: false };
    snapshots.push({
      lineHighlighted: 9,
      actionType: 'done',
      explanation: `List is empty! Inserting Node(${newValue}) as the new Head of the list.`,
      linkedListState: [newTempNode],
      variables: { head: newValue, current: 'null', temp: newValue },
      consoleOutput: `[SUCCESS] Created new Head node with value ${newValue}`
    });
    return snapshots;
  }

  const prevNode = list.find(n => n.id === insertAfterNodeId);
  const prevVal = prevNode ? prevNode.value : 'null';

  const nodesCopy = () => list.map(n => ({ ...n }));

  // 1. Init
  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initializing operation: insertAfter(prevNode, newData) with value ${newValue}`,
    linkedListState: nodesCopy(),
    variables: { prevNode: prevVal, newData: newValue, temp: 'undefined' },
    consoleOutput: `[INFO] Initializing insertAfter(current, newValue=${newValue})...`
  });

  // 2. Check null
  snapshots.push({
    lineHighlighted: 2,
    actionType: 'compare',
    explanation: `Checking validation condition: if (prevNode === null) ... prevNode points to Node(${prevVal})`,
    linkedListState: nodesCopy(),
    variables: { prevNode: prevVal, prevNodeIsNull: prevNode ? 'false' : 'true' },
    consoleOutput: `[INFO] Checking: prevNode refers to non-null value.`
  });

  if (!prevNode) return snapshots;

  // 3. Create temp Node
  const tempId = 'temp_node';
  const newTempNode: LinkedListNodeState = { id: tempId, value: newValue, nextId: null, isTemp: true };
  const listWithFloating = [...nodesCopy(), newTempNode];

  snapshots.push({
    lineHighlighted: 6,
    actionType: 'insert',
    explanation: `Allocating memory heap. Creating dynamic node 'temp' (Value: ${newValue})`,
    linkedListState: listWithFloating,
    variables: { prevNode: prevVal, temp: `Node(${newValue})`, 'temp.next': 'null' },
    highlightedNodes: [tempId],
    consoleOutput: `[INFO] Allocated new Node with value ${newValue} at address @0x9F2`
  });

  // 4. Connect newNode.next -> prevNode.next
  newTempNode.nextId = prevNode.nextId;
  const listWithFloatingConnected = [...nodesCopy(), { ...newTempNode }];

  snapshots.push({
    lineHighlighted: 7,
    actionType: 'pointer_rewire',
    explanation: `Setting temp.next = current.next (points to Node(${prevNode.nextId ? list.find(x => x.id === prevNode.nextId)?.value : 'null'}))`,
    linkedListState: listWithFloatingConnected,
    variables: { prevNode: prevVal, temp: `Node(${newValue})`, 'temp.next': prevNode.nextId ? `Node(${list.find(x => x.id === prevNode.nextId)?.value})` : 'null' },
    highlightedNodes: [tempId],
    consoleOutput: `[TRACE] Linking temp.next ↔ prevNode.next (@${prevNode.nextId || 'null'})`
  });

  // 5. Connect prevNode.next -> newNode
  const prevInList = list.find(n => n.id === insertAfterNodeId)!;
  prevInList.nextId = tempId;

  const listFinalMutated: LinkedListNodeState[] = list.map(n => n.id === insertAfterNodeId ? { ...n, nextId: tempId } : { ...n });
  listFinalMutated.push({ ...newTempNode });

  snapshots.push({
    lineHighlighted: 8,
    actionType: 'pointer_rewire',
    explanation: `Setting current.next = temp. Dynamic pointer redirects towards Node(${newValue})`,
    linkedListState: listFinalMutated,
    variables: { prevNode: prevVal, 'prevNode.next': `Node(${newValue})` },
    highlightedNodes: [insertAfterNodeId, tempId],
    consoleOutput: `[TRACE] Diverted prevNode.next to temp node (@0x9F2)`
  });

  // Flatten properly in order
  const flatNodes: LinkedListNodeState[] = [];
  const visited = new Set<string>();
  let currId: string | null = listFinalMutated[0].id; // head

  while (currId) {
    if (visited.has(currId)) break;
    visited.add(currId);

    const stateNode = listFinalMutated.find(n => n.id === currId);
    if (!stateNode) break;

    flatNodes.push({ id: stateNode.id, value: stateNode.value, nextId: stateNode.nextId, isTemp: stateNode.isTemp });
    currId = stateNode.nextId;
  }

  // 6. Complete
  snapshots.push({
    lineHighlighted: 9,
    actionType: 'done',
    explanation: `Splicing complete! Node(${newValue}) is seamlessly inserted after Node(${prevVal})`,
    linkedListState: flatNodes,
    variables: { head: list[0].value, current: prevVal, temp: newValue },
    consoleOutput: `[SUCCESS] Operation completed. Spliced value ${newValue} after index ${prevVal}`
  });

  return snapshots;
}

export function generateListDeleteSnapshots(
  initialNodes: { id: string; value: number; nextId: string | null }[],
  targetValue: number
): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const list = initialNodes.map(n => ({ ...n }));
  const nodesCopy = () => list.map(n => ({ ...n }));

  if (list.length === 0) {
    snapshots.push({
      lineHighlighted: 1,
      actionType: 'done',
      explanation: 'Linked List is already empty! Nothing to delete.',
      linkedListState: [],
      variables: { current: 'null', prev: 'null', target: targetValue },
      consoleOutput: '[INFO] Deletion targeted on empty list, skipped.'
    });
    return snapshots;
  }

  // 1. Init
  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initializing deletion flow: deleteNode(head, targetValue=${targetValue})`,
    linkedListState: nodesCopy(),
    variables: { current: list[0].value, prev: 'null', target: targetValue },
    consoleOutput: `[INFO] Initializing deleteNode(head, target=${targetValue})...`
  });

  // 2. Variable setup
  snapshots.push({
    lineHighlighted: 2,
    actionType: 'traverse',
    explanation: `Allocating pointers: current = head, prev = null`,
    linkedListState: nodesCopy(),
    variables: { current: list[0].value, prev: 'null', target: targetValue },
    consoleOutput: `[INFO] Set current ↔ Node(${list[0].value}), prev ↔ null`
  });

  let prevId: string | null = null;
  let currId: string | null = list[0].id;
  let found = false;

  while (currId) {
    const currNode = list.find(n => n.id === currId)!;
    const prevNode = prevId ? list.find(n => n.id === prevId) : null;

    snapshots.push({
      lineHighlighted: 3,
      actionType: 'compare',
      explanation: `Loop check: is current (Node(${currNode.value})) non-null? Yes, continuing search.`,
      linkedListState: nodesCopy(),
      variables: { current: currNode.value, prev: prevNode ? prevNode.value : 'null', target: targetValue },
      highlightedNodes: [currId],
      consoleOutput: `[TRACE] Scanning list: current points to Node(${currNode.value})`
    });

    snapshots.push({
      lineHighlighted: 4,
      actionType: 'compare',
      explanation: `Evaluating value: is Node.value (${currNode.value}) === target (${targetValue})?`,
      linkedListState: nodesCopy(),
      variables: { current: currNode.value, prev: prevNode ? prevNode.value : 'null', target: targetValue },
      highlightedNodes: [currId],
      consoleOutput: `[TRACE] Comparing Node(${currNode.value}) ↔ target(${targetValue})`
    });

    if (currNode.value === targetValue) {
      found = true;
      snapshots.push({
        lineHighlighted: 5,
        actionType: 'found',
        explanation: `Target match found at node with value ${targetValue}! Decoupling item from list.`,
        linkedListState: nodesCopy(),
        variables: { current: currNode.value, prev: prevNode ? prevNode.value : 'null', target: targetValue },
        highlightedNodes: [currId],
        consoleOutput: `[INFO] Target node matched! Preparing pointer rewiring.`
      });

      if (prevId !== null) {
        // change pointer of prev to current's successor
        const prevObj = list.find(n => n.id === prevId)!;
        prevObj.nextId = currNode.nextId;

        snapshots.push({
          lineHighlighted: 5,
          actionType: 'pointer_rewire',
          explanation: `Bypassing target node. Setting prev.next (${prevObj.value}.next) = current.next (${currNode.nextId ? list.find(n => n.id === currNode.nextId)?.value : 'null'})`,
          linkedListState: nodesCopy(),
          variables: { current: currNode.value, prev: prevObj.value, 'prev.next': currNode.nextId ? `Node(${list.find(n => n.id === currNode.nextId)?.value})` : 'null' },
          highlightedNodes: [prevId, currId],
          consoleOutput: `[TRACE] Bypassed Node(${currNode.value}). Pointer updated: Node(${prevObj.value}).next = Node(${currNode.nextId ? list.find(n => n.id === currNode.nextId)?.value : 'null'})`
        });
      } else {
        // deleting absolute head
        snapshots.push({
          lineHighlighted: 6,
          actionType: 'pointer_rewire',
          explanation: `Bypassing root node. Setting head = current.next (which is Node(${currNode.nextId ? list.find(n => n.id === currNode.nextId)?.value : 'null'}))`,
          linkedListState: nodesCopy(),
          variables: { current: currNode.value, prev: 'null', head: currNode.nextId ? `Node(${list.find(n => n.id === currNode.nextId)?.value})` : 'null' },
          highlightedNodes: [currId],
          consoleOutput: `[TRACE] Deleting head. Resetting root address to successor.`
        });
      }

      // Slices target node out
      const remainingNodes = list.filter(n => n.id !== currNode.id);
      if (prevId) {
        const remainingMutated = remainingNodes.map(n => n.id === prevId ? { ...n, nextId: currNode.nextId } : { ...n });
        snapshots.push({
          lineHighlighted: 7,
          actionType: 'done',
          explanation: `Node ${targetValue} is successfully decoupled and GC collected!`,
          linkedListState: remainingMutated,
          variables: { target: targetValue },
          consoleOutput: `[SUCCESS] Solved deletion. Target ${targetValue} deleted successfully!`
        });
      } else {
        snapshots.push({
          lineHighlighted: 7,
          actionType: 'done',
          explanation: `Node ${targetValue} (former head) is successfully decoupled!`,
          linkedListState: remainingNodes,
          variables: { target: targetValue },
          consoleOutput: `[SUCCESS] Deletion completed. Head node deleted successfully!`
        });
      }
      break;
    }

    // Step to index forward
    prevId = currId;
    currId = currNode.nextId;

    snapshots.push({
      lineHighlighted: 9,
      actionType: 'traverse',
      explanation: `Stepping forward: setting prev = current, current = current.next`,
      linkedListState: nodesCopy(),
      variables: { current: currId ? list.find(n => n.id === currId)?.value || 'null' : 'null', prev: prevNode ? prevNode.value : 'null' },
      consoleOutput: `[TRACE] Advancing pointers: current ↔ pointer.next`
    });
  }

  if (!found) {
    snapshots.push({
      lineHighlighted: 11,
      actionType: 'not_found',
      explanation: `Traversal completed. Node containing value ${targetValue} was not found in the list.`,
      linkedListState: nodesCopy(),
      variables: {},
      consoleOutput: `[ERROR] Target item ${targetValue} not found in Linked List.`
    });
  }

  return snapshots;
}

// ==========================================
// 3. Binary Search Tree (BST) Snapshots
// ==========================================

// Pre-defined static coordinates helper for rendering up to 3 levels trees without node overlap
export function getBSTNodeCoordinates(id: string): { x: number; y: number } {
  const coords: Record<string, { x: number; y: number }> = {
    '50': { x: 300, y: 50 },
    '30': { x: 200, y: 150 },
    '70': { x: 400, y: 150 },
    '20': { x: 120, y: 250 },
    '40': { x: 260, y: 250 },
    '60': { x: 350, y: 250 },
    '80': { x: 480, y: 250 },
  };
  return coords[id] || { x: 300, y: 50 };
}

// Default layout nodes for Trees
export const DEFAULT_BST_NODES: TreeNodeState[] = [
  { id: '50', value: 50, leftId: '30', rightId: '70', x: 300, y: 50, highlighted: false },
  { id: '30', value: 30, leftId: '20', rightId: '40', x: 200, y: 150, highlighted: false },
  { id: '70', value: 70, leftId: '60', rightId: '80', x: 400, y: 150, highlighted: false },
  { id: '20', value: 20, leftId: null, rightId: null, x: 120, y: 250, highlighted: false },
  { id: '40', value: 40, leftId: null, rightId: null, x: 260, y: 250, highlighted: false },
  { id: '60', value: 60, leftId: null, rightId: null, x: 350, y: 250, highlighted: false },
  { id: '80', value: 80, leftId: null, rightId: null, x: 480, y: 250, highlighted: false }
];

export function generateBSTInsertSnapshots(
  initialTree: TreeNodeState[],
  newValue: number
): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const tree: TreeNodeState[] = initialTree.map(n => ({ ...n, highlighted: false, traversed: false }));
  const treeCopy = () => tree.map(n => ({ ...n }));

  // Pseudocode for insert
  // 1: def insert(root, val):
  // 2:   if root is None:
  // 3:     return Node(val)
  // 4:   if val < root.value:
  // 5:     root.left = insert(root.left, val)
  // 6:   else:
  // 7:     root.right = insert(root.right, val)
  // 8:   return root

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initializing BST Insert: insert(root, val=${newValue}) recursively`,
    treeState: treeCopy(),
    variables: { root: 50, val: newValue, current: 50 },
    consoleOutput: `[INFO] Initializing insertBST(root, val=${newValue})...`
  });

  if (tree.length === 0) {
    const freshNode: TreeNodeState = { id: String(newValue), value: newValue, leftId: null, rightId: null, x: 300, y: 50 };
    snapshots.push({
      lineHighlighted: 3,
      actionType: 'insert',
      explanation: `Tree is empty! Creating root node directly at center (Value: ${newValue})`,
      treeState: [freshNode],
      variables: { val: newValue },
      consoleOutput: `[SUCCESS] Created root node styled with value ${newValue}`
    });
    return snapshots;
  }

  let currId: string | null = '50'; // Assume start at root
  let parentId: string | null = null;
  let direction: 'left' | 'right' | null = null;

  while (currId) {
    const currNode = tree.find(n => n.id === currId);
    if (!currNode) break;

    // Highlight current evaluation node
    currNode.traversed = true;
    currNode.highlighted = true;

    snapshots.push({
      lineHighlighted: 2,
      actionType: 'compare',
      explanation: `Visiting Node(${currNode.value}). Comparing insertion target (${newValue}) ↔ node value (${currNode.value})`,
      treeState: treeCopy(),
      variables: { current: currNode.value, val: newValue },
      highlightedNodes: [currId],
      consoleOutput: `[TRACE] Visiting BST Node(${currNode.value}). Comparing val ${newValue} ↔ root value ${currNode.value}`
    });

    if (newValue < currNode.value) {
      snapshots.push({
        lineHighlighted: 4,
        actionType: 'compare',
        explanation: `Evaluate: is ${newValue} < Node(${currNode.value})? Yes! Diving Left side.`,
        treeState: treeCopy(),
        variables: { current: currNode.value, direction: 'left' },
        highlightedNodes: [currId],
        consoleOutput: `[TRACE] ${newValue} is smaller than ${currNode.value}. Recursing into LEFT child.`
      });

      // Clear highlighted state of parent for focus
      currNode.highlighted = false;
      parentId = currId;
      direction = 'left';
      currId = currNode.leftId;
    } else {
      snapshots.push({
        lineHighlighted: 6,
        actionType: 'compare',
        explanation: `Evaluate: is ${newValue} >= Node(${currNode.value})? Yes! Diving Right side.`,
        treeState: treeCopy(),
        variables: { current: currNode.value, direction: 'right' },
        highlightedNodes: [currId],
        consoleOutput: `[TRACE] ${newValue} is equal or larger than ${currNode.value}. Recursing into RIGHT child.`
      });

      currNode.highlighted = false;
      parentId = currId;
      direction = 'right';
      currId = currNode.rightId;
    }
  }

  // Splicing the new node coordinate calculation
  const pNode = tree.find(n => n.id === parentId);
  const newId = String(newValue);
  let newX = 300;
  let newY = 250;

  if (pNode) {
    if (newValue === 10) { newX = 50; newY = 320; }
    else if (newValue === 25) { newX = 160; newY = 320; }
    else if (newValue === 35) { newX = 230; newY = 320; }
    else if (newValue === 45) { newX = 280; newY = 320; }
    else if (newValue === 55) { newX = 320; newY = 320; }
    else if (newValue === 65) { newX = 380; newY = 320; }
    else if (newValue === 75) { newX = 440; newY = 320; }
    else if (newValue === 90) { newX = 530; newY = 320; }
    else {
      // defaults
      newX = direction === 'left' ? pNode.x - 40 : pNode.x + 40;
      newY = pNode.y + 70;
    }
  }

  const newNodeItem: TreeNodeState = {
    id: newId,
    value: newValue,
    leftId: null,
    rightId: null,
    x: newX,
    y: newY,
    highlighted: true,
    traversed: true
  };

  // Mutate parent tree representation
  if (pNode) {
    if (direction === 'left') {
      pNode.leftId = newId;
    } else {
      pNode.rightId = newId;
    }
  }
  tree.push(newNodeItem);

  snapshots.push({
    lineHighlighted: 5,
    actionType: 'insert',
    explanation: pNode
      ? `Target insertion leaf reached! Appending custom Node(${newValue}) under parent ${pNode.value} on the ${direction}`
      : `Target insertion leaf reached! Appending custom Node(${newValue}) as root`,
    treeState: treeCopy(),
    variables: pNode 
      ? { parent: pNode.value, parentRight: pNode.rightId || 'None', parentLeft: pNode.leftId || 'None' }
      : {},
    highlightedNodes: [newId],
    consoleOutput: pNode
      ? `[SUCCESS] BST insertion solved successfully! Node(${newValue}) is a child of Node(${pNode.value})`
      : `[SUCCESS] BST insertion solved successfully! Node(${newValue}) is a parentless root`
  });

  return snapshots;
}

export function generateBSTSearchSnapshots(
  initialTree: TreeNodeState[],
  target: number
): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const tree = initialTree.map(n => ({ ...n, highlighted: false, traversed: false }));
  const treeCopy = () => tree.map(n => ({ ...n }));

  // Pseudocode for search
  // 1: def search(root, key):
  // 2:   if root is None or root.val == key:
  // 3:     return root
  // 4:   if key < root.val:
  // 5:     return search(root.left, key)
  // 6:   return search(root.right, key)

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: `Initializing BST Search: searchBST(root, key=${target})`,
    treeState: treeCopy(),
    variables: { root: 50, key: target, current: 50 },
    consoleOutput: `[INFO] Initializing BST Search... Target key: ${target}`
  });

  let currId: string | null = '50';
  let found = false;

  while (currId) {
    const currNode = tree.find(n => n.id === currId);
    if (!currNode) break;

    currNode.traversed = true;
    currNode.highlighted = true;

    snapshots.push({
      lineHighlighted: 2,
      actionType: 'compare',
      explanation: `Evaluating: is current Node(${currNode.value}) null or equal to target Key (${target})?`,
      treeState: treeCopy(),
      variables: { current: currNode.value, key: target, compareResult: currNode.value === target ? 'MATCH' : 'NO MATCH' },
      highlightedNodes: [currId],
      consoleOutput: `[TRACE] Visiting Node(${currNode.value}). Evaluating search match.`
    });

    if (currNode.value === target) {
      found = true;
      snapshots.push({
        lineHighlighted: 3,
        actionType: 'found',
        explanation: `Target reached! Key (${target}) found in BST node!`,
        treeState: treeCopy(),
        variables: { key: target, found: 'true', nodeAddress: `@0x${currNode.value}A` },
        highlightedNodes: [currId],
        consoleOutput: `[SUCCESS] Target key ${target} found successfully at node reference address!`
      });
      break;
    }

    if (target < currNode.value) {
      snapshots.push({
        lineHighlighted: 4,
        actionType: 'compare',
        explanation: `Checking path: is key (${target}) < NodeValue (${currNode.value})? Yes! Traversing LEFT subtree.`,
        treeState: treeCopy(),
        variables: { key: target, current: currNode.value, next: 'left' },
        highlightedNodes: [currId],
        consoleOutput: `[TRACE] Key ${target} < Node(${currNode.value}). Traversing Left child pointer.`
      });
      currNode.highlighted = false;
      currId = currNode.leftId;
    } else {
      snapshots.push({
        lineHighlighted: 6,
        actionType: 'compare',
        explanation: `Checking path: is key (${target}) >= NodeValue (${currNode.value})? Yes! Traversing RIGHT subtree.`,
        treeState: treeCopy(),
        variables: { key: target, current: currNode.value, next: 'right' },
        highlightedNodes: [currId],
        consoleOutput: `[TRACE] Key ${target} >= Node(${currNode.value}). Traversing Right child pointer.`
      });
      currNode.highlighted = false;
      currId = currNode.rightId;
    }
  }

  if (!found) {
    snapshots.push({
      lineHighlighted: 3,
      actionType: 'not_found',
      explanation: `Branch node is null. Decisive failure: value ${target} is not in BST structure.`,
      treeState: treeCopy(),
      variables: { found: 'false' },
      consoleOutput: `[ERROR] Search key ${target} could not be located in Tree structure.`
    });
  }

  return snapshots;
}

export function generateBSTInorderSnapshots(
  initialTree: TreeNodeState[]
): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const tree = initialTree.map(n => ({ ...n, highlighted: false, traversed: false }));
  const treeCopy = () => tree.map(n => ({ ...n }));

  // 1: def inorder(root):
  // 2:   if root is None:
  // 3:     return
  // 4:   inorder(root.left)
  // 5:   print(root.val)
  // 6:   inorder(root.right)

  snapshots.push({
    lineHighlighted: 1,
    actionType: 'init',
    explanation: 'Initializing In-order Traversal (LVR: Left, Node, Right) sequentially',
    treeState: treeCopy(),
    variables: { index: 0 },
    consoleOutput: `[INFO] Starting In-order Traversal... DFS recursion tree mapping`
  });

  const path: number[] = [];

  function traverse(nodeId: string | null) {
    if (!nodeId) {
      snapshots.push({
        lineHighlighted: 2,
        actionType: 'compare',
        explanation: 'Encountered leaf child null pointer. Backtracking up.',
        treeState: treeCopy(),
        variables: { current: 'null' },
        consoleOutput: `[TRACE] Checked null leaf backtracking...`
      });
      return;
    }

    const node = tree.find(n => n.id === nodeId);
    if (!node) return;

    snapshots.push({
      lineHighlighted: 4,
      actionType: 'traverse',
      explanation: `Visiting Node(${node.value}). Diving LEFT child branch recursively`,
      treeState: treeCopy(),
      variables: { current: node.value, action: 'Left sweep' },
      highlightedNodes: [nodeId],
      consoleOutput: `[TRACE] Visiting node ${node.value}, diving left child: Node(${node.leftId || 'None'})`
    });
    traverse(node.leftId);

    // Node visit
    node.traversed = true;
    node.highlighted = true;
    path.push(node.value);

    snapshots.push({
      lineHighlighted: 5,
      actionType: 'traverse',
      explanation: `Processing Node(${node.value}). printing value to Output. Total Traversed array: [${path.join(', ')}]`,
      treeState: treeCopy(),
      variables: { current: node.value, result: `[${path.join(', ')}]` },
      highlightedNodes: [nodeId],
      consoleOutput: `[ACTIVE] Evaluating node ${node.value} (Leaf). Array outputs: [${path.join(', ')}]`
    });

    // Clear highlight immediately after processing so children focus correctly
    node.highlighted = false;

    snapshots.push({
      lineHighlighted: 6,
      actionType: 'traverse',
      explanation: `Diving RIGHT child branch recursively from Node(${node.value})`,
      treeState: treeCopy(),
      variables: { current: node.value, action: 'Right sweep' },
      highlightedNodes: [nodeId],
      consoleOutput: `[TRACE] Diving right child from Node(${node.value})`
    });
    traverse(node.rightId);
  }

  // Find root node dynamically (the node with no parents)
  let rootId = '50';
  if (tree.length > 0) {
    const leftIds = new Set(tree.map(n => n.leftId).filter(Boolean));
    const rightIds = new Set(tree.map(n => n.rightId).filter(Boolean));
    const rootNode = tree.find(n => !leftIds.has(n.id) && !rightIds.has(n.id));
    if (rootNode) {
      rootId = rootNode.id;
    } else {
      rootId = tree[0].id;
    }
  }

  traverse(rootId);

  snapshots.push({
    lineHighlighted: 3,
    actionType: 'done',
    explanation: `Traversal fully resolved! Accumulated ordered output: [${path.join(', ')}]`,
    treeState: treeCopy(),
    variables: { inorderPath: `[${path.join(', ')}]` },
    consoleOutput: `[SUCCESS] BST Traversal in-order complete! Result sequence: [${path.join(', ')}]`
  });

  return snapshots;
}
