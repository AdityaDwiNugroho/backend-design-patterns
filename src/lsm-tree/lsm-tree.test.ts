import { describe, it, expect } from 'vitest'
import { LSMTree } from './lsm-tree'

describe('LSM Tree', () => {
  it('should write and read from MemTable', () => {
    const db = new LSMTree<string, string>(10)
    db.put('key1', 'val1')
    expect(db.get('key1')).toBe('val1')
  })

  it('should flush to SSTable and still read data', () => {
    const db = new LSMTree<string, string>(2) // Flush after 2 items
    db.put('A', '1')
    db.put('B', '2')
    // Should flush now
    db.put('C', '3')

    expect(db.getSSTableCount()).toBe(1)
    expect(db.get('A')).toBe('1') // From SSTable
    expect(db.get('C')).toBe('3') // From MemTable
  })

  it('should read latest value if updated', () => {
    const db = new LSMTree<string, string>(10)
    db.put('key1', 'v1')
    db.flush()
    db.put('key1', 'v2') // Update in MemTable

    expect(db.get('key1')).toBe('v2') // MemTable shadows SSTable
  })
})
