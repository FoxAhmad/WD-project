import React, { useState } from 'react';

const categories = ['Beachfront', 'Cabins', 'Trending', 'Luxurious', 'City'];

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState('');

  return (
    <div className="flex overflow-x-auto space-x-4 p-4">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-full border-2 ${
            activeCategory === category
              ? 'bg-red-600 text-white'
              : 'border-gray-300 text-gray-600'
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Categories;
