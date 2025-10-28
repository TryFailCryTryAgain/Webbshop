import express from 'express';
import ReviewController from '../controller/ReviewController';

const { getReviews, getReviewById, createReview, updateReview, deleteReview, getReviewByProductId, getReviewByUserId } = ReviewController;

const ReviewRouter = express.Router();

// Defining Routes
// Get reviews by userid / productid
ReviewRouter.get("/", getReviews);
ReviewRouter.get("/:_id", getReviewById);
ReviewRouter.get("/product/:productId", getReviewByProductId);
ReviewRouter.get("/user/:userId", getReviewByUserId);
ReviewRouter.post("/", createReview);
ReviewRouter.put("/:_id", updateReview);
ReviewRouter.delete("/:_id", deleteReview);

export default ReviewRouter;