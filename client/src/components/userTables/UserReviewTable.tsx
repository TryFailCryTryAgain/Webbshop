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

    // Format date for display
    const formatDate = (date: Date | string): string => {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toLocaleDateString();
    };

    return (
        <>
            {loading && <div>Loading product information...</div>}
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
                                    <div className="rating-stars">
                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                    </div>
                                    <span className="rating-number">({review.rating}/5)</span>
                                </td>
                                <td>{review.description}</td>
                                <td>
                                    {productTitles[review.productId] || "Loading..."}
                                </td>
                                <td>{formatDate(review.created_at)}</td>
                                <td>{formatDate(review.updated_at)}</td>
                                <td>
                                    <button className="edit-btn">Edit</button>
                                    <button className="delete-btn">Delete</button>
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