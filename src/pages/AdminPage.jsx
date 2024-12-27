import React, { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard_A';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isadmin, setisadmin] = useState(false);

  // if (!isadmin) {
  //   window.location.href = '/adminlog';
  // }

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:3001/api/users'); // Adjust endpoint
        const listingsResponse = await fetch('http://localhost:3001/api/listings'); // Adjust endpoint

        const usersData = await usersResponse.json();
        const listingsData = await listingsResponse.json();

        setUsers(usersData);
        setListings(listingsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const deleteListing = async (orid,id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setLoading(true);
    try {
      //const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/admin/listings/${orid}`, {
        method: 'DELETE',
        //headers: { Authorization: `Bearer ${token}` },
      });
     
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-4 bg-teal-200 ">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Section */}
        <section className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">Role: {user.role}</p>
                </div>
                <div>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Listings Section */}
        <section className="bg-white  p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Listings</h2>
          <ul>
            {listings.map((listing) => (
              <li key={listing._id} className="flex justify-between items-center border-b py-2">
                <div>
                <ListingCard
            key={listing.orid}
            orid={listing.orid}
            title={listing.title}
            host={listing.host}
            status={listing.status}
            price={listing.price}
            location={listing.location}
            seller={listing.seller}
          />
                </div>
                <div>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => deleteListing(listing.orid,listing._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
