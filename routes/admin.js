import express from 'express';
import {
    handleCreateUser,
    handleGetAllUser,
    handleDeleteUser,
} from '../controllers/admin.js';

const router = express.Router();


router.route('/users/:id')
    .delete(handleDeleteUser)

router.route('/users')
    .post(handleCreateUser)
    .get(handleGetAllUser)

export default router;