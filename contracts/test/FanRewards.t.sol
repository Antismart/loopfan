// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FanRewards} from "../src/FanRewards.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract FanRewardsTest is Test {
    FanRewards public rewardsImplementation;
    FanRewards public rewards;
    
    address public creator = makeAddr("creator");
    address public fan = makeAddr("fan");
    address public deployer = makeAddr("deployer");
    
    string public constant URI = "https://api.example.com/rewards/{id}";
    
    event RewardSent(address indexed to, uint256 indexed rewardId);
    
    function setUp() public {
        vm.startPrank(deployer);
        
        // Deploy FanRewards implementation
        rewardsImplementation = new FanRewards();
        
        // Deploy proxy and initialize
        bytes memory initData = abi.encodeWithSelector(
            FanRewards.initialize.selector,
            creator,
            URI
        );
        
        ERC1967Proxy proxy = new ERC1967Proxy(address(rewardsImplementation), initData);
        rewards = FanRewards(address(proxy));
        
        vm.stopPrank();
    }
    
    function test_Initialize() public {
        assertEq(rewards.creator(), creator);
        assertEq(rewards.owner(), creator);
        assertEq(rewards.uri(0), URI);
        assertEq(rewards.tipVolume(fan), 0);
        assertFalse(rewards.isHolder(fan));
    }
    
    function test_RecordTip() public {
        uint256 tipAmount = 1 ether;
        
        vm.prank(creator);
        rewards.recordTip(fan, tipAmount);
        
        assertEq(rewards.tipVolume(fan), tipAmount);
        // Note: isHolder is not automatically set by recordTip
        assertFalse(rewards.isHolder(fan));
    }
    
    function test_RecordTip_RevertNotCreator() public {
        uint256 tipAmount = 1 ether;
        
        vm.prank(fan);
        vm.expectRevert();
        rewards.recordTip(fan, tipAmount);
    }
    
    function test_RecordNFT() public {
        vm.prank(creator);
        rewards.recordNFT(fan);
        
        assertTrue(rewards.isHolder(fan));
    }
    
    function test_RecordNFT_RevertNotCreator() public {
        vm.prank(fan);
        vm.expectRevert();
        rewards.recordNFT(fan);
    }
    
    function test_RecordTip_Accumulative() public {
        uint256 firstTip = 0.5 ether;
        uint256 secondTip = 0.3 ether;
        uint256 expectedTotal = firstTip + secondTip;
        
        vm.startPrank(creator);
        rewards.recordTip(fan, firstTip);
        rewards.recordTip(fan, secondTip);
        vm.stopPrank();
        
        assertEq(rewards.tipVolume(fan), expectedTotal);
        // isHolder is not automatically set by recordTip
        assertFalse(rewards.isHolder(fan));
    }
    
    function test_AirdropReward() public {
        uint256 rewardId = 1;
        uint256 amount = 5;
        
        vm.expectEmit(true, true, false, true);
        emit RewardSent(fan, rewardId);
        
        vm.prank(creator);
        rewards.airdropReward(fan, rewardId, amount);
        
        assertEq(rewards.balanceOf(fan, rewardId), amount);
    }
    
    function test_AirdropReward_RevertNotCreator() public {
        uint256 rewardId = 1;
        uint256 amount = 5;
        
        vm.prank(fan);
        vm.expectRevert();
        rewards.airdropReward(fan, rewardId, amount);
    }
    
    function test_AirdropReward_MultipleRewards() public {
        uint256 rewardId1 = 1;
        uint256 rewardId2 = 2;
        uint256 amount1 = 3;
        uint256 amount2 = 7;
        
        vm.startPrank(creator);
        rewards.airdropReward(fan, rewardId1, amount1);
        rewards.airdropReward(fan, rewardId2, amount2);
        vm.stopPrank();
        
        assertEq(rewards.balanceOf(fan, rewardId1), amount1);
        assertEq(rewards.balanceOf(fan, rewardId2), amount2);
    }
    
    function test_AirdropReward_SameRewardMultipleTimes() public {
        uint256 rewardId = 1;
        uint256 firstAmount = 3;
        uint256 secondAmount = 2;
        uint256 expectedTotal = firstAmount + secondAmount;
        
        vm.startPrank(creator);
        rewards.airdropReward(fan, rewardId, firstAmount);
        rewards.airdropReward(fan, rewardId, secondAmount);
        vm.stopPrank();
        
        assertEq(rewards.balanceOf(fan, rewardId), expectedTotal);
    }
    
    function test_MultipleFans() public {
        address fan2 = makeAddr("fan2");
        uint256 tipAmount1 = 1 ether;
        uint256 tipAmount2 = 2 ether;
        uint256 rewardId = 1;
        uint256 rewardAmount = 5;
        
        vm.startPrank(creator);
        
        // Record tips for both fans
        rewards.recordTip(fan, tipAmount1);
        rewards.recordTip(fan2, tipAmount2);
        
        // Record NFT status for both fans
        rewards.recordNFT(fan);
        rewards.recordNFT(fan2);
        
        // Send rewards to both fans
        rewards.airdropReward(fan, rewardId, rewardAmount);
        rewards.airdropReward(fan2, rewardId, rewardAmount * 2);
        
        vm.stopPrank();
        
        // Check tip volumes
        assertEq(rewards.tipVolume(fan), tipAmount1);
        assertEq(rewards.tipVolume(fan2), tipAmount2);
        
        // Check holder status
        assertTrue(rewards.isHolder(fan));
        assertTrue(rewards.isHolder(fan2));
        
        // Check reward balances
        assertEq(rewards.balanceOf(fan, rewardId), rewardAmount);
        assertEq(rewards.balanceOf(fan2, rewardId), rewardAmount * 2);
    }
    
    function test_AuthorizeUpgrade_OnlyOwner() public {
        address newImplementation = address(new FanRewards());
        
        vm.prank(creator);
        rewards.upgradeToAndCall(newImplementation, "");
        
        // Should not revert
    }
    
    function test_AuthorizeUpgrade_RevertNotOwner() public {
        address newImplementation = address(new FanRewards());
        
        vm.prank(fan);
        vm.expectRevert();
        rewards.upgradeToAndCall(newImplementation, "");
    }
    
    function test_ERC1155_Transfer() public {
        uint256 rewardId = 1;
        uint256 amount = 10;
        address fan2 = makeAddr("fan2");
        
        // Send reward to fan
        vm.prank(creator);
        rewards.airdropReward(fan, rewardId, amount);
        
        // Fan transfers half to fan2
        vm.prank(fan);
        rewards.safeTransferFrom(fan, fan2, rewardId, amount / 2, "");
        
        assertEq(rewards.balanceOf(fan, rewardId), amount / 2);
        assertEq(rewards.balanceOf(fan2, rewardId), amount / 2);
    }
    
    function test_ERC1155_BatchTransfer() public {
        uint256[] memory rewardIds = new uint256[](2);
        uint256[] memory amounts = new uint256[](2);
        rewardIds[0] = 1;
        rewardIds[1] = 2;
        amounts[0] = 5;
        amounts[1] = 10;
        
        address fan2 = makeAddr("fan2");
        
        // Send rewards to fan
        vm.startPrank(creator);
        rewards.airdropReward(fan, rewardIds[0], amounts[0]);
        rewards.airdropReward(fan, rewardIds[1], amounts[1]);
        vm.stopPrank();
        
        // Fan transfers to fan2
        vm.prank(fan);
        rewards.safeBatchTransferFrom(fan, fan2, rewardIds, amounts, "");
        
        assertEq(rewards.balanceOf(fan, rewardIds[0]), 0);
        assertEq(rewards.balanceOf(fan, rewardIds[1]), 0);
        assertEq(rewards.balanceOf(fan2, rewardIds[0]), amounts[0]);
        assertEq(rewards.balanceOf(fan2, rewardIds[1]), amounts[1]);
    }
    
    function testFuzz_RecordTip(uint256 tipAmount) public {
        vm.assume(tipAmount > 0 && tipAmount <= 1000 ether);
        
        vm.prank(creator);
        rewards.recordTip(fan, tipAmount);
        
        assertEq(rewards.tipVolume(fan), tipAmount);
        // isHolder is not automatically set by recordTip
        assertFalse(rewards.isHolder(fan));
    }
    
    function testFuzz_AirdropReward(uint256 rewardId, uint256 amount) public {
        vm.assume(rewardId <= 1000);
        vm.assume(amount > 0 && amount <= 1000000);
        
        vm.prank(creator);
        rewards.airdropReward(fan, rewardId, amount);
        
        assertEq(rewards.balanceOf(fan, rewardId), amount);
    }
}
