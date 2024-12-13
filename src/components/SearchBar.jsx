import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const SearchBar = ({ onSearch, onReset }) => {
  const [mode, setMode] = useState('Stays'); // 'Stays' or 'Experiences'
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = async () => {
    const params = {};

    if (mode) params.type = mode;
    if (location) params.location = location.trim();
    if (guests) params.guests = guests.trim();

    if (mode === 'Stays') {
      if (checkIn) params.checkIn = checkIn.trim();
      if (checkOut) params.checkOut = checkOut.trim();
    } else if (mode === 'Experiences') {
      if (date) params.date = date.trim();
    }

    try {
      const response = await axios.get('http://localhost:3001/api/listings', { params });
      if (onSearch) onSearch(response.data);
    } catch (error) {
      console.error('Error fetching filtered listings:', error.response?.data || error.message);
    }
  };

  const handleReset = () => {
    setMode('Stays');
    setLocation('');
    setGuests('');
    setCheckIn('');
    setCheckOut('');
    setDate('');
    if (onReset) onReset();
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-center mb-3">
        <button
          onClick={() => setMode('Stays')}
          className={`px-4 py-2 ${mode === 'Stays' ? 'font-bold border-b-2 border-black' : 'text-gray-500'}`}
        >
          Stays
        </button>
        <button
          onClick={() => setMode('Experiences')}
          className={`px-4 py-2 ${mode === 'Experiences' ? 'font-bold border-b-2 border-black' : 'text-gray-500'}`}
        >
          Experiences
        </button>
      </div>
      <div className="flex flex-col sm:flex-row px-14 py-4 items-center justify-center bg-white rounded-full shadow-md border border-gray-300 space-y-2 sm:space-y-0">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full sm:w-auto flex-grow px-2 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-500"
        />
        {mode === 'Stays' ? (
          <>
            <input
              type="date"
              value={checkIn}
              placeholder='Check-in'
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full sm:w-auto flex-grow px-1 py-2 bg-transparent outline-none text-gray-700"
            />
            <input
              type="date"
              value={checkOut}
              placeholder='Check-out'
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full sm:w-auto flex-grow px-2 py-2 bg-transparent outline-none text-gray-700"
            />
          </>
        ) : (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-auto flex-grow px-2 py-2 bg-transparent outline-none text-gray-700"
          />
        )}
        <input
          type="number"
          placeholder="Guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full sm:w-auto flex-grow px-2 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-500"
        />
        <button onClick={handleSearch} className="p-2 bg-teal-500 rounded-full text-white sm:ml-2">
          <FaSearch />
        </button>
        <button onClick={handleReset} className="ml-2 px-4 py-1 bg-teal-500 rounded-full text-white">
          Reset
        </button>
      </div>
    </div>
  );
};


export default SearchBar;
