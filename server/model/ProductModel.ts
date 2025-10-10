import mongoose, { Schema, Document } from "mongoose";

export interface Products extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    price: number;
    images: string[];
    creation_at: Date;
    update_at: Date;
    rate: string[];
}

const ProductSchema: Schema = new Schema<Products>({
    _id: { type: Schema.Types.ObjectId, auto:true },
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    images: [{ type: String }],
    creation_at: { type: Date },
    update_at: { type: Date },
    rate: [{ type: String }]
});

export const Product = mongoose.model<Products>('Products', ProductSchema, 'Product');