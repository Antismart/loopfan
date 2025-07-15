// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

interface IMembershipNFT {
    function isMember(
        address user,
        uint256 tierId
    ) external view returns (bool);
}

contract GatedContentRegistry is
    OwnableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable
{
    struct Content {
        address creator;
        string encryptedURI;
        address membershipNFT;
        uint256 requiredTier;
    }

    uint256 public nextContentId;
    mapping(uint256 => Content) public contents;

    event ContentPublished(
        uint256 indexed contentId,
        address indexed creator,
        string encryptedURI
    );

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function publishContent(
        string calldata encryptedURI,
        address membershipNFT,
        uint256 requiredTier
    ) external returns (uint256) {
        contents[nextContentId] = Content(
            msg.sender,
            encryptedURI,
            membershipNFT,
            requiredTier
        );
        emit ContentPublished(nextContentId, msg.sender, encryptedURI);
        return nextContentId++;
    }

    function getContentURI(
        address viewer,
        uint256 contentId
    ) external view returns (string memory) {
        Content memory c = contents[contentId];
        require(
            c.creator == viewer ||
                (c.membershipNFT != address(0) &&
                    IMembershipNFT(c.membershipNFT).isMember(
                        viewer,
                        c.requiredTier
                    )),
            "No access"
        );
        return c.encryptedURI;
    }
}
