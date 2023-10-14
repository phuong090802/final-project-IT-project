import express from 'express';
import { handleCreateUser } from '../controllers/adminController.js';
import { verifyCreateUser } from '../middlewares/verifyUser.js';


const router = express.Router();


router.route('/users').post(verifyCreateUser, handleCreateUser);

export default router;