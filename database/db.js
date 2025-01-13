import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        console.log("Connecting to DB:", process.env.DB); // Debug log
        await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database Connected");
    } catch (error) {
        console.error("Database Connection Error:", error.message);
    }
};
