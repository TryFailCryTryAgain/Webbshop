// productRoutes.ts
import express from 'express';
import ProductController from '../controller/ProductController';

const { 
    getProducts,
    getProductById,
    getProductsByCategory,
    getProductsByCategorySlug,
    createProduct,
    updateProduct,
    deleteProduct 
} = ProductController;

const ProductRouter = express.Router();

ProductRouter.get('/', getProducts);
ProductRouter.get('/:_id', getProductById);
ProductRouter.get('/category/:categoryId', getProductsByCategory);
ProductRouter.get('/category/slug/:slug', getProductsByCategorySlug);
ProductRouter.post('/', createProduct);
ProductRouter.put('/:_id', updateProduct);
ProductRouter.delete('/:_id', deleteProduct);

export default ProductRouter;