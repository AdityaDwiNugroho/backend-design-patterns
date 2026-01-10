import { describe, it, expect, vi } from 'vitest'
import { CircuitBreaker, CircuitState } from './circuit-breaker'

describe('CircuitBreaker', () => {
  it('should start in CLOSED state', () => {
    const cb = new CircuitBreaker()
    expect(cb.getState()).toBe(CircuitState.CLOSED)
  })

  it('should execute function successfully', async () => {
    const cb = new CircuitBreaker()
    const result = await cb.execute(async () => 'success')
    expect(result).toBe('success')
  })

  it('should open after threshold failures', async () => {
    const cb = new CircuitBreaker(3, 1000)
    const failFn = async () => { throw new Error('fail') }

    await expect(cb.execute(failFn)).rejects.toThrow('fail')
    await expect(cb.execute(failFn)).rejects.toThrow('fail')
    await expect(cb.execute(failFn)).rejects.toThrow('fail')

    expect(cb.getState()).toBe(CircuitState.OPEN)
    await expect(cb.execute(failFn)).rejects.toThrow('Circuit is OPEN')
  })

  it('should transition to HALF_OPEN after timeout', async () => {
    vi.useFakeTimers()
    const cb = new CircuitBreaker(1, 1000)
    const failFn = async () => { throw new Error('fail') }

    await expect(cb.execute(failFn)).rejects.toThrow('fail')
    expect(cb.getState()).toBe(CircuitState.OPEN)

    vi.advanceTimersByTime(1100)
    
    // logic checks timeout inside execute, so we need to call execute
    // This call should enter HALF_OPEN. If it succeeds, it goes CLOSED.
    // If it fails, it goes OPEN again (simplest implementation) or stays OPEN.
    // Our impl currently doesn't explicitly handle "fail in HALF_OPEN -> OPEN", 
    // it just calls recordFailure() which increments count and sets OPEN if >= threshold.
    // Since count wasn't reset, it will stay/go OPEN.
    
    // Let's testing success
    const result = await cb.execute(async () => 'recovered')
    expect(result).toBe('recovered')
    expect(cb.getState()).toBe(CircuitState.CLOSED)

    vi.useRealTimers()
  })
})
