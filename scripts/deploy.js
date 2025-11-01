import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("Deploying FastestFingerPot to Monad Testnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MON");
  
  // Deploy the contract
  const FastestFingerPot = await ethers.getContractFactory("FastestFingerPot");
  const contract = await FastestFingerPot.deploy();
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  
  console.log("✅ FastestFingerPot deployed to:", contractAddress);
  console.log("\nAdd this to your .env file:");
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\nVerify on explorer:");
  console.log(`https://explorer.testnet.monad.xyz/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
