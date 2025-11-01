import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys FastestFingerPot contract
 */
const deployFastestFingerPot: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("FastestFingerPot", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const fastestFingerPot = await hre.ethers.getContract<Contract>("FastestFingerPot", deployer);
  console.log("🎮 FastestFingerPot deployed at:", await fastestFingerPot.getAddress());
  console.log("📊 Round duration:", await fastestFingerPot.ROUND_DURATION());
};

export default deployFastestFingerPot;

deployFastestFingerPot.tags = ["FastestFingerPot"];
