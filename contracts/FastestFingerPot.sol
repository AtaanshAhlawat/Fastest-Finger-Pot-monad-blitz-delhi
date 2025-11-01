// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FastestFingerPot
 * @dev A click-speed competition game where players stake ETH and compete in 15-second rounds.
 * Winner is determined by highest (clicks × stake) score and receives the entire pot.
 */
contract FastestFingerPot is ReentrancyGuard {
    uint256 public constant ROUND_DURATION = 15; // 15 seconds
    
    struct Player {
        uint256 stake;
        uint256 clicks;
        bool hasEntered;
    }
    
    struct Round {
        uint256 startTime;
        uint256 totalPot;
        bool active;
        address[] playerAddresses;
        mapping(address => Player) players;
    }
    
    Round public currentRound;
    address public lastWinner;
    uint256 public lastWinningScore;
    
    event PlayerJoined(address indexed player, uint256 stake);
    event ClickRecorded(address indexed player, uint256 totalClicks);
    event RoundStarted(uint256 startTime);
    event RoundEnded(address indexed winner, uint256 winningScore, uint256 payout);
    
    modifier roundActive() {
        require(currentRound.active, "No active round");
        require(block.timestamp < currentRound.startTime + ROUND_DURATION, "Round has ended");
        _;
    }
    
    modifier roundEnded() {
        require(currentRound.active, "No round to end");
        require(block.timestamp >= currentRound.startTime + ROUND_DURATION, "Round still active");
        _;
    }
    
    /**
     * @dev Join the current round with a stake
     */
    function joinRound() external payable {
        require(msg.value > 0, "Stake must be greater than 0");
        require(!currentRound.players[msg.sender].hasEntered, "Already entered this round");
        
        // Start round if this is the first player
        if (!currentRound.active) {
            currentRound.active = true;
            currentRound.startTime = block.timestamp;
            emit RoundStarted(block.timestamp);
        } else {
            // Can only join if round just started (within first 5 seconds)
            require(block.timestamp < currentRound.startTime + 5, "Round already in progress");
        }
        
        currentRound.players[msg.sender] = Player({
            stake: msg.value,
            clicks: 0,
            hasEntered: true
        });
        
        currentRound.playerAddresses.push(msg.sender);
        currentRound.totalPot += msg.value;
        
        emit PlayerJoined(msg.sender, msg.value);
    }
    
    /**
     * @dev Record a click for the sender (only during active round)
     */
    function click() external roundActive {
        require(currentRound.players[msg.sender].hasEntered, "Must join round first");
        
        currentRound.players[msg.sender].clicks++;
        
        emit ClickRecorded(msg.sender, currentRound.players[msg.sender].clicks);
    }
    
    /**
     * @dev End the round and payout to winner
     */
    function endRound() external roundEnded nonReentrant {
        require(currentRound.playerAddresses.length > 0, "No players in round");
        
        // Calculate winner (highest clicks * stake)
        address winner = currentRound.playerAddresses[0];
        uint256 highestScore = currentRound.players[winner].clicks * currentRound.players[winner].stake;
        
        for (uint256 i = 1; i < currentRound.playerAddresses.length; i++) {
            address playerAddr = currentRound.playerAddresses[i];
            uint256 score = currentRound.players[playerAddr].clicks * currentRound.players[playerAddr].stake;
            
            if (score > highestScore) {
                highestScore = score;
                winner = playerAddr;
            }
        }
        
        uint256 payout = currentRound.totalPot;
        lastWinner = winner;
        lastWinningScore = highestScore;
        
        emit RoundEnded(winner, highestScore, payout);
        
        // Reset round
        resetRound();
        
        // Transfer pot to winner
        (bool success, ) = payable(winner).call{value: payout}("");
        require(success, "Payout failed");
    }
    
    /**
     * @dev Reset round state for next game
     */
    function resetRound() private {
        for (uint256 i = 0; i < currentRound.playerAddresses.length; i++) {
            delete currentRound.players[currentRound.playerAddresses[i]];
        }
        
        delete currentRound.playerAddresses;
        currentRound.totalPot = 0;
        currentRound.startTime = 0;
        currentRound.active = false;
    }
    
    /**
     * @dev Get current round info
     */
    function getCurrentRoundInfo() external view returns (
        bool active,
        uint256 startTime,
        uint256 totalPot,
        uint256 playerCount,
        uint256 timeRemaining
    ) {
        active = currentRound.active;
        startTime = currentRound.startTime;
        totalPot = currentRound.totalPot;
        playerCount = currentRound.playerAddresses.length;
        
        if (currentRound.active && block.timestamp < currentRound.startTime + ROUND_DURATION) {
            timeRemaining = (currentRound.startTime + ROUND_DURATION) - block.timestamp;
        } else {
            timeRemaining = 0;
        }
    }
    
    /**
     * @dev Get player info for current round
     */
    function getPlayerInfo(address player) external view returns (
        bool hasEntered,
        uint256 stake,
        uint256 clicks,
        uint256 score
    ) {
        Player memory p = currentRound.players[player];
        hasEntered = p.hasEntered;
        stake = p.stake;
        clicks = p.clicks;
        score = p.clicks * p.stake;
    }
    
    /**
     * @dev Get all players in current round
     */
    function getAllPlayers() external view returns (address[] memory) {
        return currentRound.playerAddresses;
    }
    
    /**
     * @dev Get leaderboard for current round
     */
    function getLeaderboard() external view returns (
        address[] memory addresses,
        uint256[] memory stakes,
        uint256[] memory clicks,
        uint256[] memory scores
    ) {
        uint256 playerCount = currentRound.playerAddresses.length;
        
        addresses = new address[](playerCount);
        stakes = new uint256[](playerCount);
        clicks = new uint256[](playerCount);
        scores = new uint256[](playerCount);
        
        for (uint256 i = 0; i < playerCount; i++) {
            address playerAddr = currentRound.playerAddresses[i];
            Player memory p = currentRound.players[playerAddr];
            
            addresses[i] = playerAddr;
            stakes[i] = p.stake;
            clicks[i] = p.clicks;
            scores[i] = p.clicks * p.stake;
        }
    }
}
