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
const ListingCard = ({ orid, image, title, host, status, price, location }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/listings/${orid}`);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
  const userData = fetchUserInfo();
  if(userData.role === 'Customer'){
    navigate(`/bookings/${orid}`);}
   else {
     alert('You must be a customer to book a listing.');
     navigate('/login');
   } 
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
