import React, { useState } from 'react';

const ScamReport = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    network: '',
    lossOfFunds: ''
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can handle the form submission, e.g., send data to an API
    console.log('Scam Report Submitted:', formData);
  };

  return (
    <div className="flex flex-col items-center justify-center  min-w-xs p-4">
      <h1 className="text-xl font-semibold text-green-500 mb-2">Scam Report</h1>
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
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="border border-green-500 p-3 rounded bg-gray-900 text-white placeholder-green-400"
        />
        <input
          type="text"
          name="network"
          placeholder="Network"
          value={formData.network}
          onChange={handleChange}
          required
          className="border border-green-500 p-3 rounded bg-gray-900 text-white placeholder-green-400"
        />
        <input
          type="number"
          name="lossOfFunds"
          placeholder="Loss of Funds"
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
