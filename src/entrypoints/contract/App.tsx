import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import "./style.css";

export default function App() {
  const [features, setFeatures] = useState([
    { name: "Web3 Safe Browsing", key: "web3Safe", enabled: false, icon: '🌐' },
    { name: "Twitter Phishing Warning", key: "twitterPhishing", enabled: false, icon: '🐦' },
    { name: "Contract Security", key: "contractSecurity", enabled: false, icon: '🔒' },
  ]);

  // New state for contract address and selected chain ID
  const [contractAddress, setContractAddress] = useState("");
  const [chainId, setChainId] = useState("");
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

  useEffect(() => {
    chrome.storage.local.get(null, (data) => { 
      setFeatures((prevFeatures) =>
        prevFeatures.map((feature) => ({
          ...feature,
          enabled: data[feature.key] || false,
        }))
      );
    });
  }, []);

  const toggleFeature = (index: number) => {
    setFeatures((prevFeatures) => {
      const newFeatures = prevFeatures.map((feature, i) => {
        if (i === index) {
          const newState = !feature.enabled;
          chrome.runtime.sendMessage({ action: "toggleFeature", feature: feature.key, enabled: newState });
          return { ...feature, enabled: newState };
        }
        return feature;
      });
      return newFeatures;
    });
  };

  // New function to check contract
  const checkContract = async () => {
    if (contractAddress && chainId) {
      const response = await fetch(`https://api.goapi.com/check?address=${contractAddress}&chainId=${chainId}`);
      const data = await response.json();
      console.log(data); // Handle the response as needed
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <Header />
      <div className="min-w-xs p-4 space-y-4">
        {/* New input for contract address */}
        <div>
          <input
            type="text"
            placeholder="Enter Contract Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        {/* New dropdown for chain ID */}
        <div>
          <select
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Chain ID</option>
            {supportedChains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={checkContract} className="mt-2 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg">
          Check Contract
        </button>
        {features.map((feature, index) => (
          <div className="flex items-center justify-between p-2 border-b border-gray-200" key={feature.name}>
            <div className="flex items-center">
              <span className="text-xl mr-2">{feature.icon}</span>
              <span className="text-lg">{feature.name}</span>
            </div>
            {feature.name !== 'Coming Soon' && (
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  checked={feature.enabled}
                  className="sr-only peer"
                  onChange={() => toggleFeature(index)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              </label>
            )}
          </div>
        ))}
        <button className="mt-6 w-full py-2 px-4 bg-blue-600 text-black font-semibold rounded-lg ">
          Coming Soon
        </button>
      </div>
    </div>
  );
}
