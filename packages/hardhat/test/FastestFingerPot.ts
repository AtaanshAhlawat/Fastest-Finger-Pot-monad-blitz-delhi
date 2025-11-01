import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("FastestFingerPot", () => {
  async function deployFastestFingerPotFixture() {
    const [deployer, player1, player2, player3] = await hre.ethers.getSigners();

    const FastestFingerPot = await hre.ethers.getContractFactory("FastestFingerPot");
    const contract = await FastestFingerPot.deploy();

    return { contract, deployer, player1, player2, player3 };
  }

  describe("Deployment", () => {
    it("Should deploy and initialize with round 1", async () => {
      const { contract } = await loadFixture(deployFastestFingerPotFixture);
      expect(await contract.currentRoundNumber()).to.equal(1);
      expect(await contract.roundActive()).to.equal(true);
    });

    it("Should have 15 second round duration", async () => {
      const { contract } = await loadFixture(deployFastestFingerPotFixture);
      expect(await contract.ROUND_DURATION()).to.equal(15);
    });
  });

  describe("Joining Rounds", () => {
    it("Should allow players to join with stake", async () => {
      const { contract, player1 } = await loadFixture(deployFastestFingerPotFixture);
      const stake = hre.ethers.parseEther("0.1");

      await contract.connect(player1).joinRound({ value: stake });

      const playerData = await contract.getPlayerData(player1.address);
      expect(playerData.hasJoined).to.equal(true);
      expect(playerData.stake).to.equal(stake);
      expect(playerData.clicks).to.equal(0);
    });

    it("Should reject joining with zero stake", async () => {
      const { contract, player1 } = await loadFixture(deployFastestFingerPotFixture);

      await expect(contract.connect(player1).joinRound({ value: 0 })).to.be.revertedWith("Must stake some MON");
    });

    it("Should reject joining same round twice", async () => {
      const { contract, player1 } = await loadFixture(deployFastestFingerPotFixture);
      const stake = hre.ethers.parseEther("0.1");

      await contract.connect(player1).joinRound({ value: stake });
      await expect(contract.connect(player1).joinRound({ value: stake })).to.be.revertedWith(
        "Already joined this round",
      );
    });

    it("Should update pot size when players join", async () => {
      const { contract, player1, player2 } = await loadFixture(deployFastestFingerPotFixture);
      const stake1 = hre.ethers.parseEther("0.1");
      const stake2 = hre.ethers.parseEther("0.2");

      await contract.connect(player1).joinRound({ value: stake1 });
      expect(await contract.potSize()).to.equal(stake1);

      await contract.connect(player2).joinRound({ value: stake2 });
      expect(await contract.potSize()).to.equal(stake1 + stake2);
    });
  });

  describe("Clicking", () => {
    it("Should increment player clicks", async () => {
      const { contract, player1 } = await loadFixture(deployFastestFingerPotFixture);
      const stake = hre.ethers.parseEther("0.1");

      await contract.connect(player1).joinRound({ value: stake });

      await contract.connect(player1).click();
      await contract.connect(player1).click();
      await contract.connect(player1).click();

      const playerData = await contract.getPlayerData(player1.address);
      expect(playerData.clicks).to.equal(3);
    });

    it("Should reject clicking without joining", async () => {
      const { contract, player1 } = await loadFixture(deployFastestFingerPotFixture);

      await expect(contract.connect(player1).click()).to.be.revertedWith("Must join round first");
    });
  });

  describe("Ending Rounds", () => {
    it("Should determine winner based on highest score", async () => {
      const { contract, player1, player2, player3 } = await loadFixture(deployFastestFingerPotFixture);

      // Player 1: 10 clicks × 0.1 MON = 1.0 score
      await contract.connect(player1).joinRound({ value: hre.ethers.parseEther("0.1") });
      for (let i = 0; i < 10; i++) {
        await contract.connect(player1).click();
      }

      // Player 2: 5 clicks × 0.3 MON = 1.5 score (winner)
      await contract.connect(player2).joinRound({ value: hre.ethers.parseEther("0.3") });
      for (let i = 0; i < 5; i++) {
        await contract.connect(player2).click();
      }

      // Player 3: 20 clicks × 0.05 MON = 1.0 score
      await contract.connect(player3).joinRound({ value: hre.ethers.parseEther("0.05") });
      for (let i = 0; i < 20; i++) {
        await contract.connect(player3).click();
      }

      // Fast forward time
      await hre.network.provider.send("evm_increaseTime", [15]);
      await hre.network.provider.send("evm_mine");

      // End round
      await contract.endRound();

      expect(await contract.currentWinner()).to.equal(player2.address);
      expect(await contract.currentRoundNumber()).to.equal(2);
      expect(await contract.potSize()).to.equal(0);
    });

    it("Should reset pot after round ends", async () => {
      const { contract, player1, player2 } = await loadFixture(deployFastestFingerPotFixture);

      await contract.connect(player1).joinRound({ value: hre.ethers.parseEther("0.1") });
      await contract.connect(player2).joinRound({ value: hre.ethers.parseEther("0.2") });

      const initialPot = await contract.potSize();
      expect(initialPot).to.equal(hre.ethers.parseEther("0.3"));

      await hre.network.provider.send("evm_increaseTime", [15]);
      await hre.network.provider.send("evm_mine");

      await contract.endRound();

      const newPot = await contract.potSize();
      expect(newPot).to.equal(0);
    });

    it("Should reject ending round before time is up", async () => {
      const { contract } = await loadFixture(deployFastestFingerPotFixture);

      await expect(contract.endRound()).to.be.revertedWith("Round still active");
    });

    it("Should pay winner the entire pot", async () => {
      const { contract, player1, player2 } = await loadFixture(deployFastestFingerPotFixture);

      const stake1 = hre.ethers.parseEther("0.5");
      const stake2 = hre.ethers.parseEther("1.0");

      await contract.connect(player1).joinRound({ value: stake1 });
      await contract.connect(player1).click();

      await contract.connect(player2).joinRound({ value: stake2 });
      await contract.connect(player2).click();

      const initialBalance = await hre.ethers.provider.getBalance(player2.address);

      await hre.network.provider.send("evm_increaseTime", [15]);
      await hre.network.provider.send("evm_mine");

      await contract.endRound();

      const finalBalance = await hre.ethers.provider.getBalance(player2.address);
      const winnings = finalBalance - initialBalance;

      // Account for gas costs
      expect(winnings).to.be.closeTo(stake1 + stake2, hre.ethers.parseEther("0.001"));
    });
  });

  describe("Player Scores", () => {
    it("Should calculate correct scores", async () => {
      const { contract, player1, player2 } = await loadFixture(deployFastestFingerPotFixture);

      await contract.connect(player1).joinRound({ value: hre.ethers.parseEther("0.1") });
      for (let i = 0; i < 5; i++) {
        await contract.connect(player1).click();
      }

      await contract.connect(player2).joinRound({ value: hre.ethers.parseEther("0.5") });
      for (let i = 0; i < 3; i++) {
        await contract.connect(player2).click();
      }

      const score1 = await contract.getPlayerScore(player1.address);
      const score2 = await contract.getPlayerScore(player2.address);

      expect(score1).to.equal(hre.ethers.parseEther("0.5")); // 5 × 0.1
      expect(score2).to.equal(hre.ethers.parseEther("1.5")); // 3 × 0.5
    });
  });
});
