import { useState, useEffect } from 'react';
import axios from 'axios';

const SellerPage = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newListing, setNewListing] = useState({
    images: [],
    type: '',
    amenities: [],
    guests: 0,
    bedrooms: 0,
    bathrooms: 0,
    beds: 0,
    title: '',
    host: '',
    status: 'Booking open',
    price: 0,
    booked: false,
    location: '',
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:3001/api/seller/listings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch listings.');
    } finally {
      setLoading(false);
    }
  };

  const addListing = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/seller/listings', newListing, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => [...prev, response.data]);
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add listing.');
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/seller/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prevListings) => prevListings.filter((listing) => listing._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewListing({
      images: [],
      type: '',
      amenities: [],
      guests: 0,
      bedrooms: 0,
      bathrooms: 0,
      beds: 0,
      title: '',
      host: '',
      status: 'Booking open',
      price: 0,
      booked: false,
      location: '',
    });
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Listings</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setIsFormOpen(true)}
      >
        Add Listing
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Listing</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addListing();
              }}
            >
              <input
                type="text"
                placeholder="Title"
                value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Type"
                value={newListing.type}
                onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newListing.price}
                onChange={(e) => setNewListing({ ...newListing, price: Number(e.target.value) })}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newListing.location}
                onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                className="border p-2 mb-2 w-full"
                required
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Submit
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div key={listing._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{listing.title}</h3>
            <p className="text-gray-700">Type: {listing.type}</p>
            <p className="text-gray-700">Price: ${listing.price}</p>
            <p className="text-gray-500">Location: {listing.location}</p>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded mt-2"
              onClick={() => deleteListing(listing._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerPage;
