"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
import {
  GelatoSmartWalletContextProvider,
  dynamic,
  wagmi,
} from "@gelatonetwork/smartwallet-react-sdk";
import { baseSepolia, sepolia } from "viem/chains";
import { http } from "wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GelatoSmartWalletContextProvider
      settings={{
        defaultChain: baseSepolia,
        waas: dynamic(process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string),
        wagmi: wagmi({
          chains: [baseSepolia],
          transports: {
            [baseSepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL as string),
          },
        }),
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GelatoSmartWalletContextProvider>
  );
}
