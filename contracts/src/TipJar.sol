// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TipJar is OwnableUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    address public creator;
    address public usdc;
    uint256 public referralFeeBps; // e.g. 500 = 5%

    event TipReceived(address indexed tipper, uint256 amount, address token, string message, address indexed referrer, uint256 referralAmount);

    function initialize(address _creator, address _usdc, uint256 _referralFeeBps) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        creator = _creator;
        usdc = _usdc;
        referralFeeBps = _referralFeeBps;
        transferOwnership(_creator);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function tipETH(string calldata message, address referrer) external payable nonReentrant {
        require(msg.value > 0, "No ETH sent");
        uint256 referralAmount = 0;
        if (referrer != address(0) && referrer != msg.sender && referralFeeBps > 0) {
            referralAmount = (msg.value * referralFeeBps) / 10000;
            (bool sent, ) = referrer.call{value: referralAmount}("");
            require(sent, "Referral failed");
        }
        (bool sent2, ) = creator.call{value: msg.value - referralAmount}("");
        require(sent2, "Tip failed");
        emit TipReceived(msg.sender, msg.value, address(0), message, referrer, referralAmount);
    }

    function tipUSDC(uint256 amount, string calldata message, address referrer) external nonReentrant {
        require(amount > 0, "No USDC sent");
        uint256 referralAmount = 0;
        if (referrer != address(0) && referrer != msg.sender && referralFeeBps > 0) {
            referralAmount = (amount * referralFeeBps) / 10000;
            IERC20(usdc).transferFrom(msg.sender, referrer, referralAmount);
        }
        IERC20(usdc).transferFrom(msg.sender, creator, amount - referralAmount);
        emit TipReceived(msg.sender, amount, usdc, message, referrer, referralAmount);
    }

    function setReferralFee(uint256 bps) external onlyOwner {
        require(bps <= 1000, "Max 10%");
        referralFeeBps = bps;
    }
} 