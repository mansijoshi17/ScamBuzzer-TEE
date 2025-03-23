import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid'; 
import {  createSchema , writeCollectionData, readCollectionData} from '../utils/secretVault';
import { FaTrash } from "react-icons/fa";
import { CgCopy } from "react-icons/cg";

const WalletBookmark = () => {
    const [wallets, setWallets] = useState([]);
    const [walletName, setWalletName] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [schemaId, setSchemaId] = useState("");

    async function main() {
        try {
            chrome.storage.local.get(['schemaId'], async (result) => {
                if (!result.schemaId) {
                    const newSchema = await createSchema(); 
                    const schemaId = newSchema[0].schemaId;
                    setSchemaId(schemaId); 
                    chrome.storage.local.set({ schemaId }, () => {
                        console.log('Schema ID stored in Chrome storage:', schemaId);
                    });
                } else {
                    setSchemaId(result.schemaId);
                    console.log('Schema ID retrieved from Chrome storage:', result.schemaId);
                }
            });
        } catch (error: any) {
            console.error('❌ Failed to use SecretVaultWrapper:', error.message);
        }
    }

    useEffect(() => {
        main(); 
    }, []);

    useEffect(() => {
        fetchWalletAddresses();
    }, [schemaId]);

    const saveWallet = async () => {
        if (!walletName || !walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
            toast.error(!walletName ? "Please enter both a name and wallet address." : "Please enter a valid wallet address.");
            return;
        }

        try {
             
            const dataToWrite = [
                {
                    _id: uuidv4(), 
                    name: walletName,
                    wallet_address: walletAddress 
                }
            ]; 
            
            const res = await  writeCollectionData(schemaId, dataToWrite);
            console.log('res', res); 
            const newWallets = [...wallets, { name: walletName, address: walletAddress }];
            setWallets(newWallets);
            console.log("Wallet saved successfully:", res);
            toast.success("Wallet address saved successfully!");
            
            setWalletName("");
            setWalletAddress("");
        } catch (error) {
            console.error("Error saving wallet:", error);
            toast.error("Failed to save wallet address.");
        }
    };

    const fetchWalletAddresses = async () => {
        if (!schemaId) {
            console.error('schemaId is required to fetch wallet addresses.');
            return;
        }
        
        try { 
            const records = await readCollectionData(schemaId); 
            const decryptedWallets = records.map((record: any) => ({
                name: record.name,
                address: record.wallet_address
            })); 
            setWallets(decryptedWallets);
        } catch (error) {
            console.error('Error fetching wallet addresses:', error);
        }
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
    <div className="w-full min-w-xs p-4 ">
      <h2 className="text-lg font-semibold text-green-500 mb-2">Stay protected from address poisoning</h2> 
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
      <h2 className="text-lg font-semibold text-green-500 ">Wallet Bookmarks</h2>
      {wallets.length === 0 ? (
        <ul className="space-y-2 max-h-[240px] overflow-y-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <div className="flex flex-col items-start"> 
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-500 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-600 rounded w-12"></div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2 max-h-[230px] overflow-y-auto">
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
      )}
    </div>
  );
};

export default WalletBookmark;
