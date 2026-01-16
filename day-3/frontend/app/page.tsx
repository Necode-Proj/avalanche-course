"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useChainId,
} from "wagmi";
import { injected } from "wagmi/connectors";
const CONTRACT_ADDRESS = "0x1e4944c2755f3438af5fe1aa77f9f4518316365c";

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default function Home() {
  // State
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const [inputValue, setInputValue] = useState("");
  // Read
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
  });

  // Write
  const { writeContract, isPending: isWriting } = useWriteContract();
  const handleSetValue = async () => {
    if (!inputValue) return;
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: SIMPLE_STORAGE_ABI,
      functionName: "setValue",
      args: [BigInt(inputValue)],
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="bg-white/10 p-6 min-w-112.5 rounded-[15px] backdrop-blur-[10px] border border-white/10 text-center text-white shadow-2xl">
        <h1 className="flex items-center justify-center text-4xl font-bold bg-linear-to-r from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent mb-2">
          Avalanche dApps
        </h1>
        <p className="m-4 text-lg text-gray-300 font-light">
          Connect To Wallet
        </p>

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full my-2 px-14 py-3 bg-[#5b3789] text-white rounded-md cursor-pointer hover:bg-[#34084f] transition-colors disabled:opacity-50"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => disconnect()}
                  className="flex-1 px-4 py-3 bg-red-900/40 border border-red-500/50 text-white rounded-md cursor-pointer hover:bg-red-800 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>

              <div className="bg-black/30 border border-white/15 rounded-lg p-4 flex-col gap-3 space-y-2 text-left">
                <div className="flex justify-between items-center text-[0.9rem] text-[#e0e0e0]">
                  <strong className="text-[#94a3b8] font-medium">
                    Status:
                  </strong>
                  <span className="font-mono text-green-400">Connected</span>
                </div>
                <div className="flex justify-between items-center text-[0.9rem] text-[#e0e0e0]">
                  <strong className="text-[#94a3b8] font-medium">
                    Network ID:
                  </strong>
                  <span className="font-mono text-white">{chainId}</span>
                </div>
                <div className="flex justify-between items-center text-[0.9rem] text-[#e0e0e0]">
                  <strong className="text-[#94a3b8] font-medium">
                    Address:
                  </strong>
                  <span
                    className="font-mono text-white text-[10px] truncate max-w-5"
                    title={address}
                  >
                    {address}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-4 text-left">
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Contract Stored Value:
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">
                      {isReading ? "..." : value?.toString() || "0"}
                    </span>
                    <button
                      onClick={() => refetch()}
                      className="relative text-xs text-blue-400 cursor-pointer group pb-1">
                      Refresh
                      <span className="absolute left-0 bottom-1 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Update Value</p>
                  <input
                    type="number"
                    placeholder="New value..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-3 rounded bg-black/50 border border-white/20 text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSetValue}
                    disabled={isWriting || !inputValue}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-bold rounded-md transition-all"
                  >
                    {isWriting ? "Confirming..." : "Update on Blockchain"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <p className="text-[10px] text-gray-500 mt-6 uppercase tracking-widest">
          Arnold Darmawan • 241011450317
        </p>
      </div>
    </main>
  );
}
