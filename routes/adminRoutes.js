import express from 'express';
import { handleCreateUser, handleDisableUser, handleGetAll, handleCountUsers, handleCountTopics } from '../controllers/adminController.js';
import { verifyCreateUser } from '../middlewares/userMiddleware.js';


const router = express.Router();

router.route('/users/:id').put(handleDisableUser);
router.get('/users/count', handleCountUsers);
router.get('/topics/count', handleCountTopics);
router.route('/users').post(verifyCreateUser, handleCreateUser).get(handleGetAll);

export default router;