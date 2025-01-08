import express from 'express';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { getDashboardStats } from '../controllers/stats.controller.js';

const app = express.Router();

app.use(adminOnly);

app.post('/dashboard-stats', getDashboardStats);


export default app;