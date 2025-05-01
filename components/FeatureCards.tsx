import Image from "next/image";
import React from "react";

export default function FeatureCards() {
  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Complete Wallet Stack */}
      <div className="w-full flex flex-col min-h-[260px] p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded-[6px] mr-3 flex items-center justify-center">
            <Image
              src="/layers-three.svg"
              alt="layers-three"
              width={24}
              height={24}
            />
          </div>
          <h3 className="text-text-title text-md font-medium break-words">
            Complete Smart Wallet Stack
          </h3>
        </div>
        <p className="text-text-tertiary text-sm flex-grow break-words mb-4">
          Build and deploy production-ready smart wallets on any EVM chain.
          Gelato Smart Wallet SDK enables frictionless integration and unmatched
          UX.
        </p>
      </div>

      {/* High-Performance Gas Stack */}
      <div className="w-full flex flex-col min-h-[260px] p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded-[6px] mr-3 flex items-center justify-center">
            <Image src="/zap.svg" alt="zap" width={24} height={24} />
          </div>
          <h3 className="text-text-title text-md font-medium break-words">
            High-Performance Gas Abstraction
          </h3>
        </div>
        <p className="text-text-tertiary text-sm flex-grow break-words mb-4">
          Gelato's Bundler and Paymaster are engineered for ultra-low latency
          and optimal gas efficiency. Confidently scale without compromising
          speed or cost.
        </p>
      </div>

      {/* Wallet-as-a-Service */}
      <div className="w-full flex flex-col min-h-[260px] p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded-[6px] mr-3 flex items-center justify-center">
            <Image src="/wallet.svg" alt="wallet" width={24} height={24} />
          </div>
          <h3 className="text-text-title text-md font-medium break-words">
            Embedded Wallets
          </h3>
        </div>
        <p className="text-text-tertiary text-sm flex-grow break-words mb-4">
          Seamlessly onboard users with embedded wallets powered by Dynamic.
          Fully integrated and friction-free sign-ups with familiar methods
          (email, social, phone, and more).
        </p>
      </div>

      {/* Enterprise Ready */}
      <div className="w-full flex flex-col min-h-[260px] p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded-[6px] mr-3 flex items-center justify-center">
            <Image src="/building.svg" alt="building" width={24} height={24} />
          </div>
          <h3 className="text-text-title text-md font-medium break-words">
            Enterprise-Grade Infrastructure
          </h3>
        </div>
        <p className="text-text-tertiary text-sm flex-grow break-words mb-4">
          Manage smart contracts, SDKs, gas sponsorship, and embedded wallets
          all in one intuitive, dashboard. SOC2-compliant and production-ready.
        </p>
      </div>
    </div>
  );
}
