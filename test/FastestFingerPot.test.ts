import { expect } from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const { ethers } = hre;
type FastestFingerPot = any;

describe("FastestFingerPot", function () {
  let contract: FastestFingerPot;
  let owner: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;
  
  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    
    const FastestFingerPot = await ethers.getContractFactory("FastestFingerPot");
    contract = await FastestFingerPot.deploy();
    await contract.waitForDeployment();
  });
  
  describe("Joining Round", function () {
    it("Should allow players to join with stake", async function () {
      const stake = ethers.parseEther("0.1");
      
      await expect(contract.connect(player1).joinRound({ value: stake }))
        .to.emit(contract, "PlayerJoined")
        .withArgs(player1.address, stake);
      
      const playerInfo = await contract.getPlayerInfo(player1.address);
      expect(playerInfo.hasEntered).to.be.true;
      expect(playerInfo.stake).to.equal(stake);
    });
    
    it("Should start round when first player joins", async function () {
      await expect(contract.connect(player1).joinRound({ value: ethers.parseEther("0.1") }))
        .to.emit(contract, "RoundStarted");
      
      const roundInfo = await contract.getCurrentRoundInfo();
      expect(roundInfo.active).to.be.true;
    });
    
    it("Should not allow joining with zero stake", async function () {
      await expect(contract.connect(player1).joinRound({ value: 0 }))
        .to.be.revertedWith("Stake must be greater than 0");
    });
  });
  
  describe("Clicking", function () {
    beforeEach(async function () {
      await contract.connect(player1).joinRound({ value: ethers.parseEther("0.1") });
    });
    
    it("Should record clicks for entered players", async function () {
      await expect(contract.connect(player1).click())
        .to.emit(contract, "ClickRecorded")
        .withArgs(player1.address, 1);
      
      const playerInfo = await contract.getPlayerInfo(player1.address);
      expect(playerInfo.clicks).to.equal(1);
    });
    
    it("Should not allow clicks from non-entered players", async function () {
      await expect(contract.connect(player2).click())
        .to.be.revertedWith("Must join round first");
    });
    
    it("Should not allow clicks after round ends", async function () {
      await time.increase(16); // Move past 15 second duration
      
      await expect(contract.connect(player1).click())
        .to.be.revertedWith("Round has ended");
    });
  });
  
  describe("Ending Round", function () {
    it("Should payout to winner with highest score", async function () {
      const stake1 = ethers.parseEther("0.1");
      const stake2 = ethers.parseEther("0.2");
      
      await contract.connect(player1).joinRound({ value: stake1 });
      await contract.connect(player2).joinRound({ value: stake2 });
      
      // Player 1 clicks 10 times
      for (let i = 0; i < 10; i++) {
        await contract.connect(player1).click();
      }
      
      // Player 2 clicks 3 times (but higher stake, so score = 3 * 0.2 = 0.6)
      for (let i = 0; i < 3; i++) {
        await contract.connect(player2).click();
      }
      
      // Player1 score = 10 * 0.1 = 1.0 (winner)
      // Player2 score = 3 * 0.2 = 0.6
      
      const initialBalance = await ethers.provider.getBalance(player1.address);
      
      await time.increase(16);
      
      await expect(contract.endRound())
        .to.emit(contract, "RoundEnded")
        .withArgs(player1.address, stake1 * 10n, stake1 + stake2);
      
      const finalBalance = await ethers.provider.getBalance(player1.address);
      expect(finalBalance).to.be.greaterThan(initialBalance);
    });
  });
});
