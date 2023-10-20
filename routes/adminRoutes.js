import express from 'express';
import {
    handleCreate, handleDisable,
    handleGetAll, handleCountAccounts, handleCountTopics, handleChangePassword
} from '../controllers/adminController.js';
import { handleValidationCreate } from '../middlewares/accountMiddleware.js';


const router = express.Router();

router.get('/accounts/count', handleCountAccounts);
router.put('/accounts/disable/:id', handleDisable);
router.put('/accounts/password/:id', handleChangePassword);
router.get('/topics/count', handleCountTopics);
router.route('/accounts')
    .post(handleValidationCreate, handleCreate)
    .get(handleGetAll);

export default router;