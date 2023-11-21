import express from 'express';
import {
    handleCreateUser,
    handleGetAllUser
} from '../controllers/admin.js';

const router = express.Router();


router.route('/users')
    .post(handleCreateUser)
    .get(handleGetAllUser)

export default router;