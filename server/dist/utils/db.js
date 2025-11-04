"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI || "";
let cachedDb = null;
async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    await mongoose_1.default.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    cachedDb = mongoose_1.default.connection;
    cachedDb.on('connected', () => {
        console.log('Connected to MongoDB');
    });
    cachedDb.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    return cachedDb;
}
exports.default = {
    connectToDatabase
};
