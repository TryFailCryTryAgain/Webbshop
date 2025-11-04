"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// productRoutes.ts
const express_1 = __importDefault(require("express"));
const ProductController_1 = __importDefault(require("../controller/ProductController"));
const { getProducts, getProductById, getProductsByCategory, getProductsByCategorySlug, createProduct, updateProduct, deleteProduct } = ProductController_1.default;
const ProductRouter = express_1.default.Router();
ProductRouter.get('/', getProducts);
ProductRouter.get('/:_id', getProductById);
ProductRouter.get('/category/:categoryId', getProductsByCategory);
ProductRouter.get('/category/slug/:slug', getProductsByCategorySlug);
ProductRouter.post('/', createProduct);
ProductRouter.put('/:_id', updateProduct);
ProductRouter.delete('/:_id', deleteProduct);
exports.default = ProductRouter;
