require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes.cjs');
const sellerRoutes = require('./routes/sellerRoutes.cjs');
const authRoutes = require('./routes/authRoutes.cjs'); // Optional for login
const jwt = require('jsonwebtoken'); // For verifying tokens
const User = require('./models/User.cjs');
//const { verifyToken } = require('./middleware/authMiddleware.cjs'); 
const { authenticateUser, authorizeRoles } = require('./middleware/authMiddleware.cjs');
//const Listing = require('./models/Listing.cjs'); // Assuming a Mongoose model for listings
const router = express.Router();


// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
   
      origin: 'http://localhost:5173', // Match frontend origin
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'], // Include Authorization for token
      credentials: true,
  },
});
 // Your Mongoose User model


// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,

}));
app.use(express.json());
//app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/auth', authRoutes);

// // Mongoose Schema for Listings
const listingSchema = new mongoose.Schema({
  images: [String],
  orid: Number,
  type: String,
  amenities: [String],
  guests: Number,
  bedrooms: Number,
  bathrooms: Number,
  beds: Number,
  title: String,
  host: String, // This might represent the seller's name or ID
  status: { type: String, default: 'Booking open' },
  price: Number,
  booked: { type: Boolean, default: false },
  location: String,
  seller: { type: String,  required: true }, // Add seller reference if needed
});

// Check if the Listing model is already defined
const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);


// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    
   
  })
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Emit Updated Listings
async function emitUpdatedListings() {
  try {
    const listings = await Listing.find();
    io.emit('listingUpdated', listings); // Notify all connected clients
  } catch (err) {
    console.error('Error emitting listings:', err);
  }
}

async function emitUpdatedUsers() {
  try {
    const users = await User.find();
    io.emit('userUpdated', users); // Notify all connected clients
  } catch (err) {
    console.error('Error emitting users:', err);
  }
}


// GET All Listings
app.get('/api/listings', async (req, res) => {
  try {
    const { type, location, guests, checkIn, checkOut, date } = req.query;

    // Build filter query
    const query = {};

    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' }; // Case-insensitive location match
    if (guests) query.guests = { $gte: parseInt(guests, 10) };

    if (type === 'Stays') {
      if (checkIn || checkOut) {
        query.status = 'available'; // Example: Add logic to filter stays based on availability
      }
    } else if (type === 'Experiences' && date) {
      query.status = 'available'; // Example: Add logic for filtering experiences by date
    }

    const listings = await Listing.find(query);
    res.json(listings);
    emitUpdatedListings(); // Emit real-time updates
  } catch (err) {
    console.error('Error retrieving filtered listings:', err);
    res.status(500).json({ message: 'Error retrieving listings' });
  }
});

app.get('/api/users/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, '17301');
    //console.log(decoded);
    const userId = decoded.id; // Assuming the token contains the user's ID

    // Fetch the user from MongoDB
    const user = await User.findById(userId).select('-password'); 
    // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
   // console.log(res);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET Listing by ID
app.get('/api/listings/:orid', async (req, res) => {
  const { orid } = req.params; // Extract 'orid' from route params
  //console.log(orid); // Debugging: Log orid to confirm it's being passed

  try {
    // Use Mongoose to find a single document with the matching 'orid'
    const listing = await Listing.findOne({ orid: orid });

    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    console.error('Error fetching listing:', error.message);
    res.status(500).json({ message: 'Server error occurred' });
  }
});

app.delete('/api/admin/listings/:orid', async (req, res) => {
  try {
    const { orid } = req.params; // Extract 'orid' from the route
    console.log('Deleting listing with orid:', orid);

    // Delete the listing by 'orid'
    const deletedListing = await Listing.findOneAndDelete({ orid: orid });

    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    return res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error.message);
    res.status(500).json({ message: 'Server error occurred' });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try { 
    const { id } = req.params; // Extract 'id' from the route
    console.log('Deleting user with id:', id);

    // Delete the user by 'id'
    const deletedUser = await User.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Server error occurred' });
  }
});

app.get('/api/Users', async (req, res) => {
  try {
    const users = await User.find(req.body);
    res.json(users);
    emitUpdatedUsers(); // Emit real-time updates
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// POST Add a New Listing
app.post('/api/listings', async (req, res) => {
  try {
    //console.log("HI im here");
    const newListing = new Listing(req.body);
    await newListing.save();
    await emitUpdatedListings(); // Emit real-time updates
    res.status(201).json({ message: 'Listing added successfully' });
  } catch (err) {
    console.error('Error adding listing:', err);
    res.status(500).json({ message: 'Error adding listing' });
  }
});


// WebSocket Connection for Real-Time Updates
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the current listings when a client connects
  emitUpdatedListings();

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
