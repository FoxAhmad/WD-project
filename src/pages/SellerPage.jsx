import { useState, useEffect } from 'react';
import axios from 'axios';

const SellerPage = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('token'); // Authentication token
      const response = await axios.get('http://localhost:3001/api/seller/listings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch listings.');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Listings</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div key={listing.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{listing.title}</h3>
            <p className="text-gray-700">Price: ${listing.price}</p>
            <p className="text-gray-500">Location: {listing.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerPage;
