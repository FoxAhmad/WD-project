import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Navbar from './Navbar';
import Categories from './Categories';
import ListingCard from './ListingCard';

const socket = io('http://localhost:3001'); // Ensure the URL matches your server

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [searchActive, setSearchActive] = useState(false); // New state to track search activity

  useEffect(() => {
    if (searchActive) return; // Skip fetching all listings when search is active

    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/listings');
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();

    // Listen for WebSocket updates
    socket.on('listingUpdated', (updatedListings) => {
      if (!searchActive) setListings(updatedListings); // Update listings only if search is not active
    });

    // Clean up the WebSocket connection on unmount
    return () => {
      socket.off('listingUpdated');
    };
  }, [searchActive]);

  const handleSearch = (searchResults) => {
    setListings(searchResults);
    setSearchActive(true); // Mark search as active
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <Categories />
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing, index) => (
          <ListingCard
            key={index}
            image={listing.image}
            id={listing.id}
            title={listing.title}
            host={listing.host}
            status={listing.status}
            price={listing.price}
            location={listing.location}
            seller={listing.seller} // Pass seller information to the card
          />
        ))}
      </main>
    </div>
  );
};

export default HomePage;
