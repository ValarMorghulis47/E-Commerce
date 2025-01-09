import express from 'express';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { getBarChartsData, getDashboardStats, getLineChartsData, getPieChartsData } from '../controllers/stats.controller.js';

const app = express.Router();

app.use(adminOnly);

app.get('/dashboard-stats', getDashboardStats);

app.get('/bar-chart', getBarChartsData);

app.get('/pie-chart', getPieChartsData);

app.get('/line-chart', getLineChartsData);


export default app;