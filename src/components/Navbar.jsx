// src/components/Navbar.jsx
import SearchBar from './SearchBar';
import { FaUserCircle } from 'react-icons/fa';
const Navbar = () => {
  return (
    <header className="flex flex-col space-y-4 p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="./waterbnb.png" alt="Waterbnb Logo" className="h-8" /> Waterbnb
        </div>
        <div className="flex items-center space-x-4 text-gray-600">
          <button className="text-sm">Waterbnb your home</button>
          <div className="p-2 bg-gray-200 rounded-full">
            <FaUserCircle size={24} className="text-gray-600" />
          </div>
        </div>
      </div>
      {/* Include the SearchBar below the main navbar items */}
      <SearchBar />
    </header>
  );
};

export default Navbar;
