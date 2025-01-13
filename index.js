import express from 'express';

import { connectDb } from './database/db.js';

import dotenv from 'dotenv';
dotenv.config();

console.log("Environment Variables:", process.env.DB); // Debug log


const app = express();

//using middlewares
app.use(express.json());

const port = process.env.PORT;

app.get("/", (req, res) =>{
    res.send("Server is working");
})


//importing routes

import userRoutes from './routes/user.js';

// using routes

app.use('/api', userRoutes);


app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})
