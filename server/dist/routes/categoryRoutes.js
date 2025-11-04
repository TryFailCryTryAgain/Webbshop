"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CategoryController_1 = __importDefault(require("../controller/CategoryController"));
const { getCategories, getCategoryById, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = CategoryController_1.default;
const CategoryRouter = express_1.default.Router();
CategoryRouter.get('/', getCategories);
CategoryRouter.get('/id/:_id', getCategoryById);
CategoryRouter.get('/slug/:slug', getCategoryBySlug);
CategoryRouter.post('/', createCategory);
CategoryRouter.put('/:_id', updateCategory);
CategoryRouter.delete('/:_id', deleteCategory);
exports.default = CategoryRouter;
