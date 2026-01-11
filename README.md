# Backend Design Patterns

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%23007ACC.svg)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

Production-grade, zero-dependency implementations of core distributed system patterns in TypeScript.

Designed for engineers who need clean, reference implementations without the bloat of heavy frameworks.

## Patterns

### [Consistent Hashing](./src/consistent-hashing)
A ring-based consistent hashing implementation with virtual nodes.
- **Complexity**: O(log N) lookup.
- **Use Case**: Sharding data across distributed caches or databases.

### [Token Bucket Rate Limiter](./src/rate-limiter)
High-performance lazy-refill token bucket.
- **Features**: Burst support, thread-safe logic (for Node.js event loop).
- **Use Case**: API rate limiting, traffic shaping.

### [Circuit Breaker](./src/circuit-breaker)
Robust state machine for fault tolerance.
- **States**: `CLOSED` -> `OPEN` -> `HALF_OPEN`
- **Use Case**: preventing cascading failures in microservices.

### [Bloom Filter](./src/bloom-filter)
Probabilistic data structure for space-efficient set membership.
- **Complexity**: O(k) for add/check (k = hash count).
- **Use Case**: Caches (filtering non-existent keys), Web Crawlers (visited URLs).

### [LSM Tree](./src/lsm-tree)
Log-Structured Merge Tree basics (MemTable + SSTable).
- **Complexity**: O(log N) write, O(read_amplification) read.
- **Use Case**: Write-heavy databases (Cassandra, RocksDB).

## System Design Guide
We included a [cheat sheet](./docs/SYSTEM_DESIGN.md) for choosing the right pattern in interviews.

### Installation

```bash
npm install @yurtzy/backend-design-patterns
```

## Try it Live

Want to see these patterns in action? We included a simulated server environment.

```bash
npm run demo
```
*Simulates a Load Balancer + Rate Limiter + Circuit Breaker handling traffic.*

## Usage

### Consistent Hashing

```typescript
import { ConsistentHashing } from 'backend-design-patterns/consistent-hashing'

const ch = new ConsistentHashing()
ch.addNode('redis-1')
ch.addNode('redis-2')

const node = ch.getNode('user-session-123')
console.log(`Assign to: ${node}`)
```

### Rate Limiter

```typescript
import { TokenBucket } from 'backend-design-patterns/rate-limiter'

const limiter = new TokenBucket(100, 10) // 100 capacity, 10 tokens/sec
if (limiter.tryConsume(1)) {
  // Handle request
} else {
  // 429 Too Many Requests
}
  // 429 Too Many Requests
}
```

### Bloom Filter

```typescript
import { BloomFilter } from 'backend-design-patterns/bloom-filter'

const filer = new BloomFilter(1024, 3)
filter.add('superuser')

if (filter.mightContain('superuser')) {
  // It MIGHT be in the set
}
```

## Benchmarks

Core patterns are optimized for high-throughput environments.

| Pattern | Operation | Ops/Sec (approx) |
|---------|-----------|------------------|
| **Token Bucket** | `tryConsume` | **25,000,000+** |
| **Consistent Hashing** | `getNode` | **3,000,000+** |
| **Bloom Filter** | `mightContain` | **15,000,000+** |
| **LSM Tree** | `put` (MemTable) | **500,000+** |

*Measured on standard i7 equivalent hardware using `npm run benchmark`.*

## Development

This project uses TypeScript and Vitest.

```bash
npm install
npm test
```

## Contributing

We welcome contributions! Please keep implementations minimal and zero-dependency.
See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

**Simple. Robust. TypeScript.**
