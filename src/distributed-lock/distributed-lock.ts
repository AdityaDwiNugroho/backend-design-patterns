export interface DistributedLock {
  acquire(key: string, ttl: number): Promise<boolean>
  release(key: string): Promise<void>
}

export class InMemoryLock implements DistributedLock {
  private locks: Map<string, number> = new Map()

  public async acquire(key: string, ttl: number): Promise<boolean> {
    const now = Date.now()
    const expiry = this.locks.get(key)

    if (expiry && expiry > now) {
      return false // Locked
    }

    this.locks.set(key, now + ttl)
    return true
  }

  public async release(key: string): Promise<void> {
    this.locks.delete(key)
  }
}
