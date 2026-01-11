# System Design Decision Guide

A cheat sheet for choosing the right distributed system pattern.

## Rate Limiting

| Algorithm | Pros | Cons | Best For |
|-----------|------|------|----------|
| **Token Bucket** | Handles bursts, memory efficient | Complex refilling logic | API Implementation |
| **Leaky Bucket** | Constant outflow rate | Drops bursts | Packet switching / Nginx |
| **Fixed Window** | Simple | Border cases (2x load) | Basic DoS protection |
| **Sliding Window** | Smoothest | High memory cost | Strict quota enforcement |

### Decision Tree
- Need to allow short bursts? -> **Token Bucket**
- Need to smooth out traffic spike? -> **Leaky Bucket**
- Need strict exact limits? -> **Sliding Window Log**

---

## Caching Strategy (Consistent Hashing)

When to use **Consistent Hashing** vs **Modulo Hashing**?

```mermaid
graph TD
    A[Add/Remove Cache Node] -->|Modulo Hashing| B[Almost ALL keys remapped]
    A -->|Consistent Hashing| C[Only K/N keys remapped]
    B --> D[Cache Stampede (DB Overload)]
    C --> E[Minimal Impact]
```

**Rule of Thumb**: If your node count changes (auto-scaling, failures), ALWAYS use Consistent Hashing.

---

## Circuit Breaker States

| State | Behavior | Next Transition |
|-------|----------|-----------------|
| **CLOSED** | All requests go through | -> **OPEN** (if Failure Threshold met) |
| **OPEN** | Fails fast (no requests) | -> **HALF_OPEN** (after Timeout) |
| **HALF_OPEN** | Testing (1 request) | -> **CLOSED** (Success) or **OPEN** (Failure) |

**Why?** To prevent "Fail Storms". If Service A is down, Service B should stop calling it to let it recover.

---

## Log-Structured Merge Tree (LSM) vs B+ Tree

| Feature | LSM Tree (Cassandra/RocksDB) | B+ Tree (MySQL/Postgres) |
|---------|------------------------------|--------------------------|
| **Write Speed** | 🚀 High (Append only) | Low (Random disk I/O) |
| **Read Speed** | Moderate (Check MemTable -> SSTables) | 🚀 High (Direct lookup) |
| **Compaction** | Required (Merge SSTables) | Not required |
| **Best For** | Write-heavy workloads (Logs, Chat, IoT) | Read-heavy workloads |
