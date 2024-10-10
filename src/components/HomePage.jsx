import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import Categories from './Categories';
import ListingCard from './ListingCard';
import Footer from './Footer';


const Home = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch mock listings data here
    setListings([
      {
        id: 1,
        image: 'https://via.placeholder.com/300',
        title: 'Beautiful Beachfront Home',
        propertyType: 'Entire home',
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        price: 200,
        rating: 4.9,
      },
      {
        id: 2,
        image: 'https://via.placeholder.com/300',
        title: 'Cozy Cabin in the Woods',
        propertyType: 'Cabin',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        price: 150,
        rating: 4.8,
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <SearchBar />
      <Categories />
      <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Home;
