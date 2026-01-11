export class SkipListNode<K, V> {
  key: K
  value: V
  forward: SkipListNode<K, V>[]

  constructor(key: K, value: V, level: number) {
    this.key = key
    this.value = value
    this.forward = new Array(level + 1)
  }
}

export class MemTable<K, V> {
  private head: SkipListNode<K, V>
  private level: number
  private readonly maxLevel: number
  private readonly probability: number
  private _size: number

  constructor(maxLevel = 16, probability = 0.5) {
    this.maxLevel = maxLevel
    this.probability = probability
    this.level = 0
    // Dummy header logic (key/value are type-casted nulls for simplicity in this demo)
    this.head = new SkipListNode<K, V>(null as unknown as K, null as unknown as V, maxLevel)
    this._size = 0
  }

  get size(): number {
    return this._size
  }

  public put(key: K, value: V): void {
    const update = new Array(this.maxLevel + 1)
    let current = this.head

    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].key < key) {
        current = current.forward[i]
      }
      update[i] = current
    }

    current = current.forward[0]

    if (current && current.key === key) {
      current.value = value
    } else {
      const newLevel = this.randomLevel()
      if (newLevel > this.level) {
        for (let i = this.level + 1; i <= newLevel; i++) {
          update[i] = this.head
        }
        this.level = newLevel
      }

      const newNode = new SkipListNode(key, value, newLevel)
      for (let i = 0; i <= newLevel; i++) {
        newNode.forward[i] = update[i].forward[i]
        update[i].forward[i] = newNode
      }
      this._size++
    }
  }

  public get(key: K): V | undefined {
    let current = this.head
    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].key < key) {
        current = current.forward[i]
      }
    }
    current = current.forward[0]

    if (current && current.key === key) {
      return current.value
    }
    return undefined
  }

  public *entries(): Generator<[K, V]> {
    let current = this.head.forward[0]
    while (current) {
      yield [current.key, current.value]
      current = current.forward[0]
    }
  }

  public clear(): void {
    this.head = new SkipListNode<K, V>(null as unknown as K, null as unknown as V, this.maxLevel)
    this.level = 0
    this._size = 0
  }

  private randomLevel(): number {
    let lvl = 0
    while (Math.random() < this.probability && lvl < this.maxLevel) {
      lvl++
    }
    return lvl
  }
}
