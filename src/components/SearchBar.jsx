import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [mode, setMode] = useState('Stays'); // 'Stays' or 'Experiences'

  return (
    <div className="  mx-auto ">
      {/* Mode toggle */}
      <div className="flex justify-center  mb-3">
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

      {/* Responsive Search Bar */}
      <div className="flex flex-col sm:flex-row px-14 py-4  items-center justify-center bg-white rounded-full shadow-md p-3  sm:py-2 border border-gray-300 space-y-2 sm:space-y-0 sm:space-x-0">
        <input
          type="text"
          placeholder="Where"
          className="w-full sm:w-auto flex-grow px-2 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-500"
        />
        
        <div className="hidden sm:block h-6 w-px bg-gray-300 "></div>

        {mode === 'Stays' ? (
          <>
            <input
              type="text"
              placeholder="Check in"
              className="w-full sm:w-auto rounded-full flex-grow px-1 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
            <div className=" hidden sm:block h-6 w-px bg-gray-300"></div>
            <input
              type="text"
              placeholder="Check out"
              className="w-full sm:w-auto flex-grow px-2 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Date"
              className="w-full sm:w-auto flex-grow px-2 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
          </>
        )}

        <input
          type="text"
          placeholder="Who"
          className="w-full sm:w-auto flex-grow px-2 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-500"
        />
        
        <button className="p-2 bg-teal-500 rounded-full  text-white sm:ml-2">
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
