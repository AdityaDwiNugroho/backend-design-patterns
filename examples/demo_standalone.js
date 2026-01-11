const { createHash } = require('crypto');

// --- 1. Consistent Hashing Implementation ---
class ConsistentHashing {
  constructor(replicas = 160, algorithm = 'sha256') {
    this.replicas = replicas;
    this.algorithm = algorithm;
    this.ring = [];
  }

  addNode(node) {
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.getHash(`${node}:${i}`);
      this.ring.push({ hash, node });
    }
    this.ring.sort((a, b) => a.hash - b.hash);
  }

  getNode(key) {
    if (this.ring.length === 0) return null;
    const hash = this.getHash(key);
    const idx = this.binarySearch(hash);
    return this.ring[idx % this.ring.length].node;
  }

  getHash(key) {
    const hash = createHash(this.algorithm).update(key).digest('hex');
    return parseInt(hash.substring(0, 8), 16);
  }

  binarySearch(hash) {
    let low = 0;
    let high = this.ring.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.ring[mid].hash < hash) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return low;
  }
}

// --- 2. Token Bucket Implementation ---
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  tryConsume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }

  refill() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    if (elapsedSeconds > 0) {
      const newTokens = elapsedSeconds * this.refillRate;
      this.tokens = Math.min(this.capacity, this.tokens + newTokens);
      this.lastRefillTimestamp = now;
    }
  }
}

// --- 3. Circuit Breaker Implementation ---
const CircuitState = {
  CLOSED: 0,
  OPEN: 1,
  HALF_OPEN: 2
};

class CircuitBreaker {
  constructor(failureThreshold = 5, resetTimeout = 5000) {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
  }

  async execute(fn) {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error('Circuit is OPEN');
      }
    }

    try {
      const result = await fn();
      if (this.state === CircuitState.HALF_OPEN) {
        this.reset();
      }
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }
}

// --- 4. Simulation Logic ---
const nodes = ['api-server-1', 'api-server-2', 'api-server-3'];
const hashing = new ConsistentHashing();
const limiter = new TokenBucket(10, 5); // 10 capacity, 5/sec refill
const breaker = new CircuitBreaker(3, 2000);

console.log('Starting Backend System Simulation (Standalone Mode)...\n');
nodes.forEach(node => {
  hashing.addNode(node);
  console.log(`[System] Added node: ${node}`);
});
console.log('\n--- Traffic Simulation Start ---\n');

async function handleRequest(requestId) {
  const userIp = `192.168.1.${requestId % 255}`;
  
  // 1. Check Rate Limit
  if (!limiter.tryConsume(1)) {
    console.log(`[${requestId}] [BLOCKED] Rate Limiter (IP: ${userIp})`);
    return;
  }

  // 2. Load Balance
  const targetNode = hashing.getNode(userIp);
  
  // 3. Process Request
  try {
    const result = await breaker.execute(async () => {
      // Simulate random failure
      if (Math.random() > 0.9) throw new Error('Database Timeout');
      return 'Success';
    });
    console.log(`[${requestId}] [SUCCESS] Request routed to ${targetNode} -> ${result}`);
  } catch (error) {
    console.log(`[${requestId}] [WARN]    Request failed on ${targetNode} -> ${error.message}`);
  }
}

// Run Loop
let id = 1;
const interval = setInterval(() => {
  handleRequest(id++);
  if (id > 20) {
    clearInterval(interval);
    console.log('\n--- Simulation Complete ---');
  }
}, 300);
