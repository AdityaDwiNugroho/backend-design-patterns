import { describe, it, expect } from 'vitest'
import { BloomFilter } from './bloom-filter'

describe('BloomFilter', () => {
  it('should return false for empty filter', () => {
    const bf = new BloomFilter()
    expect(bf.mightContain('item1')).toBe(false)
  })

  it('should return true for added items', () => {
    const bf = new BloomFilter()
    bf.add('item1')
    expect(bf.mightContain('item1')).toBe(true)
  })

  it('should handle collisions gracefully', () => {
    const bf = new BloomFilter(100, 3)
    bf.add('A')
    bf.add('B')
    expect(bf.mightContain('A')).toBe(true)
    expect(bf.mightContain('B')).toBe(true)
    // C might be true or false depending on collisions, but we just check A and B
  })
})
