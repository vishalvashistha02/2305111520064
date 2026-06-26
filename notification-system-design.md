# Notification System Design

## Overview
The Campus Notifications Microservice involves a secure authentication system, custom logging middleware, and a priority-based inbox for delivering time-sensitive and relevant updates to students.

## Priority Inbox Logic
The frontend filters and displays the most critical notifications using a Min-Heap based priority queue. 

### Priority Rules
1. **Type Precedence**: `Placement > Result > Event`
2. **Recency**: Newer notifications have higher priority than older ones of the same type.

### Implementation Approach
1. **Scoring Function**: Each notification is assigned a composite score.
   - Type maps to a primary base score (Placement: 3, Result: 2, Event: 1).
   - The timestamp is used as a tie-breaker.
   - `Score = (TypeScore * 1e13) + TimestampMillis`
2. **Min-Heap**: We maintain a Min-Heap of size `k=10`.
   - As we stream through notifications, we add them to the heap.
   - If the heap exceeds size `k`, we compare the new notification's score with the heap's root (which holds the smallest score in the top K).
   - If the new notification's score is higher, we pop the root and insert the new notification.
3. **Efficiency**: 
   - Time Complexity: `O(N log K)` where `N` is the total number of notifications and `K` is 10.
   - Space Complexity: `O(K)` for the heap storage.

This guarantees the user sees the most relevant and recent top 10 notifications immediately.
