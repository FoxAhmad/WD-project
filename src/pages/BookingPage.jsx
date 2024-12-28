import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import React from 'react';
import Navbar from '../components/Navbar_CP';
import { useNavigate } from 'react-router-dom';


const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '500px',
};

const BookingPage = () => {
  const { orid } = useParams();
  const [listing, setListing] = useState(null);
  const [totalPrice , settotalP ] = useState(0);
  const navigate = useNavigate();
  const [newBooking, setNewBooking] = useState({
    title: '',
    listing: '',
    user: '',
    seller: '',
    CheckIn: '',
    CheckOut: '',
    guests: 1,
    totalPrice: 0,
    status: 'Pending',
    createdAt: new Date(),
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/listings/${orid}`);
        const data = await response.json();
        setListing(data);
        setNewBooking((prev) => ({
          ...prev,
         
          listing: data._id,
          seller: data.seller,
        }));
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };
    fetchListing();
  }, [orid]);

  const calculateTotalPrice = () => {
    const nights = (new Date(newBooking.CheckOut) - new Date(newBooking.CheckIn)) / (1000 * 60 * 60 * 24);
    if (nights > 0 && listing) {
      setNewBooking((prev) => ({
        ...prev,
        totalPrice: nights * listing.price,
      }));
    } else {
      setNewBooking((prev) => ({
        ...prev,
        totalPrice: 0,
      }));
    }
  };

  const handleBooking = async () => {
    try {
      const userToken = localStorage.getItem('token'); // Assuming token holds user info
      if (!userToken) {
        alert('Please log in to book.');
        return;
      }
  
      // Fetch user information
      const userResponse = await fetch('http://localhost:3001/api/users/me', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const userData = await userResponse.json();
  
      const bookingDetails = { ...newBooking, user: userData.id, title: listing.title };
  
      // Create the booking
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails),
      });
  
      if (response.ok) {
        // Booking successful, update listing status
        // const updateListingResponse = await fetch(
        //   `http://localhost:3001/api/listings/${newBooking.listing}`,
        //   {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ booked: true  , status: 'Booking closed' }),
        //   }
        // );
  
        
          alert('Booking successful ');
          navigate('/profile');
         
          
      }

      else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };
  
  return (
    <div><Navbar />
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-lg">
       
      {listing && (
        <>
          {/* Image Slider */}
          <div className="slide-container">
            <Slide>
              {listing.images.map((slideImage, index) => (
                <div key={index}>
                  <div style={{ ...divStyle, backgroundImage: `url(${slideImage})` }} />
                </div>
              ))}
            </Slide>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Booking for <span className="text-teal-600">{listing.title}</span>
          </h2>

          {/* Booking Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label htmlFor="check-in" className="text-lg font-semibold text-gray-700">Check-in:</label>
              <input
                id="check-in"
                type="date"
                value={newBooking.CheckIn}
                onChange={(e) => {
                  const CheckIn = (e.target.value)
                  
                  if(newBooking.CheckOut < CheckIn)
                  {
                    alert(`Please Choose a date before ${newBooking.CheckOut}`);
                    setNewBooking({ ...newBooking, CheckIn: newBooking.CheckOut });
                    calculateTotalPrice();
                  }
                  else {setNewBooking({ ...newBooking, CheckIn: e.target.value });
                  calculateTotalPrice();}
                }}
                className="border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="check-out" className="text-lg font-semibold text-gray-700">Check-out:</label>
              <input
                id="check-out"
                type="date"
                value={newBooking.CheckOut}
                onChange={(e) => {
                  const CheckOut = (e.target.value)
                  
                  if(newBooking.CheckIn > CheckOut)
                  {
                    alert(`Please Choose a date after ${newBooking.CheckIn}`);
                    setNewBooking({ ...newBooking, CheckOut: newBooking.CheckIn });
                    calculateTotalPrice();
                  }
                  else {setNewBooking({ ...newBooking, CheckOut: e.target.value });
                  calculateTotalPrice();}
                }}
                className="border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
            <label htmlFor="guests" className="text-lg font-semibold text-gray-700">Guests:</label>
  <input
    id="guests"
    type="number"
    min="1"
    value={newBooking.guests}
    onChange={(e) => {
      const guestInput = Number(e.target.value);
      if (guestInput > listing.guests) {
        alert(`The maximum allowed guests for this listing is ${listing.guests}. Please enter a valid number.`);
        setNewBooking({ ...newBooking, guests: listing.guests });
      } else {
        setNewBooking({ ...newBooking, guests: guestInput });
      }
    }}
    className="border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
    required
  />
            </div>
          </div>

          {/* Total Price Section */}
          <div className="mt-6">
            <p className="text-2xl font-semibold text-gray-800">
              Total Price: <span className="text-teal-600">${newBooking.totalPrice}</span>
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
    </div>
  );
};

export default BookingPage;
