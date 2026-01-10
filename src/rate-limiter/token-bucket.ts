export class TokenBucket {
  private readonly capacity: number
  private readonly refillRate: number // tokens per second
  private tokens: number
  private lastRefillTimestamp: number

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity
    this.refillRate = refillRate
    this.tokens = capacity
    this.lastRefillTimestamp = Date.now()
  }

  public tryConsume(tokens = 1): boolean {
    this.refill()

    if (this.tokens >= tokens) {
      this.tokens -= tokens
      return true
    }

    return false
  }

  public getTokens(): number {
    this.refill()
    return this.tokens
  }

  private refill(): void {
    const now = Date.now()
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000
    
    if (elapsedSeconds > 0) {
      const newTokens = elapsedSeconds * this.refillRate
      this.tokens = Math.min(this.capacity, this.tokens + newTokens)
      this.lastRefillTimestamp = now
    }
  }
}
