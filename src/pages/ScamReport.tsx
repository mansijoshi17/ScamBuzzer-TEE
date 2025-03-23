import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid'; 
import {  createScamReportSchema, writeScamReportData} from '../utils/secretVault';
import DropdownChain from '../components/DropdownChain';

const ScamReport = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    contractAddress: '',
    description: '',
    network: '',
    lossOfFunds: ''
  });
  const [schemaId, setSchemaId] = useState('');
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


  async function main() {
    try {
        const newSchema = await createScamReportSchema(); 
        const reportSchemaId = newSchema[0].schemaId;
        setSchemaId(reportSchemaId); 
        chrome.storage.local.set({ reportSchemaId }, () => {
            console.log('Schema ID stored in Chrome storage:', reportSchemaId);
        });
    } catch (error: any) {
        console.error('❌ Failed to use SecretVaultWrapper:', error.message);
    }
}

useEffect(() => {
    main(); 
}, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; 

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can handle the form submission, e.g., send data to an API
    if ( !/^0x[a-fA-F0-9]{40}$/.test(formData.contractAddress)) {
        toast.error("Please enter a valid contract address.");
        return;
    }

    const dataToWrite = [
        {
            _id: uuidv4(), 
            title: formData.title,
            url: formData.url,
            contractAddress: formData.contractAddress,
            description: formData.description,
            network: {
                chainId: chainId.id,
                name: chainId.name
            },
            lossOfFunds: formData.lossOfFunds
        }
    ]; 
    console.log('Scam Report Submitted:', formData);
    const res = await  writeScamReportData(schemaId, dataToWrite);
    console.log('res', res);  
    toast.success("Scam Report Submitted successfully!");

    setFormData({
      title: '',
      url: '',
      contractAddress: '',
      description: '',
      network: '',
      lossOfFunds: ''
    }); 
  };

  return (
    <div className="flex flex-col items-center justify-center  min-w-xs p-4">
      <h4 className="text-lg font-semibold text-green-500">Scam Report</h4>
      <p className="text-gray-500 mb-4">This is a scam report page.</p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md"> 
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border border-green-500 p-3 rounded bg-gray-900 text-white placeholder-green-400"
        />
        <input
          type="url"
          name="url"
          placeholder="URL"
          value={formData.url}
          onChange={handleChange}
          required
          className="border border-green-500 p-3 rounded bg-gray-900 text-white placeholder-green-400"
        />
         <DropdownChain supportedChains={supportedChains} setChainId={setChainId} chainId={chainId} />
        <input
          type="text"
          name="contractAddress"
          placeholder="Contract Address"
          value={formData.contractAddress}
          onChange={handleChange} 
          className="border border-green-500 p-3 rounded bg-gray-900 text-white placeholder-green-400"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="border border-green-500 p-3 rounded bg-gray-900 text-white placeholder-green-400"
        />
      
        <input
          type="number"
          name="lossOfFunds"
          placeholder="Loss of Funds (USD)"
          value={formData.lossOfFunds}
          onChange={handleChange}
          required
          className="border border-green-500 p-3 rounded bg-gray-900 text-white placeholder-green-400"
        />
        <button type="submit" className="cursor-pointer w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 transition">
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ScamReport;
