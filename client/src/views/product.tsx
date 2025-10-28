import { Header } from "../components/header";
import TestReview from "../components/test_reviews";
import { useLocation } from "react-router";
import type { Product } from "../api/api";

const renderMultipleReviews = (count: number) => {
    return Array.from({ length: count }, (_, index) => (
        <TestReview key={index} />
    ));
}

interface LocationState {
    product: Product;
    productId: string;
}

export const ProductPage = () => {
    const location = useLocation();
    const state = location.state as LocationState;

    const { product, productId } = state;

    function status() {
        console.log(product);
    }

    return (
        <>
            <Header />
            <div className="main-product-container2">
                <div className="specific-info">
                    <div 
                        className="category"
                        onClick={() => status()}
                    >
                        {product.category.title}
                    </div>
                    <div className="title">{product.title}</div>
                    <div className="rating">*****</div>
                </div>
                <div className="img-container">
                    <div className="img">
                        <img src={product.images[0]}></img>
                    </div>
                    <div className="price-info">
                        <div className="price">{product.price}$</div>
                        <div className="action-buttons">
                            <button className="add-to-cart">add</button>
                            <button className="wishlist">Whistlist</button>
                        </div>
                    </div>
                </div>
                <div className="product-info">
                    <h2 className="title">Product info</h2>
                    <div className="info">{product.description}</div>
                </div>
                <div className="review-container">
                    <h2 className="review-title">Reviews</h2>
                    {renderMultipleReviews(5)}
                </div>
            </div>
            
        </>
    );
};