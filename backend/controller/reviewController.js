import Review from "../model/reviewModel.js";

// Add a review
export const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;
        const userName = req.user.name;

        console.log("Review data:", { productId, rating, comment, userId, userName });

        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        const newReview = new Review({
            productId,
            userId,
            userName,
            rating,
            comment
        });

        await newReview.save();

        res.status(201).json({ 
            success: true, 
            message: "Review added successfully",
            review: newReview 
        });

    } catch (error) {
        console.log("Add review error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name');

        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            reviews,
            averageRating,
            totalReviews: reviews.length
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update review (optional - if user wants to edit)
export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        const review = await Review.findOne({ _id: reviewId, userId });

        if (!review) {
            return res.status(404).json({ message: "Review not found or unauthorized" });
        }

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete review
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });

        if (!review) {
            return res.status(404).json({ message: "Review not found or unauthorized" });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Mark review as helpful
export const markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.helpful += 1;
        await review.save();

        res.status(200).json({
            success: true,
            message: "Marked as helpful",
            helpful: review.helpful
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};
