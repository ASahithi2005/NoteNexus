import React from 'react';
import SideBar from '../Components/SideBar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideBar />
        {children}
    </div>
  );
};

export default MainLayout;
