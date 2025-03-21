import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header"; 

export const Checkbox = () => {
  const [features, setFeatures] = useState([
    { name: "Web3 Safe Browsing",description: "Scambuzzer will check if the website is safe to visit", key: "web3Safe", enabled: false,icon: '🌐' },
    { name: "Twitter Phishing Warning",description: "Scambuzzer will check if the twitter account is a scam", key: "twitterPhishing", enabled: false,icon: '🐦' },
    { name: "Contract Security",description: "Scambuzzer will check if the contract is safe to interact with", key: "contractSecurity", enabled: false,icon: '🔒' },
    {name: "Email Phishing Warning",description: "Scambuzzer will check if the email is a scam", key: "emailPhishing", enabled: false,icon: '📧'}
  ]);

  useEffect(() => {
    chrome.storage.local.get(null, (data) => {
      console.log(data);
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

  return (
    <div className="w-full"> 
      <div className="min-w-xs py-4 space-y-4">
        {features.map((feature, index) => (
          <div className="flex items-center justify-between py-2 border-b border-gray-800 px-3" key={feature.name}>
            <div className="flex ">
              <span className="text-xl mr-2">{feature.icon}</span>
             <div>
              <p className="text-sm font-semibold text-green-500">{feature.name}</p>
              <p className="text-xs text-gray-500">{feature.description}</p>
             </div>
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
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
              </label>
            )}
          </div>
        ))} 
      </div>
    </div>
  );
}