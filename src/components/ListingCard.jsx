// src/components/ListingCard.jsx
const ListingCard = ({ image, title, host, status }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <img src={image} alt={title} className="w-full h-[250px] object-cover" />
      <div className="p-4">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">Hosted by {host}</p>
        <p className="text-xs text-red-500">{status}</p>
      </div>
    </div>
  );
};

export default ListingCard;
