"use client";

import { useCallback, useEffect, useState } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import Header from "../components/Header";
import WalletCard from "@/components/WalletCard";
import FeatureCards from "../components/FeatureCards";
import ActivityLog from "../components/ActivityLog";
import {
  createPublicClient,
  encodeFunctionData,
  formatUnits,
  http,
} from "viem";
import { Toaster, toast } from "sonner";
import { GasEstimationModal } from "@/components/GasEstimationModal";
import { useTokenHoldings } from "@/lib/hooks/useFetchBalances";
import { Address, Log } from "viem";
import { TransactionModal } from "@/components/TransactionModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Image from "next/image";
import {
  createGelatoSmartWalletClient,
  erc20,
  GelatoTaskStatus,
  native,
  sponsored,
} from "@gelatonetwork/smartwallet";
import {
  useGelatoSmartWalletProviderContext,
  GelatoSmartWalletConnectButton,
} from "@gelatonetwork/smartwallet-react-sdk";
import {
  defaultChain,
  TOKEN_CONFIG,
  TOKEN_DETAILS,
} from "@/constants/blockchain";

interface HomeProps {}

const GELATO_API_KEY = process.env.NEXT_PUBLIC_GELATO_API_KEY!;

export default function Home({}: HomeProps) {
  const [accountAddress, setAccountAddress] = useState("");
  const [smartWalletClient, setSmartWalletClient] = useState<any>(null);
  const [logs, setLogs] = useState<
    {
      message: string;
      timestamp: string;
      details?: {
        userOpHash?: string;
        txHash?: string;
        gasDetails?: {
          estimatedGas?: string;
          actualGas?: string;
          gasToken?: string;
        };
        isSponsored?: boolean;
      };
    }[]
  >([]);
  const [gasPaymentMethod, setGasPaymentMethod] = useState<
    "sponsored" | "erc20"
  >("sponsored");
  const [gasToken, setGasToken] = useState<"USDC" | "WETH">("USDC");

  const [user, setUser] = useState<any>(null);
  const [loadingTokens, setLoadingTokens] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [showGasEstimation, setShowGasEstimation] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<any>("0");
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
  const [showTokenSelection, setShowTokenSelection] = useState(false);

  const [transactionDetails, setTransactionDetails] = useState<{
    isOpen: boolean;
    userOpHash?: string;
    txHash?: string;
    gasDetails?: {
      estimatedGas: string;
      actualGas: string;
      gasToken: string;
    };
    isSponsored: boolean;
  }>({
    isOpen: false,
    isSponsored: true,
  });

  // 7702 configuration
  const {
    gelato: { client },
    logout,
  } = useGelatoSmartWalletProviderContext();

  const { data: tokenHoldings, refetch: refetchTokenHoldings } =
    useTokenHoldings(accountAddress as Address, gasToken);

  const fetchClient = () => {
    const smartWalletClient = client;
    setUser(client?.account.address);
    setAccountAddress(client?.account.address as string);
    setSmartWalletClient(smartWalletClient);
    return smartWalletClient;
  };

  const handleLogout = async () => {
    try {
      logout();
      setUser(null);
      setAccountAddress("");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const addLog = useCallback(
    (
      message: string,
      details?: {
        userOpHash?: string;
        txHash?: string;
        gasDetails?: {
          estimatedGas?: string;
          actualGas?: string;
          gasToken?: string;
        };
        isSponsored?: boolean;
      }
    ) => {
      setLogs((prevLogs) => [
        ...prevLogs,
        {
          message,
          timestamp: new Date().toISOString(),
          details,
        },
      ]);
    },
    []
  );

  const getActualFees = async (
    txHash: string,
    gasTokenAddress: string,
    gasToken: "USDC" | "WETH"
  ) => {
    try {
      const publicClient = createPublicClient({
        chain: defaultChain,
        transport: http(),
      });

      const receipt = await publicClient.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      // Find Transfer event from the gas token to the paymaster
      const transferEvents = receipt.logs.filter((log: Log) => {
        // Check if this is a Transfer event from the gas token contract
        return (
          log.address.toLowerCase() === gasTokenAddress.toLowerCase() &&
          log.topics[0] ===
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        ); // Transfer event signature
      });

      if (transferEvents.length > 0) {
        // Get the last transfer event which should be the fee payment
        const lastTransferEvent = transferEvents[transferEvents.length - 1];
        const amount = BigInt(lastTransferEvent.data);
        const formattedAmount = formatUnits(
          amount,
          TOKEN_CONFIG[gasToken].decimals
        );
        return `${formattedAmount} ${TOKEN_CONFIG[gasToken].symbol}`;
      }
      return "Fee information not available";
    } catch (error) {
      console.error("Error getting actual fees:", error);
      return "Error fetching fee information";
    }
  };

  const handleGasEstimationConfirm = async (estimatedGas: string) => {
    setShowGasEstimation(false);
    setLoadingTokens(true);
    setIsTransactionProcessing(true);
    try {
      const smartWalletClient = fetchClient();

      let data = encodeFunctionData({
        abi: TOKEN_DETAILS.abi,
        functionName: "drop",
        args: [],
      });

      const calls = [
        {
          to: TOKEN_DETAILS.address as Address,
          value: BigInt(0),
          data,
        },
      ];
      const smartWalletResponse = await smartWalletClient?.execute({
        payment: erc20(TOKEN_CONFIG[gasToken].address as Address),
        calls,
      });

      // Add initial log with estimated gas
      addLog(
        `Sending userOp through Gelato Bundler - paying gas with ${gasToken}`,
        {
          userOpHash: smartWalletResponse?.id,
          gasDetails: {
            estimatedGas,
            gasToken,
          },
          isSponsored: false,
        }
      );
      const txHash = await smartWalletResponse?.wait();

      const actualGas = await getActualFees(
        txHash as string,
        TOKEN_CONFIG[gasToken].address as Address,
        gasToken
      );

      // Add completion log with all details
      addLog("Minted drop tokens on chain successfully", {
        userOpHash: smartWalletResponse?.id,
        txHash,
        gasDetails: {
          estimatedGas,
          actualGas,
          gasToken,
        },
        isSponsored: false,
      });

      toast.success(`Tokens claimed successfully!`);

      // Refresh token holdings after successful transaction
      if (accountAddress) {
        refetchTokenHoldings();
      }
    } catch (error: any) {
      addLog(
        `Error claiming tokens: ${
          typeof error === "string"
            ? error
            : error?.message || "Unknown error occurred"
        }`
      );
      toast.error(`Error claiming token. Check the logs`);
      console.log(error);
    } finally {
      setLoadingTokens(false);
      setIsTransactionProcessing(false);
    }
  };

  const dropToken = async () => {
    if (gasPaymentMethod === "erc20") {
      setShowGasEstimation(true);
      return;
    }

    setLoadingTokens(true);
    setIsTransactionProcessing(true);
    try {
      const smartWalletClient = fetchClient();
      let data = encodeFunctionData({
        abi: TOKEN_DETAILS.abi,
        functionName: "drop",
        args: [],
      });

      const calls = [
        {
          to: TOKEN_DETAILS.address as Address,
          value: BigInt(0),
          data,
        },
      ];
      const smartWalletResponse = await smartWalletClient?.execute({
        payment: sponsored(GELATO_API_KEY),
        calls,
      });

      addLog(
        gasPaymentMethod === "sponsored"
          ? "Sending userOp through Gelato Bundler - Sponsored"
          : `Sending UserOp through Gelato Bundler - paying gas with ${gasToken}`,
        {
          userOpHash: smartWalletResponse?.id,
          isSponsored: gasPaymentMethod === "sponsored",
        }
      );

      const txHash = await smartWalletResponse?.wait();

      // Add success log
      addLog("Minted drop tokens on chain successfully", {
        userOpHash: smartWalletResponse?.id,
        txHash,
        isSponsored: gasPaymentMethod === "sponsored",
      });

      toast.success("Tokens claimed successfully!");

      // Refresh token holdings after successful transaction
      if (accountAddress) {
        refetchTokenHoldings();
      }
    } catch (error: any) {
      console.log(error);
      addLog(
        `Error claiming tokens: ${
          typeof error === "string"
            ? error
            : error?.message || "Unknown error occurred"
        }`
      );
      toast.error(`Error claiming token. Check the logs`);
    } finally {
      setLoadingTokens(false);
      setIsTransactionProcessing(false);
    }
  };

  const handleShowTransactionDetails = useCallback((details: any) => {
    setTransactionDetails({
      isOpen: true,
      userOpHash: details.userOpHash,
      txHash: details.txHash,
      gasDetails: details.gasDetails,
      isSponsored: details.isSponsored,
    });
  }, []);

  useEffect(() => {
    function createAccount() {
      if (client) {
        try {
          setIsInitializing(true);
          fetchClient();
        } catch (error) {
          console.error("Failed to create smart wallet client:", error);
          toast.error("Failed to initialize wallet");
          setIsInitializing(false);
        } finally {
          setIsInitializing(false);
        }
      }
    }
    createAccount();
  }, [client]);

  useEffect(() => {
    if (tokenHoldings) {
      setTokenBalance(
        gasToken === "USDC"
          ? tokenHoldings.usdcBalance
          : tokenHoldings.wethBalance
      );
    }
  }, [tokenHoldings, gasToken]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-[#080808] text-white">
        {/* Transaction Processing Modal - Moved outside the main content flow */}
        {isTransactionProcessing && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-[#202020] border border-[#2A2A2A] rounded-[12px] shadow-xl w-80">
              <div className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-blue-400">
                    Processing Transaction
                  </p>
                  <p className="text-xs text-zinc-400">
                    Please wait while we confirm your transaction
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Header />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="order-1 lg:order-2 lg:col-span-2 space-y-4">
              {isInitializing ? (
                <div className="p-8 bg-[#161616] border border-[#2A2A2A] rounded-[12px] text-center">
                  <LoadingSpinner />
                </div>
              ) : !user ? (
                <div className="w-full flex flex-col items-center justify-center p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A] h-[244px] gap-y-6">
                  <span className="block text-md text-white font-medium">
                    Gelato Smart Wallet SDK Playground
                  </span>
                  <div className="flex flex-col items-center justify-center">
                    <GelatoSmartWalletConnectButton>
                      <div className="flex items-center justify-center w-[130px] h-[44px] py-2.5 px-4 bg-[#2970FF] rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed relative text-sm text-white font-medium">
                        <span className="text-sm text-white font-medium">
                          Login
                        </span>
                      </div>
                    </GelatoSmartWalletConnectButton>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-full flex flex-col p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A]">
                    <div className="space-y-4">
                      {/* Wallet Card with Logout */}
                      <WalletCard
                        accountAddress={accountAddress}
                        gasToken={gasToken}
                        handleLogout={handleLogout}
                      />

                      <div className="w-full flex flex-col p-4 bg-[#202020] border rounded-[12px] border-[#2A2A2A]">
                        <div className="w-full flex items-center mb-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-[#807872]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                          </div>
                          <h3 className="text-white text-md font-medium break-words ps-2">
                            Gas sponsorship
                          </h3>
                        </div>
                        <p className="text-zinc-400 text-sm flex-grow break-words mb-4">
                          Sponsor transactions effortlessly and deliver a
                          frictionless user experience.
                        </p>
                        <div className="w-full mt-auto">
                          <button
                            onClick={() => {
                              setGasPaymentMethod("sponsored");
                              dropToken();
                            }}
                            disabled={loadingTokens || isTransactionProcessing}
                            className="w-full py-3 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative text-sm text-white"
                          >
                            {isTransactionProcessing &&
                            gasPaymentMethod === "sponsored" ? (
                              <div className="flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                <span>Processing Transaction...</span>
                              </div>
                            ) : loadingTokens &&
                              gasPaymentMethod === "sponsored" ? (
                              "Minting..."
                            ) : (
                              "Mint Drop Tokens"
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="w-full flex flex-col p-4 bg-[#202020] border rounded-[12px] border-[#2A2A2A]">
                        <div className="w-full flex items-center mb-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-[#807872]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v12M6 12h12" />
                            </svg>
                          </div>
                          <h3 className="text-white text-md font-medium break-words ps-2">
                            ERC-20
                          </h3>
                        </div>
                        <p className="text-zinc-400 text-sm flex-grow break-words mb-4">
                          Allow your users to pay for transaction gas fees with
                          ERC-20 tokens.
                        </p>
                        <div className="w-full mt-auto">
                          {!showTokenSelection ? (
                            <button
                              onClick={() => setShowTokenSelection(true)}
                              disabled={
                                loadingTokens || isTransactionProcessing
                              }
                              className="w-full py-3 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white"
                            >
                              {isTransactionProcessing &&
                              gasPaymentMethod === "erc20" ? (
                                <div className="flex items-center justify-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  <span>Processing Transaction...</span>
                                </div>
                              ) : loadingTokens &&
                                gasPaymentMethod === "erc20" ? (
                                "Minting..."
                              ) : (
                                "Mint Drop Tokens"
                              )}
                            </button>
                          ) : (
                            <div className="space-y-4">
                              <button
                                onClick={() => {
                                  setGasToken("USDC");
                                  setGasPaymentMethod("erc20");
                                  setShowGasEstimation(true);
                                  setShowTokenSelection(false);
                                }}
                                disabled={
                                  loadingTokens || isTransactionProcessing
                                }
                                className="w-full py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm text-white"
                              >
                                {isTransactionProcessing &&
                                gasPaymentMethod === "erc20" ? (
                                  <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    <span>Processing Transaction...</span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="w-6 h-6 bg-[#2775CA]/10 rounded-full flex items-center justify-center">
                                      <Image
                                        src="/usdc.svg"
                                        alt="USDC"
                                        width={16}
                                        height={16}
                                        className="w-4 h-4"
                                      />
                                    </div>
                                    Use USDC
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setGasToken("WETH");
                                  setGasPaymentMethod("erc20");
                                  setShowGasEstimation(true);
                                  setShowTokenSelection(false);
                                }}
                                disabled={
                                  loadingTokens || isTransactionProcessing
                                }
                                className="w-full py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm text-white"
                              >
                                {isTransactionProcessing &&
                                gasPaymentMethod === "erc20" ? (
                                  <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    <span>Processing Transaction...</span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="w-6 h-6 bg-[#627EEA]/10 rounded-full flex items-center justify-center">
                                      <Image
                                        src="/weth.svg"
                                        alt="WETH"
                                        width={16}
                                        height={16}
                                        className="w-4 h-4"
                                      />
                                    </div>
                                    Use WETH
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setShowTokenSelection(false);
                                  if (accountAddress) {
                                    refetchTokenHoldings();
                                  }
                                }}
                                className="w-full py-2 text-zinc-400 hover:text-zinc-300 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Activity Log */}
                  <ActivityLog
                    logs={logs}
                    onShowDetails={handleShowTransactionDetails}
                  />
                </>
              )}
            </div>
            <div className="order-2 lg:order-1 lg:col-span-1 space-y-4">
              <FeatureCards />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#2A2A2A] mt-auto">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 text-sm text-zinc-400">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <span>Built by Gelato</span>
              <span className="hidden sm:inline">•</span>
              <span>
                Powered by{" "}
                <a
                  href="https://eips.ethereum.org/EIPS/eip-7702"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  EIP7702
                </a>
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              <a
                href="https://github.com/gelatodigital/smartwallet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                Documentation
              </a>
              <a
                href="https://github.com/gelatodigital/gelato-smart-wallet-sdk-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                Source Code
              </a>
              <a
                href="https://www.npmjs.com/package/@gelatonetwork/smartwallet-react-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                NPM Package
              </a>
            </div>
          </div>
        </footer>

        <GasEstimationModal
          isOpen={showGasEstimation}
          onClose={() => {
            setShowGasEstimation(false);
            setGasPaymentMethod("sponsored");
          }}
          onConfirm={handleGasEstimationConfirm}
          smartWalletClient={smartWalletClient}
          gasToken={gasToken}
          tokenBalance={tokenBalance}
        />

        <TransactionModal
          isOpen={transactionDetails.isOpen}
          onClose={() =>
            setTransactionDetails((prev: any) => ({ ...prev, isOpen: false }))
          }
          userOpHash={transactionDetails.userOpHash}
          txHash={transactionDetails.txHash}
          gasDetails={transactionDetails.gasDetails}
          isSponsored={transactionDetails.isSponsored}
        />

        <Toaster richColors />
      </div>
    </ThemeProvider>
  );
}
