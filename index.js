import express from 'express';
import path from 'path'; 
import { connectDb } from './database/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
dotenv.config({ path: path.resolve('server/.env') });
// console.log("Environment Variables:", process.env.DB); // Debug log

export const instance = new Razorpay(
    {
        key_id:process.env.Razorpay_Key,
        key_secret: process.env.Razorpay_Secret,
    }
)

const app = express();

//using middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.get("/", (req, res) =>{
    res.send("Server is working");
});

// app.use("/uploads",express.static("uploads"));
app.use("/uploads", express.static("D:/nodepg/server/uploads"));
// app.use("/uploads", express.static(path.join(process.cwd(), "server", "uploads")));

//importing routes

import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';

// using routes

app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);

app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})
