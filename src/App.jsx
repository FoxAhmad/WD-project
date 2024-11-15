import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import ListingDetails from './pages/ListingDetails';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/bookings/:id" element={<BookingPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
