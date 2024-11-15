import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/listings/${id}`);
       
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError(error.message);
      }
    };
    fetchListing();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!listing) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
    {/* Listing Image */}
    <img
      src={listing.image || "./demo.png"}
      alt={listing.title || "Listing Image"}
      className="w-full h-96 object-cover rounded-lg mb-8"
    />
    
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-extrabold text-gray-800">
        {listing.title || "No title available"}
      </h1>
      <span
        className={`ml-3 px-4 py-2 text-white rounded-lg ${
          listing.status === "Booking open" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {listing.status || "Status not available"}
      </span>
    </div>
    
    {/* Listing Details */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="space-y-2">
        <p className="text-xl text-gray-700">
          <span className="font-semibold text-gray-900">Type:</span> {listing.type || "N/A"}
        </p>
        <p className="text-xl text-gray-700">
          <span className="font-semibold text-gray-900">Guests:</span> {listing.guests || "N/A"}
        </p>
        <p className="text-xl text-gray-700">
          <span className="font-semibold text-gray-900">Bedrooms:</span> {listing.bedrooms || "N/A"}
        </p>
        <p className="text-xl text-gray-700">
          <span className="font-semibold text-gray-900">Bathrooms:</span> {listing.bathrooms || "N/A"}
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-xl text-gray-700">
          <span className="font-semibold text-gray-900">Price per night:</span> ${listing.price || "N/A"}
        </p>
        <p className="text-xl text-gray-700">
          <span className="font-semibold text-gray-900">Amenities:</span> 
          {listing.amenities ? listing.amenities.join(", ") : "No amenities available"}
        </p>
      </div>
    </div>
  
    {/* Host Section */}
    <div className="mb-6">
      <p className="text-xl font-semibold text-gray-800 mb-2">Hosted by:</p>
      <p className="text-lg text-gray-700">{listing.host || "No host information available"}</p>
    </div>
  
    {/* Action Button */}
    <div className="mt-8">
      <button
        onClick={() => navigate(`/bookings/${listing.id}`)}
        className="w-full py-4 bg-teal-600 text-white text-2xl font-semibold rounded-lg hover:bg-teal-700 transition duration-300"
      >
        Book Now
      </button>
    </div>
  </div>
  

  );
};

export default ListingDetails;
