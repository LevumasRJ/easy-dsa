import { describe, it, expect } from 'vitest';
import {
  generateTwoSumSnapshots,
  generateValidParenthesesSnapshots,
  generateReverseLinkedListSnapshots,
  generateBinarySearchSnapshots,
  generateBuySellStockSnapshots,
  generateContainerWithMostWaterSnapshots,
  generateInvertTreeSnapshots,
  generateGroupAnagramsSnapshots,
  generateThreeSumSnapshots,
  generateLongestSubstringSnapshots,
  generateMergeTwoListsSnapshots
} from '../src/leetcodeAlgorithms';

describe('LeetCode Engine Regression Unit Tests', () => {
  describe('Two Sum Snapshots', () => {
    it('should find pairs and return a correct done snapshot', () => {
      const result = generateTwoSumSnapshots([2, 7, 11, 15], 9);
      expect(result.length).toBeGreaterThan(0);
      const last = result[result.length - 1];
      expect(last.actionType).toBe('done');
      expect(last.variables?.answer).toBe('[0, 1]');
    });

    it('should return correct fail snapshot if no target exists', () => {
      const result = generateTwoSumSnapshots([3, 2, 4], 12);
      const last = result[result.length - 1];
      expect(last.actionType).toBe('not_found');
      expect(last.variables?.answer).toBe('[]');
    });
  });

  describe('Valid Parentheses Snapshots', () => {
    it('should validate correctly matching arrays', () => {
      const result = generateValidParenthesesSnapshots('()[]{}');
      const last = result[result.length - 1];
      expect(last.actionType).toBe('done');
      expect(last.variables?.isValid).toBe('true');
    });

    it('should reject non-matching brackets', () => {
      const result = generateValidParenthesesSnapshots('(]');
      const last = result[result.length - 1];
      expect(last.actionType).toBe('not_found'); // Mismatch returns 'not_found' immediately
      expect(last.variables?.result).toBe('false');
    });

    it('should reject unclosed brackets', () => {
      const result = generateValidParenthesesSnapshots('({[');
      const last = result[result.length - 1];
      expect(last.actionType).toBe('done'); // EOF loop with non-empty stack gives 'done' with isValid: 'false'
      expect(last.variables?.isValid).toBe('false');
    });
  });

  describe('Reverse Linked List Snapshots', () => {
    it('should reverse a standard list with nodes rewired backwards', () => {
      const result = generateReverseLinkedListSnapshots([10, 20, 30]);
      expect(result.length).toBeGreaterThan(0);
      
      const doneState = result.find(s => s.actionType === 'done');
      expect(doneState).toBeDefined();
      
      // Node values will be rewired. Let's look at next pointers
      const lastNodes = doneState?.linkedListState;
      expect(lastNodes).toHaveLength(3);
      
      const node30 = lastNodes?.find(n => n.value === 30);
      const node20 = lastNodes?.find(n => n.value === 20);
      const node10 = lastNodes?.find(n => n.value === 10);
      
      expect(node30?.nextId).toBe(node20?.id);
      expect(node20?.nextId).toBe(node10?.id);
      expect(node10?.nextId).toBeNull();
    });
  });

  describe('Binary Search Snapshots', () => {
    it('should locate index of existing target in sorted array', () => {
      const result = generateBinarySearchSnapshots([1, 2, 3, 4, 5], 4);
      const last = result[result.length - 1];
      expect(last.actionType).toBe('found');
      expect(last.variables?.return_idx).toBe(3);
    });

    it('should return -1 for non-existent targets', () => {
      const result = generateBinarySearchSnapshots([1, 2, 3, 4, 5], 99);
      const last = result[result.length - 1];
      expect(last.actionType).toBe('not_found');
      expect(last.variables?.return_val).toBe(-1);
    });
  });

  describe('Buy & Sell Stock Snapshots', () => {
    it('should determine max profit from stock pricing curve', () => {
      const result = generateBuySellStockSnapshots([7, 1, 5, 3, 6, 4]);
      const last = result[result.length - 1];
      expect(last.actionType).toBe('done');
      expect(last.variables?.final_max_profit).toBe(5); // Buy at 1, sell at 6
    });

    it('should return 0 max profit when prices strictly decrease', () => {
      const result = generateBuySellStockSnapshots([5, 4, 3, 2, 1]);
      const last = result[result.length - 1];
      expect(last.variables?.final_max_profit).toBe(0);
    });
  });

  describe('Container With Most Water Snapshots', () => {
    it('should identify optimal vertical heights for containment', () => {
      const result = generateContainerWithMostWaterSnapshots([1, 8, 6, 2, 5, 4, 8, 3, 7]);
      const last = result[result.length - 1];
      expect(last.actionType).toBe('done');
      expect(last.variables?.max_area).toBe(49);
    });
  });

  describe('Invert Binary Tree Snapshots', () => {
    it('should swap left and right subtrees for a small tree', () => {
      const result = generateInvertTreeSnapshots([4, 2, 7]);
      const doneState = result.find(s => s.actionType === 'done');
      expect(doneState).toBeDefined();

      const tree = doneState?.treeState;
      const root = tree?.find(n => n.value === 4);
      const leftNode = tree?.find(n => n.id === root?.leftId);
      const rightNode = tree?.find(n => n.id === root?.rightId);

      // Inverted, so 7 is on the left and 2 is on the right
      expect(leftNode?.value).toBe(7);
      expect(rightNode?.value).toBe(2);
    });
  });

  describe('Group Anagrams Snapshots', () => {
    it('should cluster strings into sorted anagram bins', () => {
      const result = generateGroupAnagramsSnapshots(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
      const last = result[result.length - 1];
      expect(last.actionType).toBe('done');
      
      const variableStr = String(last.variables?.result);
      expect(variableStr).toContain('eat');
      expect(variableStr).toContain('tan');
      expect(variableStr).toContain('bat');
    });
  });

  describe('Three Sum (3Sum) Snapshots', () => {
    it('should calculate unique triplets summing to zero', () => {
      const result = generateThreeSumSnapshots([-1, 0, 1, 2, -1, -4]);
      const last = result[result.length - 1];
      expect(last.actionType).toBe('done');
      
      const triplets = String(last.variables?.triplets);
      expect(triplets).toContain('[-1,-1,2]');
      expect(triplets).toContain('[-1,0,1]');
    });
  });

  describe('Longest Substring Snapshots', () => {
    it('should calculate longest unique sliding substring length', () => {
      const result = generateLongestSubstringSnapshots('abcabcbb');
      const last = result[result.length - 1];
      expect(last.variables?.max_len).toBe(3); // 'abc'
    });
  });

  describe('Merge Two Sorted Lists Snapshots', () => {
    it('should merge two small sorted arrays into a single linked list', () => {
      const result = generateMergeTwoListsSnapshots([1, 3], [2, 4]);
      const last = result[result.length - 1];
      expect(last.actionType).toBe('done');
      
      const listValues = String(last.variables?.merged).split(', ').map(Number);
      expect(listValues).toEqual([1, 2, 3, 4]);
    });
  });
});
