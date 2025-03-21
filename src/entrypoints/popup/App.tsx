 

import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "@/components/Home";
import { Settings } from "@/components/Settings";  
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
