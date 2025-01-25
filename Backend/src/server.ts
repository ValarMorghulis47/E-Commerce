import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { connectDB } from './utils/features.js';


dotenv.config({ path: './.env' });

connectDB();

const stripeKey = process.env.STRIPE_SECRET_KEY || "";
export const stripe = new Stripe(stripeKey);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

const port = process.env.PORT || 3000;

// importing routes
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import statsRoutes from './routes/stats.routes.js';

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});


app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Server is running at ${port}` );
});