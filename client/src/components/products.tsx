import React, { useState, useEffect } from "react";
import { productAPI } from "../api/api";
import type { Product } from "../api/api";
import TestProduct from "./test_products";

export const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productAPI.getProducts();
                console.log('Products state:', data); // Debug log
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Debug render to see what's in state
    console.log('Current products state:', products);

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
                {products.map((product) => (
                    <TestProduct key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};