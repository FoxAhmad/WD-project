import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:3001/api/admin/users'); // Adjust endpoint
        const listingsResponse = await axios.get('http://localhost:3001/api/admin/listings'); // Adjust endpoint
        setUsers(usersResponse.data);
        setListings(listingsResponse.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>{user.username} - {user.role}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Listings</h2>
        <ul>
          {listings.map((listing) => (
            <li key={listing._id}>{listing.title} - {listing.location}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
