import { useState, useEffect } from 'react';
import ListingCard from '../components/ListingCard_S';
import Navbar from '../components/Navbar_CP';
const SellerPage = () => {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [newListing, setNewListing] = useState(initialListingState());

  function initialListingState() {
    return {
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
    };
  }
   

  const fetchSellerListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/seller/listings', {
        // Pass the token in the Authorization header
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      // Update the listings state with the fetched data
      setListings(data);
    } catch (err) {
      // Handle errors gracefully and display an error message
      setError(err.message || 'An error occurred');
    } finally {
      // Set loading to false after the request is complete
      setLoading(false);
    }
  };
  


  const fetchBookingsForSeller = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/seller/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      //console.log(data);
      setBookings(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const approveBooking = async (bookingId, listingId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Approved' }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve booking');
      }

      

      //fetchSellerBookings();

      const updateListingResponse = await fetch(
          `http://localhost:3001/api/listings/id/${listingId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ booked: true  , status: 'Booking closed' }),
          }
        );
        updateListingResponse.json();
        alert('Booking approved successfully!');

    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const resetForm = () => {
    setNewListing(initialListingState());
    setEditingListing(null);
  };

  useEffect(() => {
    fetchSellerListings();
    fetchBookingsForSeller();
  }, []);

  return (
    <div className="p-6">
      <Navbar />
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Listings</h2>
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
          onClick={() => {
            setIsFormOpen(true);
            resetForm();
          }}
        >
          Add Listing
        </button>
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-teal-500 mb-4">Loading...</p>}

      {isFormOpen && (
        <ListingForm
          isEditing={!!editingListing}
          listing={newListing}
          onClose={() => {
            setIsFormOpen(false);
            resetForm();
          }}
          onSubmit={async () => {
            editingListing ? await updateListing() : await createListing();
          }}
          onUpdateListing={(field, value) =>
            setNewListing((prev) => ({ ...prev, [field]: value }))
          }
        />
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <ListingItem
            key={listing._id}
            listing={listing}
            onEdit={() => {
              setIsFormOpen(true);
              setEditingListing(listing);
              setNewListing(listing);
            }}
            onDelete={() => deleteListing(listing._id)}
          />
        ))}
      </section>

      <section>
        <h3 className="text-xl font-bold mt-8 mb-4">Booked Listings</h3>
        {bookings.map((booking) => {
          const listing = listings.find((item) => item._id === booking.listingId);
          return (
            <BookingItem
              key={booking._id}
              booking={booking}
              listing={listing}
              onApprove={() => approveBooking(booking._id, booking.listing)}
            />
          );
        })}
      </section>
    </div>
  );
};

const ListingForm = ({ isEditing, listing, onClose, onSubmit, onUpdateListing }) => (
  <div className="fixed inset-0 z-10 bg-gray-800 bg-opacity-75 flex justify-center items-center">
    <form
      className="bg-white p-6 rounded shadow-lg max-w-md w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit();
        onClose();
      }}
    >
      <h3 className="text-xl font-bold mb-4">
        {isEditing ? 'Edit Listing' : 'Add New Listing'}
      </h3>
      {Object.keys(listing).map((field) => (
        <div key={field} className="mb-2">
          <label className="block text-gray-700 mb-1 capitalize" htmlFor={field}>{field}</label>
          <input
            id={field}
            type={field === 'price' || field === 'guests' || field === 'bedrooms' || field === 'bathrooms' || field === 'beds' ? 'number' : 'text'}
            value={listing[field]}
            onChange={(e) => onUpdateListing(field, e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
      ))}
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          Submit
        </button>
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
);

const ListingItem = ({ listing, onEdit, onDelete }) => (
  <div className="border p-4 rounded shadow bg-white hover:shadow-lg transition">
    <ListingCard {...listing} />
    <div className="flex justify-end space-x-2">
      <button
        className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 transition"
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  </div>
);

const BookingItem = ({ booking, listing, onApprove }) => (
  <div className="border p-4 rounded shadow bg-white hover:shadow-lg transition">
    {listing && <ListingCard {...listing} />}
    <div className="mt-2 text-gray-700">
      <strong>Booking Details:</strong> 
      <p><strong>Listing:</strong> {booking.title}</p>
                <p><strong>Check-In:</strong> {new Date(booking.CheckIn).toLocaleDateString()}</p>
                <p><strong>Check-Out:</strong> {new Date(booking.CheckOut).toLocaleDateString()}</p>
                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                <p><strong>Status:</strong> {booking.status}</p>
    </div>
    <button
      className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition"
      onClick={onApprove}
    >
      Approve Booking
    </button>
  </div>
);

export default SellerPage;