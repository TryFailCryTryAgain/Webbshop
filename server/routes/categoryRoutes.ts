import express from 'express';
import CategoryController from '../controller/CategoryController';

const { 
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory 
} = CategoryController;

const CategoryRouter = express.Router();

CategoryRouter.get('/', getCategories);
CategoryRouter.get('/id/:_id', getCategoryById);
CategoryRouter.get('/slug/:slug', getCategoryBySlug);
CategoryRouter.post('/', createCategory);
CategoryRouter.put('/:_id', updateCategory);
CategoryRouter.delete('/:_id', deleteCategory);

export default CategoryRouter;