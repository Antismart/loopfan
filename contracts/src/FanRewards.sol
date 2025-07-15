// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract FanRewards is ERC1155Upgradeable, OwnableUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    address public creator;
    mapping(address => uint256) public tipVolume;
    mapping(address => bool) public isHolder;

    event RewardSent(address indexed to, uint256 indexed rewardId);

    function initialize(address _creator, string memory uri) public initializer {
        __ERC1155_init(uri);
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        creator = _creator;
        transferOwnership(_creator);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function recordTip(address fan, uint256 amount) external onlyOwner {
        tipVolume[fan] += amount;
    }

    function recordNFT(address fan) external onlyOwner {
        isHolder[fan] = true;
    }

    function airdropReward(address to, uint256 rewardId, uint256 amount) external onlyOwner {
        _mint(to, rewardId, amount, "");
        emit RewardSent(to, rewardId);
    }
} 