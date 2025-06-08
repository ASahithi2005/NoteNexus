import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiBookOpen,
  FiMenu,
  FiX
} from 'react-icons/fi';

const SideBar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
      }
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white px-4 py-3 shadow flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gray-800">Note Nexus</h1>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="text-gray-800 text-2xl"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
  className={`
    bg-white border-r px-4 py-6 
    transform transition-transform duration-200 ease-in-out
    w-64 md:w-48 lg:w-60 shadow-lg md:shadow-none
    z-50 
    ${isOpen ? 'fixed top-0 left-0 h-screen' : 'fixed top-0 left-0 -translate-x-full h-screen'}
    md:static md:translate-x-0 md:h-auto
  `}
>

        <h1 className="text-2xl font-bold text-gray-800 mb-8 hidden md:block pt-3">
          Note Nexus
        </h1>
        <nav>
          <ul className="space-y-5">
            {[
              { name: 'Dashboard', icon: FiHome, link: '/' },
              { name: 'Students', icon: FiUsers, link: '/students' },
              { name: 'Assignments', icon: FiBookOpen, link: '/assignments' },
              { name: 'Resources', icon: FiFileText, link: '/resources' },
              { name: 'NoteTaking', icon: FiFileText, link: '/studentNotes' },
              { name: 'Settings', icon: FiSettings, link: '/settings' }
            ].map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded hover:bg-gray-100 pt-3"
                >
                  <item.icon />
                  {/* Show text on desktop and when sidebar is open on mobile */}
                  <span className={`${isOpen ? 'inline' : 'hidden'} md:inline`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default SideBar;
