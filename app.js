import express from 'express';
import admin from './routes/admin.js';
import auth from './routes/auth.js';
import user from './routes/user.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {
    isAuthenticatedUser,
    authorizeRoles,
} from './middlewares/auth.js';
import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/v1/admin', isAuthenticatedUser, authorizeRoles('admin'), admin);
// app.use('/api/v1/admin', admin);
app.use('/api/v1/users', isAuthenticatedUser, authorizeRoles('admin', 'user'), user);
app.use('/api/v1/auth', auth);

export default app;