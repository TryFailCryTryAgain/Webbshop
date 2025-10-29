import React from "react";
import type { Product } from "../api/api";
import { useNavigate } from "react-router";
import { RouterContainer } from "../routes/RouterContainer";

interface TestProductProps {
    product: Product;
    averageRating?: number | null;
    reviewCount?: number;
}

const TestProduct: React.FC<TestProductProps> = ({ 
    product, 
    averageRating = null, 
    reviewCount = 0 
}) => {
    const navigate = useNavigate();

    // Convert rating to stars
    const renderStars = (rating: number | null): string => {
        if (rating === null || rating === 0) return '☆☆☆☆☆';
        
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        return '★'.repeat(fullStars) + '½'.repeat(halfStar) + '☆'.repeat(emptyStars);
    };

    const starRating = renderStars(averageRating);
    const ratingText = averageRating 
        ? `${averageRating.toFixed(1)} from ${reviewCount} review${reviewCount !== 1 ? 's' : ''}`
        : 'No ratings yet';

    const NavigateToProductPage = () => {
        const productId = product._id;
        const ShortenId = productId.slice(0, 6);

        navigate(RouterContainer.Product.replace(':id', ShortenId), {
            state: {
                product: product,
                productId: product._id
            }
        });
    };

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
                    onClick={NavigateToProductPage}
                >
                    {product.title || 'No Title'}
                </div>
                <div className="category">
                    {product.category ? product.category.title : 'Uncategorized'}
                </div>
                <div className="rating" title={ratingText}>
                    {starRating} 
                    {/* <span className="rating-text"> ({reviewCount})</span> */}
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