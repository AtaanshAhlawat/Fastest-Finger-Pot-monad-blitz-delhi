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
    uint256 public constant ROUND_DURATION = 15 seconds;
    
    // Current round state
    uint256 public roundStartTime;
    uint256 public currentRoundNumber;
    bool public roundActive;
    address public currentWinner;
    uint256 public potSize;
    
    // Player data
    struct PlayerData {
        uint256 clicks;
        uint256 stake;
        bool hasJoined;
    }
    
    mapping(uint256 => mapping(address => PlayerData)) public roundPlayers; // round => player => data
    mapping(uint256 => address[]) public roundPlayerList; // round => list of players
    
    // Events
    event RoundStarted(uint256 indexed roundNumber, uint256 startTime);
    event PlayerJoined(uint256 indexed roundNumber, address indexed player, uint256 stake);
    event PlayerClicked(uint256 indexed roundNumber, address indexed player);
    event RoundEnded(uint256 indexed roundNumber, address indexed winner, uint256 potSize, uint256 score);
    event WinnerPaid(uint256 indexed roundNumber, address indexed winner, uint256 amount);
    
    constructor() {
        roundStartTime = block.timestamp;
        roundActive = true;
        currentRoundNumber = 1;
        emit RoundStarted(currentRoundNumber, roundStartTime);
    }
    
    /**
     * @dev Join the current round by staking MON tokens
     * @notice Players must stake a minimum amount to participate
     */
    function joinRound() external payable nonReentrant {
        require(roundActive, "Round not active");
        require(!roundPlayers[currentRoundNumber][msg.sender].hasJoined, "Already joined this round");
        require(msg.value > 0, "Must stake some MON");
        
        // Reset clicks if player joins a new round
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
     * @notice Only players who joined can click
     */
    function click() external nonReentrant {
        require(roundActive, "Round not active");
        require(roundPlayers[currentRoundNumber][msg.sender].hasJoined, "Must join round first");
        
        roundPlayers[currentRoundNumber][msg.sender].clicks++;
        
        emit PlayerClicked(currentRoundNumber, msg.sender);
    }
    
    /**
     * @dev End current round and determine winner
     * @notice Can be called by anyone, but only after round duration has passed
     */
    function endRound() external nonReentrant {
        require(roundActive, "Round not active");
        require(block.timestamp >= roundStartTime + ROUND_DURATION, "Round still active");
        
        address winner = address(0);
        uint256 highestScore = 0;
        
        // Find the player with highest (clicks × stake) score
        for (uint256 i = 0; i < roundPlayerList[currentRoundNumber].length; i++) {
            address player = roundPlayerList[currentRoundNumber][i];
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
        
        // Reset for next round
        roundActive = false;
        potSize = 0;
        
        emit RoundEnded(currentRoundNumber, winner, winnerPot, winnerScore);
        
        // Pay winner
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
    function getPlayerData(address player) public view returns (PlayerData memory) {
        return roundPlayers[currentRoundNumber][player];
    }
    
    /**
     * @dev Get all players in current round
     */
    function getCurrentRoundPlayers() public view returns (address[] memory) {
        return roundPlayerList[currentRoundNumber];
    }
    
    /**
     * @dev Emergency function to recover stuck funds
     * @notice Only owner can call this
     */
    function emergencyWithdraw() external nonReentrant {
        require(!roundActive || isRoundEnded(), "Cannot withdraw during active round");
        require(address(this).balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
}

