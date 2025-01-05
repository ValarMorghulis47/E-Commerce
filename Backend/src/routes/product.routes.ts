import express from 'express';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { deleteProduct, getAllProductsAdmin, getLatestProducts, getSingleProduct, newProduct, updateProduct } from '../controllers/product.controller.js';
import { multipleUpload } from '../middlewares/multer.middleware.js';

const app = express.Router();

app.post('/new', adminOnly, multipleUpload, newProduct);

app.get('/all', adminOnly, getAllProductsAdmin);

app.get('/latest-products', getLatestProducts);

app.get('/category', getLatestProducts);

app.route('/:id').get(adminOnly, getSingleProduct)
    .put(adminOnly, multipleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);


export default app;