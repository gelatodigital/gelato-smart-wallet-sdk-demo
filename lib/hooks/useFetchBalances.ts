import { useQuery } from "@tanstack/react-query";
import { Address, formatEther, formatUnits } from "viem";
import {
    NETWORKS,
  TOKEN_CONFIG,
} from "@/constants/blockchain";
import { createPublicClient, http } from "viem";


interface TokenHoldingsResponse {
  ethBalance: string;
  usdcBalance?: string;
  wethBalance: string;
  dropBalance: string;
}

async function fetchBalances(address: Address, network: string): Promise<TokenHoldingsResponse> {
  try {
    const publicClient = createPublicClient({
      chain: NETWORKS[network as keyof typeof NETWORKS].chain,
      transport: http(),
    });
    // Fetch native ETH balance
    const ethBalance = await publicClient.getBalance({ address });

    // Fetch USDC balance
    let usdcBalance;
    if (network != "inkSepolia" && network != "arbitrumSepolia") {
    usdcBalance = await publicClient.readContract({
      address: NETWORKS[network as keyof typeof NETWORKS].tokens.USDC.address as `0x${string}`,
      abi: [
        {
          name: "balanceOf",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "account", type: "address" }],
          outputs: [{ name: "balance", type: "uint256" }],
        },
      ],
      functionName: "balanceOf",
      args: [address],
    });
  }
    // Fetch WETH balance
    const wethBalance = await publicClient.readContract({
      address: NETWORKS[network as keyof typeof NETWORKS].tokens.WETH.address as `0x${string}`,
      abi: [
        {
          name: "balanceOf",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "account", type: "address" }],
          outputs: [{ name: "balance", type: "uint256" }],
        },
      ],
      functionName: "balanceOf",
      args: [address],
    });

    // Fetch Drop token balance
    const dropBalance = await publicClient.readContract({
      address: NETWORKS[network as keyof typeof NETWORKS].dropTokenAddress as `0x${string}`,
      abi: [
        {
          name: "balanceOf",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "account", type: "address" }],
          outputs: [{ name: "balance", type: "uint256" }],
        },
      ],
      functionName: "balanceOf",
      args: [address],
    });
if (network != "inkSepolia" && network != "arbitrumSepolia") {
    return {
      ethBalance: formatEther(ethBalance),
      usdcBalance: formatUnits(
        usdcBalance as bigint,
        6
      ),
      wethBalance: formatUnits(
        wethBalance as bigint,
        18
      ),
      dropBalance: formatEther(dropBalance as bigint), // Assuming 18 decimals for Drop token
    };
  } else {
    return {
      ethBalance: formatEther(ethBalance),
      wethBalance: formatUnits(
        wethBalance as bigint,
        18
      ),
      dropBalance: formatEther(dropBalance as bigint), // Assuming 18 decimals for Drop token
    };
  }
  } catch (error) {
    console.error("Error fetching token balances:", error);
  if (network != "inkSepolia" && network != "arbitrumSepolia") {
    return {
      ethBalance: "0",
      wethBalance: "0",
      dropBalance: "0",
    };
  }
    return {
      ethBalance: "0",
      usdcBalance: "0",
      wethBalance: "0",
      dropBalance: "0",
    };
  }
}

export function useTokenHoldings(
  address: Address | undefined,
  network: string
) {
  return useQuery({
    queryKey: ["tokenHoldings", address],
    queryFn: () => fetchBalances(address!, network),
    enabled: !!address,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
