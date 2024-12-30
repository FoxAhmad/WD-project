import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Navbar from './Navbar';
import Categories from './Categories';
import ListingCard from './ListingCard';

const socket = io('http://localhost:3001');

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchActive(false); // Reset search when filtering by category
  };

  const filteredListings = selectedCategory
    ? listings.filter((listing) =>
        listing.amenities.includes(selectedCategory)
      )
    : listings;

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <Categories onCategorySelect={handleCategorySelect} />

      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredListings.map((listing) => (
          <ListingCard
            key={listing.orid}
            orid={listing.orid}
            images={listing.images}
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
