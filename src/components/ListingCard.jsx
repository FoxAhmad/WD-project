import React from 'react';

const ListingCard = ({ image, title, propertyType, guests, bedrooms, bathrooms, price, rating }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-64">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-sm text-gray-600">{propertyType}</p>
        <p className="text-sm text-gray-600">{guests} guests · {bedrooms} bedrooms · {bathrooms} bathrooms</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-red-600 font-bold">${price}/night</span>
          <span className="text-yellow-500">{rating}★</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
