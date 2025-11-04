import { useEffect, useState } from "react";
import { reviewAPI, productAPI, userAPI } from "../../api/api";

interface Review {
    _id: string;
    rating: number;
    description: string;
    userId: string;
    productId: string;
    created_at: Date;
    updated_at: Date;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    created_at: string;
    updated_at: string;
    rate: string[];
}

interface User {
    _id: string,
    email: string,
    password: string,
    adress: string;
    ZIP: number;
    city: string;
    first_name: string;
    last_name: string;
    role: string;
    tel: number;
    updated_at: Date;
    created_at: Date;
}

const AdminReviewsTab = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [productTitles, setProductTitles] = useState<{ [key: string]: string }>({});
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState({
        rating: 0,
        description: "",
        userId: "",
        productId: ""
    });
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

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

    // Fetch user name for a single user ID
    const fetchUserName = async (userId: string): Promise<string> => {
        try {
            const user = await userAPI.getUserById(userId);
            return `${user.first_name} ${user.last_name}`;
        } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
            return "Unknown User";
        }
    };

    // Fetch all product titles and user names for the reviews
    const fetchAllRelatedData = async (reviews: Review[]) => {
        if (reviews.length === 0) return;

        setLoading(true);
        const titles: { [key: string]: string } = {};
        const names: { [key: string]: string } = {};

        try {
            // Get unique product IDs and user IDs from all reviews
            const uniqueProductIds = Array.from(new Set(reviews.map(review => review.productId)));
            const uniqueUserIds = Array.from(new Set(reviews.map(review => review.userId)));

            // Fetch all product titles and user names concurrently
            const productPromises = uniqueProductIds.map(async (productId) => {
                const title = await fetchProductTitle(productId);
                return { productId, title };
            });

            const userPromises = uniqueUserIds.map(async (userId) => {
                const name = await fetchUserName(userId);
                return { userId, name };
            });

            const [productResults, userResults] = await Promise.all([
                Promise.all(productPromises),
                Promise.all(userPromises)
            ]);
            
            // Create the titles and names mappings
            productResults.forEach(({ productId, title }) => {
                titles[productId] = title;
            });

            userResults.forEach(({ userId, name }) => {
                names[userId] = name;
            });

            setProductTitles(titles);
            setUserNames(names);
        } catch (err) {
            console.error("Error fetching related data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const userData = await userAPI.getAllUsers();
            setAllUsers(userData);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    }

    const fetchAllProducts = async () => {
        try {
            const productData = await productAPI.getProducts();
            setAllProducts(productData);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    }

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                const reviewData = await reviewAPI.getReviews();
                setReviews(reviewData);
                
                // Fetch product titles and user names after reviews are loaded
                await fetchAllRelatedData(reviewData);
            } catch (err) {
                console.error("Error fetching reviews: ", err);
                setMessage("Failed to fetch reviews");
            }
        };

        fetchAllReviews();
        fetchAllUsers();
        fetchAllProducts();
    }, []);

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
            description: review.description,
            userId: review.userId,
            productId: review.productId
        });
        setMessage("");
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setEditFormData({ rating: 0, description: "", userId: "", productId: "" });
        setMessage("");
    };

    const handleEditFormChange = (field: string, value: string | number) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveEdit = async (reviewId: string) => {
        if (!editFormData.rating || !editFormData.description.trim() || !editFormData.userId || !editFormData.productId) {
            setMessage("Please provide rating, description, user, and product");
            return;
        }

        setActionLoading(reviewId);
        setMessage("");

        try {
            const updatedReview = await reviewAPI.updateReview(reviewId, {
                rating: editFormData.rating,
                description: editFormData.description.trim(),
                userId: editFormData.userId,
                productId: editFormData.productId
            });

            // Update the reviews list with the updated review
            setReviews(prev => prev.map(review => 
                review._id === reviewId ? {
                    ...updatedReview,
                    created_at: review.created_at, // Keep original created_at
                    updated_at: new Date() // Set current date for updated_at
                } : review
            ));

            // Update the product titles and user names cache
            if (editFormData.productId !== reviews.find(r => r._id === reviewId)?.productId) {
                const newProductTitle = await fetchProductTitle(editFormData.productId);
                setProductTitles(prev => ({
                    ...prev,
                    [editFormData.productId]: newProductTitle
                }));
            }

            if (editFormData.userId !== reviews.find(r => r._id === reviewId)?.userId) {
                const newUserName = await fetchUserName(editFormData.userId);
                setUserNames(prev => ({
                    ...prev,
                    [editFormData.userId]: newUserName
                }));
            }

            setMessage("Review updated successfully!");
            setEditingReviewId(null);
            setEditFormData({ rating: 0, description: "", userId: "", productId: "" });
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
            {loading && <div>Loading product and user information...</div>}
            
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
                            <th>User</th>
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
                                    {editingReviewId === review._id ? (
                                        <select
                                            value={editFormData.productId}
                                            onChange={(e) => handleEditFormChange('productId', e.target.value)}
                                            disabled={actionLoading === review._id}
                                            style={{ width: '100%', padding: '0.5rem' }}
                                        >
                                            <option value="">Select a product</option>
                                            {allProducts.map((product) => (
                                                <option key={product._id} value={product._id}>
                                                    {product.title}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        productTitles[review.productId] || "Loading..."
                                    )}
                                </td>
                                <td>
                                    {editingReviewId === review._id ? (
                                        <select
                                            value={editFormData.userId}
                                            onChange={(e) => handleEditFormChange('userId', e.target.value)}
                                            disabled={actionLoading === review._id}
                                            style={{ width: '100%', padding: '0.5rem' }}
                                        >
                                            <option value="">Select a user</option>
                                            {allUsers.map((user) => (
                                                <option key={user._id} value={user._id}>
                                                    {user.first_name} {user.last_name} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        userNames[review.userId] || "Loading..."
                                    )}
                                </td>
                                <td>{formatDate(review.created_at)}</td>
                                <td>{formatDate(review.updated_at)}</td>
                                <td className="action-buttons">
                                    {editingReviewId === review._id ? (
                                        <>
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleSaveEdit(review._id)}
                                                disabled={actionLoading === review._id}
                                            >
                                                {actionLoading === review._id ? "Saving..." : "Save"}
                                            </button>
                                            <button 
                                                className="btn-cancel"
                                                onClick={handleCancelEdit}
                                                disabled={actionLoading === review._id}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleEditClick(review)}
                                                disabled={actionLoading !== null}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-delete"
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
                                <td colSpan={7} style={{ textAlign: 'center' }}>
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

export default AdminReviewsTab;