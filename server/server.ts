import express from 'express';
import cors from 'cors';
import db from './utils/db';
import mongoose from 'mongoose';
import UserRouter from './routes/userRoutes';
import ProductRouter from './routes/productRoutes';
import ReviewRouter from './routes/reviewRoutes';
import OrderRouter from './routes/orderRoutes';

const { connectToDatabase } = db;

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// A route to check if the connection to the cluster is active
app.get('/test', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            return res.json({
                message: "A connection is established"
            });
        } else {
            return res.json({
                message: "No connection is established"
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: "Failed to execute the test"
        });
    }
})

connectToDatabase();

app.use('/user', UserRouter);
app.use('/product', ProductRouter);
app.use('/review', ReviewRouter);
app.use('/order', OrderRouter);