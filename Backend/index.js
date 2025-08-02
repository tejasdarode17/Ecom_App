import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbconnect.js";
import userRouter from "./routes/userRoutes.js"
import sellerRouter from "./routes/sellerRoutes.js"
import authRouter from "./routes/authRoute.js"


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
app.use(express.urlencoded({ extended: true }));




app.use("/api/v1", authRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", sellerRouter)

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
