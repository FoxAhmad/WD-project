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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">
          {isSignup ? 'Sign Up' : 'Log In'}
        </h2>

        {/* Error and Success Messages */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        {/* Name Field for Signup */}
        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        )}

        {/* Email Field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        {/* Password Field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        {/* Role Selection for Signup */}
        {isSignup && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Select Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
        >
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>

        {/* Toggle Between Signup and Login */}
        <p className="text-sm text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
              setSuccess(null); // Clear messages on toggle
            }}
            className="text-teal-500 cursor-pointer hover:underline"
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
