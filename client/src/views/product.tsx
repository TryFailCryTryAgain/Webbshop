import { Header } from "../components/header";

export const Product = () => {
    return (
        <>
            <Header />
            <div className="main-product-container2">
                <div className="specific-info">
                    <div className="category">Category</div>
                    <div className="title">Product Title</div>
                    <div className="rating">*****</div>
                </div>
                <div className="img-container">
                    <div className="img"></div>
                    <div className="price-info">
                        <div className="price">15 $</div>
                        <button className="add-to-cart">add</button>
                        <button className="wishlist">Whistlist</button>
                    </div>
                </div>
                <div className="product-info">
                    <h2 className="title">Product info</h2>
                    <div className="info">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi fugit placeat facilis neque at, dolores cumque sapiente quasi, hic laboriosam sint repudiandae. Velit modi magnam facilis id harum laborum quod.</div>
                </div>
            </div>
        </>
    );
};