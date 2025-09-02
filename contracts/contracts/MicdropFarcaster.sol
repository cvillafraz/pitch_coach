// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title MicdropFarcaster
 * @dev Smart contract for Micdrop pitch coaching app integrated with Farcaster
 * Handles premium session payments and subscription management
 */
contract MicdropFarcaster is ReentrancyGuard, Ownable, Pausable {
    
    // Payment types
    enum PaymentType { 
        PREMIUM_SESSION, 
        MONTHLY_SUBSCRIPTION, 
        YEARLY_SUBSCRIPTION 
    }
    
    // Payment structure
    struct Payment {
        address user;
        PaymentType paymentType;
        uint256 amount;
        uint256 timestamp;
        bool isActive;
    }
    
    // Subscription structure
    struct Subscription {
        PaymentType subscriptionType;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }
    
    // Payment amounts in wei
    uint256 public constant PREMIUM_SESSION_PRICE = 0.001 ether;
    uint256 public constant MONTHLY_SUBSCRIPTION_PRICE = 0.05 ether;
    uint256 public constant YEARLY_SUBSCRIPTION_PRICE = 0.5 ether;
    
    // Mappings
    mapping(address => uint256) public premiumSessionsRemaining;
    mapping(address => Subscription) public userSubscriptions;
    mapping(bytes32 => Payment) public payments;
    mapping(address => bool) public authorizedFrames;
    
    // Events
    event PaymentReceived(
        address indexed user, 
        PaymentType indexed paymentType, 
        uint256 amount, 
        bytes32 paymentId
    );
    
    event SubscriptionActivated(
        address indexed user, 
        PaymentType indexed subscriptionType, 
        uint256 startTime, 
        uint256 endTime
    );
    
    event PremiumSessionUsed(address indexed user, uint256 sessionsRemaining);
    event FrameAuthorized(address indexed frame, bool authorized);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor() {}
    
    /**
     * @dev Purchase a premium session
     */
    function purchasePremiumSession() external payable nonReentrant whenNotPaused {
        require(msg.value == PREMIUM_SESSION_PRICE, "Incorrect payment amount");
        
        bytes32 paymentId = keccak256(abi.encodePacked(
            msg.sender, 
            block.timestamp, 
            PaymentType.PREMIUM_SESSION
        ));
        
        payments[paymentId] = Payment({
            user: msg.sender,
            paymentType: PaymentType.PREMIUM_SESSION,
            amount: msg.value,
            timestamp: block.timestamp,
            isActive: true
        });
        
        premiumSessionsRemaining[msg.sender] += 1;
        
        emit PaymentReceived(msg.sender, PaymentType.PREMIUM_SESSION, msg.value, paymentId);
    }
    
    /**
     * @dev Purchase monthly subscription
     */
    function purchaseMonthlySubscription() external payable nonReentrant whenNotPaused {
        require(msg.value == MONTHLY_SUBSCRIPTION_PRICE, "Incorrect payment amount");
        _activateSubscription(PaymentType.MONTHLY_SUBSCRIPTION, 30 days);
    }
    
    /**
     * @dev Purchase yearly subscription
     */
    function purchaseYearlySubscription() external payable nonReentrant whenNotPaused {
        require(msg.value == YEARLY_SUBSCRIPTION_PRICE, "Incorrect payment amount");
        _activateSubscription(PaymentType.YEARLY_SUBSCRIPTION, 365 days);
    }
    
    /**
     * @dev Internal function to activate subscription
     */
    function _activateSubscription(PaymentType subscriptionType, uint256 duration) internal {
        bytes32 paymentId = keccak256(abi.encodePacked(
            msg.sender, 
            block.timestamp, 
            subscriptionType
        ));
        
        payments[paymentId] = Payment({
            user: msg.sender,
            paymentType: subscriptionType,
            amount: msg.value,
            timestamp: block.timestamp,
            isActive: true
        });
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;
        
        // If user has existing subscription, extend it
        if (userSubscriptions[msg.sender].isActive && 
            userSubscriptions[msg.sender].endTime > block.timestamp) {
            startTime = userSubscriptions[msg.sender].endTime;
            endTime = startTime + duration;
        }
        
        userSubscriptions[msg.sender] = Subscription({
            subscriptionType: subscriptionType,
            startTime: startTime,
            endTime: endTime,
            isActive: true
        });
        
        emit PaymentReceived(msg.sender, subscriptionType, msg.value, paymentId);
        emit SubscriptionActivated(msg.sender, subscriptionType, startTime, endTime);
    }
    
    /**
     * @dev Use a premium session (called by authorized frame)
     */
    function usePremiumSession(address user) external {
        require(authorizedFrames[msg.sender] || msg.sender == owner(), "Not authorized");
        require(hasPremiumAccess(user), "No premium access");
        
        if (!hasActiveSubscription(user)) {
            require(premiumSessionsRemaining[user] > 0, "No premium sessions remaining");
            premiumSessionsRemaining[user] -= 1;
            emit PremiumSessionUsed(user, premiumSessionsRemaining[user]);
        }
    }
    
    /**
     * @dev Check if user has premium access (subscription or sessions)
     */
    function hasPremiumAccess(address user) public view returns (bool) {
        return hasActiveSubscription(user) || premiumSessionsRemaining[user] > 0;
    }
    
    /**
     * @dev Check if user has active subscription
     */
    function hasActiveSubscription(address user) public view returns (bool) {
        Subscription memory sub = userSubscriptions[user];
        return sub.isActive && 
               sub.startTime <= block.timestamp && 
               sub.endTime > block.timestamp;
    }
    
    /**
     * @dev Get user subscription info
     */
    function getUserSubscription(address user) external view returns (
        PaymentType subscriptionType,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        uint256 sessionsRemaining
    ) {
        Subscription memory sub = userSubscriptions[user];
        return (
            sub.subscriptionType,
            sub.startTime,
            sub.endTime,
            hasActiveSubscription(user),
            premiumSessionsRemaining[user]
        );
    }
    
    /**
     * @dev Authorize/deauthorize frame contracts
     */
    function setFrameAuthorization(address frame, bool authorized) external onlyOwner {
        authorizedFrames[frame] = authorized;
        emit FrameAuthorized(frame, authorized);
    }
    
    /**
     * @dev Withdraw contract funds
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get payment info by ID
     */
    function getPayment(bytes32 paymentId) external view returns (
        address user,
        PaymentType paymentType,
        uint256 amount,
        uint256 timestamp,
        bool isActive
    ) {
        Payment memory payment = payments[paymentId];
        return (
            payment.user,
            payment.paymentType,
            payment.amount,
            payment.timestamp,
            payment.isActive
        );
    }
    
    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {
        // Allow contract to receive ETH
    }
}