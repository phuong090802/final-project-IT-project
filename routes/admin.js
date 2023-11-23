import express from 'express';
import {
    handleCreateUser,
    handleGetAllUser,
    handleDeleteUser,
} from '../controllers/admin.js';
import { isNotIdAdmin } from '../middlewares/auth.js';

const router = express.Router();


router.route('/users/:id')
    .delete(isNotIdAdmin, handleDeleteUser)

router.route('/users')
    .post(handleCreateUser)
    .get(handleGetAllUser)

export default router;