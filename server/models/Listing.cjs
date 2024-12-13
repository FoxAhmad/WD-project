const Listing = require('./Listing.cjs');

/**
 * Function to get all listings for a seller.
 * @param {string} sellerId - The ID of the seller.
 * @returns {Promise<Array>} - Returns a list of listings.
 * @throws {Error} - Throws an error if fetching listings fails.
 */


const getListingsBySeller = async (sellerId) => {
  try {
    // Fetch all listings for the given seller ID
    return await Listing.find({ seller: sellerId });
  } catch (error) {
    console.error(`Error fetching listings for seller ID ${sellerId}:`, error);
    throw new Error('Failed to fetch listings. Please try again later.');
  }
};

/**
 * Function to delete a specific listing by its ID.
 * Ensures that the listing belongs to the provided seller.
 * @param {string} listingId - The ID of the listing to delete.
 * @param {string} sellerId - The ID of the seller attempting to delete the listing.
 * @returns {Promise<Object>} - Returns a success message if the listing is deleted.
 * @throws {Error} - Throws an error if the listing is not found or deletion fails.
 */
const deleteListingById = async (listingId, sellerId) => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: listingId, seller: sellerId });

    if (!listing) {
      console.warn(`Unauthorized deletion attempt or listing not found. Listing ID: ${listingId}, Seller ID: ${sellerId}`);
      throw new Error('Listing not found or unauthorized action.');
    }

    return { message: 'Listing deleted successfully' };
  } catch (error) {
    console.error(`Error deleting listing ID ${listingId} for seller ID ${sellerId}:`, error);
    throw new Error(error.message || 'Failed to delete listing. Please try again later.');
  }
};

module.exports = {
  getListingsBySeller,
  deleteListingById,
};
