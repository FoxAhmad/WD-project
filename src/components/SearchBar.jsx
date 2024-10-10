import React, { useState } from 'react';

const SearchBar = () => {
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', location);
  };

  return (
    <div className="bg-white shadow-lg py-4 px-6 flex justify-center">
      <input
        type="text"
        className="border border-gray-300 rounded-l-md px-4 py-2 w-64"
        placeholder="Where are you going?"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        className="bg-red-600 text-white px-6 py-2 rounded-r-md"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
