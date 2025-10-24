import { Request, Response } from "express";
import { Product } from "../model/ProductModel";
import { Review } from '../model/ReviewModel';
import { CategoryModel } from '../model/CategoryModel';

const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find()
            .populate('category', 'title slug'); // Populate category details
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products", error: err });
    }
}

const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params; // Changed to params for RESTful design
        if (!categoryId) {
            res.status(400).json({ categoryId: "categoryId params is required!" });
            return;
        }

        // Check if category exists
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            res.status(404).json({ message: "Category not found!" });
            return;
        }

        const products = await Product.find({ category: categoryId })
            .populate('category', 'title slug');
        
        if (!products || products.length === 0) {
            res.status(404).json({ message: "No products found in this category" });
            return;
        }

        res.status(200).json({
            category: {
                _id: category._id,
                title: category.title,
                slug: category.slug
            },
            products
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Failed to fetch products by category",
            error: err 
        });
    }
}

const getProductsByCategorySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        if (!slug) {
            res.status(400).json({ slug: "slug params is required!" });
            return;
        }

        // Find category by slug
        const category = await CategoryModel.findOne({ slug });
        if (!category) {
            res.status(404).json({ message: "Category not found!" });
            return;
        }

        const products = await Product.find({ category: category._id })
            .populate('category', 'title slug');
        
        if (!products || products.length === 0) {
            res.status(404).json({ message: "No products found in this category" });
            return;
        }

        res.status(200).json({
            category: {
                _id: category._id,
                title: category.title,
                slug: category.slug
            },
            products
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Failed to fetch products by category slug",
            error: err 
        });
    }
}

const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }
        const product = await Product.findOne({ _id })
            .populate('category', 'title slug description'); // Populate category details
        
        if (!product) {
            res.status(404).json({ message: "No product found with the given ID!" });
            return;
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ 
            message: "Failed to fetch the product",
            error: err 
        });
    }
}

const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, category, price, images } = req.body;
        
        // Validate required fields
        if (!title || !description || !category || !price) {
            res.status(400).json({
                message: "title, description, category, and price are required"
            });
            return;
        }

        // Check if category exists
        const categoryExists = await CategoryModel.findById(category);
        if (!categoryExists) {
            res.status(404).json({ message: "Category not found!" });
            return;
        }

        const created_at = new Date();
        const updated_at = new Date();

        const newProduct = new Product({
            title,
            description,
            category, // This should be a Category ObjectId
            price,
            images: images || [],
            created_at,
            updated_at
        });

        await newProduct.save();
        
        // Populate the category in response
        const populatedProduct = await Product.findById(newProduct._id)
            .populate('category', 'title slug');

        res.status(201).json({ 
            message: "New Product has been successfully created!", 
            product: populatedProduct 
        });

    } catch (err) {
        res.status(500).json({ 
            message: "Failed to create a new product",
            error: err 
        });
    }
}

const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }

        const product = await Product.findById(_id);
        if (!product) {
            res.status(404).json({ message: "No product found with the given ID!" });
            return;
        }

        const { title, description, price, images, category } = req.body;
        let updateData: any = {};
        let hasChanges = false;

        // Check and update title if provided and changed
        if (title && title !== product.title) {
            updateData.title = title;
            hasChanges = true;
        }

        // Check and update description if provided and changed
        if (description && description !== product.description) {
            updateData.description = description;
            hasChanges = true;
        }

        // Check and update price if provided and changed
        if (price && price !== product.price) {
            updateData.price = price;
            hasChanges = true;
        }

        // Check and update category if provided and changed
        if (category && category !== product.category.toString()) {
            // Verify the new category exists
            const categoryExists = await CategoryModel.findById(category);
            if (!categoryExists) {
                res.status(404).json({ message: "Category not found!" });
                return;
            }
            updateData.category = category;
            hasChanges = true;
        }

        // Check and update images if provided and changed
        if (images && Array.isArray(images)) {
            const currentImages = JSON.stringify(product.images);
            const newImages = JSON.stringify(images);
            if (currentImages !== newImages) {
                updateData.images = images;
                hasChanges = true;
            }
        }

        if (hasChanges) {
            updateData.updated_at = new Date();
            
            const updatedProduct = await Product.findByIdAndUpdate(
                _id, 
                updateData, 
                { new: true, runValidators: true }
            ).populate('category', 'title slug');

            res.status(200).json({ 
                message: "Product has been successfully updated!", 
                product: updatedProduct 
            });
        } else {
            const populatedProduct = await Product.findById(_id)
                .populate('category', 'title slug');
            res.status(200).json({ 
                message: "No changes detected", 
                product: populatedProduct 
            });
        }

    } catch (err) {
        res.status(500).json({ 
            message: "Failed to update product", 
            error: err 
        });
    }
}

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }

        const product = await Product.findById(_id);
        if (!product) {
            res.status(404).json({ message: "No product found with the given ID!" });
            return;
        }

        // Delete all reviews associated with this product
        await Review.deleteMany({ productId: _id });

        await Product.findByIdAndDelete(_id);
        res.status(200).json({ 
            message: "Product and associated reviews have been successfully deleted!" 
        });

    } catch (err) {
        res.status(500).json({ 
            message: "Failed to delete the product", 
            error: err 
        });
    }
}

// Export all functions
export default {
    getProducts,
    getProductById,
    getProductsByCategory,
    getProductsByCategorySlug,
    createProduct,
    updateProduct,
    deleteProduct
}