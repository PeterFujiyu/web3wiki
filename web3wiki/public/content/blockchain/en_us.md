# Introduction to Blockchain

## What is Blockchain?

Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.

## Key Features

- **Decentralization**: No single point of control
- **Transparency**: All transactions are visible to network participants
- **Immutability**: Once recorded, data cannot be altered retroactively
- **Security**: Cryptographic techniques ensure data integrity

## How It Works

1. **Transaction Initiation**: A transaction is broadcast to all nodes in the network
2. **Validation**: Network nodes validate the transaction using algorithms
3. **Block Creation**: Validated transactions are combined into a new block
4. **Block Addition**: The new block is added to the chain
5. **Distribution**: The updated blockchain is distributed across the network

## Code Example

```javascript
// Simple Blockchain Structure
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2024", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}
```

## Applications

- Cryptocurrency (Bitcoin, Ethereum)
- Supply Chain Management
- Digital Identity
- Smart Contracts
- Healthcare Records

---

## Test Your Knowledge

[QUIZ]
Q: What is the main characteristic of blockchain technology?
A) Centralized control
B) Distributed ledger *
C) Cloud storage
D) Database management
Explanation: Blockchain is fundamentally a distributed ledger technology that maintains records across multiple nodes without centralized control.
[/QUIZ]

[QUIZ]
Q: Which cryptographic technique is used to ensure data integrity in blockchain?
A) Symmetric encryption
B) Public key infrastructure
C) Hash functions *
D) Digital signatures
Explanation: Hash functions are used to create unique digital fingerprints of data, ensuring that any change to the data will be immediately detectable.
[/QUIZ]
