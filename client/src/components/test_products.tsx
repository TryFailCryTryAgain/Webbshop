import React from "react";
import type { Product } from "../api/api";
import { useNavigate } from "react-router";
import { RouterContainer } from "../routes/RouterContainer";
import { 
    addProductToStorage, 
    getProductQuantity,
    isProductInCart 
} from "./cart-functions/cart-functions";
import { useState, useEffect } from "react";

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
    const [isInCart, setIsInCart] = useState(false);
    const [currentQuantity, setCurrentQuantity] = useState(0);

    // Check if product is in cart and get current quantity
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
        // Custom event for cart updates within the same window
        window.addEventListener('cartUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cartUpdated', handleStorageChange);
        };
    }, [product._id]);

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

    const handleAddToCart = () => {
        addProductToStorage(product);
        setIsInCart(true);
        setCurrentQuantity(getProductQuantity(product._id));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Optional: Show a quick feedback
        const button = document.querySelector(`.add_to_cart[data-product-id="${product._id}"]`);
        if (button) {
            button.textContent = 'Added!';
            setTimeout(() => {
                button.textContent = `Add to Cart ${currentQuantity + 1 > 1 ? `(${currentQuantity + 1})` : ''}`;
            }, 1000);
        }
    };

    const getButtonText = () => {
        if (currentQuantity > 0) {
            return `Add to Cart (${currentQuantity})`;
        }
        return 'Add to Cart';
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
                <button 
                    className={`add_to_cart ${isInCart ? 'in-cart' : ''}`}
                    onClick={handleAddToCart}
                    data-product-id={product._id}
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
    );
};

export default TestProduct;