import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role is customer
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';

    try {
      const response = await axios.post(`http://localhost:3001${endpoint}`, {
        email,
        password,
        role: isSignup ? role : undefined, // Role is only needed during signup
      });

      // Save token to localStorage or cookies
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      // Redirect based on role
      if (response.data.role === 'admin') navigate('/admin');
      else if (response.data.role === 'seller') navigate('/seller');
      else navigate('/'); // Redirect to homepage for customers
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          {isSignup ? 'Sign Up' : 'Log In'}
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

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

        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
        >
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>

        <p className="text-sm text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setIsSignup(!isSignup)}
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
