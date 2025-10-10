import mongoose, { Schema, Document } from 'mongoose';

export interface Users extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    adress: string;
    ZIP: number;
    city: string;
    first_name: string;
    last_name: string;
    role: string;
    tel: number;
    updated_at: Date;
}

const UserSchema: Schema = new Schema<Users>({
    _id: { type: Schema.Types.ObjectId, auto:true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    tel: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adress: { type: String },
    ZIP: { type: Number },
    city: { type: String },
    updated_at: { type: Date }
});

export const User = mongoose.model<Users>('Users', UserSchema, 'User');