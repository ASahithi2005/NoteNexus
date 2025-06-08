import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TopBar = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.name || '');
      } catch (err) {
        console.error('Failed to parse user:', err);
      }
    }
  }, []);

  return (
    <header className="w-full mt-4 px-4 md:px-6 pt-4 flex flex-row justify-between items-center gap-3 flex-wrap">

      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
        {username ? `Hello ${username} !` : 'Welcome!'}
      </h2>
      <div className="flex gap-2">
        <Link to="/signup">
          <button className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm">
            Sign In
          </button>
        </Link>
        <Link to="/login">
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            Log In
          </button>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
