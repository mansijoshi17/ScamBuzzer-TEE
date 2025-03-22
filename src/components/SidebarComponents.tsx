import React from 'react';
import { FaHome, FaStar, FaCog, FaUserPlus, FaBookmark, FaExclamationCircle } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

export const SidebarComponents = () => {
    const location = useLocation();
    const activeTab = location.pathname.split('/').pop();

    return (
        <div className="w-16 bg-gray-900 shadow-lg flex flex-col justify-between py-6 border-r border-gray-800">
            <div className="flex flex-col items-center space-y-6">
                <Link to="/" className={`text-gray-500 text-2xl  cursor-pointer ${activeTab === '' || activeTab === '/' ? 'text-green-500' : ''}`}
                >
                    <FaHome className={`hover:text-green-400 ${activeTab === '' ? 'text-green-500' : 'text-gray-500'}`} />
                </Link>
                <Link to="/contract"
                    className={`text-gray-500 text-2xl  cursor-pointer ${activeTab === 'contract' ? 'text-green-500' : ''}`}
                >
                    <FaStar className={`hover:text-green-400 ${activeTab === 'contract' ? 'text-green-500' : 'text-gray-500'}`} />
                </Link>
                
                <Link to="/bookmark"
                    className={`text-gray-500 text-2xl  cursor-pointer ${activeTab === 'bookmark' ? 'text-green-500' : ''}`}
                >
                    <FaBookmark className={`hover:text-green-400 ${activeTab === 'bookmark' ? 'text-green-500' : 'text-gray-500'}`} />
                </Link>
                <Link to="/scamreport"
                    className={`text-gray-500 text-2xl  cursor-pointer ${activeTab === 'scamreport' ? 'text-green-500' : ''}`}
                >
                    <FaExclamationCircle className={`hover:text-green-400 ${activeTab === 'scamreport' ? 'text-green-500' : 'text-gray-500'}`} />
                </Link>
                <Link to="/settings"
                    className={`text-gray-500 text-2xl  cursor-pointer ${activeTab === 'settings' ? 'text-green-500' : ''}`}
                >
                    <FaCog className={`hover:text-green-400 ${activeTab === 'settings' ? 'text-green-500' : 'text-gray-500'}`} />
                </Link>
            </div>
        </div>
    );
};