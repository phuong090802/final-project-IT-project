import express from 'express';
import { handleLogin, handleRefreshToken, handleLogout  } from '../controllers/authController.js';

const router = express.Router();


router.post('/login', handleLogin);
router.post('/refresh-token', handleRefreshToken);
router.get('/logout', handleLogout)

export default router;