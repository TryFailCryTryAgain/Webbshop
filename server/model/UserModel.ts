import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

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
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<Users>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    tel: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adress: { type: String },
    ZIP: { type: Number },
    city: { type: String },
    role: { type: String, default: 'user' },
    updated_at: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const saltRounds = 12;
        this.password = await bcrypt.hash((this as any).password, saltRounds);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<Users>('Users', UserSchema, 'User');