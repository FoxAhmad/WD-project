import { useState, useEffect } from 'react';

import ListingCard from '../components/ListingCard_S';

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

  const fetchSellerListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/seller/listings', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
  
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized: Invalid or missing token');
        } else {
          console.error(`Failed to fetch user info: ${response.status}`);
        }
        return null; // Return null if there's an error
      } else {
        const userData = await response.json();
        console.log(userData);
        return userData; // Return the fetched user data
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null; // Handle errors gracefully
    } finally {
      setLoading(false);
    }
  };
  const createListing = async () => {
    try {
      const userData = await fetchUserInfo();
      console.log(userData.name);
      if (!userData 
        // || !userData.objectid
        ) {
        console.error("User info could not be retrieved.");
        return;
      }
  
      const listingData = {
        ...newListing,
        seller: "676c4b09cba6000ec02b5f29",
        host: userData.name ,
        orid: Date.now(), // Attach the seller ID
      };
  
      console.log(listingData);
      const response = await fetch('http://localhost:3001/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });
  
      if (!response.ok) {
        console.error(`Failed to create listing: ${response.statusText}`);
      } else {
        console.log("Listing created successfully!");
        setIsFormOpen(false);
        // Optionally, refresh listings or update UI
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };
  

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/seller/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewListing({
      image: [],
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
    fetchSellerListings();
  }, []);

  return (
   <div className="p-6">
  {/* Navigation */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">Your Listings</h2>
    {/* <button
      className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
      onClick={() => navigate("/")} // Assuming `navigate` is imported from `react-router-dom`
    >
      Home
    </button> */}
  </div>

  {/* Error and Loading Messages */}
  {error && <p className="text-red-500 mb-4">{error}</p>}
  {loading && <p className="text-teal-500 mb-4">Loading...</p>}

  {/* Add Listing Button */}
  <button
    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition mb-4"
    onClick={() => setIsFormOpen(true)}
  >
    Add Listing
  </button>

  {/* Form Modal */}
  {isFormOpen && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Add New Listing</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createListing();
          }}
        >
          {/* Form Inputs */}
          <input
            type="text"
            placeholder="Title"
            value={newListing.title}
            onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Type (e.g., Apartment, House)"
            value={newListing.type}
            onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newListing.price}
            onChange={(e) => setNewListing({ ...newListing, price: Number(e.target.value) })}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newListing.location}
            onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            type="number"
            placeholder="Number of Guests"
            value={newListing.guests}
            onChange={(e) => setNewListing({ ...newListing, guests: Number(e.target.value) })}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            type="number"
            placeholder="Number of Bedrooms"
            value={newListing.bedrooms}
            onChange={(e) => setNewListing({ ...newListing, bedrooms: Number(e.target.value) })}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            type="number"
            placeholder="Number of Bathrooms"
            value={newListing.bathrooms}
            onChange={(e) => setNewListing({ ...newListing, bathrooms: Number(e.target.value) })}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            type="number"
            placeholder="Number of Beds"
            value={newListing.beds}
            onChange={(e) => setNewListing({ ...newListing, beds: Number(e.target.value) })}
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Amenities (comma-separated)"
            value={newListing.amenities}
            onChange={(e) => setNewListing({ ...newListing, amenities: e.target.value.split(',') })}
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Image URLs (comma-separated)"
            value={newListing.image}
            onChange={(e) => setNewListing({ ...newListing, images: e.target.value.split(',') })}
            className="border p-2 mb-2 w-full rounded"
          />

          {/* Buttons */}
          <div className="flex justify-between">
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* Listings Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {listings.map((listing) => (
      <div key={listing._id} className="border p-4 rounded shadow bg-white hover:shadow-lg transition">
         <ListingCard
            key={listing.orid}
            orid={listing.orid}
            image={listing.image}
            title={listing.title}
            host={listing.host}
            status={listing.status}
            price={listing.price}
            location={listing.location}
          />
        <button
          className="bg-teal-600 text-white px-2 py-1 rounded mt-2 hover:bg-teal-700 transition"
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
