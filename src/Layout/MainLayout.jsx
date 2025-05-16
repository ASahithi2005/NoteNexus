import React from 'react';
import SideBar from '../Components/SideBar';
import TopBar from '../Components/TopBar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar  />
      <div className="flex-1 overflow-y-auto">
        
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
