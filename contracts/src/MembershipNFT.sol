// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MembershipNFT is ERC1155Upgradeable, OwnableUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    struct Tier {
        uint256 priceETH;
        uint256 priceUSDC;
        uint256 duration; // in seconds
        bool active;
    }

    address public usdc;
    address public creator;
    uint256 public nextTierId;
    mapping(uint256 => Tier) public tiers;
    mapping(uint256 => mapping(address => uint256)) public expirations; // tierId => user => expiration

    event MembershipMinted(address indexed fan, uint256 indexed tierId, uint256 expiration);

    function initialize(address _creator, address _usdc, string memory uri) public initializer {
        __ERC1155_init(uri);
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        creator = _creator;
        usdc = _usdc;
        transferOwnership(_creator);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function createTier(uint256 priceETH, uint256 priceUSDC, uint256 duration) external onlyOwner {
        tiers[nextTierId] = Tier(priceETH, priceUSDC, duration, true);
        nextTierId++;
    }

    function setTierActive(uint256 tierId, bool active) external onlyOwner {
        tiers[tierId].active = active;
    }

    function mintETH(uint256 tierId) external payable nonReentrant {
        Tier memory tier = tiers[tierId];
        require(tier.active, "Inactive");
        require(msg.value == tier.priceETH, "Wrong ETH");
        _mint(msg.sender, tierId, 1, "");
        uint256 exp = block.timestamp + tier.duration;
        expirations[tierId][msg.sender] = exp;
        (bool sent, ) = creator.call{value: msg.value}("");
        require(sent, "ETH fail");
        emit MembershipMinted(msg.sender, tierId, exp);
    }

    function mintUSDC(uint256 tierId) external nonReentrant {
        Tier memory tier = tiers[tierId];
        require(tier.active, "Inactive");
        require(tier.priceUSDC > 0, "No USDC price");
        IERC20(usdc).transferFrom(msg.sender, creator, tier.priceUSDC);
        _mint(msg.sender, tierId, 1, "");
        uint256 exp = block.timestamp + tier.duration;
        expirations[tierId][msg.sender] = exp;
        emit MembershipMinted(msg.sender, tierId, exp);
    }

    function isMember(address user, uint256 tierId) public view returns (bool) {
        return expirations[tierId][user] > block.timestamp;
    }
} 