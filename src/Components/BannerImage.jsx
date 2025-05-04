import React from 'react';
import banner from '../assets/Banner1.png';

const BannerImage = () => {
  return (
    <div className="px-8 mt-4 mb-8n pt-5">
      <div className="rounded-2xl overflow-hidden shadow-lg relative h-48 md:h-56 lg:h-60">
        <img
          src={banner}
          alt="Banner"
          className="w-full h-full object-cover object-top" // keep horse in view
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h2 className="text-white text-2xl md:text-3xl font-semibold text-center">
            Welcome to Note Nexus!!
          </h2>
        </div>
      </div>
      
    </div>
  );
};

export default BannerImage;
