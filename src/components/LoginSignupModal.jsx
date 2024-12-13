import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const LoginSignupModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // useNavigate hook for page redirection

  // Redirect to Login or Sign Up page when a button is clicked
  const handleRedirect = (action) => {
    if (action === 'login') {
      navigate('/login'); // Redirect to the login page
    } else if (action === 'signup') {
      navigate('/signup'); // Redirect to the signup page
    }
    onClose(); // Close the modal when a button is clicked
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Login / Sign Up</h2>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => window.location.href = '/login'} // Redirect to login page
            className="w-full bg-teal-500 text-white py-2 rounded"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => window.location.href = '/signup'} // Redirect to signup page
            className="w-full bg-teal-500 text-white py-2 rounded"
          >
            Sign Up
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginSignupModal;
