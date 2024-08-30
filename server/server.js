import express from "express";
import dotenv from 'dotenv'
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
// Routes
import authRoutes from './routes/auth.route.js';
import productsRoutes from './routes/product.route.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

app.listen(PORT, () => {
     console.log(`Server is running on ${PORT}`);
     connectDB();
})