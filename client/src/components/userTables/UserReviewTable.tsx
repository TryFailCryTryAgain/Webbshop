import { useEffect, useState } from "react";
import { reviewAPI, productAPI } from "../../api/api";

interface Review {
    _id: string;
    rating: number;
    description: string;
    userId: string;
    productId: string;
    created_at: Date;
    updated_at: Date;
}

interface Product {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    images: string[];
    created_at: string;
    updated_at: string;
    rate: string[];
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

const useUser = (): Profile | null => {
    const [user, setUser] = useState<Profile | null>(null);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString) {
            try {
                setUser(JSON.parse(userString) as Profile);
            } catch (err) {
                console.error("Error parsing user data", err);
            }
        }
    }, []);

    return user;
}

const UserReviewTable = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [productTitles, setProductTitles] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState({
        rating: 0,
        description: ""
    });
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const user = useUser();

    // Fetch product title for a single product ID
    const fetchProductTitle = async (productId: string): Promise<string> => {
        try {
            const product = await productAPI.getProductById(productId);
            return product.title;
        } catch (err) {
            console.error(`Error fetching product ${productId}:`, err);
            return "Unknown Product";
        }
    };

    // Fetch all product titles for the reviews
    const fetchAllProductTitles = async (reviews: Review[]) => {
        if (reviews.length === 0) return;

        setLoading(true);
        const titles: { [key: string]: string } = {};

        try {
            // Get unique product IDs from all reviews
            const uniqueProductIds = Array.from(new Set(reviews.map(review => review.productId)));

            // Fetch all product titles concurrently
            const productPromises = uniqueProductIds.map(async (productId) => {
                const title = await fetchProductTitle(productId);
                return { productId, title };
            });

            const results = await Promise.all(productPromises);
            
            // Create the titles mapping
            results.forEach(({ productId, title }) => {
                titles[productId] = title;
            });

            setProductTitles(titles);
        } catch (err) {
            console.error("Error fetching product titles:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchReviewsAndProducts = async () => {
            if (!user) return;

            try {
                const reviewData = await reviewAPI.getReviewsByUserId(user._id);
                setReviews(reviewData);
                
                // Fetch product titles after reviews are loaded
                await fetchAllProductTitles(reviewData);
            } catch (err) {
                console.error("Error fetching reviews: ", err);
            }
        };

        fetchReviewsAndProducts();
    }, [user]);

    // Format date for display with proper error handling
    const formatDate = (date: Date | string | undefined | null): string => {
        if (!date) {
            return "N/A";
        }
        
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
                return "Invalid Date";
            }
            
            return dateObj.toLocaleDateString();
        } catch (error) {
            console.error("Error formatting date:", error, date);
            return "Date Error";
        }
    };

    // Edit review functions
    const handleEditClick = (review: Review) => {
        setEditingReviewId(review._id);
        setEditFormData({
            rating: review.rating,
            description: review.description
        });
        setMessage("");
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setEditFormData({ rating: 0, description: "" });
        setMessage("");
    };

    const handleEditFormChange = (field: string, value: string | number) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveEdit = async (reviewId: string) => {
        if (!editFormData.rating || !editFormData.description.trim()) {
            setMessage("Please provide both rating and description");
            return;
        }

        setActionLoading(reviewId);
        setMessage("");

        try {
            const updatedReview = await reviewAPI.updateReview(reviewId, {
                rating: editFormData.rating,
                description: editFormData.description.trim(),
                userId: user!._id,
                productId: reviews.find(r => r._id === reviewId)?.productId || ""
            });

            // Update the reviews list with the updated review
            setReviews(prev => prev.map(review => 
                review._id === reviewId ? {
                    ...updatedReview,
                    // Ensure dates are properly set
                    created_at: review.created_at, // Keep original created_at
                    updated_at: new Date() // Set current date for updated_at
                } : review
            ));

            setMessage("Review updated successfully!");
            setEditingReviewId(null);
            setEditFormData({ rating: 0, description: "" });
            window.location.reload();
        } catch (error: any) {
            console.error("Failed to update review:", error);
            setMessage(error.response?.data?.message || "Failed to update review");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
            return;
        }

        setActionLoading(reviewId);
        setMessage("");

        try {
            const result = await reviewAPI.deleteReview(reviewId);
            
            // Remove the deleted review from the list
            setReviews(prev => prev.filter(review => review._id !== reviewId));
            
            setMessage(result.message);
        } catch (error: any) {
            console.error("Failed to delete review:", error);
            setMessage(error.response?.data?.message || "Failed to delete review");
        } finally {
            setActionLoading(null);
        }
    };

    // Render star rating input
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

    return (
        <>
            {loading && <div>Loading product information...</div>}
            
            {message && (
                <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Rating</th>
                            <th>Description</th>
                            <th>Product</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review._id}>
                                <td>
                                    {editingReviewId === review._id ? (
                                        renderStarRating(editFormData.rating, 
                                            (rating) => handleEditFormChange('rating', rating))
                                    ) : (
                                        <>
                                            <div className="rating-stars">
                                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                            </div>
                                            <span className="rating-number">({review.rating}/5)</span>
                                        </>
                                    )}
                                </td>
                                <td>
                                    {editingReviewId === review._id ? (
                                        <textarea
                                            value={editFormData.description}
                                            onChange={(e) => handleEditFormChange('description', e.target.value)}
                                            rows={3}
                                            style={{ width: '100%', padding: '0.5rem' }}
                                            disabled={actionLoading === review._id}
                                        />
                                    ) : (
                                        review.description
                                    )}
                                </td>
                                <td>
                                    {productTitles[review.productId] || "Loading..."}
                                </td>
                                <td>{formatDate(review.created_at)}</td>
                                <td>{formatDate(review.updated_at)}</td>
                                <td className="action-buttons">
                                    {editingReviewId === review._id ? (
                                        <>
                                            <button 
                                                className="btn-success"
                                                onClick={() => handleSaveEdit(review._id)}
                                                disabled={actionLoading === review._id}
                                            >
                                                {actionLoading === review._id ? "Saving..." : "Save"}
                                            </button>
                                            <button 
                                                className="btn-warning"
                                                onClick={handleCancelEdit}
                                                disabled={actionLoading === review._id}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                className="btn-secondary"
                                                onClick={() => handleEditClick(review)}
                                                disabled={actionLoading !== null}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-danger"
                                                onClick={() => handleDeleteReview(review._id)}
                                                disabled={actionLoading !== null}
                                            >
                                                {actionLoading === review._id ? "Deleting..." : "Delete"}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {reviews.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    No reviews found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserReviewTable;