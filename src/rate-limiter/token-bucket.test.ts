import { describe, it, expect, vi } from 'vitest'
import { TokenBucket } from './token-bucket'

describe('TokenBucket', () => {
  it('should start with full capacity', () => {
    const bucket = new TokenBucket(10, 1)
    expect(bucket.getTokens()).toBe(10)
  })

  it('should consume tokens if available', () => {
    const bucket = new TokenBucket(10, 1)
    expect(bucket.tryConsume(5)).toBe(true)
    expect(bucket.getTokens()).toBeCloseTo(5)
  })

  it('should fail to consume if not enough tokens', () => {
    const bucket = new TokenBucket(10, 1)
    expect(bucket.tryConsume(11)).toBe(false)
    expect(bucket.getTokens()).toBe(10)
  })

  it('should refill tokens over time', async () => {
    // Mock Date.now/timers if possible, or use a small delay integration test
    // For simplicity in this env, we might rely on a small sleep or mock
    // Let's use vi.useFakeTimers if vitest supports it (it does)
    
    vi.useFakeTimers()
    const bucket = new TokenBucket(10, 1) // 1 token per second
    bucket.tryConsume(10) // empty it
    expect(bucket.getTokens()).toBeCloseTo(0)

    vi.advanceTimersByTime(1000) // 1 second
    expect(bucket.getTokens()).toBeCloseTo(1)
    
    vi.useRealTimers()
  })
})
