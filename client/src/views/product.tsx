import { Header } from "../components/header";
import { useLocation } from "react-router";
import type { Product } from "../api/api";
import { useEffect, useState, type FormEvent } from "react";
import { reviewAPI, userAPI } from '../api/api';
import { 
    addProductToStorage, 
    getProductQuantity,
    isProductInCart 
} from "../components/cart-functions/cart-functions";

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

interface Profile {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    adress: string,
    ZIP: number,
    role: string
}

export const ProductPage = () => {
    const location = useLocation();
    const state = location.state as LocationState;
    const [reviews, setReviews] = useState<Review[]>([]);
    const [_reviewAvr, setReviewAvr] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [starRating, setStarRating] = useState<string>('☆☆☆☆☆');
    const [userNames, setUserNames] = useState<UserMap>({});
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    
    // Add to cart state
    const [isInCart, setIsInCart] = useState(false);
    const [currentQuantity, setCurrentQuantity] = useState(0);
    
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) as Profile : null;

    // For the creation of a review
    const [reviewFormData, setReviewFormData] = useState({
        rating: 0,
        description: ""
    });

    const { product } = state;

    // Check cart status for this product
    useEffect(() => {
        const checkCartStatus = () => {
            setIsInCart(isProductInCart(product._id));
            setCurrentQuantity(getProductQuantity(product._id));
        };

        checkCartStatus();

        // Listen for cart updates from other components
        const handleStorageChange = () => {
            checkCartStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('cartUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cartUpdated', handleStorageChange);
        };
    }, [product._id]);

    // Check if user is authenticated
    if (!userData) {
        return (
            <>
                <Header />
                <div className="main-product-container2">
                    <div className="error-message">Please log in to view this product page.</div>
                </div>
            </>
        );
    }

    // Add to cart functionality
    const handleAddToCart = () => {
        addProductToStorage(product);
        setIsInCart(true);
        setCurrentQuantity(getProductQuantity(product._id));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Show feedback
        const button = document.querySelector('.add-to-cart');
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Added to Cart!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1000);
        }
    };

    const getButtonText = () => {
        if (currentQuantity > 0) {
            return `Add to Cart (${currentQuantity})`;
        }
        return 'Add to Cart';
    };

    const renderStarRating = (currentRating: number, onChange: (rating: number) => void) => {
        return (
            <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= currentRating ? 'filled' : ''}`}
                        onClick={() => onChange(star)}
                        style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                    >
                        {star <= currentRating ? '★' : '☆'}
                    </span>
                ))}
            </div>
        );
    };

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

    const handleReviewFormChange = (field: string, value: string | number) => {
        setReviewFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    async function createNewReview(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (!userData?._id) {
            setError('User not found. Please log in again.');
            setSubmitting(false);
            return;
        }
        
        // Validation
        if (reviewFormData.rating === 0) {
            setError('Please select a rating');
            setSubmitting(false);
            return;
        }
        
        if (!reviewFormData.description.trim()) {
            setError('Please write a review description');
            setSubmitting(false);
            return;
        }

        const reviewData = {
            productId: product._id,
            rating: reviewFormData.rating,
            description: reviewFormData.description,
            userId: userData._id
        }

        try {
            const response = await reviewAPI.createReview(reviewData);
            
            // Clear the form
            setReviewFormData({
                rating: 0,
                description: ""
            });
            
            // Refresh the reviews list
            const updatedReviews = await reviewAPI.getReviewsByProductId(product._id);
            setReviews(updatedReviews);
            
            // Update average rating
            const average = calculateAverageRating(updatedReviews);
            setReviewAvr(average);
            setStarRating(getStarRating(average));
            
            // Refresh usernames
            if (updatedReviews.length > 0) {
                await fetchUserNames(updatedReviews);
            }
            
            console.log('Review created successfully:', response);
            setSuccessMessage('Review submitted successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
            
        } catch (err) {
            console.error("Failed to create new review", err);
            setError('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

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
                        {/* {reviewAvr !== null && (
                            <span className="average-rating">({reviewAvr.toFixed(1)} out of 5)</span>
                        )} */}
                    </div>
                </div>
                
                <div className="img-container">
                    <div className="img">
                        <img src={product.images[0]} alt={product.title} />
                    </div>
                    <div className="price-info">
                        <div className="price">${product.price}</div>
                        <div className="action-buttons">
                            <button 
                                className={`add-to-cart ${isInCart ? 'in-cart' : ''}`}
                                onClick={handleAddToCart}
                            >
                                {getButtonText()}
                            </button>
                            {isInCart && (
                                <div className="cart-indicator">
                                    <i className="fa-solid fa-check"></i>
                                    In Cart
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="product-info">
                    <h2 className="title">Product Information</h2>
                    <div className="info">{product.description}</div>
                </div>

                <div className="review-container">
                    <h2 className="review-title">Leave a Review</h2>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {error && <div className="error-message">{error}</div>}
                    
                    <form className="create-review-form" onSubmit={createNewReview}>
                        {/* Star rating input */}
                        <div className="form-group">
                            {renderStarRating(reviewFormData.rating, (rating) => handleReviewFormChange('rating', rating))}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input 
                                type="text"
                                onChange={(e) => handleReviewFormChange('description', e.target.value)}
                                value={reviewFormData.description}
                                placeholder="Share your thoughts about this product..."
                                disabled={submitting}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
                
                <div className="review-container">
                    <h2 className="review-title">Customer Reviews</h2>
                    {reviews.length === 0 ? (
                        <div className="no-reviews">No reviews yet. Be the first to review this product!</div>
                    ) : (
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
                                            <div className="review-date">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="description">
                                        {review.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};