import express from 'express';

// controller
import { getAllProducts, createProduct } from '../controllers/product.controller.js';

// middleware
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts);
router.post('/', protectRoute, adminRoute, createProduct);


export default router

