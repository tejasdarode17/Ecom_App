import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbconnect.js";
import userRouter from "./routes/userRoutes.js"


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
dbConnect();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());




app.use("/api/auth", userRouter)

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
