// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MembershipNFT} from "../src/MembershipNFT.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Reuse MockUSDC from TipJar test
contract MockUSDC is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    
    string public name = "Mock USDC";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    
    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _transfer(from, to, amount);
        _approve(from, msg.sender, currentAllowance - amount);
        return true;
    }
    
    function mint(address to, uint256 amount) external {
        _totalSupply += amount;
        _balances[to] += amount;
    }
    
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(_balances[from] >= amount, "ERC20: transfer amount exceeds balance");
        
        _balances[from] -= amount;
        _balances[to] += amount;
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[owner][spender] = amount;
    }
}

contract MembershipNFTTest is Test {
    MembershipNFT public membershipImplementation;
    MembershipNFT public membership;
    MockUSDC public usdc;
    
    address public creator = makeAddr("creator");
    address public fan = makeAddr("fan");
    address public deployer = makeAddr("deployer");
    
    string public constant URI = "https://api.example.com/metadata/{id}";
    
    event MembershipMinted(address indexed fan, uint256 indexed tierId, uint256 expiration);
    
    function setUp() public {
        vm.startPrank(deployer);
        
        // Deploy mock USDC
        usdc = new MockUSDC();
        
        // Deploy MembershipNFT implementation
        membershipImplementation = new MembershipNFT();
        
        // Deploy proxy and initialize
        bytes memory initData = abi.encodeWithSelector(
            MembershipNFT.initialize.selector,
            creator,
            address(usdc),
            URI
        );
        
        ERC1967Proxy proxy = new ERC1967Proxy(address(membershipImplementation), initData);
        membership = MembershipNFT(address(proxy));
        
        vm.stopPrank();
        
        // Give fan some ETH and USDC
        vm.deal(fan, 10 ether);
        usdc.mint(fan, 10000 * 10**6); // 10,000 USDC
    }
    
    function test_Initialize() public {
        assertEq(membership.creator(), creator);
        assertEq(membership.usdc(), address(usdc));
        assertEq(membership.owner(), creator);
        assertEq(membership.uri(0), URI);
    }
    
    function test_CreateTier() public {
        uint256 priceETH = 0.1 ether;
        uint256 priceUSDC = 100 * 10**6; // 100 USDC
        uint256 duration = 30 days;
        
        vm.prank(creator);
        membership.createTier(priceETH, priceUSDC, duration);
        
        (uint256 tierPriceETH, uint256 tierPriceUSDC, uint256 tierDuration, bool active) = membership.tiers(0);
        
        assertEq(tierPriceETH, priceETH);
        assertEq(tierPriceUSDC, priceUSDC);
        assertEq(tierDuration, duration);
        assertTrue(active);
        assertEq(membership.nextTierId(), 1);
    }
    
    function test_CreateTier_RevertNotOwner() public {
        vm.prank(fan);
        vm.expectRevert();
        membership.createTier(0.1 ether, 100 * 10**6, 30 days);
    }
    
    function test_SetTierActive() public {
        // First create a tier
        vm.prank(creator);
        membership.createTier(0.1 ether, 100 * 10**6, 30 days);
        
        // Deactivate it
        vm.prank(creator);
        membership.setTierActive(0, false);
        
        (, , , bool active) = membership.tiers(0);
        assertFalse(active);
        
        // Reactivate it
        vm.prank(creator);
        membership.setTierActive(0, true);
        
        (, , , bool activeAgain) = membership.tiers(0);
        assertTrue(activeAgain);
    }
    
    function test_SetTierActive_RevertNotOwner() public {
        vm.prank(creator);
        membership.createTier(0.1 ether, 100 * 10**6, 30 days);
        
        vm.prank(fan);
        vm.expectRevert();
        membership.setTierActive(0, false);
    }
    
    function test_MintETH() public {
        uint256 priceETH = 0.1 ether;
        uint256 duration = 30 days;
        
        // Create tier
        vm.prank(creator);
        membership.createTier(priceETH, 0, duration);
        
        uint256 creatorBalanceBefore = creator.balance;
        uint256 expectedExpiration = block.timestamp + duration;
        
        vm.expectEmit(true, true, false, true);
        emit MembershipMinted(fan, 0, expectedExpiration);
        
        vm.prank(fan);
        membership.mintETH{value: priceETH}(0);
        
        // Check balances and NFT
        assertEq(creator.balance, creatorBalanceBefore + priceETH);
        assertEq(membership.balanceOf(fan, 0), 1);
        assertEq(membership.expirations(0, fan), expectedExpiration);
        assertTrue(membership.isMember(fan, 0));
    }
    
    function test_MintETH_RevertInactiveTier() public {
        uint256 priceETH = 0.1 ether;
        
        // Create and deactivate tier
        vm.prank(creator);
        membership.createTier(priceETH, 0, 30 days);
        
        vm.prank(creator);
        membership.setTierActive(0, false);
        
        vm.prank(fan);
        vm.expectRevert("Inactive");
        membership.mintETH{value: priceETH}(0);
    }
    
    function test_MintETH_RevertWrongPrice() public {
        uint256 priceETH = 0.1 ether;
        
        vm.prank(creator);
        membership.createTier(priceETH, 0, 30 days);
        
        vm.prank(fan);
        vm.expectRevert("Wrong ETH");
        membership.mintETH{value: 0.05 ether}(0);
    }
    
    function test_MintUSDC() public {
        uint256 priceUSDC = 100 * 10**6; // 100 USDC
        uint256 duration = 30 days;
        
        // Create tier
        vm.prank(creator);
        membership.createTier(0, priceUSDC, duration);
        
        // Approve USDC
        vm.prank(fan);
        usdc.approve(address(membership), priceUSDC);
        
        uint256 creatorBalanceBefore = usdc.balanceOf(creator);
        uint256 expectedExpiration = block.timestamp + duration;
        
        vm.expectEmit(true, true, false, true);
        emit MembershipMinted(fan, 0, expectedExpiration);
        
        vm.prank(fan);
        membership.mintUSDC(0);
        
        // Check balances and NFT
        assertEq(usdc.balanceOf(creator), creatorBalanceBefore + priceUSDC);
        assertEq(membership.balanceOf(fan, 0), 1);
        assertEq(membership.expirations(0, fan), expectedExpiration);
        assertTrue(membership.isMember(fan, 0));
    }
    
    function test_MintUSDC_RevertInactiveTier() public {
        uint256 priceUSDC = 100 * 10**6;
        
        // Create and deactivate tier
        vm.prank(creator);
        membership.createTier(0, priceUSDC, 30 days);
        
        vm.prank(creator);
        membership.setTierActive(0, false);
        
        vm.prank(fan);
        usdc.approve(address(membership), priceUSDC);
        
        vm.prank(fan);
        vm.expectRevert("Inactive");
        membership.mintUSDC(0);
    }
    
    function test_MintUSDC_RevertNoPriceSet() public {
        // Create tier with no USDC price
        vm.prank(creator);
        membership.createTier(0.1 ether, 0, 30 days);
        
        vm.prank(fan);
        vm.expectRevert("No USDC price");
        membership.mintUSDC(0);
    }
    
    function test_IsMember_Active() public {
        uint256 priceETH = 0.1 ether;
        uint256 duration = 30 days;
        
        vm.prank(creator);
        membership.createTier(priceETH, 0, duration);
        
        vm.prank(fan);
        membership.mintETH{value: priceETH}(0);
        
        assertTrue(membership.isMember(fan, 0));
    }
    
    function test_IsMember_Expired() public {
        uint256 priceETH = 0.1 ether;
        uint256 duration = 30 days;
        
        vm.prank(creator);
        membership.createTier(priceETH, 0, duration);
        
        vm.prank(fan);
        membership.mintETH{value: priceETH}(0);
        
        // Fast forward past expiration
        vm.warp(block.timestamp + duration + 1);
        
        assertFalse(membership.isMember(fan, 0));
    }
    
    function test_IsMember_NonExistent() public {
        assertFalse(membership.isMember(fan, 0));
    }
    
    function test_AuthorizeUpgrade_OnlyOwner() public {
        address newImplementation = address(new MembershipNFT());
        
        vm.prank(creator);
        membership.upgradeToAndCall(newImplementation, "");
        
        // Should not revert
    }
    
    function test_AuthorizeUpgrade_RevertNotOwner() public {
        address newImplementation = address(new MembershipNFT());
        
        vm.prank(fan);
        vm.expectRevert();
        membership.upgradeToAndCall(newImplementation, "");
    }
    
    function test_MultipleTiers() public {
        // Create multiple tiers
        vm.startPrank(creator);
        membership.createTier(0.1 ether, 50 * 10**6, 30 days);   // Tier 0
        membership.createTier(0.2 ether, 100 * 10**6, 60 days);  // Tier 1
        membership.createTier(0.5 ether, 250 * 10**6, 90 days);  // Tier 2
        vm.stopPrank();
        
        assertEq(membership.nextTierId(), 3);
        
        // Fan buys tier 1
        vm.prank(fan);
        membership.mintETH{value: 0.2 ether}(1);
        
        assertTrue(membership.isMember(fan, 1));
        assertFalse(membership.isMember(fan, 0));
        assertFalse(membership.isMember(fan, 2));
    }
    
    function testFuzz_CreateTier(uint256 priceETH, uint256 priceUSDC, uint256 duration) public {
        vm.assume(duration > 0 && duration <= 365 days);
        vm.assume(priceETH <= 100 ether);
        vm.assume(priceUSDC <= 1000000 * 10**6);
        
        vm.prank(creator);
        membership.createTier(priceETH, priceUSDC, duration);
        
        (uint256 tierPriceETH, uint256 tierPriceUSDC, uint256 tierDuration, bool active) = membership.tiers(0);
        
        assertEq(tierPriceETH, priceETH);
        assertEq(tierPriceUSDC, priceUSDC);
        assertEq(tierDuration, duration);
        assertTrue(active);
    }
}
