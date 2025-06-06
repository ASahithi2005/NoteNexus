import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiBookOpen,
  FiUploadCloud,
  FiPlusCircle,
} from 'react-icons/fi';

const SideBar = () => {
  const [user, setUser] = useState(null);

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

  return (
    <aside className="bg-white h-screen px-4 py-6 border-r w-20 md:w-32 lg:w-48">
      <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-8 pl-2">
        Note Nexus
      </h1>
      <nav>
        <ul className="space-y-5 pt-7">
          <li>
            <Link to="/" className="flex items-center gap-3 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <FiHome /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/students" className="flex items-center gap-3 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <FiUsers /> Students
            </Link>
          </li>
          <li>
            <Link to="/assignments" className="flex items-center gap-3 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <FiBookOpen /> Assignments
            </Link>
          </li>
          <li>
            <Link to="/resources" className="flex items-center gap-3 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <FiFileText /> Resources
            </Link>
          </li>
          <li>
            <Link to="/studentNotes" className="flex items-center gap-3 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <FiFileText /> NoteTaking
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-3 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <FiSettings /> Settings
            </Link>
          </li> 
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
