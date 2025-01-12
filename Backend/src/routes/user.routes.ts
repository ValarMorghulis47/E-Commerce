import express from 'express';
import { deleteUser, getAllUsers, getSingleUser, newUser } from '../controllers/user.controller.js';
import { adminOnly } from '../middlewares/auth.middleware.js';

const app = express.Router();

app.post('/new', newUser);

app.get('/all', adminOnly, getAllUsers);

app.get('/single/:id', getSingleUser);

app.delete('/delete/:id', adminOnly, deleteUser);


export default app;