"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReviewModel_1 = require("../model/ReviewModel");
const getReviews = async (req, res) => {
    try {
        const reviews = await ReviewModel_1.Review.find();
        res.json(reviews);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching reviews", error: err });
    }
};
const getReviewById = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! " });
            return;
        }
        const review = await ReviewModel_1.Review.findOne({ _id });
        if (!review) {
            res.status(404).json({ message: "No Reviews found with the given ID! " });
        }
        res.json(review);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching the review " });
    }
};
const getReviewByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ userId: "UserId params is required! " });
            return;
        }
        const reviews = await ReviewModel_1.Review.find({ userId });
        if (reviews.length === 0) {
            res.status(404).json({ message: "No reviews found with the given ID! " });
            return;
        }
        res.json(reviews);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching reviews " });
    }
};
const getReviewByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            res.status(400).json({ productId: "Product ID params is requried! " });
        }
        const reviews = await ReviewModel_1.Review.find({ productId });
        if (!reviews) {
            res.status(404).json({ message: "No reviews found with the given ID! " });
        }
        res.json(reviews);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching reviews " });
    }
};
const createReview = async (req, res) => {
    try {
        const { rating, description, userId, productId } = req.body;
        const created_at = Date.now();
        const updated_at = Date.now();
        const newReview = new ReviewModel_1.Review({
            rating,
            description,
            userId,
            productId,
            created_at,
            updated_at
        });
        await newReview.save();
        res.status(201).json({ message: "New Review has been successfully created!", newReview });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create the review", error: err });
    }
};
const updateReview = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! " });
            return;
        }
        const review = await ReviewModel_1.Review.findById({ _id });
        if (!review) {
            res.status(400).json({ message: "No review found by the given ID! " });
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
        }
        else {
            review.updated_at = review.updated_at;
        }
        await review.save();
        // Add a way so it gets sent to the maintainers for auth checkup before it goes live
        res.status(200).json({ message: "Review has been successfully updated! " });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to updated the review ", error: err });
    }
};
const deleteReview = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! " });
            return;
        }
        const review = await ReviewModel_1.Review.findById({ _id });
        if (!review) {
            res.status(404).json({ message: "No Review found by the given ID! " });
            return;
        }
        await review.deleteOne();
        res.status(200).json({ message: "Review has been successfully deleted! " });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting the review! ", error: err });
    }
};
exports.default = {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getReviewByUserId,
    getReviewByProductId
};
