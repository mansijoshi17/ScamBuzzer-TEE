// import { useState } from "react";   
// import { SidebarComponents } from "@/components/SidebarComponents"
// import { FaShieldAlt } from "react-icons/fa";
// import { Checkbox } from "@/components/home/checkbox";
// import { Settings } from "@/components/Settings";
// import { Home } from "@/components/Home";
// import { ContractChecker } from "@/components/ContractChecker";

// const App = () => { 
//   const [activeTab, setActiveTab] = useState('home');  
//   const [page, setPage] = useState('home');

//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//     setPage(tab);
//   };

//   useEffect(() => {
//     const handleUrlChange = () => {
//       const path = window.location.pathname;
//       setPage(path);
//     };
//     window.addEventListener('popstate', handleUrlChange);
//   }, []);

//   const renderPage = () => {
//     switch (page) {
//       case 'home':
//         return <Home />; 
//       case 'contract':
//         return <ContractChecker />; 
//       case 'settings':
//         return <Settings />; 
//       default:
//         return <Checkbox />;
//     }
//   };
//   return (
//     <div className="flex h-screen bg-gray-900 border-1 border-gray-900"> 
//       <SidebarComponents activeTab={activeTab} setActiveTab={handleTabChange} setPage={handleTabChange} /> 
//       <div className="flex-1">
//         <Header />
//         {renderPage()} 
//       </div>
//     </div>
//   );
// };

// export default App;

import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "@/components/Home";
import { Settings } from "@/components/Settings"; 
import { ContractChecker } from "@/components/ContractChecker";
import { SidebarComponents } from "@/components/SidebarComponents";
import { Header } from "@/components/Header";
import Contract from "@/pages/Contract";
import { Toaster } from "react-hot-toast";
import Bookmark from "@/pages/Bookmark";

const App = () => {
  return (
    <Router>
      <Toaster />
       <div className="flex h-screen bg-gray-900 border-1 border-gray-900"> 
       <SidebarComponents /> 
        <div className="flex-1">
          <Header /> 
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} /> 
          <Route path="/Contract" element={<Contract />} />
          <Route path="/Bookmark" element={<Bookmark />} />
        </Routes>
        </div>
      </div> 
    </Router>
  );
};

export default App;
