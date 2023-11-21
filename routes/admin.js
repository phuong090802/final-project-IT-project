import express from 'express';
import {
    handleCreateUser
} from '../controllers/admin.js';

const router = express.Router();


router.route('/users')
    .post(handleCreateUser)

export default router;