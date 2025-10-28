import { Request, Response } from "express";
import { Review } from "../model/ReviewModel";

const getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reviews", error: err });
    }
}

const getReviewById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! "});
            return;
        }
        const review = await Review.findOne({ _id });
        if (!review) {
            res.status(404).json({ message: "No Reviews found with the given ID! "});
        }
        res.json(review);
    } catch (err) {
        res.status(500).json({ message: "Error fetching the review "});
    }
}

const getReviewByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ userId: "UserId params is required! "});
            return;
        }
        const reviews = await Review.find({ userId });
        if (reviews.length === 0) {
            res.status(404).json({ message: "No reviews found with the given ID! "});
            return;
        }
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reviews "});
    }
}

const getReviewByProductId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        if (!productId) {
            res.status(400).json({ productId: "Product ID params is requried! "});
        }
        const reviews = await Review.find({ productId });
        if (!reviews) {
            res.status(404).json({ message: "No reviews found with the given ID! "});
        }
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reviews "});
    }
}

const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rating, description, userId, productId } = req.body
        const created_at = Date.now();
        const updated_at = Date.now();

        const newReview = new Review({
            rating,
            description,
            userId,
            productId,
            created_at,
            updated_at
        });

        await newReview.save();
        res.status(201).json({ message: "New Review has been successfully created!", newReview});
    } catch (err) {
        res.status(500).json({ message: "Failed to create the review", error: err});
    }
}

const updateReview = async (req: Request, res: Response): Promise<void> => {
    try {

        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! "});
            return;
        }
        const review = await Review.findById({ _id });
        if (!review) {
            res.status(400).json({ message: "No review found by the given ID! "});
            return;
        }

        const { productId, userId, rating, description } = req.body;

        const oldProductId = review.productId;
        const oldUserId = review.userId;
        const oldRating = review.rating;
        const oldDescription = review.description;

        if (oldProductId != productId || oldUserId != userId || oldRating != rating || oldDescription != description) {
            
            review.productId = productId;
            review.userId = userId;
            review.rating = rating;
            review.description = description;            
            
            const updated_at = new Date();
            updated_at.setDate(updated_at.getDate());
            review.updated_at = updated_at;
        } else {
            review.updated_at = review.updated_at;
        }

        await review.save();

        // Add a way so it gets sent to the maintainers for auth checkup before it goes live
        res.status(200).json({ message: "Review has been successfully updated! "});

    } catch (err) {
        res.status(500).json({ message: "Failed to updated the review ", error: err});
    }
}

const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! "});
            return;
        }
        const review = await Review.findById({ _id });
        if (!review) {
            res.status(404).json({ message: "No Review found by the given ID! "});
            return;
        }
        await review.deleteOne();
        res.status(200).json({ message: "Review has been successfully deleted! "});
    } catch (err) {
        res.status(500).json({ message: "Error deleting the review! ", error: err });
    }
}

export default {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getReviewByUserId,
    getReviewByProductId
}