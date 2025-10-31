import type { Product, Review } from "../../api/api";
import { useEffect, useState } from "react";

interface TopProductsRatingProps {
    reviews: Review[];
    products: Product[];
}

interface ProductRating {
    productId: string;
    title: string;
    price: number;
    averageRating: number;
    totalReviews: number;
}

export const TopProductsRating: React.FC<TopProductsRatingProps> = ({
    reviews,
    products
}) => {
    const [topProducts, setTopProducts] = useState<ProductRating[]>([]);

    useEffect(() => {
        const filterTopFiveProductsByRating = () => {
            // Create a map to store product ratings data
            const productRatingsMap = new Map<string, { totalRating: number; reviewCount: number; product: Product }>();
            
            // Initialize the map with all products
            products.forEach(product => {
                productRatingsMap.set(product._id, {
                    totalRating: 0,
                    reviewCount: 0,
                    product: product
                });
            });
            
            // Aggregate ratings for each product
            reviews.forEach(review => {
                const productData = productRatingsMap.get(review.productId);
                if (productData) {
                    productData.totalRating += review.rating;
                    productData.reviewCount += 1;
                }
            });
            
            // Convert map to array and calculate average ratings
            const productsWithRatings: ProductRating[] = Array.from(productRatingsMap.entries())
                .map(([productId, data]) => ({
                    productId,
                    title: data.product.title,
                    price: data.product.price,
                    averageRating: data.reviewCount > 0 ? data.totalRating / data.reviewCount : 0,
                    totalReviews: data.reviewCount
                }))
                .filter(product => product.totalReviews > 0) // Only include products with reviews
                .sort((a, b) => b.averageRating - a.averageRating) // Sort by average rating descending
                .slice(0, 5); // Take top 5
            
            setTopProducts(productsWithRatings);
        };

        filterTopFiveProductsByRating();
    }, [reviews, products]);

    // Helper function to render stars based on rating
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <>
                {'★'.repeat(fullStars)}
                {hasHalfStar && '☆'}
                {'☆'.repeat(emptyStars)}
                {` (${rating.toFixed(1)})`}
            </>
        );
    };

    return (
        <div className="data-table-container">
            <h3 className="chart-title">Top 5 Products by Rating</h3>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Average Rating</th>
                        <th>Total Reviews</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {topProducts.map((product) => (
                        <tr key={product.productId}>
                            <td>{product.title}</td>
                            <td>{renderStars(product.averageRating)}</td>
                            <td>{product.totalReviews}</td>
                            <td>${product.price.toFixed(2)}</td>
                        </tr>
                    ))}
                    {topProducts.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                No products with reviews found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};