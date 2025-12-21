import express from 'express';
import { 
    addReview, 
    getProductReviews, 
    updateReview, 
    deleteReview,
    markHelpful 
} from '../controller/reviewController.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

// Add a review (requires authentication)
router.post('/add', isAuth, addReview);

// Get all reviews for a product (public)
router.get('/product/:productId', getProductReviews);

// Update a review (requires authentication)
router.put('/update/:reviewId', isAuth, updateReview);

// Delete a review (requires authentication)
router.delete('/delete/:reviewId', isAuth, deleteReview);

// Mark review as helpful (public)
router.post('/helpful/:reviewId', markHelpful);

export default router;
