import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-2xl font-bold text-red-600">Airbnb</div>
        <ul className="flex space-x-4">
          <li className="hover:text-red-600 cursor-pointer">Home</li>
          <li className="hover:text-red-600 cursor-pointer">Experiences</li>
          <li className="hover:text-red-600 cursor-pointer">Online Experiences</li>
        </ul>
        <div className="flex space-x-4 items-center">
          <button className="bg-transparent text-sm font-semibold hover:text-red-600">Login</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold">Signup</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
