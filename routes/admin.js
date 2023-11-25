import express from 'express';
import {
    handleCreateUser,
    handleGetAllUser,
    handleDeleteUser,
    handleUpdatePasswordUserById,
    handleUpdatePasswordUserByUserName
} from '../controllers/admin.js';
import { isNotIdAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/users/:id')
    .patch(isNotIdAdmin, handleUpdatePasswordUserById)
    .delete(isNotIdAdmin, handleDeleteUser)

router.route('/users/:username')
    .patch(isNotIdAdmin, handleUpdatePasswordUserByUserName)


router.route('/users')
    .post(handleCreateUser)
    .get(handleGetAllUser)

export default router;