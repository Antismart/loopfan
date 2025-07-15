// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TipJar} from "../src/TipJar.sol";
import {MembershipNFT} from "../src/MembershipNFT.sol";
import {GatedContentRegistry} from "../src/GatedContentRegistry.sol";
import {FanRewards} from "../src/FanRewards.sol";

contract InteractScript is Script {
    function run() external view {
        // Load deployed contract addresses from environment or command line
        address tipJarAddr = vm.envOr("TIPJAR_ADDRESS", address(0));
        address membershipAddr = vm.envOr("MEMBERSHIP_NFT_ADDRESS", address(0));
        address contentAddr = vm.envOr("CONTENT_REGISTRY_ADDRESS", address(0));
        address rewardsAddr = vm.envOr("FAN_REWARDS_ADDRESS", address(0));
        
        if (tipJarAddr != address(0)) {
            checkTipJar(tipJarAddr);
        }
        
        if (membershipAddr != address(0)) {
            checkMembershipNFT(membershipAddr);
        }
        
        if (contentAddr != address(0)) {
            checkContentRegistry(contentAddr);
        }
        
        if (rewardsAddr != address(0)) {
            checkFanRewards(rewardsAddr);
        }
    }
    
    function checkTipJar(address addr) internal view {
        console.log("\n=== TipJar Status ===");
        console.log("Address:", addr);
        
        TipJar tipJar = TipJar(addr);
        console.log("Creator:", tipJar.creator());
        console.log("USDC:", tipJar.usdc());
        console.log("Referral Fee (bps):", tipJar.referralFeeBps());
        console.log("Owner:", tipJar.owner());
    }
    
    function checkMembershipNFT(address addr) internal view {
        console.log("\n=== MembershipNFT Status ===");
        console.log("Address:", addr);
        
        MembershipNFT membership = MembershipNFT(addr);
        console.log("Creator:", membership.creator());
        console.log("USDC:", membership.usdc());
        console.log("Next Tier ID:", membership.nextTierId());
        console.log("Owner:", membership.owner());
        console.log("URI:", membership.uri(0));
        
        // Display tier information
        uint256 nextTierId = membership.nextTierId();
        for (uint256 i = 0; i < nextTierId; i++) {
            (uint256 priceETH, uint256 priceUSDC, uint256 duration, bool active) = membership.tiers(i);
            console.log(
                string.concat(
                    "Tier ", vm.toString(i), ": ",
                    vm.toString(priceETH), " ETH / ",
                    vm.toString(priceUSDC), " USDC / ",
                    vm.toString(duration), "s / ",
                    active ? "Active" : "Inactive"
                )
            );
        }
    }
    
    function checkContentRegistry(address addr) internal view {
        console.log("\n=== GatedContentRegistry Status ===");
        console.log("Address:", addr);
        
        GatedContentRegistry registry = GatedContentRegistry(addr);
        console.log("Next Content ID:", registry.nextContentId());
        console.log("Owner:", registry.owner());
    }
    
    function checkFanRewards(address addr) internal view {
        console.log("\n=== FanRewards Status ===");
        console.log("Address:", addr);
        
        FanRewards rewards = FanRewards(addr);
        console.log("Creator:", rewards.creator());
        console.log("Owner:", rewards.owner());
        console.log("URI:", rewards.uri(0));
    }
}

// Usage examples:
contract ExampleInteractions is Script {
    function tipWithETH() external {
        address tipJarAddr = vm.envAddress("TIPJAR_ADDRESS");
        uint256 userPrivateKey = vm.envUint("USER_PRIVATE_KEY");
        
        vm.startBroadcast(userPrivateKey);
        
        TipJar tipJar = TipJar(tipJarAddr);
        tipJar.tipETH{value: 0.001 ether}("Great content!", address(0));
        
        vm.stopBroadcast();
        console.log("Tip sent!");
    }
    
    function buyMembership() external {
        address membershipAddr = vm.envAddress("MEMBERSHIP_NFT_ADDRESS");
        uint256 userPrivateKey = vm.envUint("USER_PRIVATE_KEY");
        uint256 tierId = vm.envUint("TIER_ID");
        
        vm.startBroadcast(userPrivateKey);
        
        MembershipNFT membership = MembershipNFT(membershipAddr);
        (uint256 priceETH,,,) = membership.tiers(tierId);
        
        membership.mintETH{value: priceETH}(tierId);
        
        vm.stopBroadcast();
        console.log("Membership purchased for tier:", tierId);
    }
    
    function publishContent() external {
        address contentAddr = vm.envAddress("CONTENT_REGISTRY_ADDRESS");
        address membershipAddr = vm.envAddress("MEMBERSHIP_NFT_ADDRESS");
        uint256 creatorPrivateKey = vm.envUint("CREATOR_PRIVATE_KEY");
        
        vm.startBroadcast(creatorPrivateKey);
        
        GatedContentRegistry registry = GatedContentRegistry(contentAddr);
        uint256 contentId = registry.publishContent(
            "encrypted://QmExampleHash123",
            membershipAddr,
            1 // Require tier 1 membership
        );
        
        vm.stopBroadcast();
        console.log("Content published with ID:", contentId);
    }
}
