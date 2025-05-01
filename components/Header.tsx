import Image from "next/image";
import React, { useState } from "react";

export default function Header() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i @gelatonetwork/smartwallet-react-sdk");
    setCopied(true);
    setTimeout(() => setCopied(false), 16000);
  };

  return (
    <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <div className="flex items-center mb-3 gap-x-2">
          <Image src="/gelato-icon.svg" alt="Gelato" width={26} height={26} />
          <Image src="/gelato.svg" alt="Gelato" width={62} height={16} />
        </div>
        <p className="text-sm text-text-tertiary max-w-xl">
          Enable powerful smart wallets (EIP-7702) and embedded wallet <br />
          experiences across any EVM chain. Easily create smart accounts,{" "}
          enable gasless transactions <br /> and streamline onboarding -- all from a unified dashboard.
        </p>
      </div>
      <div className="flex items-center mt-4 md:mt-0">
        <div 
          onClick={handleCopy}
          className="px-4 py-2 bg-[#202020] border border-[#2A2A2A] rounded-md text-sm font-mono text-gray-300 cursor-pointer hover:bg-[#2A2A2A] transition-colors relative"
        >
          npm i @gelatonetwork/smartwallet-react-sdk
          {copied && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#202020] px-3 py-1 rounded text-xs text-gray-300">
              Copied!
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
