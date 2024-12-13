import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import ListingDetails from './pages/ListingDetails';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SellerPage from './pages/SellerPage';
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/bookings/:id" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/seller" element={<SellerPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
