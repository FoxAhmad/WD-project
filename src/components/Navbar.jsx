import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoginSignupModal from './LoginSignupModal';
import SearchBar from './SearchBar';

const Navbar = ({ onSearch }) => {
  const [showModal, setShowModal] = useState(false); // Show login/signup modal
  const [user, setUser] = useState(null); // Store user info
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="flex flex-col space-y-4 p-4 border-b border-gray-200 bg-white">
      {/* Top Navbar Section */}
      <div className="flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img src="./waterbnb.png" alt="Waterbnb Logo" className="h-8" />
          <span className="font-semibold text-lg text-gray-800">Waterbnb</span>
        </div>

        {/* Right Action Section */}
        <div className="flex items-center space-x-4 text-gray-600">
          {user ? (
            <>
              <span className="text-sm">{`Name: ${user.name}`}{`Role: ${user.role}`}</span>
              <button className="text-sm hover:text-gray-800" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="text-sm hover:text-gray-800" onClick={() => setShowModal(true)}>
              Login / Sign Up
            </button>
          )}
          <div className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <FaUserCircle size={24} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div>
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Login/Signup Modal */}
      {showModal && <LoginSignupModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default Navbar;
