import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware';
import { AnalyticsData } from '../controllers/analytics.controller';

const router = express.Router();

router.get("/", protectRoute, adminRoute, AnalyticsData);

export default router