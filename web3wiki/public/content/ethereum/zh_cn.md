# 什么是以太坊？

## 概述

以太坊是一个去中心化、开源的区块链平台，使开发者能够构建和部署智能合约和去中心化应用（dApps）。

## 核心特性

- **智能合约**：条款直接写入代码的自执行合约
- **图灵完备**：可以执行任何计算任务
- **EVM**：以太坊虚拟机运行智能合约代码
- **Gas**：费用系统防止垃圾信息并分配资源

## 智能合约示例

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;

    event DataStored(uint256 data);

    function set(uint256 x) public {
        storedData = x;
        emit DataStored(x);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}

contract Token {
    mapping(address => uint256) public balances;

    constructor(uint256 initialSupply) {
        balances[msg.sender] = initialSupply;
    }

    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "余额不足");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}
```

## 以太坊 2.0

从工作量证明升级到权益证明，提高可扩展性、安全性和可持续性。

## 应用场景

- DeFi（去中心化金融）
- NFT（非同质化代币）
- DAO（去中心化自治组织）
- 游戏和元宇宙

---

## 知识测验

[QUIZ]
Q: 以太坊与比特币的主要区别是什么？
A) 它使用区块链技术
B) 它支持智能合约和去中心化应用 *
C) 它是一种加密货币
D) 它是去中心化的
Explanation: 虽然两者都使用区块链技术，但以太坊的关键区别在于它能够执行智能合约和托管去中心化应用，使其成为可编程的区块链平台。
[/QUIZ]

[QUIZ]
Q: 什么是以太坊虚拟机（EVM）？
A) 运行以太坊的物理计算机
B) 执行智能合约的运行时环境 *
C) 加密货币钱包
D) 挖矿软件
Explanation: EVM是在以太坊网络上执行智能合约代码的运行时环境，使其具有图灵完备性，能够运行任何计算任务。
[/QUIZ]

[QUIZ]
Q: 以太坊中"Gas"的作用是什么？
A) 为挖矿设备提供动力
B) 防止垃圾信息并分配计算资源 *
C) 提高交易速度
D) 在区块链上存储数据
Explanation: Gas是一种费用机制，通过要求用户为计算资源付费来防止垃圾信息，确保网络处理能力的有效分配。
[/QUIZ]
