import TestProduct from "./test_products";

const renderMultipleProducts = (count: number) => {
    return Array.from({ length: count }, (_, index) => (
        <TestProduct key={index} />
    ));
}
export const Products = () => {
    return (
        <>
            <div className="main-product-container">
                <div className="product-container-layout">
                    {renderMultipleProducts(12)}
                </div>
            </div>        
        </>
    );
};