// src/components/HomePage.jsx
import Navbar from './Navbar';
import Categories from './Categories';
import ListingCard from './ListingCard';

const listings = [
  {
    image: './demo.png',
    title: 'Haunt the Beetlejuice house',
    host: 'Delia Deetz',
    status: 'Booking closed',
  },
  {
    image: './demo.png',
    title: "Stay in Prince's Purple Rain house",
    host: 'Wendy and Lisa',
    status: 'Sold out',
  },
  {
    image: './demo.png',
    title: "Stay in Prince's Purple Rain house",
    host: 'Wendy and Lisa',
    status: 'Sold out',
  },
  {
    image: './demo.png',
    title: "Stay in Prince's Purple Rain house",
    host: 'Wendy and Lisa',
    status: 'Sold out',
  },
  {
    image: './demo.png',
    title: "Stay in Prince's Purple Rain house",
    host: 'Wendy and Lisa',
    status: 'Sold out',
  },
  {
    image: './demo.png',
    title: "Stay in Prince's Purple Rain house",
    host: 'Wendy and Lisa',
    status: 'Sold out',
  },
  // Add more listings as needed
];

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Categories />
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing, index) => (
          <ListingCard
            key={index}
            image={listing.image}
            title={listing.title}
            host={listing.host}
            status={listing.status}
          />
        ))}
      </main>
    </div>
  );
};

export default HomePage;
