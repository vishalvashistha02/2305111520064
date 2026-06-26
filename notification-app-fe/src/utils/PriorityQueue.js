/**
 * Priority mapping for notification types
 */
const PriorityMap = {
  placement: 3,
  result: 2,
  event: 1
};

/**
 * Calculates a composite score for a notification.
 * Higher score means higher priority.
 */
export const calculateScore = (notification) => {
  const typeScore = PriorityMap[notification.type?.toLowerCase()] || 0;
  const timestamp = new Date(notification.createdAt).getTime();
  // We use a large multiplier so that type is the primary sort key, and timestamp is secondary
  // Assuming timestamp is in milliseconds and fits in Number.MAX_SAFE_INTEGER
  return typeScore * 10000000000000 + timestamp;
};

/**
 * MinHeap implementation to keep the top K elements
 */
class MinHeap {
  constructor(compareFn) {
    this.heap = [];
    this.compareFn = compareFn;
  }

  getLeftChildIndex(parentIndex) { return 2 * parentIndex + 1; }
  getRightChildIndex(parentIndex) { return 2 * parentIndex + 2; }
  getParentIndex(childIndex) { return Math.floor((childIndex - 1) / 2); }

  hasLeftChild(index) { return this.getLeftChildIndex(index) < this.heap.length; }
  hasRightChild(index) { return this.getRightChildIndex(index) < this.heap.length; }
  hasParent(index) { return this.getParentIndex(index) >= 0; }

  leftChild(index) { return this.heap[this.getLeftChildIndex(index)]; }
  rightChild(index) { return this.heap[this.getRightChildIndex(index)]; }
  parent(index) { return this.heap[this.getParentIndex(index)]; }

  swap(indexOne, indexTwo) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  peek() {
    if (this.heap.length === 0) return null;
    return this.heap[0];
  }

  add(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  poll() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const item = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return item;
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (this.hasParent(index) && this.compareFn(this.heap[index], this.parent(index)) < 0) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (this.hasRightChild(index) && this.compareFn(this.rightChild(index), this.leftChild(index)) < 0) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.compareFn(this.heap[index], this.heap[smallerChildIndex]) < 0) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  size() {
    return this.heap.length;
  }

  toArray() {
    return [...this.heap];
  }
}

/**
 * Finds the top N notifications using a min-heap.
 * @param {Array} notifications - List of notifications
 * @param {number} k - Number of top notifications to return
 * @returns {Array} - Top k notifications sorted in descending order of priority
 */
export const getTopNotifications = (notifications, k = 10) => {
  if (!notifications || notifications.length === 0) return [];
  
  // compareFn: if a < b, it should return negative (so a goes higher up in min heap)
  // For min-heap, we want the SMALLEST of the top K elements at the root.
  // So smaller score means smaller element.
  const minHeap = new MinHeap((a, b) => {
    return calculateScore(a) - calculateScore(b);
  });

  for (const notif of notifications) {
    if (minHeap.size() < k) {
      minHeap.add(notif);
    } else {
      const root = minHeap.peek();
      if (calculateScore(notif) > calculateScore(root)) {
        minHeap.poll();
        minHeap.add(notif);
      }
    }
  }

  // Extract all elements and sort descending
  const topK = [];
  while (minHeap.size() > 0) {
    topK.push(minHeap.poll());
  }

  // minHeap gives smallest first, we reverse it to get largest first
  return topK.reverse();
};
