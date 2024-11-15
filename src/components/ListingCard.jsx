import { useNavigate } from 'react-router-dom';

const ListingCard = ({ id, image, title, host, status, price }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/listings/${id}`);
  };

  const handleBookClick = (e) => {
    e.stopPropagation(); // Prevents navigation to listing page on button click
    navigate(`/bookings/${id}`);
  };

  return (
    <div onClick={handleCardClick} className="border p-4 rounded-lg shadow-md hover:text-gray-800 transform transition-transform duration-200 hover:scale-110 cursor-pointer">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />
      <h3 className="font-semibold text-lg">{title}</h3>
      {/* <p className="text-sm text-gray-500">Hosted by {id}</p> */}
      <p className="text-sm text-gray-500">Hosted by {host}</p>
      <p className="text-sm text-gray-500">{status}</p>
      <p className="text-lg font-bold">${price} /day</p>
      <button onClick={handleBookClick} className="mt-2 p-2 bg-teal-500 text-white rounded-lg">
        Book Me
      </button>
    </div>
  );
};

export default ListingCard;
