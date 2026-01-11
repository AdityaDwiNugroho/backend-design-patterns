export class SSTable<K, V> {
  private readonly data: Map<K, V>
  public readonly timestamp: number

  constructor(entries: [K, V][]) {
    // SSTables are immutable sorted maps on disk.
    // We simulate this with an in-memory Map that is never modified.
    this.data = new Map(entries)
    this.timestamp = Date.now()
  }

  public get(key: K): V | undefined {
    return this.data.get(key)
  }

  public entries(): IterableIterator<[K, V]> {
    return this.data.entries()
  }
}
