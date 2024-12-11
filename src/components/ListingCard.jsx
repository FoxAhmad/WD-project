import { useNavigate } from 'react-router-dom';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import React from 'react';

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '250px',
};

const ListingCard = ({ id, image, title, host, status, price, location }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/listings/${id}`);
  };

  const handleBookClick = (e) => {
    e.stopPropagation(); // Prevents navigation to listing page on button click
    navigate(`/bookings/${id}`);
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevent click events on the slider from propagating
  };

  return (
    <div
      onClick={handleCardClick}
      className="border p-4 rounded-lg shadow-md hover:text-gray-800 transform transition-transform duration-200 hover:scale-110 cursor-pointer"
    >
      {/* Slider */}
      <div className="slide-container" onClick={stopPropagation}>
        <Slide>
          {image.map((slideImage, index) => (
            <div key={index}>
              <div style={{ ...divStyle, backgroundImage: `url(${slideImage})` }}></div>
            </div>
          ))}
        </Slide>
      </div>

      {/* Details */}
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">Hosted by {host}</p>
      <p className="text-sm text-gray-500">{location}</p>
      <p className="text-lg font-bold">${price} /day</p>

      {/* Booking Button */}
      <button
        onClick={handleBookClick}
        className="mt-2 p-2 bg-teal-500 text-white rounded-lg"
      >
        Book Me
      </button>
    </div>
  );
};

export default ListingCard;
