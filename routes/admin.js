import express from 'express';
import {
    handleCreateUser,
    handleGetAllUser,
    handleDeleteUser,
    handleUpdatePasswordUser,
} from '../controllers/admin.js';
import { isNotIdAdmin } from '../middlewares/auth.js';

const router = express.Router();


router.route('/users/:id')
    .patch(isNotIdAdmin, handleUpdatePasswordUser)
    .delete(isNotIdAdmin, handleDeleteUser)

router.route('/users')
    .post(handleCreateUser)
    .get(handleGetAllUser)

export default router;