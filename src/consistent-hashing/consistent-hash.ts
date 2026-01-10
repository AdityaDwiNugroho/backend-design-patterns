import { createHash } from 'crypto'

export class ConsistentHashing {
  private readonly replicas: number
  private readonly ring: { hash: number; node: string }[] = []
  private readonly algorithm: string

  constructor(replicas: number = 160, algorithm: string = 'sha256') {
    this.replicas = replicas
    this.algorithm = algorithm
  }

  public addNode(node: string): void {
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.getHash(`${node}:${i}`)
      this.ring.push({ hash, node })
    }
    this.ring.sort((a, b) => a.hash - b.hash)
  }

  public removeNode(node: string): void {
    const originalLength = this.ring.length
    for (let i = originalLength - 1; i >= 0; i--) {
      if (this.ring[i].node === node) {
        this.ring.splice(i, 1)
      }
    }
  }

  public getNode(key: string): string | null {
    if (this.ring.length === 0) {
      return null
    }

    const hash = this.getHash(key)
    const idx = this.binarySearch(hash)

    // Wrap around to 0 if we went past the end
    return this.ring[idx % this.ring.length].node
  }

  private getHash(key: string): number {
    const hash = createHash(this.algorithm).update(key).digest('hex')
    // Take first 8 chars (32 bits) and parse as integer
    // This is a simple way to map to a 32-bit space
    return parseInt(hash.substring(0, 8), 16)
  }

  private binarySearch(hash: number): number {
    let low = 0
    let high = this.ring.length - 1

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      if (this.ring[mid].hash < hash) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    return low
  }
}
