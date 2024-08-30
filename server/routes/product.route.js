import express from 'express';

// controller
import {
     createProduct,
     getAllProducts,
     getFeaturedProducts,
     deleteProduct,
     getRecommendations,
     getProductsByCategory,
     toggleFeaturedProducts
} from '../controllers/product.controller.js';

// middleware
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/recommendations', getRecommendations);
router.post('/', protectRoute, adminRoute, createProduct);
router.patch('/', protectRoute, adminRoute, toggleFeaturedProducts);
router.delete('/:id', protectRoute, adminRoute, deleteProduct);


export default router

