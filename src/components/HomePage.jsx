import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Navbar from './Navbar';
import Categories from './Categories';
import ListingCard from './ListingCard';
const socket = io('http://localhost:3001'); // Ensure the URL matches your server

const HomePage = () => {
  const [listings, setListings] = useState([]);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/listings');
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
  
    fetchListings();
  
    // Listen for updates
    socket.on('listingUpdated', (updatedListings) => {
      
     {/* console.log('Received updated listings:', updatedListings);*/}
      setListings(updatedListings);
    });
  
    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.off('listingUpdated');
    };
  }, []);
  


  return (
    <div>
      <Navbar />
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
          />
        ))}
      </main>
    </div>
  );
};

export default HomePage;
