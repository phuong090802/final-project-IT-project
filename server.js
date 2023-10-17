import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/connectDb.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import cookieParser from 'cookie-parser';
import { verifyToken, roleAdmin } from './middlewares/authMiddleware.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDb();

app.use('/api/auth', authRoutes);
app.use('/api/admin', verifyToken, roleAdmin, adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/topics', topicRoutes);

app.use('/uploads', uploadRoutes);

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running in on port ${PORT}`));

