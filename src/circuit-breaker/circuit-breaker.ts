export enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN,
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private failureCount = 0
  private lastFailureTime = 0
  private readonly failureThreshold: number
  private readonly resetTimeout: number

  constructor(failureThreshold = 5, resetTimeout = 5000) {
    this.failureThreshold = failureThreshold
    this.resetTimeout = resetTimeout
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = CircuitState.HALF_OPEN
      } else {
        throw new Error('Circuit is OPEN')
      }
    }

    try {
      const result = await fn()
      if (this.state === CircuitState.HALF_OPEN) {
        this.reset()
      }
      return result
    } catch (error) {
      this.recordFailure()
      throw error
    }
  }

  private recordFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()
    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN
    }
  }

  private reset(): void {
    this.failureCount = 0
    this.state = CircuitState.CLOSED
  }

  public getState(): CircuitState {
    return this.state
  }
}
