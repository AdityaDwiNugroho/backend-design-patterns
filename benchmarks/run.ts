import { TokenBucket } from '../src/rate-limiter/token-bucket'
import { ConsistentHashing } from '../src/consistent-hashing/consistent-hash'

function runBenchmark(name: string, fn: () => void, iterations: number) {
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    fn()
  }
  const end = performance.now()
  const durationInSec = (end - start) / 1000
  const opsPerSec = Math.floor(iterations / durationInSec)
  
  console.log(`${name}:`)
  console.log(`  Ops/Sec: ${opsPerSec.toLocaleString()}`)
  console.log(`  Total:   ${iterations.toLocaleString()} ops in ${durationInSec.toFixed(4)}s`)
  console.log('----------------------------------------')
}

function benchmarkTokenBucket() {
  const bucket = new TokenBucket(1000000, 1000000)
  runBenchmark('TokenBucket (tryConsume)', () => {
    bucket.tryConsume(1)
  }, 10_000_000)
}

function benchmarkConsistentHashing() {
  const ch = new ConsistentHashing(160)
  // Pre-populate
  for (let i = 0; i < 100; i++) ch.addNode(`node-${i}`)
  
  runBenchmark('ConsistentHashing (getNode)', () => {
    ch.getNode(`user-${Math.random()}`)
  }, 100_000)
}

console.log('\nStarting Backend Design Patterns Benchmarks...\n')
benchmarkTokenBucket()
benchmarkConsistentHashing()
