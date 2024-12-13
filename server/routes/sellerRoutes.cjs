const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware.cjs');
const Listing = require('../models/Listing.cjs');
const router = express.Router();

router.get('/listings', authenticateUser, authorizeRoles('seller'), async (req, res) => {
  const listings = await Listing.find({ seller: req.user.id });
  res.json(listings);
});

router.delete('/listings/:id', authenticateUser, authorizeRoles('seller'), async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: 'Listing deleted' });
});

module.exports = router;
