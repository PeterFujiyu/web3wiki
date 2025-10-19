# 区块链入门

## 什么是区块链？

区块链是一种分布式账本技术，它维护着一个不断增长的记录列表，这些记录被称为区块，通过密码学技术链接和保护。

## 核心特性

- **去中心化**：没有单一的控制点
- **透明性**：所有交易对网络参与者可见
- **不可篡改**：一旦记录，数据无法被追溯修改
- **安全性**：密码学技术确保数据完整性

## 工作原理

1. **交易发起**：交易被广播到网络中的所有节点
2. **验证**：网络节点使用算法验证交易
3. **区块创建**：经过验证的交易被组合成新的区块
4. **区块添加**：新区块被添加到链上
5. **分发**：更新后的区块链在整个网络中分发

## 代码示例

```javascript
// 简单的区块链结构
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
    return new Block(0, "2024/01/01", "创世区块", "0");
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

## 应用场景

- 加密货币（比特币、以太坊）
- 供应链管理
- 数字身份
- 智能合约
- 医疗记录

---

## 知识测验

[QUIZ]
Q: 区块链技术的主要特征是什么？
A) 中心化控制
B) 分布式账本 *
C) 云存储
D) 数据库管理
Explanation: 区块链本质上是一种分布式账本技术，在多个节点之间维护记录，没有中心化控制。
[/QUIZ]

[QUIZ]
Q: 区块链中使用哪种密码学技术来确保数据完整性？
A) 对称加密
B) 公钥基础设施
C) 哈希函数 *
D) 数字签名
Explanation: 哈希函数用于创建数据的唯一数字指纹，确保对数据的任何更改都能立即被检测到。
[/QUIZ]
