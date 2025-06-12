import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/common/Dialog";
import { useState, useEffect } from "react";
import { Address, encodeFunctionData, formatUnits } from "viem";
import { ExternalLink } from "lucide-react";
import {
  defaultChain,
  TOKEN_CONFIG,
  TOKEN_DETAILS,
} from "@/constants/blockchain";
import { erc20 } from "@gelatonetwork/smartwallet";
interface GasEstimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (estimatedGas: string) => void;
  smartWalletClient: any;
  gasToken: "USDC" | "WETH";
  tokenBalance: string;
}

export function GasEstimationModal({
  isOpen,
  onClose,
  onConfirm,
  smartWalletClient,
  gasToken,
}: GasEstimationModalProps) {
  const [estimatedGas, setEstimatedGas] = useState<string>("");
  const [isEstimating, setIsEstimating] = useState(false);
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(false);

  /**
   * Reset the estimated gas value whenever the modal is opened
   * This ensures we start with a fresh state for each new estimation
   */
  useEffect(() => {
    if (isOpen) {
      setEstimatedGas("");
      setConfirmButtonDisabled(false);
    }
  }, [isOpen]);

  /**
   * Formats a token balance from raw value to human-readable format
   * @param value - The raw token amount as a string
   * @param decimals - The number of decimals for the token
   * @returns Formatted balance string with up to 4 decimal places
   */
  const formatBalance = (value: string, decimals: number) => {
    try {
      return parseFloat(formatUnits(BigInt(value), decimals)).toLocaleString(
        undefined,
        {
          maximumFractionDigits: gasToken == "WETH" ? 10 : 6,
          minimumFractionDigits: 0,
        }
      );
    } catch (e) {
      return value;
    }
  };

  /**
   * Estimates the gas fee for a transaction using the Gelato oracle
   * Fetches the estimated fee based on the selected gas token and a fixed gas limit
   * Updates the UI with the formatted estimated gas amount or an error message
   */
  const estimateGasFee = async () => {
    try {
      setIsEstimating(true);
      const gasTokenAddress = TOKEN_CONFIG[gasToken].address;

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

      const results = await smartWalletClient.estimate({
        payment: erc20(gasTokenAddress as Address),
        calls,
      });

      setEstimatedGas(
        `${formatBalance(
          results.fee.amount,
          TOKEN_CONFIG[gasToken].decimals
        )} ${TOKEN_CONFIG[gasToken].symbol}`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isInsufficientBalance =
        errorMessage.includes("Insufficient balance") ||
        errorMessage.includes("transfer amount exceeds balance") ||
        errorMessage.includes("Cannot read properties");
      setConfirmButtonDisabled(isInsufficientBalance);
      setEstimatedGas(
        isInsufficientBalance
          ? "Insufficient balance for gas fees"
          : "Error estimating gas"
      );
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Gas Fee Estimation
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            This will estimate the gas fees for your drop transaction in{" "}
            {TOKEN_CONFIG[gasToken].symbol}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
            <span className="text-sm font-medium">Estimated Gas:</span>
            <span className="text-sm">
              {isEstimating ? "Estimating..." : estimatedGas}
            </span>
          </div>

          {/* Token Information Section */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Token Address:</span>
                <a
                  href={`${defaultChain.blockExplorers.default.url}/token/${TOKEN_CONFIG[gasToken].address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {TOKEN_CONFIG[gasToken].address.slice(0, 6)}...
                  {TOKEN_CONFIG[gasToken].address.slice(-4)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2">
                {gasToken === "USDC" ? (
                  <a
                    href="https://faucet.circle.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Get 10 USDC from Circle Faucet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <a
                    href={`https://base-sepolia.blockscout.com/address/${TOKEN_CONFIG[gasToken].address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Get {TOKEN_CONFIG[gasToken].symbol} for your smart account
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-tertiary hover:text-text-title border border-base-700 hover:border-base-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={estimateGasFee}
            disabled={isEstimating}
            className="w-full py-3 bg-base-700 hover:bg-base-600 text-text-title rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isEstimating ? (
              <>
                <div className="w-5 h-5 border-2 border-text-title border-t-transparent rounded-full animate-spin"></div>
                <span>Estimating...</span>
              </>
            ) : (
              <>
                <span>Estimate Gas</span>
              </>
            )}
          </button>
          <button
            onClick={() => onConfirm(estimatedGas)}
            disabled={!estimatedGas || isEstimating || confirmButtonDisabled}
            className="w-full py-3 bg-blue-600 hover:opacity-80 text-text-title rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-base-700/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Confirm</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
