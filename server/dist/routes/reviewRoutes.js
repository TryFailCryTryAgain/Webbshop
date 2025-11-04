"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ReviewController_1 = __importDefault(require("../controller/ReviewController"));
const { getReviews, getReviewById, createReview, updateReview, deleteReview, getReviewByProductId, getReviewByUserId } = ReviewController_1.default;
const ReviewRouter = express_1.default.Router();
// Defining Routes
// Get reviews by userid / productid
ReviewRouter.get("/", getReviews);
ReviewRouter.get("/:_id", getReviewById);
ReviewRouter.get("/product/:productId", getReviewByProductId);
ReviewRouter.get("/user/:userId", getReviewByUserId);
ReviewRouter.post("/", createReview);
ReviewRouter.put("/:_id", updateReview);
ReviewRouter.delete("/:_id", deleteReview);
exports.default = ReviewRouter;
