# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2026-01-11
### Added
- **Professional Metadata**: Updated `package.json` with repository links, bugs url, and author details.
- **MIT License**: Open-sourced the project under the standard MIT license.
- **Keywords**: Added SEO-friendly keywords for better discoverability on npm.

## [1.0.0] - 2026-01-11
### Added
- **Core Patterns**:
  - `ConsistentHashing`: Ring-based hashing with virtual nodes.
  - `TokenBucket`: High-performance rate limiting.
  - `CircuitBreaker`: Robust failure handling state machine.
  - `DistributedLock`: Interface for lock management.
  - `BloomFilter`: Probabilistic data structure for set membership.
  - `LSMTree`: Log-Structured Merge Tree basics (MemTable/SSTable).
- **Documentation**: Comprehensive `README.md` and System Design Guide (`docs/SYSTEM_DESIGN.md`).
- **Demo**: Interactive server simulation script (`npm run demo`).
- **Zero Dependencies**: Pure TypeScript implementation.
