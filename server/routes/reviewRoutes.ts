import express from 'express';
import ReviewController from '../controller/ReviewController';

const { getReviews, getReviewById, createReview, updateReview, deleteReview } = ReviewController;

const ReviewRouter = express.Router();

// Defining Routes
ReviewRouter.get("/", getReviews);
ReviewRouter.get("/:_id", getReviewById);
ReviewRouter.post("/", createReview);
ReviewRouter.put("/:_id", updateReview);
ReviewRouter.delete("/:_id", deleteReview);

export default ReviewRouter;