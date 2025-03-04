import express from 'express';
import { deleteReview, getAllReviews, newReview } from '../controllers/review.controller.js';

const app = express.Router();

app.post('/new/:id', newReview);
app.delete('/delete/:id', deleteReview);
app.get('/all/:id', getAllReviews);


export default app;