import { Request, Response } from "express";
import { Product } from "../model/ProductModel";
import { Review } from '../model/ReviewModel';

const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products ", error: err });
    }
}

const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! "});
            return;
        }
        const product = await Product.findOne({ _id });
        if (!product) {
            res.status(404).json({ message: "No product found with the given ID!"});
            return;
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch the product "});
    }
}

const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, price, images } = req.body
        const created_at = new Date(); // Fixed: Use Date object instead of timestamp
        const updated_at = new Date(); // Fixed: Use Date object instead of timestamp

        const newProduct = new Product({
            title,
            description,
            price,
            images,
            created_at,
            updated_at
        });

        await newProduct.save();
        res.status(201).json({ message: "New Product has been successfully created!", newProduct});

    } catch (err) {
        res.status(500).json({ message: "Failed to create a new product "});
    }
}

const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! "});
            return;
        }

        const product = await Product.findById(_id); // Fixed: Remove curly braces
        if (!product) {
            res.status(400).json({ message: "No product found by the given ID! "});
            return;
        }

        const { title, description, price, images } = req.body;

        const oldTitle = product.title;
        const oldDescription = product.description;
        const oldPrice = product.price;
        const oldImages = product.images;
        
        // Calculate average rating from reviews
        let averageRating = 0;
        const reviews = await Review.find({ productId: _id }); // Fixed: Find reviews by productId
        if (reviews && reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = totalRating / reviews.length;
        }

        // Check if any field has changed
        const hasChanges = oldTitle !== title || 
                          oldDescription !== description || 
                          oldPrice !== price || 
                          JSON.stringify(oldImages) !== JSON.stringify(images);

        if (hasChanges) {
            // Update the product fields
            product.title = title || oldTitle;
            product.description = description || oldDescription;
            product.price = price || oldPrice;
            product.images = images || oldImages;
            product.updated_at = new Date();
            
            await product.save();
            res.status(200).json({ 
                message: "Product has been successfully updated!", 
                product 
            });
        } else {
            res.status(200).json({ 
                message: "No changes detected", 
                product 
            });
        }

    } catch (err) {
        res.status(500).json({ message: "Failed to update product ", error: err });
    }
}

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! "});
            return;
        }

        const product = await Product.findById(_id);
        if (!product) {
            res.status(404).json({ message: "No product found with the given ID!" });
            return;
        }

        // Optional: Delete all reviews associated with this product
        await Review.deleteMany({ productId: _id });

        await product.deleteOne();
        res.status(200).json({ message: "Product and associated reviews have been successfully deleted!" });

    } catch (err) {
        res.status(500).json({ message: "Failed to delete the product", error: err });
    }
}

// Export all functions
export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}