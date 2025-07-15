// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {GatedContentRegistry} from "../src/GatedContentRegistry.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

// Mock MembershipNFT contract for testing
contract MockMembershipNFT {
    mapping(address => mapping(uint256 => bool)) private _members;
    
    function setMemberStatus(address user, uint256 tierId, bool memberStatus) external {
        _members[user][tierId] = memberStatus;
    }
    
    function isMember(address user, uint256 tierId) external view returns (bool) {
        return _members[user][tierId];
    }
}

contract GatedContentRegistryTest is Test {
    GatedContentRegistry public registryImplementation;
    GatedContentRegistry public registry;
    MockMembershipNFT public mockMembership;
    
    address public creator = makeAddr("creator");
    address public viewer = makeAddr("viewer");
    address public deployer = makeAddr("deployer");
    
    event ContentPublished(
        uint256 indexed contentId,
        address indexed creator,
        string encryptedURI
    );
    
    function setUp() public {
        vm.startPrank(deployer);
        
        // Deploy mock membership NFT
        mockMembership = new MockMembershipNFT();
        
        // Deploy GatedContentRegistry implementation
        registryImplementation = new GatedContentRegistry();
        
        // Deploy proxy and initialize
        bytes memory initData = abi.encodeWithSelector(
            GatedContentRegistry.initialize.selector
        );
        
        ERC1967Proxy proxy = new ERC1967Proxy(address(registryImplementation), initData);
        registry = GatedContentRegistry(address(proxy));
        
        vm.stopPrank();
    }
    
    function test_Initialize() public {
        assertEq(registry.nextContentId(), 0);
        assertEq(registry.owner(), deployer);
    }
    
    function test_PublishContent() public {
        string memory encryptedURI = "encrypted://content-hash-123";
        address membershipNFT = address(mockMembership);
        uint256 requiredTier = 1;
        
        vm.expectEmit(true, true, false, true);
        emit ContentPublished(0, creator, encryptedURI);
        
        vm.prank(creator);
        uint256 contentId = registry.publishContent(encryptedURI, membershipNFT, requiredTier);
        
        assertEq(contentId, 0);
        assertEq(registry.nextContentId(), 1);
        
        (address contentCreator, string memory uri, address nft, uint256 tier) = registry.contents(0);
        assertEq(contentCreator, creator);
        assertEq(uri, encryptedURI);
        assertEq(nft, membershipNFT);
        assertEq(tier, requiredTier);
    }
    
    function test_PublishContent_NoMembership() public {
        string memory encryptedURI = "encrypted://content-hash-123";
        
        vm.prank(creator);
        uint256 contentId = registry.publishContent(encryptedURI, address(0), 0);
        
        (address contentCreator, string memory uri, address nft, uint256 tier) = registry.contents(0);
        assertEq(contentCreator, creator);
        assertEq(uri, encryptedURI);
        assertEq(nft, address(0));
        assertEq(tier, 0);
    }
    
    function test_GetContentURI_CreatorAccess() public {
        string memory encryptedURI = "encrypted://content-hash-123";
        
        vm.prank(creator);
        registry.publishContent(encryptedURI, address(mockMembership), 1);
        
        vm.prank(creator);
        string memory retrievedURI = registry.getContentURI(creator, 0);
        
        assertEq(retrievedURI, encryptedURI);
    }
    
    function test_GetContentURI_MemberAccess() public {
        string memory encryptedURI = "encrypted://content-hash-123";
        uint256 requiredTier = 1;
        
        vm.prank(creator);
        registry.publishContent(encryptedURI, address(mockMembership), requiredTier);
        
        // Set viewer as member of required tier
        mockMembership.setMemberStatus(viewer, requiredTier, true);
        
        vm.prank(viewer);
        string memory retrievedURI = registry.getContentURI(viewer, 0);
        
        assertEq(retrievedURI, encryptedURI);
    }
    
    function test_GetContentURI_RevertNoAccess() public {
        string memory encryptedURI = "encrypted://content-hash-123";
        uint256 requiredTier = 1;
        
        vm.prank(creator);
        registry.publishContent(encryptedURI, address(mockMembership), requiredTier);
        
        // Viewer is not a member
        mockMembership.setMemberStatus(viewer, requiredTier, false);
        
        vm.prank(viewer);
        vm.expectRevert("No access");
        registry.getContentURI(viewer, 0);
    }
    
    function test_GetContentURI_NoMembershipRequired() public {
        string memory encryptedURI = "encrypted://content-hash-123";
        
        vm.prank(creator);
        registry.publishContent(encryptedURI, address(0), 0);
        
        vm.prank(viewer);
        string memory retrievedURI = registry.getContentURI(viewer, 0);
        
        assertEq(retrievedURI, encryptedURI);
    }
    
    function test_GetContentURI_MemberWrongTier() public {
        string memory encryptedURI = "encrypted://content-hash-123";
        uint256 requiredTier = 2;
        
        vm.prank(creator);
        registry.publishContent(encryptedURI, address(mockMembership), requiredTier);
        
        // Set viewer as member of different tier
        mockMembership.setMemberStatus(viewer, 1, true);
        mockMembership.setMemberStatus(viewer, requiredTier, false);
        
        vm.prank(viewer);
        vm.expectRevert("No access");
        registry.getContentURI(viewer, 0);
    }
    
    function test_MultipleContent() public {
        string memory uri1 = "encrypted://content-1";
        string memory uri2 = "encrypted://content-2";
        string memory uri3 = "encrypted://content-3";
        
        vm.startPrank(creator);
        
        uint256 id1 = registry.publishContent(uri1, address(0), 0);
        uint256 id2 = registry.publishContent(uri2, address(mockMembership), 1);
        uint256 id3 = registry.publishContent(uri3, address(mockMembership), 2);
        
        vm.stopPrank();
        
        assertEq(id1, 0);
        assertEq(id2, 1);
        assertEq(id3, 2);
        assertEq(registry.nextContentId(), 3);
        
        // Check content 1 (no membership required)
        (address creator1, string memory retrievedUri1,,) = registry.contents(0);
        assertEq(creator1, creator);
        assertEq(retrievedUri1, uri1);
        
        // Check content 2 (tier 1 required)
        (address creator2, string memory retrievedUri2, address nft2, uint256 tier2) = registry.contents(1);
        assertEq(creator2, creator);
        assertEq(retrievedUri2, uri2);
        assertEq(nft2, address(mockMembership));
        assertEq(tier2, 1);
        
        // Check content 3 (tier 2 required) - simplified
        (,, address nft3, uint256 tier3) = registry.contents(2);
        assertEq(nft3, address(mockMembership));
        assertEq(tier3, 2);
    }
    
    function test_AuthorizeUpgrade_OnlyOwner() public {
        address newImplementation = address(new GatedContentRegistry());
        
        vm.prank(deployer);
        registry.upgradeToAndCall(newImplementation, "");
        
        // Should not revert
    }
    
    function test_AuthorizeUpgrade_RevertNotOwner() public {
        address newImplementation = address(new GatedContentRegistry());
        
        vm.prank(creator);
        vm.expectRevert();
        registry.upgradeToAndCall(newImplementation, "");
    }
    
    function test_DifferentCreators() public {
        address creator2 = makeAddr("creator2");
        string memory uri1 = "encrypted://creator1-content";
        string memory uri2 = "encrypted://creator2-content";
        
        vm.prank(creator);
        registry.publishContent(uri1, address(0), 0);
        
        vm.prank(creator2);
        registry.publishContent(uri2, address(0), 0);
        
        // Creator 1 can access their content
        vm.prank(creator);
        string memory retrievedUri1 = registry.getContentURI(creator, 0);
        assertEq(retrievedUri1, uri1);
        
        // Creator 2 can access their content
        vm.prank(creator2);
        string memory retrievedUri2 = registry.getContentURI(creator2, 1);
        assertEq(retrievedUri2, uri2);
        
        // Creator 1 cannot access creator 2's content (no membership)
        vm.prank(creator);
        string memory publicUri = registry.getContentURI(creator, 1);
        assertEq(publicUri, uri2); // Should work since no membership required
    }
    
    function test_EmptyURI() public {
        string memory emptyURI = "";
        
        vm.prank(creator);
        uint256 contentId = registry.publishContent(emptyURI, address(0), 0);
        
        vm.prank(creator);
        string memory retrievedURI = registry.getContentURI(creator, contentId);
        
        assertEq(retrievedURI, emptyURI);
    }
    
    function testFuzz_PublishContent(string memory uri, uint256 tier) public {
        vm.assume(bytes(uri).length <= 1000); // Reasonable URI length
        vm.assume(tier <= 100); // Reasonable tier number
        
        vm.prank(creator);
        uint256 contentId = registry.publishContent(uri, address(mockMembership), tier);
        
        (address contentCreator, string memory retrievedUri, address nft, uint256 retrievedTier) = registry.contents(contentId);
        
        assertEq(contentCreator, creator);
        assertEq(retrievedUri, uri);
        assertEq(nft, address(mockMembership));
        assertEq(retrievedTier, tier);
    }
}
