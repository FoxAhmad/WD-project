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

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/auth', authRoutes);

// Mongoose Schema for Listings
const listingSchema = new mongoose.Schema({
  images: [String],
  id: Number,
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
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add seller reference if needed
});

// Check if the Listing model is already defined
const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);


// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    
    // After MongoDB is connected, insert the listings if not already done
    // const dataPath = path.join(__dirname, 'listings.json');
    // const listingsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Listing.countDocuments({}, (err, count) => {
    //   if (count === 0) { // Only insert if no listings are already in the database
    //     Listing.insertMany(listingsData)
    //       .then((result) => {
    //         console.log('Listings added successfully:', result);
    //       })
    //       .catch((error) => {
    //         console.error('Error adding listings:', error);
    //       });
    //   }
    // });
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

// GET Listing by ID
app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id); 
    
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (err) {
    console.error('Error retrieving listing:', err);
    res.status(500).json({ message: 'Error retrieving listing' });
  }
});

// POST Add a New Listing
app.post('/api/listings', async (req, res) => {
  try {
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
