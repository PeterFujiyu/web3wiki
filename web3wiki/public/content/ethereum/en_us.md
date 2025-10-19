# What is Ethereum?

## Overview

Ethereum is a decentralized, open-source blockchain platform that enables developers to build and deploy smart contracts and decentralized applications (dApps).

## Key Features

- **Smart Contracts**: Self-executing contracts with the terms directly written into code
- **Turing-Complete**: Can execute any computational task
- **EVM**: Ethereum Virtual Machine runs smart contract code
- **Gas**: Fee system to prevent spam and allocate resources

## Smart Contract Example

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
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}
```

## Ethereum 2.0

The upgrade from Proof of Work to Proof of Stake, improving scalability, security, and sustainability.

## Use Cases

- DeFi (Decentralized Finance)
- NFTs (Non-Fungible Tokens)
- DAOs (Decentralized Autonomous Organizations)
- Gaming and Metaverse

---

## Test Your Knowledge

[QUIZ]
Q: What makes Ethereum different from Bitcoin?
A) It uses blockchain technology
B) It supports smart contracts and dApps *
C) It's a cryptocurrency
D) It's decentralized
Explanation: While both use blockchain technology, Ethereum's key differentiator is its ability to execute smart contracts and host decentralized applications, making it a programmable blockchain platform.
[/QUIZ]

[QUIZ]
Q: What is the Ethereum Virtual Machine (EVM)?
A) A physical computer that runs Ethereum
B) A runtime environment for executing smart contracts *
C) A cryptocurrency wallet
D) A mining software
Explanation: The EVM is a runtime environment that executes smart contract code on the Ethereum network, making it Turing-complete and capable of running any computational task.
[/QUIZ]

[QUIZ]
Q: What is the purpose of "gas" in Ethereum?
A) To power mining equipment
B) To prevent spam and allocate computational resources *
C) To increase transaction speed
D) To store data on the blockchain
Explanation: Gas is a fee mechanism that prevents spam by requiring users to pay for computational resources, ensuring efficient allocation of the network's processing power.
[/QUIZ]
