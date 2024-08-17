import express from 'express';
import { errorMiddleware } from './middlewares/error.middleware.js';


const app = express();

app.use(express.json());

const port = 3000;

// importing routes
import userRoutes from './routes/user.routes.js';

app.use('api/v1/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});


app.use(errorMiddleware);
app.listen(port, () => {
  console.log('Server is running at http://localhost:3000');
});