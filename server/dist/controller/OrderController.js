"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrderModel_1 = require("../model/OrderModel");
const ProductModel_1 = require("../model/ProductModel");
const UserModel_1 = require("../model/UserModel");
const getOrders = async (req, res) => {
    try {
        const orders = await OrderModel_1.Order.find()
            .populate('userId', 'first_name last_name email')
            .populate('productId', 'title price');
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err });
    }
};
const getOrderById = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! " });
            return;
        }
        const order = await OrderModel_1.Order.findOne({ _id })
            .populate('userId', 'first_name last_name email adress city ZIP')
            .populate('productId', 'title price images');
        if (!order) {
            res.status(404).json({ message: "No order found with the given ID!" });
            return;
        }
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching the order  " });
    }
};
const createOrder = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        // Validate required fields
        if (!userId || !productId || !Array.isArray(productId) || productId.length === 0) {
            res.status(400).json({
                message: "userId and productId (as non-empty array) are required!"
            });
            return;
        }
        // Check if user exists
        const user = await UserModel_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        // Get unique product IDs to check existence
        const uniqueProductIds = [...new Set(productId)];
        // Check if all unique products exist
        const uniqueProducts = await ProductModel_1.Product.find({ _id: { $in: uniqueProductIds } });
        if (uniqueProducts.length !== uniqueProductIds.length) {
            res.status(404).json({ message: "One or more products not found!" });
            return;
        }
        // Create a map of product prices for quick lookup
        const productPriceMap = new Map();
        uniqueProducts.forEach(product => {
            productPriceMap.set(product._id.toString(), product.price);
        });
        // Calculate total price considering quantities (duplicates)
        const totalPrice = productId.reduce((sum, id) => {
            const price = productPriceMap.get(id);
            return sum + (price || 0);
        }, 0);
        // Calculate delivery date (7 days from now)
        const delivery_date = new Date();
        delivery_date.setDate(delivery_date.getDate() + 7);
        const created_at = new Date();
        const updated_at = new Date();
        const newOrder = new OrderModel_1.Order({
            userId,
            productId, // This keeps the duplicates to maintain quantities
            price: totalPrice,
            delivery_date,
            created_at,
            updated_at
        });
        await newOrder.save();
        // Populate the response with product and user details
        const populatedOrder = await OrderModel_1.Order.findById(newOrder._id)
            .populate('userId', 'first_name last_name email')
            .populate('productId', 'title price');
        res.status(201).json({
            message: "Order has been successfully created!",
            order: populatedOrder
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error creating the order",
            error: err
        });
    }
};
const updateOrder = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }
        const order = await OrderModel_1.Order.findById(_id);
        if (!order) {
            res.status(404).json({ message: "No order found with the given ID!" });
            return;
        }
        const { userId, productId, delivery_date } = req.body;
        let updateData = {};
        let hasChanges = false;
        // Check and update userId if provided
        if (userId && userId !== order.userId.toString()) {
            const user = await UserModel_1.User.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found!" });
                return;
            }
            updateData.userId = userId;
            hasChanges = true;
        }
        // Check and update productId if provided
        if (productId && Array.isArray(productId)) {
            const products = await ProductModel_1.Product.find({ _id: { $in: productId } });
            if (products.length !== productId.length) {
                res.status(404).json({ message: "One or more products not found!" });
                return;
            }
            // Check if product list actually changed
            const currentProductIds = order.productId.map(id => id.toString());
            const newProductIds = productId.map(id => id.toString());
            const arraysEqual = currentProductIds.length === newProductIds.length &&
                currentProductIds.every((id, index) => id === newProductIds[index]);
            if (!arraysEqual) {
                updateData.productId = productId;
                // Recalculate price if products changed
                const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
                updateData.price = totalPrice;
                hasChanges = true;
            }
        }
        // Check and update delivery_date if provided
        if (delivery_date && new Date(delivery_date).getTime() !== order.delivery_date.getTime()) {
            updateData.delivery_date = new Date(delivery_date);
            hasChanges = true;
        }
        if (hasChanges) {
            updateData.updated_at = new Date();
            const updatedOrder = await OrderModel_1.Order.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true }).populate('userId', 'first_name last_name email')
                .populate('productId', 'title price');
            res.status(200).json({
                message: "Order has been successfully updated!",
                order: updatedOrder
            });
        }
        else {
            res.status(200).json({
                message: "No changes detected",
                order
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to update order",
            error: err
        });
    }
};
const deleteOrder = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }
        const order = await OrderModel_1.Order.findById(_id);
        if (!order) {
            res.status(404).json({ message: "No order found with the given ID!" });
            return;
        }
        await OrderModel_1.Order.findByIdAndDelete(_id);
        res.status(200).json({ message: "Order has been successfully deleted!" });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to delete order",
            error: err
        });
    }
};
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ userId: "userId params is required!" });
            return;
        }
        const user = await UserModel_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        const orders = await OrderModel_1.Order.find({ userId })
            .populate('productId', 'title price images')
            .sort({ created_at: -1 });
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching user orders",
            error: err
        });
    }
};
// Export all functions
exports.default = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getUserOrders
};
