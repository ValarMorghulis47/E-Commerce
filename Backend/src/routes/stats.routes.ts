import express from 'express';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { getBarChartData, getDashboardStats, getPieChartData } from '../controllers/stats.controller.js';

const app = express.Router();

app.use(adminOnly);

app.get('/dashboard-stats', getDashboardStats);

app.get('/bar-chart', getBarChartData);

app.get('/pie-chart', getPieChartData);


export default app;