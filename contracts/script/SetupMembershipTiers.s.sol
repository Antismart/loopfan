// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MembershipNFT} from "../src/MembershipNFT.sol";

contract SetupMembershipTiers is Script {
    function run() external {
        address membershipNFTAddress = vm.envAddress("MEMBERSHIP_NFT_ADDRESS");
        uint256 creatorPrivateKey = vm.envUint("CREATOR_PRIVATE_KEY");
        
        MembershipNFT membership = MembershipNFT(membershipNFTAddress);
        
        vm.startBroadcast(creatorPrivateKey);
        
        console.log("Setting up membership tiers for:", membershipNFTAddress);
        
        // Tier 0: Basic (1 month)
        membership.createTier(
            0.01 ether,        // 0.01 ETH
            10 * 10**6,        // 10 USDC
            30 days            // 30 days duration
        );
        console.log("Created Tier 0: Basic - 0.01 ETH / 10 USDC for 30 days");
        
        // Tier 1: Premium (3 months)
        membership.createTier(
            0.025 ether,       // 0.025 ETH
            25 * 10**6,        // 25 USDC
            90 days            // 90 days duration
        );
        console.log("Created Tier 1: Premium - 0.025 ETH / 25 USDC for 90 days");
        
        // Tier 2: VIP (6 months)
        membership.createTier(
            0.04 ether,        // 0.04 ETH
            40 * 10**6,        // 40 USDC
            180 days           // 180 days duration
        );
        console.log("Created Tier 2: VIP - 0.04 ETH / 40 USDC for 180 days");
        
        // Tier 3: Lifetime (1 year)
        membership.createTier(
            0.1 ether,         // 0.1 ETH
            100 * 10**6,       // 100 USDC
            365 days           // 365 days duration
        );
        console.log("Created Tier 3: Lifetime - 0.1 ETH / 100 USDC for 365 days");
        
        vm.stopBroadcast();
        
        console.log("\nMembership tiers setup completed!");
        console.log("Next tier ID:", membership.nextTierId());
    }
}
