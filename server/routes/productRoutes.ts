// productRoutes.ts
import express from 'express';
import ProductController from '../controller/ProductController';

const ProductRouter = express.Router();

ProductRouter.get('/', ProductController.getProducts);
ProductRouter.get('/:_id', ProductController.getProductById);
ProductRouter.get('/category/:categoryId', ProductController.getProductsByCategory);
ProductRouter.get('/category/slug/:slug', ProductController.getProductsByCategorySlug);
ProductRouter.post('/', ProductController.createProduct);
ProductRouter.put('/:_id', ProductController.updateProduct);
ProductRouter.delete('/:_id', ProductController.deleteProduct);

export default ProductRouter;