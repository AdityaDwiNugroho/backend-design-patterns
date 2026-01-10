import { ConsistentHashing } from '../src/consistent-hashing/consistent-hash'
import { TokenBucket } from '../src/rate-limiter/token-bucket'
import { CircuitBreaker } from '../src/circuit-breaker/circuit-breaker'

// Simulation Setup
const nodes = ['api-server-1', 'api-server-2', 'api-server-3']
const hashing = new ConsistentHashing()
const limiter = new TokenBucket(10, 5) // 10 capacity, 5/sec refill
const breaker = new CircuitBreaker(3, 2000)

// Initialize Load Balancer
console.log('Starting Backend System Simulation...\n')
nodes.forEach(node => {
  hashing.addNode(node)
  console.log(`[System] Added node: ${node}`)
})
console.log('\n--- Traffic Simulation Start ---\n')

async function handleRequest(requestId: number) {
  const userIp = `192.168.1.${requestId % 255}`
  
  // 1. Check Rate Limit
  if (!limiter.tryConsume(1)) {
    console.log(`[${requestId}] [BLOCKED] Rate Limiter (IP: ${userIp})`)
    return
  }

  // 2. Load Balance (Consistent Hashing)
  const targetNode = hashing.getNode(userIp)
  
  // 3. Process Request (Circuit Breaker Protection)
  try {
    const result = await breaker.execute(async () => {
      // Simulate random failure
      if (Math.random() > 0.9) throw new Error('Database Timeout')
      return 'Success'
    })
    console.log(`[${requestId}] [SUCCESS] Request routed to ${targetNode} -> ${result}`)
  } catch (error) {
    console.log(`[${requestId}] [WARN]    Request failed on ${targetNode} -> ${(error as Error).message}`)
  }
}

// Run Simulation Loop
let id = 1
const interval = setInterval(() => {
  handleRequest(id++)
  if (id > 20) {
    clearInterval(interval)
    console.log('\n--- Simulation Complete ---')
  }
}, 300) // 3 requests per second approx
