// src/components/Categories.jsx
import { FaHome, FaCity, FaMountain, FaUmbrellaBeach, FaBed, FaSnowflake, FaTree, FaFireAlt, FaBacteria } from 'react-icons/fa';
import React from 'react';
import { useState } from 'react';
import { FaHouse, FaHouseChimney, FaHouseChimneyWindow, FaHouseSignal } from 'react-icons/fa6';

 
const categories = [
  { name: 'Icons', icon: <FaHome /> },
  { name: 'Rooms', icon: <FaBed /> },
  { name: 'Top Cities', icon: <FaCity /> },
  { name: 'Amazing Views', icon: <FaMountain /> },
  { name: 'Beach', icon: <FaUmbrellaBeach /> },
  { name: 'Arctic', icon: <FaSnowflake /> },
  { name: 'Cabins', icon: <FaTree /> },
  { name: 'Trending', icon: <FaFireAlt /> },
  { name: 'Castle', icon: <FaHouseChimneyWindow /> },
  //make different icons
  { name: 'Covid-19', icon: <FaBacteria /> },
  { name: 'House', icon: <FaHouse /> },
  { name: 'House Chimney', icon: <FaHouseChimney /> },
  { name: 'House Signal', icon: <FaHouseSignal /> },
  //more icons
  
  // Add more categories as needed
];
const Categories = () => {
  return (
    <div className="flex  items-center  space-x-10 overflow-x-auto p-4 border-b border-gray-200">
      {categories.map((category, index) => (
       <button
        // Add a key prop to the button element
         
     
        key={index} 
        className="flex flex-col items-center justify-center w-24 h-24 rounded-full p-3 text-gray-600 hover:text-gray-800 transform transition-transform duration-200 hover:scale-110 hover:bg-blue-200 ">
        <span className="text-2xl">{category.icon}</span>
        <span className="text-sm">{category.name}</span>
      </button>
      
      ))}
    </div>
  );
};

export default Categories;
//hover animation 