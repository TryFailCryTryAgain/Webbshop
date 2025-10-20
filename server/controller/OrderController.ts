import { Request, Response } from "express";
import { Order } from "../model/OrderModel";
import { Product } from "../model/ProductModel";
import { User } from "../model/UserModel";

const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find()
            .populate('userId', 'first_name last_name email')
            .populate('productId', 'title price');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err });
    }
}

const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required! "});
            return;
        }
        const order = await Order.findOne({ _id })
            .populate('userId', 'first_name last_name email adress city ZIP')
            .populate('productId', 'title price images');
        if (!order) {
            res.status(404).json({ message: "No order found with the given ID!"});
            return;
        }

        res.json(order);

    } catch (err) {
        res.status(500).json({ message: "Error fetching the order  "});
    }
}

const createOrder = async (req: Request, res: Response): Promise<void> => {
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
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return;
        }

        // Check if all products exist and fetch their prices
        const products = await Product.find({ _id: { $in: productId } });
        if (products.length !== productId.length) {
            res.status(404).json({ message: "One or more products not found!" });
            return;
        }

        // Calculate total price
        const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

        // Calculate delivery date (7 days from now)
        const delivery_date = new Date();
        delivery_date.setDate(delivery_date.getDate() + 7);

        const created_at = new Date();
        const updated_at = new Date();

        const newOrder = new Order({
            userId,
            productId,
            price: totalPrice,
            delivery_date,
            created_at,
            updated_at
        });

        await newOrder.save();
        
        // Populate the response with product and user details
        const populatedOrder = await Order.findById(newOrder._id)
            .populate('userId', 'first_name last_name email')
            .populate('productId', 'title price');

        res.status(201).json({ 
            message: "Order has been successfully created!", 
            order: populatedOrder 
        });

    } catch (err) {
        res.status(500).json({ 
            message: "Error creating the order",
            error: err 
        });
    }
}

const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }

        const order = await Order.findById(_id);
        if (!order) {
            res.status(404).json({ message: "No order found with the given ID!" });
            return;
        }

        const { userId, productId, delivery_date } = req.body;
        let updateData: any = {};
        let hasChanges = false;

        // Check and update userId if provided
        if (userId && userId !== order.userId.toString()) {
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found!" });
                return;
            }
            updateData.userId = userId;
            hasChanges = true;
        }

        // Check and update productId if provided
        if (productId && Array.isArray(productId)) {
            const products = await Product.find({ _id: { $in: productId } });
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
            
            const updatedOrder = await Order.findByIdAndUpdate(
                _id, 
                updateData, 
                { new: true, runValidators: true }
            ).populate('userId', 'first_name last_name email')
             .populate('productId', 'title price');

            res.status(200).json({ 
                message: "Order has been successfully updated!", 
                order: updatedOrder 
            });
        } else {
            res.status(200).json({ 
                message: "No changes detected", 
                order 
            });
        }

    } catch (err) {
        res.status(500).json({ 
            message: "Failed to update order",
            error: err 
        });
    }
}

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required!" });
            return;
        }

        const order = await Order.findById(_id);
        if (!order) {
            res.status(404).json({ message: "No order found with the given ID!" });
            return;
        }

        await Order.findByIdAndDelete(_id);
        res.status(200).json({ message: "Order has been successfully deleted!" });

    } catch (err) {
        res.status(500).json({ 
            message: "Failed to delete order",
            error: err 
        });
    }
}

const getUserOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ userId: "userId params is required!" });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return;
        }

        const orders = await Order.find({ userId })
            .populate('productId', 'title price images')
            .sort({ created_at: -1 });

        res.status(200).json(orders);

    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching user orders",
            error: err 
        });
    }
}

// Export all functions
export default {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getUserOrders
}