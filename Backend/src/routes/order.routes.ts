import express from 'express';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { deleteOrder, getAllOrders, getMyOrders, getSingleOrder, newOrder, processOrder } from '../controllers/order.controller.js';

const app = express.Router();


app.post('/new', newOrder);

app.get('/all', adminOnly, getAllOrders);

app.get('/my', getMyOrders);

app.route('/:id').get(getSingleOrder).put(adminOnly, processOrder).delete(adminOnly, deleteOrder);


export default app;