import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <ul className="space-y-2">
            <li>Support</li>
            <li>Community</li>
            <li>Hosting</li>
            <li>About</li>
          </ul>
          <div className="space-x-4">
            <i className="fab fa-facebook text-2xl"></i>
            <i className="fab fa-twitter text-2xl"></i>
            <i className="fab fa-instagram text-2xl"></i>
          </div>
        </div>
        <div className="text-center text-sm mt-4">
          &copy; 2024 Airbnb Clone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
