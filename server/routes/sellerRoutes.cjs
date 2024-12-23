const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware.cjs');
const Listing = require('../models/Listing.cjs'); // Assuming this is the Mongoose model
const router = express.Router();

/**
 * Get all listings for the authenticated seller.
 */
router.get('/listings', authenticateUser, authorizeRoles('seller'), async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Fetch listings where the seller ID matches the authenticated user's ID
    const listings = await Listing.getListingsBySeller( sellerId );

    if (!listings.length) {
      return res.status(404).json({ message: 'No listings found for this seller.' });
    }

    res.status(200).json(listings);
  } catch (error) {
    console.error(`Error fetching listings for seller ${req.user.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch listings. Please try again later.' });
  }
});

/**
 * Delete a specific listing by ID (for sellers).
 */
router.delete('/listings/:id', authenticateUser, authorizeRoles('seller'), async (req, res) => {
  try {
    const { id: listingId } = req.params;
    const sellerId = req.user.id;

    // Find and delete the listing while ensuring the seller matches
    const listing = await Listing.findOneAndDelete({ _id: listingId, seller: sellerId });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found or unauthorized action.' });
    }

    res.status(200).json({ message: 'Listing deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting listing ID ${req.params.id} for seller ${req.user.id}:`, error);
    res.status(500).json({ message: 'Failed to delete listing. Please try again later.' });
  }
});

module.exports = router;
