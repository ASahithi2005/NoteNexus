import React from 'react';
import banner from '../assets/image.png';

const BannerImage = () => {
  return (
    <div className="px-3 sm:px-6 md:px-5 pt-2 mb-6">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg h-40 sm:h-48 md:h-52 lg:h-56">
        <img
          src={banner}
          alt="Banner"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4 space-y-3">
          <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg">
            Welcome to <span className="text-black-400">Note Nexus</span>!!
          </h2>
          <p className="text-sm sm:text-base text-blue-50 font-light italic">
            Your one-stop hub for courses, notes, and collaboration 🚀
          </p>
          </div>
      </div>
    </div>
  );
};

export default BannerImage;
