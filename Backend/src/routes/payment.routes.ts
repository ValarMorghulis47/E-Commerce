import express from 'express';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { applyCoupon, deleteCoupon, getAllCoupons, getSingleCoupon, newCoupon, updateCoupon } from '../controllers/payment.controller.js';

const app = express.Router();


app.post('/new', adminOnly, newCoupon);

app.post('/apply', applyCoupon);

app.get('/all', adminOnly, getAllCoupons);

app.route('/coupon/:id').get(adminOnly, getSingleCoupon).put(adminOnly, updateCoupon).delete(adminOnly, deleteCoupon);


export default app;