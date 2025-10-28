import { Header } from "../components/header";
import React, { useState, useEffect } from "react";
import { productAPI } from "../api/api";
import type { Product } from "../api/api";
import { useLocation } from "react-router";
import TestProduct from "../components/test_products";


interface LocationState {
    categoryId: string;
}

const Specific_Category = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const state = location.state as LocationState;

    const { categoryId } = state;

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                setLoading(true);
                const data = await productAPI.getProductByCategory(categoryId);
                setProducts(data);
            } catch(err) {
                setError('Failed to fetch products');
                console.error('Error fetching products', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByCategory();

    }, [categoryId])


    function Testing() {
        console.log(products);
    }



    return (
        <>
            <Header />
            <div className="main-product-container">
                <div className="product-container-layout">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <TestProduct key={product._id} product={product}/>
                        ))
                    ) : (
                        <>
                            <p>No products found in this category.</p>
                            <button onClick={() => Testing()}></button>
                        </>
                    )}
                </div>
            </div>

        </>
    );
};

export default Specific_Category;