import Navbar from "../components/Navbar_CP";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import Listingcard from "../components/Listingcard_S";
const CustomerProfile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null); // Track the booking being edited
 const [listing, setListing] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data); // Store user data in state
        fetchBookings(data.id); // Pass user ID to fetch bookings
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchBookings = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/bookings/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setBookings(data);
       // fetchListing(data.listing); // Store bookings in state
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    
    fetchUser();
  }, []);

  const handleCancelBooking = async (bookingId, listingId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Update listing's booked status
      await fetch(`http://localhost:3001/api/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ booked: false, status: "Booking open" }),
      });

      alert("Booking canceled successfully!");
      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };
  

  const handleEditBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const { _id, listing, CheckIn, CheckOut } = editingBooking;
      const response = await fetch(`http://localhost:3001/api/bookings/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ CheckIn, CheckOut }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        alert("Booking updated successfully!");

        // Update total price
        const nights = (new Date(CheckOut) - new Date(CheckIn)) / (1000 * 60 * 60 * 24);
        const totalPrice = nights * listing.price;

        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === _id ? { ...updatedBooking, totalPrice } : booking
          )
        );
        setEditingBooking(null);
      } else {
        alert("Failed to update booking. Please try again.");
      }
    } catch (error) {
      console.error("Error editing booking:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto my-8">
        <h1 className="text-3xl font-bold text-center mb-6">Customer Profile</h1>

        {/* Display User Information */}
        {user ? (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            
          </div>
        ) : (
          <p>Loading user information...</p>
        )}

        {/* Display Booking Information */}
        <div className="bg-white p-6 rounded shadow-md mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking._id} className="border-b-2 border-gray-200 pb-4 mb-4">
                <p><strong>Listing:</strong> {booking.title}</p>
                <p><strong>Check-In:</strong> {new Date(booking.CheckIn).toLocaleDateString()}</p>
                <p><strong>Check-Out:</strong> {new Date(booking.CheckOut).toLocaleDateString()}</p>
                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleCancelBooking(booking._id, booking.listing)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Cancel Booking
                  </button>
                  <button
                    onClick={() => setEditingBooking(booking)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Edit Booking
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No bookings found.</p>
          )}

          {/* Edit Booking Form */}
          {editingBooking && (
            <div className="mt-8 bg-gray-100 p-6 rounded shadow-md">
              <h3 className="text-xl font-bold mb-4">Edit Booking</h3>
              <div>
                <label>Check-In:</label>
                <input
                  type="date"
                  value={editingBooking.CheckIn}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, CheckIn: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-4"
                />
              </div>
              <div>
                <label>Check-Out:</label>
                <input
                  type="date"
                  value={editingBooking.CheckOut}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, CheckOut: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-4"
                />
              </div>
              <button
                onClick={handleEditBooking}
                className="bg-teal-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingBooking(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded ml-4"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
     
    </div>
  );
};

export default CustomerProfile;
