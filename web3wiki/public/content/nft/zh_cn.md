# 理解 NFT

## 什么是 NFT？

非同质化代币（NFT）是存储在区块链上的独特数字资产。与加密货币不同，每个 NFT 都有独特的属性，不能一对一交换。

## 核心特征

- **唯一性**：每个 NFT 都有唯一标识符
- **不可分割**：不能被分割成更小的单位
- **可验证**：所有权和真实性可在区块链上验证
- **可转移**：可以买卖和交易

## ERC-721 标准

以太坊上最常见的 NFT 标准。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("我的NFT", "MNFT") {}

    function mint(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "代币不存在");
        return _tokenURIs[tokenId];
    }
}
```

## 应用场景

- **数字艺术**：独特的艺术品和收藏品
- **游戏**：游戏内物品和角色
- **音乐**：独家曲目和专辑
- **房地产**：虚拟土地和资产
- **门票**：活动门票和会员资格

## 热门 NFT 市场

- [OpenSea](https://opensea.io/)
- [Rarible](https://rarible.com/)
- [Foundation](https://foundation.app/)
- [SuperRare](https://superrare.com/)

---

## 知识测验

[QUIZ]
Q: NFT中"非同质化"是什么意思？
A) 代币可以分割成更小的部分
B) 每个代币都是独特的，不能一对一交换 *
C) 代币是一种加密货币
D) 代币可以被复制
Explanation: 非同质化意味着每个代币都是独特的，具有不同的属性，不像同质化资产（如比特币）每个单位都是相同且可互换的。
[/QUIZ]

[QUIZ]
Q: 以太坊上最常见的NFT标准是什么？
A) ERC-20
B) ERC-721 *
C) ERC-1155
D) BEP-721
Explanation: ERC-721是以太坊上最广泛采用的NFT标准，定义了非同质化代币的通用接口。
[/QUIZ]

[QUIZ]
Q: 以下哪项不是NFT的特征？
A) 唯一标识符
B) 可分割成更小的单位 *
C) 可验证所有权
D) 可转移
Explanation: NFT在设计上是不可分割的——它们不能被拆分成更小的单位。这是它们区别于加密货币的关键特征之一。
[/QUIZ]
