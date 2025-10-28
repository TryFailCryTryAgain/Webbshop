import React from "react";
import type { Product } from "../api/api";
import { useNavigate } from "react-router";
import { RouterContainer } from "../routes/RouterContainer";

interface TestProductProps {
    product: Product;
}

const TestProduct: React.FC<TestProductProps> = ({ product }) => {

    const navigate = useNavigate();

    // Calculate average rating - handle empty array
    const calculateAverageRating = (ratings: string[]): number => {
        if (!ratings || ratings.length === 0) return 0;
        
        const numericRatings = ratings.map(rating => {
            const num = parseFloat(rating);
            return isNaN(num) ? 0 : num;
        });
        
        const sum = numericRatings.reduce((acc, rating) => acc + rating, 0);
        return sum / numericRatings.length;
    };

    // Convert rating to stars
    const renderStars = (rating: number): string => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        return '★'.repeat(fullStars) + '½'.repeat(halfStar) + '☆'.repeat(emptyStars);
    };

    const averageRating = calculateAverageRating(product.rate);
    const starRating = averageRating > 0 ? renderStars(averageRating) : 'No ratings yet';


    function NavigateToProductPage() {

        const productId = product._id;
        const ShortenId = productId.slice(0, 6)

        navigate(RouterContainer.Product.replace(':id', ShortenId), {
            state: {
                product: product,
                productId: product._id
            }
        });
   
    }

    return (
        <div className="product-card">
            <div className="img">
                {product.images && product.images.length > 0 ? (
                    <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="product-image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                    />
                ) : (
                    <div className="no-image">No Image Available</div>
                )}
            </div>
            <div className="info">
                <div 
                    className="title"
                    style={{cursor: "pointer"}}
                    onClick={() => NavigateToProductPage()}
                >
                    {product.title || 'No Title'}
                </div>
                <div className="category">
                    {product.category ? product.category.title : 'Uncategorized'}
                </div>
                <div className="rating" title={averageRating > 0 ? `${averageRating.toFixed(1)} out of 5` : 'No ratings'}>
                    {starRating} 
                    {product.rate && product.rate.length > 0 && ` (${product.rate.length})`}
                </div>
                <div className="price">${product.price ? product.price.toFixed(2) : '0.00'}</div>
                <div className="description">
                    {product.description ? 
                        (product.description.length > 100 
                            ? `${product.description.substring(0, 100)}...` 
                            : product.description
                        ) 
                        : 'No description available'
                    }
                </div>
            </div>
            <div className="action">
                <button className="add_to_cart">Add to Cart</button>
            </div>
        </div>
    );
};

export default TestProduct;