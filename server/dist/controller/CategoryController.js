"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryModel_1 = require("../model/CategoryModel");
const ProductModel_1 = require("../model/ProductModel");
const getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel_1.CategoryModel.find();
        if (!categories || categories.length === 0) {
            res.status(404).json({ message: "No categories found!" });
            return;
        }
        res.json(categories);
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching categories",
            error: err
        });
    }
};
const getCategoryById = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }
        const category = await CategoryModel_1.CategoryModel.findOne({ _id });
        if (!category) {
            res.status(404).json({ message: "No category found with the given ID!" });
            return;
        }
        res.json(category);
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching the category",
            error: err
        });
    }
};
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            res.status(400).json({ slug: "slug params is required!" });
            return;
        }
        const category = await CategoryModel_1.CategoryModel.findOne({ slug });
        if (!category) {
            res.status(404).json({ message: "No category found with the given slug!" });
            return;
        }
        res.json(category);
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching the category",
            error: err
        });
    }
};
const createCategory = async (req, res) => {
    try {
        const { title, description, slug } = req.body;
        if (!title || !slug) {
            res.status(400).json({
                message: "title and slug are required"
            });
            return;
        }
        const categoryTitle = await CategoryModel_1.CategoryModel.findOne({ title });
        const categorySlug = await CategoryModel_1.CategoryModel.findOne({ slug });
        if (categoryTitle) {
            res.status(400).json({ message: "This title is already in use" });
            return;
        }
        if (categorySlug) {
            res.status(400).json({ message: "This slug term is already in use" });
            return;
        }
        const created_at = new Date();
        const updated_at = new Date();
        const newCategory = new CategoryModel_1.CategoryModel({
            title,
            description,
            slug,
            created_at,
            updated_at
        });
        await newCategory.save();
        res.status(201).json({
            message: "Category has been successfully created!",
            category: newCategory
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to create category!",
            error: err
        });
    }
};
const updateCategory = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }
        const category = await CategoryModel_1.CategoryModel.findById(_id);
        if (!category) {
            res.status(404).json({ message: "No category found with the given ID!" });
            return;
        }
        const { title, description, slug } = req.body;
        let updateData = {};
        let hasChanges = false;
        // Check and update title if provided and changed
        if (title && title !== category.title) {
            // Check if new title is already used by another category
            const existingTitle = await CategoryModel_1.CategoryModel.findOne({
                title,
                _id: { $ne: _id }
            });
            if (existingTitle) {
                res.status(400).json({ message: "This title is already in use by another category!" });
                return;
            }
            updateData.title = title;
            hasChanges = true;
        }
        // Check and update slug if provided and changed
        if (slug && slug !== category.slug) {
            // Check if new slug is already used by another category
            const existingSlug = await CategoryModel_1.CategoryModel.findOne({
                slug,
                _id: { $ne: _id }
            });
            if (existingSlug) {
                res.status(400).json({ message: "This slug is already in use by another category!" });
                return;
            }
            updateData.slug = slug;
            hasChanges = true;
        }
        // Check and update description if provided and changed
        if (description !== undefined && description !== category.description) {
            updateData.description = description;
            hasChanges = true;
        }
        if (hasChanges) {
            updateData.updated_at = new Date();
            const updatedCategory = await CategoryModel_1.CategoryModel.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
            res.status(200).json({
                message: "Category has been successfully updated!",
                category: updatedCategory
            });
        }
        else {
            res.status(200).json({
                message: "No changes detected",
                category
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to update category",
            error: err
        });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }
        const category = await CategoryModel_1.CategoryModel.findById(_id);
        if (!category) {
            res.status(404).json({ message: "No category found with the given ID!" });
            return;
        }
        const productsInCategory = await ProductModel_1.Product.find({ category: _id });
        if (productsInCategory.length > 0) {
            res.status(400).json({
                message: "Can't delete category with existing products. Please reassign products first"
            });
            return;
        }
        await CategoryModel_1.CategoryModel.findByIdAndDelete(_id);
        res.status(200).json({ message: "Category has been successfully deleted!" });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to delete category",
            error: err
        });
    }
};
// Export all functions
exports.default = {
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
};
