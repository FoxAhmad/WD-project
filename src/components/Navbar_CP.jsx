import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoginSignupModal from './LoginSignupModal';
//import SearchBar from './SearchBar';

const Navbar = ({ onSearch }) => {
  const [showModal, setShowModal] = useState(false); // Show login/signup modal
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  // Fetch user info from the API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
  
        const response = await fetch('http://localhost:3001/api/users/me', {
        
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
         // console.log(response);
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized: Invalid or missing token');
          } else {
            console.error(`Failed to fetch user info: ${response.status}`);
          }
        } else {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching
  }

  return (
    <header className="flex flex-col space-y-4 p-4 border-b border-gray-200 bg-white">
      {/* Top Navbar Section */}
      <div className="flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img src="../public/waterbnb.png" alt="Waterbnb Logo" className="h-8" />
          <span className="font-semibold text-lg text-gray-800">Waterbnb</span>
        </div>

        {/* Right Action Section */}
        <div className="flex items-center space-x-4 text-gray-600">
  {user ? (
    // User is logged in
    <div className="relative group">
      {/* Avatar */}
      <div className="flex items-center space-x-2 cursor-pointer">
        <img
          src= '../public/pfp.png'//{`https://ui-avatars.com/api/?name=${user.name}&background=random&bold=true`} // Dynamically generate avatar
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-300"
        />
        <span className="hidden md:block font-medium">{user.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown */}
      <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
        <div className="p-4">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
        <hr />
        <button
          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  ) : (
    // User is not logged in
    <div className="flex items-center space-x-4"> 
    <button
      className="px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
      onClick={() => setShowModal(true)}
    >
      Login / Sign Up (seller/customer/admin)
    </button>
   <div className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
    <FaUserCircle size={24} className="text-gray-600" />
  </div>
</div>
  
  )}
  {/* User icon */}
  
</div>

      </div>

      {/* Search Bar Section */}
      {/* <div>
        <SearchBar onSearch={onSearch} />
      </div> */}

      {/* Login/Signup Modal */}
      {showModal && <LoginSignupModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default Navbar;