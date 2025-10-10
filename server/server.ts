import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './utils/db.ts';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

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