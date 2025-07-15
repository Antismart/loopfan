// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TipJar} from "../src/TipJar.sol";
import {MembershipNFT} from "../src/MembershipNFT.sol";
import {GatedContentRegistry} from "../src/GatedContentRegistry.sol";
import {FanRewards} from "../src/FanRewards.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployScript is Script {
    // Configuration
    address public constant USDC_ADDRESS = 0xA0B86a33E6441b8Dc30c5Fc08Ca6b8E5dBb4cEcA; // Base Sepolia USDC
    string public constant MEMBERSHIP_URI = "https://api.looopfan.com/membership/{id}";
    string public constant REWARDS_URI = "https://api.looopfan.com/rewards/{id}";
    uint256 public constant REFERRAL_FEE_BPS = 500; // 5%
    
    // Deployed contract addresses
    TipJar public tipJar;
    MembershipNFT public membershipNFT;
    GatedContentRegistry public contentRegistry;
    FanRewards public fanRewards;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address creator = vm.envAddress("CREATOR_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying contracts...");
        console.log("Deployer:", deployer);
        console.log("Creator:", creator);
        console.log("USDC Address:", USDC_ADDRESS);
        
        // Deploy TipJar
        deployTipJar(creator);
        
        // Deploy MembershipNFT
        deployMembershipNFT(creator);
        
        // Deploy GatedContentRegistry
        deployGatedContentRegistry();
        
        // Deploy FanRewards
        deployFanRewards(creator);
        
        vm.stopBroadcast();
        
        // Log deployed addresses
        logDeployedAddresses();
        
        // Save deployment information
        saveDeploymentInfo();
    }
    
    function deployTipJar(address creator) internal {
        console.log("\n=== Deploying TipJar ===");
        
        // Deploy implementation
        TipJar implementation = new TipJar();
        console.log("TipJar implementation:", address(implementation));
        
        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            TipJar.initialize.selector,
            creator,
            USDC_ADDRESS,
            REFERRAL_FEE_BPS
        );
        
        // Deploy proxy
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        tipJar = TipJar(address(proxy));
        
        console.log("TipJar proxy:", address(tipJar));
        console.log("TipJar creator:", tipJar.creator());
        console.log("TipJar referral fee:", tipJar.referralFeeBps(), "bps");
    }
    
    function deployMembershipNFT(address creator) internal {
        console.log("\n=== Deploying MembershipNFT ===");
        
        // Deploy implementation
        MembershipNFT implementation = new MembershipNFT();
        console.log("MembershipNFT implementation:", address(implementation));
        
        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            MembershipNFT.initialize.selector,
            creator,
            USDC_ADDRESS,
            MEMBERSHIP_URI
        );
        
        // Deploy proxy
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        membershipNFT = MembershipNFT(address(proxy));
        
        console.log("MembershipNFT proxy:", address(membershipNFT));
        console.log("MembershipNFT creator:", membershipNFT.creator());
        console.log("MembershipNFT URI:", membershipNFT.uri(0));
    }
    
    function deployGatedContentRegistry() internal {
        console.log("\n=== Deploying GatedContentRegistry ===");
        
        // Deploy implementation
        GatedContentRegistry implementation = new GatedContentRegistry();
        console.log("GatedContentRegistry implementation:", address(implementation));
        
        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            GatedContentRegistry.initialize.selector
        );
        
        // Deploy proxy
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        contentRegistry = GatedContentRegistry(address(proxy));
        
        console.log("GatedContentRegistry proxy:", address(contentRegistry));
        console.log("GatedContentRegistry owner:", contentRegistry.owner());
    }
    
    function deployFanRewards(address creator) internal {
        console.log("\n=== Deploying FanRewards ===");
        
        // Deploy implementation
        FanRewards implementation = new FanRewards();
        console.log("FanRewards implementation:", address(implementation));
        
        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            FanRewards.initialize.selector,
            creator,
            REWARDS_URI
        );
        
        // Deploy proxy
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        fanRewards = FanRewards(address(proxy));
        
        console.log("FanRewards proxy:", address(fanRewards));
        console.log("FanRewards creator:", fanRewards.creator());
        console.log("FanRewards URI:", fanRewards.uri(0));
    }
    
    function logDeployedAddresses() internal view {
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("TipJar:", address(tipJar));
        console.log("MembershipNFT:", address(membershipNFT));
        console.log("GatedContentRegistry:", address(contentRegistry));
        console.log("FanRewards:", address(fanRewards));
        console.log("========================");
    }
    
    function saveDeploymentInfo() internal {
        string memory deploymentInfo = string.concat(
            "{\n",
            '  "network": "base-sepolia",\n',
            '  "chainId": 84532,\n',
            '  "contracts": {\n',
            '    "TipJar": "', vm.toString(address(tipJar)), '",\n',
            '    "MembershipNFT": "', vm.toString(address(membershipNFT)), '",\n',
            '    "GatedContentRegistry": "', vm.toString(address(contentRegistry)), '",\n',
            '    "FanRewards": "', vm.toString(address(fanRewards)), '"\n',
            '  },\n',
            '  "configuration": {\n',
            '    "usdcAddress": "', vm.toString(USDC_ADDRESS), '",\n',
            '    "referralFeeBps": ', vm.toString(REFERRAL_FEE_BPS), ',\n',
            '    "membershipURI": "', MEMBERSHIP_URI, '",\n',
            '    "rewardsURI": "', REWARDS_URI, '"\n',
            '  }\n',
            "}\n"
        );
        
        vm.writeFile("deployments/base-sepolia.json", deploymentInfo);
        console.log("\nDeployment info saved to deployments/base-sepolia.json");
    }
}
