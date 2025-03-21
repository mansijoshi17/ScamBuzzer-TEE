import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CgCopy } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";

const WalletBookmark = () => {
  const [wallets, setWallets] = useState<any[]>([
    { name: "Wallet 1", address: "0x1234567890123456789012345678901234567890" },
    { name: "Wallet 2", address: "0x1234567890123456789012345678901234567890" },
    { name: "Wallet 3", address: "0x1234567890123456789012345678901234567890" },    
    { name: "Wallet 4", address: "0x1234567890123456789012345678901234567890" },
    { name: "Wallet 5", address: "0x1234567890123456789012345678901234567890" },
    { name: "Wallet 6", address: "0x1234567890123456789012345678901234567890" },
    { name: "Wallet 7", address: "0x1234567890123456789012345678901234567890" },
    { name: "Wallet 8", address: "0x1234567890123456789012345678901234567890" },
    { name: "Wallet 9", address: "0x1234567890123456789012345678901234567890" },
    { name: "Wallet 10", address: "0x1234567890123456789012345678901234567890" },
  ]);
  const [walletName, setWalletName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

 

  // Save a new wallet
  const saveWallet = () => {
    if (!walletName || !walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast.error(!walletName ? "Please enter both a name and wallet address." : "Please enter a valid wallet address.");
      return;
    }

    const newWallets = [...wallets, { name: walletName, address: walletAddress }];
    chrome.storage.local.set({ wallets: newWallets }, () => {
      setWallets(newWallets);
      setWalletName("");
      setWalletAddress("");
    });
  };

  // Remove a wallet
  const removeWallet = (index: number) => {
    const updatedWallets = wallets.filter((_, i) => i !== index);
    chrome.storage.local.set({ wallets: updatedWallets }, () => {
      setWallets(updatedWallets);
    });
  };

  const formatAddress = (address: string) => {
    return address.slice(0, 10) + "..." + address.slice(-4);
  };

  return (
    <div className="w-full min-w-xs p-6 ">
      <h2 className="text-xl font-semibold text-white mb-2">Wallet Bookmarks</h2> 
      <input
        type="text"
        placeholder="Wallet Name"
        value={walletName}
        onChange={(e) => setWalletName(e.target.value)}
        className="w-full p-3 mb-4 border border-green-500 rounded bg-gray-900 text-white placeholder-green-400"
      />
      <input
        type="text"
        placeholder="Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="w-full p-3 mb-4 border border-green-500 rounded bg-gray-900 text-white placeholder-green-400"
      />
      <button onClick={saveWallet} className="cursor-pointer w-full p-3 mb-4 bg-green-500 text-white rounded hover:bg-green-600 transition">
        Save Wallet
      </button>
      <h2 className="text-xl font-semibold text-white mb-2">Wallet Bookmarks</h2>
      <ul className="space-y-2 max-h-[240px] overflow-y-auto">
        {wallets.map((wallet: any, index: number) => (
          <li key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
            <div className="flex flex-col items-start">
              <p className="text-green-400">{wallet.name}</p>
              <div className="flex items-center">
                <p className="text-green-400 font-bold">{formatAddress(wallet.address)}</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(wallet.address);
                    toast.success("Address copied to clipboard!"); // Show copy address message
                  }} 
                  className="ml-2 text-gray-400 hover:text-green-500 cursor-pointer"
                  aria-label="Copy address"
                >
                  <CgCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button onClick={() => removeWallet(index)} className="text-red-400 hover:text-red-700 cursor-pointer">
             <FaTrash className="w-4 h-4 " />
            </button>
          </li>
        ))}
      </ul> 
    </div>
  );
};

export default WalletBookmark;
