import { Header } from "../components/header";
import TestReview from "../components/test_reviews";
import { useLocation } from "react-router";
import type { Product } from "../api/api";
import { useEffect, useState } from "react";
import { reviewAPI, userAPI } from '../api/api';

interface Review {
    _id: string;
    rating: number;
    description: string;
    userId: string;
    productId: string;
    created_at: Date;
    updated_at: Date;
}

interface UserMap {
    [userId: string]: string; // userId -> username
}

interface LocationState {
    product: Product;
    productId: string;
}

export const ProductPage = () => {
    const location = useLocation();
    const state = location.state as LocationState;
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewAvr, setReviewAvr] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [starRating, setStarRating] = useState<string>('☆☆☆☆☆');
    const [userNames, setUserNames] = useState<UserMap>({});
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

    const { product, productId } = state;

    // Function to convert numeric rating to star display
    const getStarRating = (rating: number | null): string => {
        if (rating === null || rating === 0) return '☆☆☆☆☆';
        
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return '★'.repeat(fullStars) + '½'.repeat(halfStar) + '☆'.repeat(emptyStars);
    }

    // Fetch usernames for all reviews
    const fetchUserNames = async (reviews: Review[]) => {
        setLoadingUsers(true);
        try {
            const uniqueUserIds = [...new Set(reviews.map(review => review.userId))];
            const userMap: UserMap = {};

            // Fetch all usernames concurrently
            const userPromises = uniqueUserIds.map(async (userId) => {
                try {
                    const user = await userAPI.getUserById(userId);
                    userMap[userId] = `${user.first_name} ${user.last_name}`;
                } catch (err) {
                    console.error(`Failed to fetch user ${userId}:`, err);
                    userMap[userId] = 'Unknown User';
                }
            });

            await Promise.all(userPromises);
            setUserNames(userMap);
        } catch (err) {
            console.error('Error fetching usernames:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Calculate average rating and update star display
    const calculateAverageRating = (reviews: Review[]): number | null => {
        if (reviews.length === 0) return null;
        
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
    }

    useEffect(() => {
        const fetchReviewsByProductId = async () => {
            try {
                const data = await reviewAPI.getReviewsByProductId(product._id);
                setReviews(data);

                // Calculate average rating
                const average = calculateAverageRating(data);
                setReviewAvr(average);

                // Update star rating display
                setStarRating(getStarRating(average));

                // Fetch usernames for the reviews
                if (data.length > 0) {
                    await fetchUserNames(data);
                }

            } catch (err) {
                setError('Failed to fetch reviews for the product');
                console.error('Error fetching reviews', err);
            }
        };

        fetchReviewsByProductId();
    }, [product._id]);

    // Debug functions
    const logProduct = () => {
        console.log(product);
    }

    // const logReviews = () => {
    //     console.log(reviews);
    // }

    return (
        <>
            <Header />
            <div className="main-product-container2">
                <div className="specific-info">
                    <div 
                        className="category"
                        onClick={logProduct}
                    >
                        {product.category.title}
                    </div>
                    <div className="title">{product.title}</div>
                    <div className="rating">
                        <div className="star-rating">{starRating}</div>
                    </div>
                </div>
                
                <div className="img-container">
                    <div className="img">
                        <img src={product.images[0]} alt={product.title} />
                    </div>
                    <div className="price-info">
                        <div className="price">${product.price}</div>
                        <div className="action-buttons">
                            <button className="add-to-cart">Add to Cart</button>
                            <button 
                                className="wishlist"
                                // onClick={}
                            >
                                Leave a Review
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="product-info">
                    <h2 className="title">Product Information</h2>
                    <div className="info">{product.description}</div>
                </div>
                
                <div className="review-container">
                    <h2 className="review-title">Customer Reviews</h2>
                    {error && <div className="error-message">{error}</div>}

                    {/* Test reviews section with proper usernames */}
                    <div className="test-reviews">
                        {reviews.map((review) => (
                            <div key={review._id} className="review-card">
                                <div className="user-info">
                                    <div className="profile-img"></div>
                                    <div className="profile-info">
                                        <div className="rating">{getStarRating(review.rating)}</div>
                                        <div className="username">
                                            {loadingUsers ? 'Loading...' : userNames[review.userId] || 'Unknown User'}
                                        </div>
                                    </div>
                                </div>
                                <div className="description">
                                    {review.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};