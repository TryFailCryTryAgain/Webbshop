import { Header } from "../components/header";
import { useState, useEffect } from "react";
import { productAPI } from "../api/api";
import type { Product } from "../api/api";
import { useLocation } from "react-router";
import TestProduct from "../components/test_products";


interface LocationState {
    categoryId: string;
}

const Specific_Category = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [_loading, setLoading] = useState<boolean>(true);
    const [_error, setError] = useState<string | null>(null);

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
                        </>
                    )}
                </div>
            </div>

        </>
    );
};

export default Specific_Category;