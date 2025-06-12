import { baseSepolia, sepolia, arbitrumSepolia, inkSepolia } from "viem/chains";
import { FaEthereum } from "react-icons/fa";
import { HiOutlineCurrencyDollar } from "react-icons/hi";



export const NETWORKS = {
  baseSepolia: {
    name: "Base Sepolia",
    chain: baseSepolia,
    tokens: {
      USDC: {
        address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        symbol: "USDC",
        decimals: 6,
        icon: HiOutlineCurrencyDollar,
      },
      WETH: {
        address: "0x4200000000000000000000000000000000000006",
        symbol: "WETH",
        decimals: 18,
        icon: FaEthereum,
      },
    },
    dropTokenAddress: "0x7503384FA2731D34A5170ab5b12d674f74D54EDf",
    explorer: "https://sepolia.basescan.org/",
  },
  inkSepolia: {
    name: "Ink Sepolia",
    chain: inkSepolia,
    tokens: {
      USDC: {
        address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        symbol: "USDC",
        decimals: 6,
        icon: HiOutlineCurrencyDollar,
      },
      WETH: {
        address: "0x60C67E75292B101F9289f11f59aD7DD75194CCa6",
        symbol: "WETH",
        decimals: 18,
        icon: FaEthereum,
      },
    },
    dropTokenAddress: "0x792A9Fd227C690f02beB23678a52BF766849DFc0",
    explorer: "https://explorer-sepolia.inkonchain.com/",
  },
  sepolia: {
    name: "Sepolia",
    chain: sepolia,
    tokens: {
      USDC: {
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
        symbol: "USDC",
        decimals: 6,
        icon: HiOutlineCurrencyDollar,
      },
      WETH: {
        address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // Sepolia WETH
        symbol: "WETH",
        decimals: 18,
        icon: FaEthereum,
      },
    },
    dropTokenAddress: "0xE83d80DD2462a053390863505D56D40D6F028E92",
    explorer: "https://sepolia.etherscan.io",
  },
  arbitrumSepolia: {
    name: "Arbitrum Sepolia",
    chain: arbitrumSepolia,
    tokens: {
      USDC: {
        address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // Arb Sepolia USDC
        symbol: "USDC",
        decimals: 6,
        icon: HiOutlineCurrencyDollar,
      },
      WETH: {
        address: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73", // Arb Sepolia WETH
        symbol: "WETH",
        decimals: 18,
        icon: FaEthereum,
      },
    },
    dropTokenAddress: "0xFDcD053Bf2A1d2D1FAB5436d4342f9645093B0C9",
    explorer: "https://sepolia.arbiscan.io",
  },
};

// Helper function to get network config by chain ID
export const getNetworkByChainId = (chainId: number) => {
  return Object.values(NETWORKS).find(network => network.chain.id === chainId);
};

// Helper function to get token config by chain ID and token symbol
export const getTokenConfig = (chainId: number, tokenSymbol: string) => {
  const network = getNetworkByChainId(chainId);
  return network?.tokens[tokenSymbol as keyof typeof network.tokens];
};

// Default network configuration
export const defaultNetwork = NETWORKS.baseSepolia;

export const TOKEN_CONFIG = {
  USDC: {
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    symbol: "USDC",
    decimals: 6,
    icon: HiOutlineCurrencyDollar,
  },
  WETH: {
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    decimals: 18,
    icon: FaEthereum,
  },
};

export const TOKEN_DETAILS = {
  address: "0x7503384FA2731D34A5170ab5b12d674f74D54EDf",
  abi: [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "Dropped",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "subtractedValue", type: "uint256" },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "drop",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "dropped",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "stake",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "staked",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
