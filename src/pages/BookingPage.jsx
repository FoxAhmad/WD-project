import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const BookingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/listings/${id}`);
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };
    fetchListing();
  }, [id]);

  const calculateTotalPrice = () => {
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    setTotalPrice(nights * (listing ? listing.price : 0));
  };

  const handleBooking = async () => {
    try {
      const bookingDetails = { checkIn, checkOut, listingId: id };
      const response = await fetch(`http://localhost:3001/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails)
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-lg">
    {listing && (
      <>
        {/* Listing Image */}
        <img
          src={listing.image || "./demo.png"}
          alt={listing.title || "Listing Image"}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Booking for <span className="text-teal-600">{listing.title}</span>
        </h2>
        
        {/* Check-in and Check-out Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="check-in" className="text-lg font-semibold text-gray-700">Check-in:</label>
            <input
              id="check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              onBlur={calculateTotalPrice}
              className="border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="check-out" className="text-lg font-semibold text-gray-700">Check-out:</label>
            <input
              id="check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              onBlur={calculateTotalPrice}
              className="border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
  
        {/* Total Price Section */}
        <div className="mt-6">
          <p className="text-2xl font-semibold text-gray-800">
            Total Price: <span className="text-teal-600">${totalPrice}</span>
          </p>
        </div>
  
        {/* Confirm Button */}
        <div className="mt-8">
          <button
            onClick={handleBooking}
            className="w-full py-4 bg-teal-600 text-white text-xl font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition duration-300"
          >
            Confirm Booking
          </button>
        </div>
      </>
    )}
  </div>
  
  
  );
};

export default BookingPage;
