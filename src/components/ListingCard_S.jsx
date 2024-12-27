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

const ListingCard_S = ({ orid, image, title, host, status, price, location }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/listings/${orid}`);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    navigate(`/bookings/${orid}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border p-4 rounded-lg shadow-md hover:text-gray-800 transform transition-transform duration-200 hover:scale-110 cursor-pointer"
    >
      <div className="slide-container" onClick={(e) => e.stopPropagation()}>
        <Slide>
          {image.map((slideImage, index) => (
            <div key={index}>
              <div style={{ ...divStyle, backgroundImage: `url(${slideImage})` }}></div>
            </div>
          ))}
        </Slide>
      </div>

      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">Hosted by {host}</p>
      <p className="text-sm text-gray-500">{location}</p>
      <p className="text-lg font-bold">${price} /day</p>

     
    </div>
  );
};

export default ListingCard_S;
