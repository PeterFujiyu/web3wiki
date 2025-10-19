# Understanding NFTs

## What are NFTs?

Non-Fungible Tokens (NFTs) are unique digital assets stored on a blockchain. Unlike cryptocurrencies, each NFT has distinct properties and cannot be exchanged on a one-to-one basis.

## Key Characteristics

- **Unique**: Each NFT has a unique identifier
- **Indivisible**: Cannot be divided into smaller units
- **Verifiable**: Ownership and authenticity can be verified on the blockchain
- **Transferable**: Can be bought, sold, and traded

## ERC-721 Standard

The most common NFT standard on Ethereum.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mint(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIs[tokenId];
    }
}
```

## Use Cases

- **Digital Art**: Unique artworks and collectibles
- **Gaming**: In-game items and characters
- **Music**: Exclusive tracks and albums
- **Real Estate**: Virtual land and properties
- **Tickets**: Event passes and memberships

## Popular NFT Marketplaces

- OpenSea
- Rarible
- Foundation
- SuperRare

---

## Test Your Knowledge

[QUIZ]
Q: What does "non-fungible" mean in the context of NFTs?
A) The token can be divided into smaller parts
B) Each token is unique and cannot be exchanged one-to-one *
C) The token is a type of cryptocurrency
D) The token can be duplicated
Explanation: Non-fungible means each token is unique with distinct properties, unlike fungible assets (like Bitcoin) where each unit is identical and interchangeable.
[/QUIZ]

[QUIZ]
Q: What is the most common NFT standard on Ethereum?
A) ERC-20
B) ERC-721 *
C) ERC-1155
D) BEP-721
Explanation: ERC-721 is the most widely adopted standard for NFTs on Ethereum, defining a common interface for non-fungible tokens.
[/QUIZ]

[QUIZ]
Q: Which of the following is NOT a characteristic of NFTs?
A) Unique identifier
B) Divisible into smaller units *
C) Verifiable ownership
D) Transferable
Explanation: NFTs are indivisible by design - they cannot be split into smaller units. This is one of their key characteristics that differentiates them from cryptocurrencies.
[/QUIZ]
