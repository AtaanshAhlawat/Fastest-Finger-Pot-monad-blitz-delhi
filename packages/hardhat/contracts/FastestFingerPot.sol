// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FastestFingerPot
 * @dev A speed-clicking game where players join by staking MON tokens
 *      and compete to click the fastest during a 15-second round.
 *      Winner takes the entire pot based on highest (clicks × stake) score.
 */
contract FastestFingerPot is ReentrancyGuard {
    // Round duration in seconds
    uint256 public constant ROUND_DURATION = 15; // Changed from "15 seconds" to just 15
    uint256 public constant INACTIVITY_TIMEOUT = 300; // 5 minutes in seconds (changed from 1 minute)
    uint256 public constant MIN_STAKE = 0.001 ether; // Added minimum stake
    
    // Current round state
    uint256 public roundStartTime;
    uint256 public currentRoundNumber;
    bool public roundActive;
    address public currentWinner;
    address public lastRoundWinner;
    uint256 public potSize;
    
    // Player data
    struct PlayerData {
        uint256 clicks;
        uint256 stake;
        bool hasJoined;
    }
    
    mapping(uint256 => mapping(address => PlayerData)) public roundPlayers;
    mapping(uint256 => address[]) public roundPlayerList;
    
    // Events
    event RoundStarted(uint256 indexed roundNumber, uint256 startTime);
    event PlayerJoined(uint256 indexed roundNumber, address indexed player, uint256 stake);
    event PlayerClicked(uint256 indexed roundNumber, address indexed player, uint256 totalClicks);
    event RoundEnded(uint256 indexed roundNumber, address indexed winner, uint256 potSize, uint256 score);
    event WinnerPaid(uint256 indexed roundNumber, address indexed winner, uint256 amount);
    event InactivityPayout(uint256 indexed roundNumber, address indexed recipient, uint256 amount);
    
    constructor() {
        roundStartTime = block.timestamp;
        roundActive = true;
        currentRoundNumber = 1;
        emit RoundStarted(currentRoundNumber, roundStartTime);
    }
    
    /**
     * @dev Join the current round by staking MON tokens
     */
    function joinRound() external payable nonReentrant {
        require(roundActive, "Round not active");
        require(!roundPlayers[currentRoundNumber][msg.sender].hasJoined, "Already joined this round");
        require(msg.value >= MIN_STAKE, "Minimum stake is 0.001 MON");
        require(block.timestamp < roundStartTime + ROUND_DURATION, "Round has ended");
        
        roundPlayers[currentRoundNumber][msg.sender] = PlayerData({
            clicks: 0,
            stake: msg.value,
            hasJoined: true
        });
        
        roundPlayerList[currentRoundNumber].push(msg.sender);
        potSize += msg.value;
        
        emit PlayerJoined(currentRoundNumber, msg.sender, msg.value);
    }
    
    /**
     * @dev Click button during active round
     */
    function click() external nonReentrant {
        require(roundActive, "Round not active");
        require(roundPlayers[currentRoundNumber][msg.sender].hasJoined, "Must join round first");
        require(block.timestamp < roundStartTime + ROUND_DURATION, "Round has ended");
        
        roundPlayers[currentRoundNumber][msg.sender].clicks++;
        
        emit PlayerClicked(currentRoundNumber, msg.sender, roundPlayers[currentRoundNumber][msg.sender].clicks);
    }
    
    /**
     * @dev End current round and determine winner
     */
    function endRound() external nonReentrant {
        require(roundActive, "Round not active");
        require(block.timestamp >= roundStartTime + ROUND_DURATION, "Round still active");
        
        address winner = address(0);
        uint256 highestScore = 0;
        
        // Find the player with highest (clicks × stake) score
        address[] memory players = roundPlayerList[currentRoundNumber];
        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            PlayerData memory data = roundPlayers[currentRoundNumber][player];
            uint256 score = data.clicks * data.stake;
            
            if (score > highestScore) {
                highestScore = score;
                winner = player;
            }
        }
        
        currentWinner = winner;
        uint256 winnerPot = potSize;
        uint256 winnerScore = highestScore;
        
        // Store winner for potential inactivity payout
        if (winner != address(0)) {
            lastRoundWinner = winner;
        }
        
        // Reset for next round
        roundActive = false;
        potSize = 0;
        
        emit RoundEnded(currentRoundNumber, winner, winnerPot, winnerScore);
        
        // Pay winner immediately
        if (winner != address(0) && winnerPot > 0) {
            (bool success, ) = payable(winner).call{value: winnerPot}("");
            require(success, "Transfer failed");
            emit WinnerPaid(currentRoundNumber, winner, winnerPot);
        }
        
        // Start next round
        currentRoundNumber++;
        roundStartTime = block.timestamp;
        roundActive = true;
        
        emit RoundStarted(currentRoundNumber, roundStartTime);
    }
    
    /**
     * @dev Check if round has ended
     */
    function isRoundEnded() public view returns (bool) {
        return block.timestamp >= roundStartTime + ROUND_DURATION;
    }
    
    /**
     * @dev Get time remaining in current round
     */
    function getTimeRemaining() public view returns (uint256) {
        if (!roundActive) return 0;
        if (block.timestamp >= roundStartTime + ROUND_DURATION) return 0;
        return (roundStartTime + ROUND_DURATION) - block.timestamp;
    }
    
    /**
     * @dev Get player's score for current round
     */
    function getPlayerScore(address player) public view returns (uint256) {
        PlayerData memory data = roundPlayers[currentRoundNumber][player];
        return data.clicks * data.stake;
    }
    
    /**
     * @dev Get player data for current round
     */
    function getPlayerData(address player) public view returns (
        uint256 clicks,
        uint256 stake,
        uint256 score,
        bool hasJoined
    ) {
        PlayerData memory data = roundPlayers[currentRoundNumber][player];
        return (data.clicks, data.stake, data.clicks * data.stake, data.hasJoined);
    }
    
    /**
     * @dev Get all players in current round
     */
    function getCurrentRoundPlayers() public view returns (address[] memory) {
        return roundPlayerList[currentRoundNumber];
    }
    
    /**
     * @dev Get leaderboard for current round
     */
    function getLeaderboard() public view returns (
        address[] memory players,
        uint256[] memory scores,
        uint256[] memory clicks,
        uint256[] memory stakes
    ) {
        address[] memory currentPlayers = roundPlayerList[currentRoundNumber];
        uint256 len = currentPlayers.length;
        
        players = new address[](len);
        scores = new uint256[](len);
        clicks = new uint256[](len);
        stakes = new uint256[](len);
        
        for (uint256 i = 0; i < len; i++) {
            address player = currentPlayers[i];
            PlayerData memory data = roundPlayers[currentRoundNumber][player];
            
            players[i] = player;
            clicks[i] = data.clicks;
            stakes[i] = data.stake;
            scores[i] = data.clicks * data.stake;
        }
        
        return (players, scores, clicks, stakes);
    }
    
    /**
     * @dev Get comprehensive round info
     */
    function getRoundInfo() public view returns (
        uint256 roundNumber,
        uint256 pot,
        uint256 playerCount,
        uint256 timeLeft,
        bool active
    ) {
        return (
            currentRoundNumber,
            potSize,
            roundPlayerList[currentRoundNumber].length,
            getTimeRemaining(),
            roundActive
        );
    }
    
    /**
     * @dev Claim inactivity payout - if no one joined for 5 minutes, last winner gets the pot
     */
    function claimInactivityPayout() external nonReentrant {
        require(roundActive, "Round not active");
        require(block.timestamp >= roundStartTime + INACTIVITY_TIMEOUT, "Inactivity timeout not reached");
        require(roundPlayerList[currentRoundNumber].length == 0, "Players have joined this round");
        require(lastRoundWinner != address(0), "No previous winner");
        require(address(this).balance > 0, "No funds to payout");
        
        uint256 payout = address(this).balance;
        potSize = 0;
        
        (bool success, ) = payable(lastRoundWinner).call{value: payout}("");
        require(success, "Transfer failed");
        
        emit InactivityPayout(currentRoundNumber, lastRoundWinner, payout);
        
        // Start new round
        currentRoundNumber++;
        roundStartTime = block.timestamp;
        emit RoundStarted(currentRoundNumber, roundStartTime);
    }
    
    /**
     * @dev Check if inactivity timeout has been reached
     */
    function canClaimInactivityPayout() public view returns (bool) {
        return roundActive &&
               block.timestamp >= roundStartTime + INACTIVITY_TIMEOUT &&
               roundPlayerList[currentRoundNumber].length == 0 &&
               lastRoundWinner != address(0) &&
               address(this).balance > 0;
    }
    
    /**
     * @dev Get time until inactivity payout can be claimed
     */
    function getTimeUntilInactivityPayout() public view returns (uint256) {
        if (!roundActive || roundPlayerList[currentRoundNumber].length > 0) return 0;
        if (block.timestamp >= roundStartTime + INACTIVITY_TIMEOUT) return 0;
        return (roundStartTime + INACTIVITY_TIMEOUT) - block.timestamp;
    }
}