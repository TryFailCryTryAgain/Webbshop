import mongoose, { Schema, Document } from 'mongoose';

export interface Order extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
    price: Number;
    delivery_date: Date;
}

const OrderSchema: Schema = new Schema<Order>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    productId: [{ type: Schema.Types.ObjectId, ref: 'Products', required: true }],
    created_at: { type: Date },
    updated_at: { type: Date },
    price: { type: Number },
    delivery_date: { type: Date }
});

export const Order = mongoose.model<Order>('Order', OrderSchema, 'Order');