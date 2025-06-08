// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto items-center px-4">
        <p className="text-center mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} Note Nexus. All rights reserved.
        </p>
        <h4 className="text-center mb-2 md:mb-0">Made By A Sahithi</h4>
      </div>
    </footer>
  );
};

export default Footer;
