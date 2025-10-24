import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Category extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    slug: string;
    created_at: Date;
    updated_at: Date;
}

const CategorySchema: Schema = new Schema<Category>({
    _id: { type: Schema.Types.ObjectId, auto: true},
    title: { type: String, required: true, unique: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export const CategoryModel = mongoose.model<Category>('Category', CategorySchema, 'categories');