import mongoose, { Schema, Document } from "mongoose";

export interface Review extends Document {
    _id: mongoose.Types.ObjectId;
    rating: number;
    description: string;
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const ReviewSchema: Schema = new Schema<Review>({
    _id: { type: Schema.Types.ObjectId, auto:true },
    rating: { type: Number },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
    created_at: { type: Date },
    updated_at: { type: Date }
});

export const Review = mongoose.model<Review>('Review', ReviewSchema, 'Review');