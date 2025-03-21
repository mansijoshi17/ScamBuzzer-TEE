import DropdownChain from "@/components/DropdownChain";
import { GoPlus } from "@goplus/sdk-node";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaShieldAlt, FaSpinner } from "react-icons/fa";

export default function Contract() {
  const [contractAddress, setContractAddress] = useState("");
  const [isContractScanning, setIsContractScanning] = useState(false);
  const [chainId, setChainId] = useState<any>(null);
  const [supportedChains, setSupportedChains] = useState([
    { id: "1", name: "Ethereum" },
    { id: "10", name: "Optimism" },
    { id: "25", name: "Cronos" },
    { id: "56", name: "BSC" },
    { id: "100", name: "Gnosis" },
    { id: "128", name: "HECO" },
    { id: "137", name: "Polygon" },
    { id: "250", name: "Fantom" },
    { id: "321", name: "KCC" },
    { id: "324", name: "zkSync Era" },
    { id: "201022", name: "FON" },
    { id: "42161", name: "Arbitrum" },
    { id: "43114", name: "Avalanche" },
    { id: "59144", name: "Linea Mainnet" },
    { id: "tron", name: "Tron" },
    { id: "534352", name: "Scroll" },
    { id: "204", name: "opBNB" },
    { id: "8453", name: "Base" },
    { id: "solana", name: "Solana" }
  ]);
  const [scanResult, setScanResult] = useState<any>(null);

  // New function to check contract
  const handleContractScan = async () => {
    if (!contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(contractAddress) || !chainId) {
      toast.error(!contractAddress ? "Please enter a contract address" :
        !/^0x[a-fA-F0-9]{40}$/.test(contractAddress) ? "Please enter a valid contract address" :
          "Please select a chain");
      return;
    }

    setIsContractScanning(true);
    try {
      const response = await GoPlus.addressSecurity(chainId.id, contractAddress, 30);
      setScanResult(response.result);
      toast.success("Contract security scan completed");
    } catch (error) {
      toast.error("An error occurred during the scan");
    } finally {
      setIsContractScanning(false);
    }
  };

  return (
    <div className="w-full ">
      <div className="min-w-xs p-4 space-y-4">
        <h4 className="text-lg font-semibold text-green-500">Contract Security Scan</h4>
        <div>
          <input
            type="text"
            placeholder="Enter Contract Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="border p-2 rounded w-full text-green-500"
          />
        </div>

        <DropdownChain supportedChains={supportedChains} setChainId={setChainId} chainId={chainId} />
        <button onClick={() => handleContractScan()} className="w-full flex items-center justify-between bg-green-500 text-white p-4 rounded-md shadow-md cursor-pointer">
          <span className="font-semibold">Contract Security Scan</span>
          {isContractScanning ? (
            <FaSpinner className="text-xl animate-spin" />
          ) : (
            <FaShieldAlt className="text-xl" />
          )}
        </button>

        {scanResult && (
          <div className="p-4 border rounded bg-gray-900">
            <h4 className="text-lg font-semibold text-white">Scan Result for <span className="text-green-500">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span></h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="text-green-500"><strong>Blacklist Doubt:</strong> {scanResult.blacklist_doubt}</div>
              <div className="text-green-500"><strong>Blackmail Activities:</strong> {scanResult.blackmail_activities}</div>
              <div className="text-green-500"><strong>Cybercrime:</strong> {scanResult.cybercrime}</div>
              <div className="text-green-500"><strong>Darkweb Transactions:</strong> {scanResult.darkweb_transactions}</div>
              <div className="text-green-500"><strong>Fake KYC:</strong> {scanResult.fake_kyc}</div>
              <div className="text-green-500"><strong>Financial Crime:</strong> {scanResult.financial_crime}</div>
              <div className="text-green-500"><strong>Honeypot Related Address:</strong> {scanResult.honeypot_related_address}</div>
              <div className="text-green-500"><strong>Money Laundering:</strong> {scanResult.money_laundering}</div>
              <div className="text-green-500"><strong>Phishing Activities:</strong> {scanResult.phishing_activities}</div>
              <div className="text-green-500"><strong>Stealing Attack:</strong> {scanResult.stealing_attack}</div>
            </div>
            <div className={`mt-4 w-full flex items-center justify-between ${scanResult.phishing_activities * 100 < 20 ? 'bg-green-500' : scanResult.phishing_activities * 100 <= 40 ? 'bg-orange-500' : 'bg-red-500'} text-white p-4 rounded-md shadow-md cursor-pointer`}>
              <strong>Phishing Score:</strong> {scanResult.phishing_activities * 100}% - {scanResult.phishing_activities * 100 < 20 ? '✅ Safe' : scanResult.phishing_activities * 100 <= 40 ? '⚠️ Medium Risk - Proceed with caution' : '🚨 High Risk'}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
