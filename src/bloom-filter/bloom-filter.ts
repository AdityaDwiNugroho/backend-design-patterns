export class BloomFilter {
  private readonly size: number
  private readonly hashCount: number
  private readonly bitArray: Uint8Array

  constructor(size = 1024, hashCount = 3) {
    this.size = size
    this.hashCount = hashCount
    // simple bit array using Uint8Array (1 byte = 8 bits)
    this.bitArray = new Uint8Array(Math.ceil(size / 8))
  }

  public add(item: string): void {
    for (let i = 0; i < this.hashCount; i++) {
      const position = this.getHash(item, i) % this.size
      this.setBit(position)
    }
  }

  public mightContain(item: string): boolean {
    for (let i = 0; i < this.hashCount; i++) {
      const position = this.getHash(item, i) % this.size
      if (!this.getBit(position)) {
        return false
      }
    }
    return true
  }

  private setBit(position: number): void {
    const byteIndex = Math.floor(position / 8)
    const bitIndex = position % 8
    this.bitArray[byteIndex] |= (1 << bitIndex)
  }

  private getBit(position: number): boolean {
    const byteIndex = Math.floor(position / 8)
    const bitIndex = position % 8
    return (this.bitArray[byteIndex] & (1 << bitIndex)) !== 0
  }

  // FNV-1a hash variant to simulate multiple hash functions
  private getHash(item: string, seed: number): number {
    let hash = 2166136261
    // Combine item and seed
    const str = item + ':' + seed
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i)
      hash = Math.imul(hash, 16777619)
    }
    return hash >>> 0 // force unsigned 32-bit integer
  }
}
