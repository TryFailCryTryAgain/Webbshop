import React, { useState, useEffect } from "react";
import { productAPI, reviewAPI } from "../api/api";
import type { Product, Review } from "../api/api";
import TestProduct from "./test_products";

export const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productReviews, setProductReviews] = useState<{[key: string]: Review[]}>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                
                // Fetch all products
                const productsData = await productAPI.getProducts();
                setProducts(productsData);

                // Fetch reviews for all products at once
                const reviewsMap: {[key: string]: Review[]} = {};
                
                // Use Promise.all to fetch reviews for all products concurrently
                const reviewPromises = productsData.map(async (product) => {
                    try {
                        const reviews = await reviewAPI.getReviewsByProductId(product._id);
                        reviewsMap[product._id] = reviews;
                    } catch (err) {
                        console.error(`Error fetching reviews for product ${product._id}:`, err);
                        reviewsMap[product._id] = [];
                    }
                });

                await Promise.all(reviewPromises);
                setProductReviews(reviewsMap);

            } catch (err) {
                setError('Failed to fetch products');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Calculate average rating for a product
    const calculateAverageRating = (reviews: Review[]): number | null => {
        if (!reviews || reviews.length === 0) return null;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
    };

    if (loading) {
        return (
            <div className="main-product-container">
                <div className="loading-message">Loading products...</div>
                <div className="product-container-layout">
                    {Array.from({ length: 12 }, (_, index) => (
                        <div key={index} className="product-card loading">
                            <div className="img skeleton"></div>
                            <div className="info">
                                <div className="title skeleton"></div>
                                <div className="category skeleton"></div>
                                <div className="rating skeleton"></div>
                                <div className="price skeleton"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-product-container">
                <div className="error-message">
                    {error}
                    <button onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="main-product-container">
                <div className="no-products-message">
                    No products found
                </div>
            </div>
        );
    }

    return (
        <div className="main-product-container">
            <div className="product-container-layout">
                {products.map((product) => {
                    const reviews = productReviews[product._id] || [];
                    const averageRating = calculateAverageRating(reviews);
                    const reviewCount = reviews.length;

                    return (
                        <TestProduct 
                            key={product._id} 
                            product={product}
                            averageRating={averageRating}
                            reviewCount={reviewCount}
                        />
                    );
                })}
            </div>
        </div>
    );
};