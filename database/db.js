// import mongoose from "mongoose";

// export const connectDb = async () => {
//     try {
//         await mongoose.connect(process.env.DB, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("Database Connected");
//     } catch (error) {
//         console.error("Database Connection Error:", error);
//         process.exit(1); // Stops the application if the database connection fails
//     }
// };
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();  // Ensure environment variables are loaded from .env file

export const connectDb = async () => {
    try {
        // Debug: Log the DB URI
        console.log("MongoDB URI: ", process.env.DB);

        if (!process.env.DB) {
            console.error("DB URI is not defined in environment variables!");
            return;
        }

        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Database Connected");
    } catch (error) {
        console.error("Database Connection Error:", error);
        process.exit(1); // Stops the application if the database connection fails
    }
};
