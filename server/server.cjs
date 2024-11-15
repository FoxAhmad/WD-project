// server/server.cjs
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Allow only your frontend origin
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

// Path to listings.json file
const listingsPath = path.join(__dirname, 'listings.json');

// Load listings data from JSON file
let listings = require(listingsPath);

// Serve listings via a GET endpoint
app.get('/api/listings/:id', (req, res) => {
  const listingId = req.params.id;
  
  let listing;
for (let i = 0; i < listings.length; i++) {
 
  if (listings[i].id == listingId) {
    listing = listings[i];
   
    break; // Stops once a match is found
  }
}

  if (listing) {
    res.json(listing);
  } else {
   
    res.status(404).json({ message: 'Listing not found' });
  }
});
app.get('/api/listings', (req, res) => {

  res.json(listings);
  
});


// Function to add a new listing and emit updates to clients
function addListing(newListing) {
  listings.push(newListing);
  console.log('New listing added:', newListing);
  console.log('Updated listings array:', listings);
  io.emit('listingUpdated', listings);  // Notify all connected clients
}

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// API endpoint to add a new listing
app.post('/api/listings', (req, res) => {
  const newListing = req.body;
  addListing(newListing);
  res.status(201).json({ message: 'Listing added successfully' });
});

// Watch for changes in listings.json file and emit updates
fs.watchFile(listingsPath, (curr, prev) => {
  console.log('listings.json file has changed');
  // Clear the require cache and reload listings data
  delete require.cache[require.resolve(listingsPath)];
  listings = require(listingsPath);
  io.emit('listingUpdated', listings);  // Emit updated listings to clients
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
