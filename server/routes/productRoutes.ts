import express from "express";
import ProductController from "../controller/ProductController";

const ProductRouter = express.Router();

const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = ProductController;

ProductRouter.get('/', getProducts );
ProductRouter.get('/:_id', getProductById );
ProductRouter.post('/', createProduct);
ProductRouter.put('/:_id', updateProduct);
ProductRouter.delete('/:_id', deleteProduct);

export default ProductRouter;