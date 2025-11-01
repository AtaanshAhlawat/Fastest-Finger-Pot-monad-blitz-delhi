import { useEffect, useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useIsMounted } from "usehooks-ts";
import { usePublicClient } from "wagmi";
import { Contract, ContractCodeStatus, ContractName, contracts } from "~~/utils/scaffold-eth/contract";

/**
 * Gets the matching contract info for the provided contract name from the contracts present in deployedContracts.ts
 * and externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 */
export const useDeployedContractInfo = <TContractName extends ContractName>(contractName: TContractName) => {
  const isMounted = useIsMounted();
  const { targetNetwork } = useTargetNetwork();
  const deployedContract = contracts?.[targetNetwork.id]?.[contractName as ContractName] as Contract<TContractName>;
  const [status, setStatus] = useState<ContractCodeStatus>(ContractCodeStatus.LOADING);
  const publicClient = usePublicClient({ chainId: targetNetwork.id });

  useEffect(() => {
    const checkContractDeployment = async () => {
      try {
        if (!isMounted() || !publicClient) return;

        if (!deployedContract) {
          console.warn(`Contract ${contractName} not found in deployedContracts for chain ${targetNetwork.id}`);
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }

        // Add timeout and retry logic
        const code = await Promise.race([
          publicClient.getBytecode({
            address: deployedContract.address,
          }),
          new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 10000)
          ),
        ]) as string;

        // If contract code is `0x` => no contract deployed on that address
        if (code === "0x" || !code) {
          console.warn(`No bytecode found at ${deployedContract.address} on chain ${targetNetwork.id}`);
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }
        setStatus(ContractCodeStatus.DEPLOYED);
      } catch (e) {
        console.error(`Error checking contract deployment for ${contractName}:`, e);
        // Retry once after a delay
        setTimeout(() => {
          checkContractDeployment();
        }, 3000);
      }
    };

    checkContractDeployment();
  }, [isMounted, contractName, deployedContract, publicClient, targetNetwork.id]);

  return {
    data: status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
    isLoading: status === ContractCodeStatus.LOADING,
  };
};
