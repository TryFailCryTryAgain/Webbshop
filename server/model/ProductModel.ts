import mongoose, { Schema, Document } from "mongoose";

export interface Products extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    category: mongoose.Types.ObjectId;
    price: number;
    images: string[];
    created_at: Date;
    updated_at: Date;
    rate: string[];
}

const ProductSchema: Schema = new Schema<Products>({
    _id: { type: Schema.Types.ObjectId, auto:true },
    title: { type: String },
    description: { type: String },
    category: { 
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: { type: Number },
    images: [{ type: String }],
    created_at: { type: Date },
    updated_at: { type: Date },
    rate: [{ type: String }]
});

export const Product = mongoose.model<Products>('Products', ProductSchema, 'Product');