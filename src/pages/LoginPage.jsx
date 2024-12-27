import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Added for signup
  const [role, setRole] = useState('customer');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // For success messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null); // Reset success state

    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
    const payload = {
      email,
      password,
      role: isSignup ? role : undefined,
    };

    if (isSignup) {
      payload.name = name;
    }

    try {
      const response = await axios.post(`http://localhost:3001${endpoint}`, payload);

      if (isSignup) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          setIsSignup(false); // Switch to login form
          setSuccess(null); // Clear success message
        }, 2000); // Delay for 2 seconds
      } else {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);

        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'customer') navigate('/');
        else if (user.role === 'seller') navigate('/seller');
        else navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-wrap justify-center h-screen bg-gradient-to-br from-teal-100 via-teal-200 to-gray-100">
  {/* Form Section */}
  <div className="flex flex-col items-center justify-center w-full md:w-1/2">
    <div className="lg:w-[28rem] mx-auto flex flex-col justify-center pt-8 px-6">
      <p className="text-left text-4xl font-bold text-teal-700">Welcome</p>
      <p className="mt-2 text-left text-gray-600">
        Please enter your details to continue.
      </p>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full space-y-6 mt-4">
        <h2 className="text-2xl font-semibold text-center text-teal-700">
          {isSignup ? 'Sign Up' : 'Log In'}
        </h2>

        {/* Error and Success Messages */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        {/* Name Field for Signup */}
        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-teal-200"
            required
          />
        )}

        {/* Email Field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-teal-200"
          required
        />

        {/* Password Field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-teal-200"
          required
        />

        {/* Role Selection for Signup */}
        {isSignup && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Select Role:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-teal-200"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700 transition"
        >
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>

        {/* Toggle Between Signup and Login */}
        <p className="text-sm text-center text-gray-600">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
              setSuccess(null);
            }}
            className="text-teal-600 cursor-pointer hover:underline"
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </span>
        </p>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Are you an admin?{' '}
        <span
          onClick={() => navigate('/adminlog')}
          className="text-teal-600 cursor-pointer hover:underline"
        >
          Log in here
        </span>
      </p>
    </div>
  </div>

  {/* Advertisement Section */}
  <div className="hidden md:flex md:w-1/2 relative bg-gray-800 items-center justify-center">
  {/* Background Image */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('../public/demo.png')" }}
  ></div>

  {/* Gradient Overlay */}
  <div className="hidden md:block md:absolute z-0 left-0 top-0 w-full h-full bg-gradient-to-r from-teal-200 via-white-100 to-white-300" />
   

  {/* Text Content */}
  <div className="relative h-full w-full">
  {/* Background Image */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('../public/demo.png')" }}
  ></div>

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-teal-200 via-transparent to-transparent opacity-70"></div>

  {/* Text Content */}
  <div className="absolute bottom-0 left-0  p-6 bg-black bg-opacity-50 text-white">
    <h2 className="text-lg font-bold mb-2">
      Welcome to Water BnB
    </h2>
    <p className="text-sm font-semibold">
      Experience the ultimate stay with Water BnB! Discover serene waterfront properties, luxurious lake houses, and charming beachside retreats. Dive into a world of comfort and tranquility, where every stay feels like a vacation.
    </p>
  </div>
</div>

</div>

</div>

  );
};

export default LoginPage;
