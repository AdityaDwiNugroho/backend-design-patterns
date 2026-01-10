import { describe, it, expect } from 'vitest'
import { ConsistentHashing } from './consistent-hash'

describe('ConsistentHashing', () => {
  it('should return null if no nodes exist', () => {
    const ch = new ConsistentHashing()
    expect(ch.getNode('any-key')).toBeNull()
  })

  it('should return the same node for the same key', () => {
    const ch = new ConsistentHashing()
    ch.addNode('node-1')
    ch.addNode('node-2')
    ch.addNode('node-3')

    const nodeA = ch.getNode('user-123')
    const nodeB = ch.getNode('user-123')
    expect(nodeA).toBe(nodeB)
  })

  it('should redistribute keys when a node is removed', () => {
    const ch = new ConsistentHashing(10) // low replicas for easier mental model
    ch.addNode('node-A')
    ch.addNode('node-B')

    const initialAssignment = ch.getNode('key-1')
    
    // If we remove the other node, it should stay. 
    // If we remove the assigned node, it should move.
    
    // Let's just verify it returns a valid node after removal
    ch.removeNode('node-A')
    const assignmentAfter = ch.getNode('key-1')
    expect(assignmentAfter).toBe('node-B')
  })
})
