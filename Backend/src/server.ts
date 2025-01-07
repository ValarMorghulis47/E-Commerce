import express from 'express';
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { connectDB } from './utils/features.js';


dotenv.config({ path: './.env' });

connectDB();
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

// importing routes
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';

app.use('api/v1/user', userRoutes);
app.use('api/v1/product', productRoutes);
app.use('api/v1/order', orderRoutes);
app.use('api/v1/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});


app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Server is running at ${port}` );
});