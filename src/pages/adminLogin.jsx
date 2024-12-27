import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isadmin, setisadmin] = useState(false);
  const navigate = useNavigate();

  if (isadmin) {
    navigate('/admin'); // Replace with the admin dashboard route
  }

  const hardcodedAdmin = {
    email: 'admin@example.com',
    password: 'admin123',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
      setError(null);
      setisadmin(true);
      navigate('/admin'); // Replace with the admin dashboard route
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex flex-wrap justify-center h-screen bg-gradient-to-br from-teal-100 via-teal-200 to-gray-100">
      {/* Form Section */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2">
        <div className="lg:w-[28rem] mx-auto flex flex-col justify-center pt-8 px-6">
          <p className="text-left text-4xl font-bold text-teal-700">Welcome Admin</p>
          <p className="mt-2 text-left text-gray-600">
            Please enter your admin credentials to continue.
          </p>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full space-y-6 mt-4">
            <h2 className="text-2xl font-semibold text-center text-teal-700">Admin Log In</h2>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700 transition"
            >
              Log In
            </button>
          </form>
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
        <div className="absolute inset-0 bg-gradient-to-r from-teal-200 via-transparent to-transparent opacity-70"></div>

        {/* Text Content */}
        <div className="absolute bottom-0 left-0 p-6 bg-black bg-opacity-50 text-white">
          <h2 className="text-lg font-bold mb-2">Welcome to Water BnB</h2>
          <p className="text-sm font-semibold">
            Experience the ultimate stay with Water BnB! Discover serene waterfront properties, luxurious lake houses, and charming beachside retreats. Dive into a world of comfort and tranquility, where every stay feels like a vacation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
