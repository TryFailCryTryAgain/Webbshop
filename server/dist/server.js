"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./utils/db"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const { connectToDatabase } = db_1.default;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// A route to check if the connection to the cluster is active
app.get('/test', async (req, res) => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            return res.json({
                message: "A connection is established"
            });
        }
        else {
            return res.json({
                message: "No connection is established"
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: "Failed to execute the test"
        });
    }
});
connectToDatabase();
app.use('/user', userRoutes_1.default);
app.use('/product', productRoutes_1.default);
app.use('/review', reviewRoutes_1.default);
app.use('/order', orderRoutes_1.default);
app.use('/category', categoryRoutes_1.default);
