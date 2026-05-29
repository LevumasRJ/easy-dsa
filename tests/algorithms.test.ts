import { describe, it, expect } from 'vitest';
import {
  generateBubbleSortSnapshots,
  generateQuickSortSnapshots,
  generateListInsertSnapshots,
  generateListDeleteSnapshots,
  getBSTNodeCoordinates,
  generateBSTInsertSnapshots,
  generateBSTSearchSnapshots,
  generateBSTInorderSnapshots
} from '../src/algorithms';
import { LinkedListNodeState, TreeNodeState } from '../src/types';

describe('Singly LinkedList & Sorting Visualizer Core Engine', () => {
  describe('Bubble Sort Snapshot Generator', () => {
    it('should handle sorting an empty array', () => {
      const result = generateBubbleSortSnapshots([]);
      expect(result).toHaveLength(2); // 'init' and 'done'
      expect(result[0].actionType).toBe('init');
      expect(result[1].actionType).toBe('done');
      expect(result[1].arrayState).toEqual([]);
    });

    it('should handle a single element array', () => {
      const result = generateBubbleSortSnapshots([42]);
      expect(result).toHaveLength(2); // 'init' and 'done'
      expect(result[1].arrayState).toEqual([42]);
    });

    it('should correctly produce comparison and swap logs for an unsorted array', () => {
      const result = generateBubbleSortSnapshots([3, 1, 2]);
      expect(result.length).toBeGreaterThan(2);
      
      const lastSnapshot = result[result.length - 1];
      expect(lastSnapshot.actionType).toBe('done');
      expect(lastSnapshot.arrayState).toEqual([1, 2, 3]);

      // Verify that at least one action is a swap
      const swaps = result.filter(s => s.actionType === 'swap');
      expect(swaps.length).toBeGreaterThan(0);
    });
  });

  describe('Quick Sort Snapshot Generator', () => {
    it('should handle empty arrays gracefully', () => {
      const result = generateQuickSortSnapshots([]);
      expect(result[0].actionType).toBe('init');
      const lastSnapshot = result[result.length - 1];
      expect(lastSnapshot.arrayState).toEqual([]);
    });

    it('should correctly partition and sort an unsorted array', () => {
      const result = generateQuickSortSnapshots([5, 3, 8, 4]);
      const lastSnapshot = result[result.length - 1];
      expect(lastSnapshot.arrayState).toEqual([3, 4, 5, 8]);
    });
  });

  describe('Singly Linked List Splicing Snapshots', () => {
    const defaultList: LinkedListNodeState[] = [
      { id: '1', value: 10, nextId: '2' },
      { id: '2', value: 20, nextId: '3' },
      { id: '3', value: 30, nextId: null }
    ];

    it('should handle inserts into empty list as head', () => {
      const emptyList: LinkedListNodeState[] = [];
      const result = generateListInsertSnapshots(emptyList, 'any_id', 99);
      expect(result).toHaveLength(1);
      expect(result[0].actionType).toBe('done');
      expect(result[0].linkedListState?.[0].value).toBe(99);
    });

    it('should correctly insert in the middle of a non-empty list', () => {
      const result = generateListInsertSnapshots(defaultList, '2', 25);
      
      // We expect multiple phases: init -> check null -> insert (allocated) -> pointer_rewire 1 -> pointer_rewire 2 -> done
      const actions = result.map(s => s.actionType);
      expect(actions).toContain('init');
      expect(actions).toContain('compare');
      expect(actions).toContain('insert');
      expect(actions).toContain('pointer_rewire');
      expect(actions).toContain('done');

      const completed = result.find(s => s.actionType === 'done');
      const finalState = completed?.linkedListState;
      expect(finalState).toBeDefined();
      
      // List should now contain Node(25) placed between Node(20) and Node(30)
      const insertedNode = finalState?.find(n => n.value === 25);
      expect(insertedNode).toBeDefined();
      expect(insertedNode?.nextId).toBe('3');

      const node2 = finalState?.find(n => n.id === '2');
      expect(node2?.nextId).toBe('temp_node');
    });

    it('should return snapshots immediately if target node is invalid', () => {
      const result = generateListInsertSnapshots(defaultList, 'nonexistent_id', 42);
      // It will exit on the "prevNodeIsNull Check" returning the init/compare snapshots
      expect(result).toHaveLength(2);
      expect(result[1].actionType).toBe('compare');
    });
  });

  describe('Singly Linked List Deletion Snapshots', () => {
    const defaultList: LinkedListNodeState[] = [
      { id: '1', value: 100, nextId: '2' },
      { id: '2', value: 200, nextId: '3' },
      { id: '3', value: 300, nextId: null }
    ];

    it('should handle deleting from an empty list cleanly', () => {
      const emptyList: LinkedListNodeState[] = [];
      const result = generateListDeleteSnapshots(emptyList, 10);
      expect(result).toHaveLength(1);
      expect(result[0].actionType).toBe('done');
      expect(result[0].linkedListState).toEqual([]);
    });

    it('should support deleting the head node', () => {
      const result = generateListDeleteSnapshots(defaultList, 100);
      const doneState = result.find(s => s.actionType === 'done');
      expect(doneState?.linkedListState?.map(n => n.value)).toEqual([200, 300]);
    });

    it('should support deleting a middle node', () => {
      const result = generateListDeleteSnapshots(defaultList, 200);
      const doneState = result.find(s => s.actionType === 'done');
      expect(doneState?.linkedListState?.map(n => n.value)).toEqual([100, 300]);
    });

    it('should support deleting the tail node', () => {
      const result = generateListDeleteSnapshots(defaultList, 300);
      const doneState = result.find(s => s.actionType === 'done');
      expect(doneState?.linkedListState?.map(n => n.value)).toEqual([100, 200]);
    });

    it('should handle deleting non-existent target value', () => {
      const result = generateListDeleteSnapshots(defaultList, 999);
      const notFoundState = result.find(s => s.actionType === 'not_found');
      expect(notFoundState).toBeDefined();
      // Values remain unmodified
      expect(notFoundState?.linkedListState?.map(n => n.value)).toEqual([100, 200, 300]);
    });
  });

  describe('Binary Search Tree (BST) Coordinates Builder & Algorithmic Animators', () => {
    it('should compute coordinate maps successfully', () => {
      const rootCoords = getBSTNodeCoordinates('50');
      expect(rootCoords.x).toBe(300);
      expect(rootCoords.y).toBe(50);

      const randomCoords = getBSTNodeCoordinates('unknown_node_value_id');
      expect(randomCoords.x).toBeGreaterThan(0);
      expect(randomCoords.y).toBeGreaterThan(0);
    });

    it('should generate insertion snapshots for BST', () => {
      const tree: TreeNodeState[] = [
        { id: '50', value: 50, leftId: null, rightId: null, x: 300, y: 50 }
      ];
      // Insert value 30
      const result = generateBSTInsertSnapshots(tree, 30);
      expect(result.length).toBeGreaterThan(0);

      // Verify final snapshot includes the child
      const doneSnapshot = result[result.length - 1];
      expect(doneSnapshot.treeState).toHaveLength(2);
      const root = doneSnapshot.treeState?.find(n => n.id === '50');
      expect(root?.leftId).toBe('30');
    });

    it('should generate binary search snapshots for BST', () => {
      const tree: TreeNodeState[] = [
        { id: '50', value: 50, leftId: '30', rightId: '70', x: 300, y: 50 },
        { id: '30', value: 30, leftId: null, rightId: null, x: 200, y: 150 },
        { id: '70', value: 70, leftId: null, rightId: null, x: 400, y: 150 }
      ];
      const searchFound = generateBSTSearchSnapshots(tree, 30);
      expect(searchFound.some(s => s.actionType === 'found')).toBe(true);

      const searchNotFound = generateBSTSearchSnapshots(tree, 99);
      expect(searchNotFound.some(s => s.actionType === 'not_found')).toBe(true);
    });

    it('should generate inorder traversal snapshots', () => {
      const tree: TreeNodeState[] = [
        { id: '50', value: 50, leftId: '30', rightId: null, x: 300, y: 50 },
        { id: '30', value: 30, leftId: null, rightId: null, x: 200, y: 150 }
      ];
      const result = generateBSTInorderSnapshots(tree);
      expect(result.length).toBeGreaterThan(0);
      
      const lastTrace = result[result.length - 1];
      expect(lastTrace.actionType).toBe('done');
    });
  });
});
