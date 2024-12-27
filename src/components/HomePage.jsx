import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Navbar from './Navbar';
import Categories from './Categories';
import ListingCard from './ListingCard';

const socket = io('http://localhost:3001');

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    if (searchActive) return;

    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/listings');
        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
      }
    };

    fetchListings();

    socket.on('listingUpdated', (updatedListings) => {
      if (!searchActive) setListings(updatedListings);
    });

    return () => socket.off('listingUpdated');
  }, [searchActive]);

  const handleSearch = (searchResults) => {
    setListings(searchResults);
    setSearchActive(true);
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <Categories />
      
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard
            key={listing.orid}
            orid={listing.orid}
            image={listing.image}
            title={listing.title}
            host={listing.host}
            status={listing.status}
            price={listing.price}
            location={listing.location}
          />
        ))}
      </main>
    </div>
  );
};

export default HomePage;
