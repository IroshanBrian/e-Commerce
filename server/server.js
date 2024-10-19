import express from "express";
import dotenv from 'dotenv'
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
// Routes
import authRoutes from './routes/auth.route.js';
import cartRoutes from './routes/cart.route.js';
import productsRoutes from './routes/product.route.js';
import couponsRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(PORT, () => {
     console.log(`Server is running on ${PORT}`);
     connectDB();
})