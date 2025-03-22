import express from 'express';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { deleteProduct, deleteReview, getAllProductsAdmin, getAllReviews, getCategories, getLatestProducts, getSearchProducts, getSingleProduct, newProduct, newReview, updateProduct } from '../controllers/product.controller.js';
import { multipleUpload } from '../middlewares/multer.middleware.js';

const app = express.Router();

app.post('/new', adminOnly, multipleUpload, newProduct);

app.get('/search-products', getSearchProducts);

app.get('/all', adminOnly, getAllProductsAdmin);

app.get('/latest-products', getLatestProducts);

app.get('/category', getCategories);

app.route('/:id').get(getSingleProduct)
    .put(adminOnly, multipleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);

app.post('/new/review/:id', newReview);
app.delete('/delete/:id', deleteReview);
app.get('/all/review/:id', getAllReviews);

export default app;