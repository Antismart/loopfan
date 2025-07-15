// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TipJar} from "../src/TipJar.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Mock USDC contract for testing
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

contract TipJarTest is Test {
    TipJar public tipJarImplementation;
    TipJar public tipJar;
    MockUSDC public usdc;
    
    address public creator = makeAddr("creator");
    address public tipper = makeAddr("tipper");
    address public referrer = makeAddr("referrer");
    address public deployer = makeAddr("deployer");
    
    uint256 public constant REFERRAL_FEE_BPS = 500; // 5%
    
    event TipReceived(
        address indexed tipper, 
        uint256 amount, 
        address token, 
        string message, 
        address indexed referrer, 
        uint256 referralAmount
    );
    
    function setUp() public {
        vm.startPrank(deployer);
        
        // Deploy mock USDC
        usdc = new MockUSDC();
        
        // Deploy TipJar implementation
        tipJarImplementation = new TipJar();
        
        // Deploy proxy and initialize
        bytes memory initData = abi.encodeWithSelector(
            TipJar.initialize.selector,
            creator,
            address(usdc),
            REFERRAL_FEE_BPS
        );
        
        ERC1967Proxy proxy = new ERC1967Proxy(address(tipJarImplementation), initData);
        tipJar = TipJar(address(proxy));
        
        vm.stopPrank();
        
        // Give tipper some ETH and USDC
        vm.deal(tipper, 10 ether);
        usdc.mint(tipper, 10000 * 10**6); // 10,000 USDC
        
        // Give referrer some ETH
        vm.deal(referrer, 1 ether);
    }
    
    function test_Initialize() public {
        assertEq(tipJar.creator(), creator);
        assertEq(tipJar.usdc(), address(usdc));
        assertEq(tipJar.referralFeeBps(), REFERRAL_FEE_BPS);
        assertEq(tipJar.owner(), creator);
    }
    
    function test_TipETH_WithoutReferrer() public {
        uint256 tipAmount = 1 ether;
        string memory message = "Great content!";
        
        uint256 creatorBalanceBefore = creator.balance;
        
        vm.expectEmit(true, true, false, true);
        emit TipReceived(tipper, tipAmount, address(0), message, address(0), 0);
        
        vm.prank(tipper);
        tipJar.tipETH{value: tipAmount}(message, address(0));
        
        assertEq(creator.balance, creatorBalanceBefore + tipAmount);
    }
    
    function test_TipETH_WithReferrer() public {
        uint256 tipAmount = 1 ether;
        string memory message = "Great content!";
        uint256 expectedReferralAmount = (tipAmount * REFERRAL_FEE_BPS) / 10000;
        uint256 expectedCreatorAmount = tipAmount - expectedReferralAmount;
        
        uint256 creatorBalanceBefore = creator.balance;
        uint256 referrerBalanceBefore = referrer.balance;
        
        vm.expectEmit(true, true, false, true);
        emit TipReceived(tipper, tipAmount, address(0), message, referrer, expectedReferralAmount);
        
        vm.prank(tipper);
        tipJar.tipETH{value: tipAmount}(message, referrer);
        
        assertEq(creator.balance, creatorBalanceBefore + expectedCreatorAmount);
        assertEq(referrer.balance, referrerBalanceBefore + expectedReferralAmount);
    }
    
    function test_TipETH_ReferrerIsSender() public {
        uint256 tipAmount = 1 ether;
        string memory message = "Great content!";
        
        uint256 creatorBalanceBefore = creator.balance;
        
        vm.expectEmit(true, true, false, true);
        emit TipReceived(tipper, tipAmount, address(0), message, tipper, 0);
        
        vm.prank(tipper);
        tipJar.tipETH{value: tipAmount}(message, tipper);
        
        // Should not pay referral fee to self
        assertEq(creator.balance, creatorBalanceBefore + tipAmount);
    }
    
    function test_TipETH_RevertZeroAmount() public {
        vm.prank(tipper);
        vm.expectRevert("No ETH sent");
        tipJar.tipETH{value: 0}("message", address(0));
    }
    
    function test_TipUSDC_WithoutReferrer() public {
        uint256 tipAmount = 100 * 10**6; // 100 USDC
        string memory message = "Great content!";
        
        // Approve USDC transfer
        vm.prank(tipper);
        usdc.approve(address(tipJar), tipAmount);
        
        uint256 creatorBalanceBefore = usdc.balanceOf(creator);
        
        vm.expectEmit(true, true, false, true);
        emit TipReceived(tipper, tipAmount, address(usdc), message, address(0), 0);
        
        vm.prank(tipper);
        tipJar.tipUSDC(tipAmount, message, address(0));
        
        assertEq(usdc.balanceOf(creator), creatorBalanceBefore + tipAmount);
        assertEq(usdc.balanceOf(tipper), 10000 * 10**6 - tipAmount);
    }
    
    function test_TipUSDC_WithReferrer() public {
        uint256 tipAmount = 100 * 10**6; // 100 USDC
        string memory message = "Great content!";
        uint256 expectedReferralAmount = (tipAmount * REFERRAL_FEE_BPS) / 10000;
        uint256 expectedCreatorAmount = tipAmount - expectedReferralAmount;
        
        // Approve USDC transfer
        vm.prank(tipper);
        usdc.approve(address(tipJar), tipAmount);
        
        uint256 creatorBalanceBefore = usdc.balanceOf(creator);
        uint256 referrerBalanceBefore = usdc.balanceOf(referrer);
        
        vm.expectEmit(true, true, false, true);
        emit TipReceived(tipper, tipAmount, address(usdc), message, referrer, expectedReferralAmount);
        
        vm.prank(tipper);
        tipJar.tipUSDC(tipAmount, message, referrer);
        
        assertEq(usdc.balanceOf(creator), creatorBalanceBefore + expectedCreatorAmount);
        assertEq(usdc.balanceOf(referrer), referrerBalanceBefore + expectedReferralAmount);
    }
    
    function test_TipUSDC_RevertZeroAmount() public {
        vm.prank(tipper);
        vm.expectRevert("No USDC sent");
        tipJar.tipUSDC(0, "message", address(0));
    }
    
    function test_TipUSDC_RevertInsufficientAllowance() public {
        uint256 tipAmount = 100 * 10**6; // 100 USDC
        
        vm.prank(tipper);
        vm.expectRevert("ERC20: transfer amount exceeds allowance");
        tipJar.tipUSDC(tipAmount, "message", address(0));
    }
    
    function test_SetReferralFee() public {
        uint256 newFee = 300; // 3%
        
        vm.prank(creator);
        tipJar.setReferralFee(newFee);
        
        assertEq(tipJar.referralFeeBps(), newFee);
    }
    
    function test_SetReferralFee_RevertTooHigh() public {
        uint256 newFee = 1100; // 11%
        
        vm.prank(creator);
        vm.expectRevert("Max 10%");
        tipJar.setReferralFee(newFee);
    }
    
    function test_SetReferralFee_RevertNotOwner() public {
        uint256 newFee = 300; // 3%
        
        vm.prank(tipper);
        vm.expectRevert();
        tipJar.setReferralFee(newFee);
    }
    
    function test_AuthorizeUpgrade_OnlyOwner() public {
        address newImplementation = address(new TipJar());
        
        vm.prank(creator);
        tipJar.upgradeToAndCall(newImplementation, "");
        
        // Should not revert
    }
    
    function test_AuthorizeUpgrade_RevertNotOwner() public {
        address newImplementation = address(new TipJar());
        
        vm.prank(tipper);
        vm.expectRevert();
        tipJar.upgradeToAndCall(newImplementation, "");
    }
    
    function testFuzz_TipETH(uint256 tipAmount) public {
        vm.assume(tipAmount > 0 && tipAmount <= 10 ether);
        
        vm.deal(tipper, tipAmount);
        
        uint256 creatorBalanceBefore = creator.balance;
        
        vm.prank(tipper);
        tipJar.tipETH{value: tipAmount}("fuzz test", address(0));
        
        assertEq(creator.balance, creatorBalanceBefore + tipAmount);
    }
    
    function testFuzz_TipUSDC(uint256 tipAmount) public {
        vm.assume(tipAmount > 0 && tipAmount <= 10000 * 10**6);
        
        usdc.mint(tipper, tipAmount);
        
        vm.prank(tipper);
        usdc.approve(address(tipJar), tipAmount);
        
        uint256 creatorBalanceBefore = usdc.balanceOf(creator);
        
        vm.prank(tipper);
        tipJar.tipUSDC(tipAmount, "fuzz test", address(0));
        
        assertEq(usdc.balanceOf(creator), creatorBalanceBefore + tipAmount);
    }
}
