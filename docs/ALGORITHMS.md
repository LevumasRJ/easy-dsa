# 📚 AlgoFlow Computational Algorithms Reference

This document covers the theoretical foundations, implementation methodologies, visual representations, and complexity ratings of the algorithms within **AlgoFlow**.

---

## 📅 Summary Matrix of Complexity and Visuals

| Algorithm | Category | Best Time | Avg Time | Worst Time | Space | Core Visual Elements |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Two Sum** | Arrays & Hashing | $O(1)$ | $O(N)$ | $O(N)$ | $O(N)$ | Complement highlight, HashMap keys/values |
| **Group Anagrams** | Arrays & Hashing | $O(N \cdot K \log K)$ | $O(N \cdot K \log K)$ | $O(N \cdot K \log K)$ | $O(N \cdot K)$ | Sorting visualizer, Dynamic bucket columns |
| **3Sum** | Two Pointers | $O(N^2)$ | $O(N^2)$ | $O(N^2)$ | $O(N)$ or $O(\log N)$ | Boundary pointers ($i$, $L$, $R$), Sorted tape |
| **Container With Water** | Two Pointers | $O(N)$ | $O(N)$ | $O(N)$ | $O(1)$ | Dual pointers ($L$, $R$), Area volume bar |
| **Valid Parentheses** | Stack | $O(N)$ | $O(N)$ | $O(N)$ | $O(N)$ | Vertical stack frame, bracket pop transition |
| **Binary Search** | Binary Search | $O(1)$ | $O(\log N)$ | $O(\log N)$ | $O(1)$ | $L$, $R$ and $M$ pointer indicators, sector halving |
| **Buy & Sell Stock** | Sliding Window | $O(N)$ | $O(N)$ | $O(N)$ | $O(1)$ | Buy day anchor, sell tracker, profit accumulator |
| **Longest Substring** | Sliding Window | $O(N)$ | $O(N)$ | $O(N)$ | $O(\min(M, N))$ | Dynamic window highlight, HashSet watcher |
| **Reverse Linked List** | Linked List | $O(N)$ | $O(N)$ | $O(N)$ | $O(1)$ | Inline node pointer rewiring transitions |
| **Merge Two Sorted Lists** | Linked List | $O(N + M)$ | $O(N + M)$ | $O(N + M)$ | $O(1)$ | Two head pointers ($p1$, $p2$), growing output ribbon |
| **Bubble Sort** | Sorting | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | Horizontal bars, active swap swap indices |
| **Quick Sort** | Sorting | $O(N \log N)$ | $O(N \log N)$ | $O(N^2)$ | $O(\log N)$ | Pivot selection indicator, partition groupings |
| **BST Operations** | Trees | $O(\log N)$ | $O(\log N)$ | $O(N)$ | $O(H)$ | Inter-connected parent-subtree coordinates |

---

## 📂 Category-by-Category Algorithm Analysis

### 1. Arrays & Hashing

#### Two Sum
* **Concept**: Finds two numbers in an array that add up to a target number.
* **Mechanism**: Cycles through elements, calculating the complement value (`target - nums[i]`). It checks a hash map for this complement. If found, it returns the indices; if not, it stores the current number and index in the map.
* **Visualization Highlights**: Highlights the current scanning element in blue, reveals the calculated complement, and animates its lookup in the HashMap watchlist.

#### Group Anagrams
* **Concept**: Groups words that are composed of the exact same characters in different orders.
* **Mechanism**: Loops through the word list. It sorts each word's characters alphabetically to serve as a consistent key (e.g., `"eat"` and `"tea"` both sort to `"aet"`). Words with the same sorted key are grouped into the same hashing bucket.
* **Visualization Highlights**: Shows each word being examined and sorted, and dynamically expands the HashMap buckets column in real-time.

---

### 2. Two Pointers

#### 3Sum
* **Concept**: Identifies all unique triplets in an array summing to exactly zero ($0$).
* **Mechanism**: Sorts the array. It uses a loop anchor ($i$), and sets two pointers ($L = i+1$ and $R = \text{last\_index}$). If the sum is too small, it increments $L$; if too large, it decrements $R$. When a triplet is found, it logs it and advances pointers past duplicates.
* **Visualization Highlights**: Color-coded indices (blue for $i$, green for $L$, red for $R$) move along the sorted array. It displays the current equation evaluation and lists valid triplets.

#### Container With Most Water
* **Concept**: Finds two lines that contain the maximum amount of water.
* **Mechanism**: Sets pointers at both ends of the elements tape (`L` and `R`). It calculates the area bounds ($\min(\text{height}[L], \text{height}[R]) \times (R - L)$) and updates the maximum volume. It then shifts the pointer tracking the shorter column inward.
* **Visualization Highlights**: Pointers scan inward, and the vertical container lines are drawn on-screen alongside real-time coordinate calculations.

---

### 3. Stack

#### Valid Parentheses
* **Concept**: Validates if open brackets are closed correctly and in the correct order.
* **Mechanism**: Loops through characters. It pushes open characters `(`, `{`, `[` onto a stack. When a closing character is met, it pops from the stack and checks if it matches.
* **Visualization Highlights**: Displays a physical stack container. Floating brackets slide in and out of the stack, matching characters in real-time.

---

### 4. Binary Search

#### Standard Binary Search
* **Concept**: Efficiently searches a sorted array in logarithmic time.
* **Mechanism**: Maintains pointers $L$ and $R$. It calculates the midpoint $M = L + \frac{R-L}{2}$. If $\text{nums}[M] < \text{target}$, it shifts $L = M + 1$; if larger, it shifts $R = M - 1$.
* **Visualization Highlights**: Fades out excluded array sectors, highlighting the midpoint indicator as limits adjust dynamically.

---

### 5. Sliding Window

#### Best Time to Buy & Sell Stock
* **Concept**: Evaluates optimal buying and selling days to maximize profit.
* **Mechanism**: Maintains a left buying pointer `L` and right selling pointer `R`. If the price on day `R` is cheaper than day `L`, it updates the buying day `L = R`. Otherwise, it calculates the profit on day `R` and tracks the maximum.
* **Visualization Highlights**: Visualizes the active transaction interval on a transaction ledger, showing day trades and profits.

#### Longest Substring Without Repeating Characters
* **Concept**: Identifies the length of the longest substring containing only unique characters.
* **Mechanism**: Uses a sliding window defined by boundaries `L` and `R`. If the scanned character `s[R]` exists in a set, it shrinks the window by deleting `s[L]` and moving `L` forward. It then adds the character and records the maximum width.
* **Visualization Highlights**: Highlights the sliding window sub-sequence, displaying characters in the active set container.

---

### 6. Linked Lists

#### Reverse Linked List
* **Concept**: Reverses the direction of pointers in a singly linked list.
* **Mechanism**: Iteratively updates node references using three pointers: `prev`, `curr`, and `next`. It redirects `curr.next` to point to `prev`, and shifts variables forward.
* **Visualization Highlights**: Arrows between circular nodes dynamically detach and point in reverse as pointers move forward.

#### Merge Two Sorted Lists
* **Concept**: Combines two sorted lists into a single sorted list.
* **Mechanism**: Compares elements at the head of both lists (`p1` and `p2`), choosing the smaller element to append to a new list. It advances the pointer of the chosen node.
* **Visualization Highlights**: Side-by-side linked nodes comparison highlights, showing cursors moving and items merging onto a central ribbon.
