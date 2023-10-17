import express from 'express';
import {
    handleCreateUser, handleDisableUser,
    handleGetAll, handleCountUsers, handleCountTopics, handleChangePassword
} from '../controllers/adminController.js';
import { verifyCreateUser } from '../middlewares/userMiddleware.js';


const router = express.Router();

router.get('/users/count', handleCountUsers);
router.put('/users/disable/:id', handleDisableUser);
router.put('/users/password/:id', handleChangePassword);
router.get('/topics/count', handleCountTopics);
router.route('/users').post(verifyCreateUser, handleCreateUser).get(handleGetAll);

export default router;