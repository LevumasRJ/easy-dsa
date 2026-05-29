import { CodeLanguage } from './types';

export interface CodeLine {
  text: string;
  indent: number;
}

export type SnippetsRegistry = Record<
  string, // algorithm name
  Record<CodeLanguage, CodeLine[]>
>;

export const CODE_SNIPPETS: SnippetsRegistry = {
  bubblesort: {
    javascript: [
      { text: '// Empty placeholder for synchrony', indent: 0 },
      { text: 'function bubbleSort(arr) {', indent: 0 },
      { text: '  let n = arr.length;', indent: 0 },
      { text: '  for (let i = 0; i < n; i++) {', indent: 0 },
      { text: '    for (let j = 0; j < n - i - 1; j++) {', indent: 1 },
      { text: '      if (arr[j] > arr[j+1]) {', indent: 2 },
      { text: '        let temp = arr[j];', indent: 3 },
      { text: '        arr[j] = arr[j+1];', indent: 3 },
      { text: '        arr[j+1] = temp;', indent: 3 },
      { text: '      }', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '  }', indent: 0 },
      { text: '}', indent: 0 }
    ],
    python: [
      { text: '# Empty placeholder for synchrony', indent: 0 },
      { text: 'def bubble_sort(arr):', indent: 0 },
      { text: '    n = len(arr)', indent: 1 },
      { text: '    for i in range(n):', indent: 1 },
      { text: '        for j in range(0, n - i - 1):', indent: 2 },
      { text: '            if arr[j] > arr[j + 1]:', indent: 3 },
      { text: '                temp = arr[j]', indent: 4 },
      { text: '                arr[j] = arr[j + 1]', indent: 4 },
      { text: '                arr[j + 1] = temp', indent: 4 },
      { text: '            # endif', indent: 3 },
      { text: '        # end j-loop', indent: 2 },
      { text: '    # end i-loop', indent: 1 },
      { text: '# end func', indent: 0 }
    ],
    cpp: [
      { text: '// Empty placeholder for synchrony', indent: 0 },
      { text: 'void bubbleSort(vector<int>& arr) {', indent: 0 },
      { text: '    int n = arr.size();', indent: 1 },
      { text: '    for (int i = 0; i < n; ++i) {', indent: 1 },
      { text: '        for (int j = 0; j < n - i - 1; ++j) {', indent: 2 },
      { text: '            if (arr[j] > arr[j+1]) {', indent: 3 },
      { text: '                int temp = arr[j];', indent: 4 },
      { text: '                arr[j] = arr[j+1];', indent: 4 },
      { text: '                arr[j+1] = temp;', indent: 4 },
      { text: '            }', indent: 3 },
      { text: '        }', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '}', indent: 0 }
    ],
    java: [
      { text: '// Empty placeholder for synchrony', indent: 0 },
      { text: 'public void bubbleSort(int[] arr) {', indent: 0 },
      { text: '    int n = arr.length;', indent: 1 },
      { text: '    for (int i = 0; i < n; i++) {', indent: 1 },
      { text: '        for (int j = 0; j < n - i - 1; j++) {', indent: 2 },
      { text: '            if (arr[j] > arr[j+1]) {', indent: 3 },
      { text: '                int temp = arr[j];', indent: 4 },
      { text: '                arr[j] = arr[j+1];', indent: 4 },
      { text: '                arr[j+1] = temp;', indent: 4 },
      { text: '            }', indent: 3 },
      { text: '        }', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '}', indent: 0 }
    ]
  },
  quicksort: {
    javascript: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'function quickSort(arr, low, high) {', indent: 0 },
      { text: '  if (low < high) {', indent: 1 },
      { text: '    let pi = partition(arr, low, high);', indent: 2 },
      { text: '    quickSort(arr, low, pi - 1);', indent: 2 },
      { text: '    quickSort(arr, pi + 1, high);', indent: 2 },
      { text: '  }', indent: 1 },
      { text: '}', indent: 0 },
      { text: 'function partition(arr, low, high) {', indent: 0 },
      { text: '  let pivot = arr[high]; let i = low - 1;', indent: 1 },
      { text: '  for (let j = low; j < high; j++) {', indent: 1 },
      { text: '    if (arr[j] < pivot) {', indent: 2 },
      { text: '      i++; [arr[i], arr[j]] = [arr[j], arr[i]];', indent: 3 },
      { text: '    }', indent: 2 },
      { text: '  }', indent: 1 },
      { text: '  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];', indent: 1 },
      { text: '  return i + 1;', indent: 1 },
      { text: '}', indent: 0 }
    ],
    python: [
      { text: '# Spacer line 0', indent: 0 },
      { text: 'def quick_sort(arr, low, high):', indent: 0 },
      { text: '    if low < high:', indent: 1 },
      { text: '        pi = partition(arr, low, high)', indent: 2 },
      { text: '        quick_sort(arr, low, pi - 1)', indent: 2 },
      { text: '        quick_sort(arr, pi + 1, high)', indent: 2 },
      { text: '    # endif', indent: 1 },
      { text: '# end func', indent: 0 },
      { text: 'def partition(arr, low, high):', indent: 0 },
      { text: '    pivot = arr[high]; i = low - 1', indent: 1 },
      { text: '    for j in range(low, high):', indent: 1 },
      { text: '        if arr[j] < pivot:', indent: 2 },
      { text: '            i += 1; arr[i], arr[j] = arr[j], arr[i]', indent: 3 },
      { text: '        # endif', indent: 2 },
      { text: '    # endfor', indent: 1 },
      { text: '    arr[i + 1], arr[high] = arr[high], arr[i + 1]', indent: 1 },
      { text: '    return i + 1', indent: 1 },
      { text: '# end func', indent: 0 }
    ],
    cpp: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'void quickSort(int arr[], int low, int high) {', indent: 0 },
      { text: '    if (low < high) {', indent: 1 },
      { text: '        int pi = partition(arr, low, high);', indent: 2 },
      { text: '        quickSort(arr, low, pi - 1);', indent: 2 },
      { text: '        quickSort(arr, pi + 1, high);', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '}', indent: 0 },
      { text: 'int partition(int arr[], int low, int high) {', indent: 0 },
      { text: '    int pivot = arr[high]; int i = low - 1;', indent: 1 },
      { text: '    for (int j = low; j < high; ++j) {', indent: 1 },
      { text: '        if (arr[j] < pivot) {', indent: 2 },
      { text: '            swap(&arr[++i], &arr[j]);', indent: 3 },
      { text: '        }', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    swap(&arr[i + 1], &arr[high]);', indent: 1 },
      { text: '    return (i + 1);', indent: 1 },
      { text: '}', indent: 0 }
    ],
    java: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'public void quickSort(int[] arr, int low, int high) {', indent: 0 },
      { text: '    if (low < high) {', indent: 1 },
      { text: '        int pi = partition(arr, low, high);', indent: 2 },
      { text: '        quickSort(arr, low, pi - 1);', indent: 2 },
      { text: '        quickSort(arr, pi + 1, high);', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '}', indent: 0 },
      { text: 'public int partition(int[] arr, int low, int high) {', indent: 0 },
      { text: '    int pivot = arr[high]; int i = low - 1;', indent: 1 },
      { text: '    for (int j = low; j < high; j++) {', indent: 1 },
      { text: '        if (arr[j] < pivot) {', indent: 2 },
      { text: '            i++; int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;', indent: 3 },
      { text: '        }', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;', indent: 1 },
      { text: '    return i + 1;', indent: 1 },
      { text: '}', indent: 0 }
    ]
  },
  insertAfter: {
    javascript: [
      { text: 'function insertAfter(prevNode, newData) {', indent: 0 },
      { text: '  if (prevNode === null) {', indent: 1 },
      { text: '    console.log("Previous node cannot be null");', indent: 2 },
      { text: '    return;', indent: 2 },
      { text: '  }', indent: 1 },
      { text: '  // Spacer inline', indent: 0 },
      { text: '  let newNode = new Node(newData);', indent: 1 },
      { text: '  newNode.next = prevNode.next;', indent: 1 },
      { text: '  prevNode.next = newNode;', indent: 1 },
      { text: '}', indent: 0 }
    ],
    python: [
      { text: 'def insert_after(prev_node, new_data):', indent: 0 },
      { text: '    if prev_node is None:', indent: 1 },
      { text: '        print("Previous node cannot be None")', indent: 2 },
      { text: '        return', indent: 2 },
      { text: '    # endif', indent: 1 },
      { text: '    # Spacer list', indent: 0 },
      { text: '    new_node = Node(new_data)', indent: 1 },
      { text: '    new_node.next = prev_node.next', indent: 1 },
      { text: '    prev_node.next = new_node', indent: 1 },
      { text: '# end func', indent: 0 }
    ],
    cpp: [
      { text: 'void insertAfter(Node* prev_node, int new_data) {', indent: 0 },
      { text: '    if (prev_node == nullptr) {', indent: 1 },
      { text: '        cout << "Previous node cannot be NULL";', indent: 2 },
      { text: '        return;', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    // Spacer code', indent: 0 },
      { text: '    Node* new_node = new Node(new_data);', indent: 1 },
      { text: '    new_node->next = prev_node->next;', indent: 1 },
      { text: '    prev_node->next = new_node;', indent: 1 },
      { text: '}', indent: 0 }
    ],
    java: [
      { text: 'public void insertAfter(Node prevNode, int newData) {', indent: 0 },
      { text: '    if (prevNode == null) {', indent: 1 },
      { text: '        System.out.println("Previous node cannot be null");', indent: 2 },
      { text: '        return;', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    // Spacer code', indent: 0 },
      { text: '    Node newNode = new Node(newData);', indent: 1 },
      { text: '    newNode.next = prevNode.next;', indent: 1 },
      { text: '    prevNode.next = newNode;', indent: 1 },
      { text: '}', indent: 0 }
    ]
  },
  deleteNode: {
    javascript: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'function deleteNode(head, target) {', indent: 0 },
      { text: '  let current = head; let prev = null;', indent: 1 },
      { text: '  while (current !== null) {', indent: 1 },
      { text: '    if (current.value === target) {', indent: 2 },
      { text: '      if (prev !== null) { prev.next = current.next; }', indent: 3 },
      { text: '      else { head = current.next; }', indent: 3 },
      { text: '      return;', indent: 3 },
      { text: '    }', indent: 2 },
      { text: '    prev = current; current = current.next;', indent: 2 },
      { text: '  }', indent: 1 },
      { text: '}', indent: 0 }
    ],
    python: [
      { text: '# Spacer line 0', indent: 0 },
      { text: 'def delete_node(head, target):', indent: 0 },
      { text: '    current = head; prev = None', indent: 1 },
      { text: '    while current is not None:', indent: 1 },
      { text: '        if current.value == target:', indent: 2 },
      { text: '            if prev is not None: prev.next = current.next', indent: 3 },
      { text: '            else: head = current.next', indent: 3 },
      { text: '            return', indent: 3 },
      { text: '        # endif', indent: 2 },
      { text: '        prev = current; current = current.next', indent: 2 },
      { text: '    # end while', indent: 1 },
      { text: '# end func', indent: 0 }
    ],
    cpp: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'void deleteNode(Node*& head, int target) {', indent: 0 },
      { text: '    Node* current = head; Node* prev = nullptr;', indent: 1 },
      { text: '    while (current != nullptr) {', indent: 1 },
      { text: '        if (current->value == target) {', indent: 2 },
      { text: '            if (prev != nullptr) { prev->next = current->next; }', indent: 3 },
      { text: '            else { head = current->next; }', indent: 3 },
      { text: '            return;', indent: 3 },
      { text: '        }', indent: 2 },
      { text: '        prev = current; current = current->next;', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '}', indent: 0 }
    ],
    java: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'public void deleteNode(Node head, int target) {', indent: 0 },
      { text: '    Node current = head; Node prev = null;', indent: 1 },
      { text: '    while (current != null) {', indent: 1 },
      { text: '        if (current.value == target) {', indent: 2 },
      { text: '            if (prev != null) { prev.next = current.next; }', indent: 3 },
      { text: '            else { head = current.next; }', indent: 3 },
      { text: '            return;', indent: 3 },
      { text: '        }', indent: 2 },
      { text: '        prev = current; current = current.next;', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '}', indent: 0 }
    ]
  },
  insertBST: {
    javascript: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'function insertBST(root, val) {', indent: 0 },
      { text: '  if (root === null) {', indent: 1 },
      { text: '    return new TreeNode(val);', indent: 2 },
      { text: '  }', indent: 1 },
      { text: '  if (val < root.value) {', indent: 1 },
      { text: '    root.left = insertBST(root.left, val);', indent: 2 },
      { text: '  } else {', indent: 1 },
      { text: '    root.right = insertBST(root.right, val);', indent: 2 },
      { text: '  }', indent: 1 },
      { text: '  return root;', indent: 1 },
      { text: '}', indent: 0 }
    ],
    python: [
      { text: '# Spacer line 0', indent: 0 },
      { text: 'def insert_bst(root, val):', indent: 0 },
      { text: '    if root is None:', indent: 1 },
      { text: '        return TreeNode(val)', indent: 2 },
      { text: '    # endif', indent: 1 },
      { text: '    if val < root.value:', indent: 1 },
      { text: '        root.left = insert_bst(root.left, val)', indent: 2 },
      { text: '    else:', indent: 1 },
      { text: '        root.right = insert_bst(root.right, val)', indent: 2 },
      { text: '    # endif', indent: 1 },
      { text: '    return root', indent: 1 },
      { text: '# end func', indent: 0 }
    ],
    cpp: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'TreeNode* insertBST(TreeNode* root, int val) {', indent: 0 },
      { text: '    if (root == nullptr) {', indent: 1 },
      { text: '        return new TreeNode(val);', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    if (val < root->value) {', indent: 1 },
      { text: '        root->left = insertBST(root->left, val);', indent: 2 },
      { text: '    } else {', indent: 1 },
      { text: '        root->right = insertBST(root->right, val);', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    return root;', indent: 1 },
      { text: '}', indent: 0 }
    ],
    java: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'public TreeNode insertBST(TreeNode root, int val) {', indent: 0 },
      { text: '    if (root == null) {', indent: 1 },
      { text: '        return new TreeNode(val);', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    if (val < root.value) {', indent: 1 },
      { text: '        root.left = insertBST(root.left, val);', indent: 2 },
      { text: '    } else {', indent: 1 },
      { text: '        root.right = insertBST(root.right, val);', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    return root;', indent: 1 },
      { text: '}', indent: 0 }
    ]
  },
  searchBST: {
    javascript: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'function searchBST(root, key) {', indent: 0 },
      { text: '  if (root === null || root.value === key) {', indent: 1 },
      { text: '    return root;', indent: 2 },
      { text: '  }', indent: 1 },
      { text: '  if (key < root.value) {', indent: 1 },
      { text: '    return searchBST(root.left, key);', indent: 2 },
      { text: '  }', indent: 1 },
      { text: '  return searchBST(root.right, key);', indent: 2 },
      { text: '}', indent: 0 }
    ],
    python: [
      { text: '# Spacer line 0', indent: 0 },
      { text: 'def search_bst(root, key):', indent: 0 },
      { text: '    if root is None or root.value == key:', indent: 1 },
      { text: '        return root', indent: 2 },
      { text: '    # endif', indent: 1 },
      { text: '    if key < root.value:', indent: 1 },
      { text: '        return search_bst(root.left, key)', indent: 2 },
      { text: '    # endif', indent: 1 },
      { text: '    return search_bst(root.right, key)', indent: 1 },
      { text: '# end func', indent: 0 }
    ],
    cpp: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'TreeNode* searchBST(TreeNode* root, int key) {', indent: 0 },
      { text: '    if (root == nullptr || root->value == key) {', indent: 1 },
      { text: '        return root;', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    if (key < root->value) {', indent: 1 },
      { text: '        return searchBST(root->left, key);', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    return searchBST(root->right, key);', indent: 1 },
      { text: '}', indent: 0 }
    ],
    java: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'public TreeNode searchBST(TreeNode root, int key) {', indent: 0 },
      { text: '    if (root == null || root.value == key) {', indent: 1 },
      { text: '        return root;', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    if (key < root.value) {', indent: 1 },
      { text: '        return searchBST(root.left, key);', indent: 2 },
      { text: '    }', indent: 4 },
      { text: '    return searchBST(root.right, key);', indent: 1 },
      { text: '}', indent: 0 }
    ]
  },
  inorderBST: {
    javascript: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'function inorder(root) {', indent: 0 },
      { text: '  if (root === null) {', indent: 1 },
      { text: '    return;', indent: 2 },
      { text: '  }', indent: 1 },
      { text: '  inorder(root.left);', indent: 1 },
      { text: '  console.log(root.value);', indent: 1 },
      { text: '  inorder(root.right);', indent: 1 },
      { text: '}', indent: 0 }
    ],
    python: [
      { text: '# Spacer line 0', indent: 0 },
      { text: 'def inorder(root):', indent: 0 },
      { text: '    if root is None:', indent: 1 },
      { text: '        return', indent: 2 },
      { text: '    # endif', indent: 1 },
      { text: '    inorder(root.left)', indent: 1 },
      { text: '    print(root.value)', indent: 1 },
      { text: '    inorder(root.right)', indent: 1 },
      { text: '# end func', indent: 0 }
    ],
    cpp: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'void inorder(TreeNode* root) {', indent: 0 },
      { text: '    if (root == nullptr) {', indent: 1 },
      { text: '        return;', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    inorder(root->left);', indent: 1 },
      { text: '    cout << root->value << endl;', indent: 1 },
      { text: '    inorder(root->right);', indent: 1 },
      { text: '}', indent: 0 }
    ],
    java: [
      { text: '// Spacer line 0', indent: 0 },
      { text: 'public void inorder(TreeNode root) {', indent: 0 },
      { text: '    if (root == null) {', indent: 1 },
      { text: '        return;', indent: 2 },
      { text: '    }', indent: 1 },
      { text: '    inorder(root.left);', indent: 1 },
      { text: '    System.out.println(root.value);', indent: 1 },
      { text: '    inorder(root.right);', indent: 1 },
      { text: '}', indent: 0 }
    ]
  }
};
