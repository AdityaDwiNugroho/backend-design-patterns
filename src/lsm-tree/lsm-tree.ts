import { MemTable } from './memtable'
import { SSTable } from './sstable'

export class LSMTree<K, V> {
  private memTable: MemTable<K, V>
  private ssTables: SSTable<K, V>[]
  private readonly flushThreshold: number

  constructor(flushThreshold = 100) {
    this.memTable = new MemTable<K, V>()
    this.ssTables = []
    this.flushThreshold = flushThreshold
  }

  public put(key: K, value: V): void {
    this.memTable.put(key, value)
    
    // Auto-flush if threshold met
    if (this.memTable.size >= this.flushThreshold) {
      this.flush()
    }
  }

  public get(key: K): V | undefined {
    // 1. Check MemTable (L1 Cache essentially)
    const memResult = this.memTable.get(key)
    if (memResult !== undefined) {
      return memResult
    }

    // 2. Check SSTables (Newest to Oldest)
    // In a real system, we would use a Bloom Filter here to avoid scanning every SSTable!
    for (let i = this.ssTables.length - 1; i >= 0; i--) {
      const sstResult = this.ssTables[i].get(key)
      if (sstResult !== undefined) {
        return sstResult
      }
    }

    return undefined
  }

  public flush(): void {
    if (this.memTable.size === 0) return

    // Create immutable SSTable from MemTable entries
    const entries = Array.from(this.memTable.entries())
    const newSSTable = new SSTable(entries)
    
    this.ssTables.push(newSSTable)
    this.memTable.clear()
  }

  public getSSTableCount(): number {
    return this.ssTables.length
  }
}
