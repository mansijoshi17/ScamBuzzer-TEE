import React from 'react';
import { FaShieldAlt, FaSpinner } from "react-icons/fa";
import { useState } from "react"; 
import { Checkbox } from './home/checkbox';

export const Home = () => { 
    const [isContractScanning, setIsContractScanning] = useState(false);
    const handleContractScan = () => {
        analyzeEmail("Dear user, your account has been compromised. Please click the link to verify your identity: http://fake-link.com");
        setIsContractScanning(true);

        setTimeout(() => {
            setIsContractScanning(false);
        }, 3000);
    }

    const analyzeEmail = async (emailContent: string) => { 
        console.log("✅ Running Email Phishing Warning...", emailContent); 
        try {
            const response = await fetch(`https://nilai-a779.nillion.network/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer Nillion2025`, // Ensure this is correct
                },
                body: JSON.stringify({ 
                    "model": "meta-llama/Llama-3.1-8B-Instruct",
                    "messages": [
                        {
                            "role": "user",
                            "content": `Analyze the following email for phishing scams: "${emailContent}"`
                        } 
                    ],
                    "temperature": 0.2,
                    "top_p": 0.95,
                    "max_tokens": 2048,
                    "stream": false,
                    "nilrag": {}  
                }),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the error message from the response
                throw new Error(`Failed to analyze email: ${response.status} ${errorText}`);
            }

            const data = await response.json(); 
            const analysis = data.choices[0].message.content; 
        } catch (error) {
            console.error('Error analyzing email:', error);
        } 
    }; 

    return (
        <div className="flex flex-col w-full min-w-xs ">  
            <div className="mt-2 space-y-4 w-full p-4"> 
                <button onClick={() => handleContractScan()} className="w-full flex items-center justify-between bg-green-500 text-white p-4 rounded-md shadow-md cursor-pointer">
                        <span className="font-semibold">Contract Security Scan</span>
                        {isContractScanning ? (
                            <FaSpinner className="text-xl animate-spin" />
                        ) : (
                            <FaShieldAlt className="text-xl" />
                        )}
                    </button> 
            </div> 
            <Checkbox />
        </div>
    );
};
